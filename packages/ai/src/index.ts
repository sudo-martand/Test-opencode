import type { UID } from '@cybersim/shared';
import { uid } from '@cybersim/shared';
import type { Tensor, InferenceSession } from 'onnxruntime-web';

// ── Types ────────────────────────────────────────────────────────────────

export type ModelId = string & { readonly __brand: 'modelId' };
export type Embedding = Float32Array & { readonly __brand: 'embedding' };
export type ConfidenceScore = number & { readonly __brand: 'confidence' };
export type AnomalyScore = number & { readonly __brand: 'anomaly' };

export function modelId(value: string): ModelId { return value as ModelId; }
export function confidence(value: number): ConfidenceScore { return Math.max(0, Math.min(1, value)) as ConfidenceScore; }
export function anomalyScore(value: number): AnomalyScore { return value as AnomalyScore; }

export function embedding(values: number[] | Float32Array): Embedding {
  const arr = values instanceof Float32Array ? values : new Float32Array(values);
  return arr as Embedding;
}

export type ModelCapability = 'text_classification' | 'anomaly_detection' | 'embedding' | 'ner' | 'code_generation';

export interface ModelMetadata {
  id: ModelId;
  name: string;
  version: string;
  capabilities: ModelCapability[];
  inputShape: number[];
  outputShape: number[];
  memoryEstimateMb: number;
  labels?: Record<number, string>;
  description?: string;
}

export interface ModelLoadOptions {
  executionProvider?: 'wasm' | 'webgl' | 'webnn' | 'cpu';
  enableProfiling?: boolean;
  enableMemPattern?: boolean;
  intraOpNumThreads?: number;
}

export interface ClassificationResult {
  label: string;
  score: ConfidenceScore;
  classIndex: number;
}

export interface InferenceResult {
  modelId: ModelId;
  timestamp: number;
  durationMs: number;
  output: Tensor;
}

// ── Errors ───────────────────────────────────────────────────────────────

export class AiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AiError';
  }

  static modelNotFound(id: ModelId): AiError {
    return new AiError('MODEL_NOT_FOUND', `Model not found: ${id}`);
  }

  static modelNotLoaded(id: ModelId): AiError {
    return new AiError('MODEL_NOT_LOADED', `Model not loaded: ${id}`);
  }

  static incompatibleInput(id: ModelId, expected: number[], got: number[]): AiError {
    return new AiError('INCOMPATIBLE_INPUT',
      `Model ${id} expects shape [${expected}] but got [${got}]`);
  }

  static runtimeError(msg: string): AiError {
    return new AiError('RUNTIME_ERROR', msg);
  }
}

// ── ModelManager ─────────────────────────────────────────────────────────

export class ModelManager {
  private sessions: Map<ModelId, InferenceSession> = new Map();
  private metadatas: Map<ModelId, ModelMetadata> = new Map();
  private loading: Set<ModelId> = new Set();

  async loadModel(
    modelId: ModelId,
    modelUrl: string,
    metadata: ModelMetadata,
    options?: ModelLoadOptions,
  ): Promise<void> {
    if (this.sessions.has(modelId)) return;
  if (this.loading.has(modelId)) {
      throw new AiError('ALREADY_LOADING', `Model ${modelId} is currently loading`);
    }

    this.loading.add(modelId);
    try {
      const session = await this.createSession(modelUrl, options);
      this.sessions.set(modelId, session);
      this.metadatas.set(modelId, metadata);
    } finally {
      this.loading.delete(modelId);
    }
  }

  private async createSession(modelUrl: string, options?: ModelLoadOptions): Promise<InferenceSession> {
    const ort = await import('onnxruntime-web');
    const sessionOptions: InferenceSession.SessionOptions = {};

    if (options?.executionProvider) {
      sessionOptions.executionProviders = [options.executionProvider];
    }

    if (options?.enableProfiling) {
      sessionOptions.enableProfiling = true;
    }

    if (options?.['enableMemPattern']) {
      (sessionOptions as Record<string, unknown>)['enableMemPattern'] = true;
    }

    if (options?.intraOpNumThreads !== undefined) {
      sessionOptions.intraOpNumThreads = options.intraOpNumThreads;
    }

    return ort.InferenceSession.create(modelUrl, sessionOptions);
  }

  async unloadModel(modelId: ModelId): Promise<void> {
    const session = this.sessions.get(modelId);
    if (session) {
      try {
        await session.release();
      } catch { }
      this.sessions.delete(modelId);
      this.metadatas.delete(modelId);
    }
  }

  getModelMetadata(modelId: ModelId): ModelMetadata | undefined {
    return this.metadatas.get(modelId);
  }

  isLoaded(modelId: ModelId): boolean {
    return this.sessions.has(modelId);
  }

  getLoadedModels(): ModelMetadata[] {
    return Array.from(this.metadatas.values());
  }

  // ── Inference ──────────────────────────────────────────────────────

  async runInference(modelId: ModelId, input: Tensor): Promise<InferenceResult> {
    const session = this.sessions.get(modelId);
    if (!session) throw AiError.modelNotLoaded(modelId);

    const start = performance.now();

    try {
      const feeds: Record<string, Tensor> = {};
      const inputNames = session.inputNames;
      if (inputNames.length > 0) {
        feeds[inputNames[0]!] = input;
      }

      const results = await session.run(feeds);
      const outputName = session.outputNames[0]!;
      const output = results[outputName];
      if (!output) throw AiError.runtimeError('No output from model');

      const durationMs = performance.now() - start;

      return {
        modelId,
        timestamp: Date.now(),
        durationMs,
        output,
      };
    } catch (e) {
      throw e instanceof AiError ? e : AiError.runtimeError(String(e));
    }
  }

  async dispose(): Promise<void> {
    for (const modelId of this.sessions.keys()) {
      await this.unloadModel(modelId);
    }
  }
}

// ── TextClassifier ───────────────────────────────────────────────────────

export interface TextClassifierConfig {
  modelId: ModelId;
  labels: Record<number, string>;
  maxLength: number;
  threshold: ConfidenceScore;
}

export class TextClassifier {
  private manager: ModelManager;
  private config: TextClassifierConfig;

  constructor(manager: ModelManager, config: TextClassifierConfig) {
    this.manager = manager;
    this.config = config;
  }

  async classify(text: string): Promise<ClassificationResult[]> {
    const modelMeta = this.manager.getModelMetadata(this.config.modelId);
    if (!modelMeta) throw AiError.modelNotFound(this.config.modelId);

    const ort = await import('onnxruntime-web');
    const inputTensor = this.tokenize(text, ort);
    const result = await this.manager.runInference(this.config.modelId, inputTensor);

    const outputData = result.output.data;
    const scores: ClassificationResult[] = [];

    for (let i = 0; i < outputData.length; i++) {
      const scoreValue = outputData[i] as number;
      if (scoreValue >= this.config.threshold) {
        const label = this.config.labels[i] ?? `class_${i}`;
        scores.push({
          label,
          score: confidence(scoreValue),
          classIndex: i,
        });
      }
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  async classifyTop(text: string): Promise<ClassificationResult | undefined> {
    const results = await this.classify(text);
    return results[0];
  }

  private tokenize(text: string, ort: typeof import('onnxruntime-web')): Tensor {
    const ids = new Float32Array(this.config.maxLength).fill(0);
    const tokens = text.slice(0, this.config.maxLength).split('').map((c) => c.charCodeAt(0));
    for (let i = 0; i < Math.min(tokens.length, this.config.maxLength); i++) {
      ids[i] = tokens[i]!;
    }
    return new ort.Tensor('float32', ids, [1, this.config.maxLength]);
  }
}

// ── AnomalyDetector ──────────────────────────────────────────────────────

export interface AnomalyDetectorConfig {
  modelId: ModelId;
  threshold: AnomalyScore;
  inputSize: number;
}

export interface AnomalyResult {
  score: AnomalyScore;
  isAnomaly: boolean;
  timestamp: number;
  features: Record<string, number>;
}

export class AnomalyDetector {
  private manager: ModelManager;
  private config: AnomalyDetectorConfig;
  private baseline: Map<string, number[]> = new Map();

  constructor(manager: ModelManager, config: AnomalyDetectorConfig) {
    this.manager = manager;
    this.config = config;
  }

  async score(features: Record<string, number>): Promise<AnomalyResult> {
    const ort = await import('onnxruntime-web');
    const featureArray = this.featuresToArray(features);
    const tensor = new ort.Tensor('float32', new Float32Array(featureArray), [1, this.config.inputSize]);

    let result: InferenceResult;
    try {
      result = await this.manager.runInference(this.config.modelId, tensor);
    } catch {
      return {
        score: anomalyScore(this.heuristicScore(features)),
        isAnomaly: this.heuristicScore(features) > this.config.threshold,
        timestamp: Date.now(),
        features,
      };
    }

    const outputData = result.output.data;
    const rawScore = (outputData[0] as number) ?? 0;
    const score = anomalyScore(rawScore);

    return {
      score,
      isAnomaly: score >= this.config.threshold,
      timestamp: Date.now(),
      features,
    };
  }

  recordBaseline(key: string, values: number[]): void {
    this.baseline.set(key, values);
  }

  private heuristicScore(features: Record<string, number>): number {
    let score = 0;
    const baseline = this.baseline;

    for (const [key, value] of Object.entries(features)) {
      const baselineValues = baseline.get(key);
      if (baselineValues && baselineValues.length > 1) {
        const mean = baselineValues.reduce((a, b) => a + b, 0) / baselineValues.length;
        const variance = baselineValues.reduce((a, b) => a + (b - mean) ** 2, 0) / baselineValues.length;
        const stddev = Math.sqrt(variance);
        if (stddev > 0) {
          const zScore = Math.abs(value - mean) / stddev;
          score += Math.min(zScore / 3, 1);
        }
      }
    }

    return score / Math.max(1, Object.keys(features).length);
  }

  private featuresToArray(features: Record<string, number>): number[] {
    const keys = Object.keys(features).sort();
    const result = new Array(this.config.inputSize).fill(0);
    for (let i = 0; i < Math.min(keys.length, this.config.inputSize); i++) {
      result[i] = features[keys[i]!] ?? 0;
    }
    return result;
  }

  setThreshold(t: AnomalyScore): void {
    this.config.threshold = t;
  }
}

// ── EmbeddingStore ───────────────────────────────────────────────────────

export interface EmbeddingEntry {
  id: UID;
  embedding: Embedding;
  metadata: Record<string, unknown>;
  timestamp: number;
}

export interface SimilarityResult {
  entry: EmbeddingEntry;
  similarity: number;
}

export type SimilarityMetric = 'cosine' | 'euclidean' | 'dot';

export class EmbeddingStore {
  private entries: EmbeddingEntry[] = [];
  private index: Map<string, EmbeddingEntry> = new Map();

  add(entry: EmbeddingEntry): void {
    this.entries.push(entry);
    this.index.set(entry.id, entry);
  }

  remove(id: UID): boolean {
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.entries.splice(idx, 1);
    this.index.delete(id);
    return true;
  }

  get(id: UID): EmbeddingEntry | undefined {
    return this.index.get(id);
  }

  search(query: Embedding, topK: number = 10, metric: SimilarityMetric = 'cosine'): SimilarityResult[] {
    const scored = this.entries.map((entry) => ({
      entry,
      similarity: this.computeSimilarity(query, entry.embedding, metric),
    }));

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  searchByMetadata(filter: (meta: Record<string, unknown>) => boolean): EmbeddingEntry[] {
    return this.entries.filter((e) => filter(e.metadata));
  }

  private computeSimilarity(a: Embedding, b: Embedding, metric: SimilarityMetric): number {
    if (metric === 'cosine') {
      return this.cosineSimilarity(a, b);
    }
    if (metric === 'euclidean') {
      return 1 / (1 + this.euclideanDistance(a, b));
    }
    return this.dotProduct(a, b);
  }

  private cosineSimilarity(a: Embedding, b: Embedding): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i]! * b[i]!;
      normA += a[i]! * a[i]!;
      normB += b[i]! * b[i]!;
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  private euclideanDistance(a: Embedding, b: Embedding): number {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const diff = a[i]! - b[i]!;
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  private dotProduct(a: Embedding, b: Embedding): number {
    let dot = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i]! * b[i]!;
    }
    return dot;
  }

  get size(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
    this.index.clear();
  }
}

// ── Predefined model metadata ────────────────────────────────────────────

export const builtinModels: Record<string, ModelMetadata> = {
  'threat-classifier': {
    id: modelId('threat-classifier'),
    name: 'Threat Classification Model',
    version: '1.0.0',
    capabilities: ['text_classification'],
    inputShape: [1, 512],
    outputShape: [1, 10],
    memoryEstimateMb: 32,
    labels: {
      0: 'benign',
      1: 'malware',
      2: 'phishing',
      3: 'ransomware',
      4: 'exfiltration',
      5: 'lateral_movement',
      6: 'command_and_control',
      7: 'reconnaissance',
      8: 'privilege_escalation',
      9: 'defense_evasion',
    },
  },
  'anomaly-detector': {
    id: modelId('anomaly-detector'),
    name: 'Network Anomaly Detector',
    version: '1.0.0',
    capabilities: ['anomaly_detection'],
    inputShape: [1, 128],
    outputShape: [1, 1],
    memoryEstimateMb: 16,
  },
};

export function createDefaultModelManager(): ModelManager {
  return new ModelManager();
}
