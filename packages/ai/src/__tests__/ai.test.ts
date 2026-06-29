import { describe, it, expect, beforeEach } from 'vitest';
import {
  ModelManager,
  TextClassifier,
  AnomalyDetector,
  EmbeddingStore,
  AiError,
  modelId,
  confidence,
  anomalyScore,
  embedding,
  builtinModels,
  createDefaultModelManager,
} from '../index';

describe('ModelManager', () => {
  let manager: ModelManager;

  beforeEach(() => {
    manager = new ModelManager();
  });

  it('starts with no models loaded', () => {
    expect(manager.getLoadedModels()).toHaveLength(0);
  });

  it('throws MODEL_NOT_FOUND for unknown model metadata', () => {
    expect(manager.getModelMetadata(modelId('nonexistent'))).toBeUndefined();
  });

  it('reports not loaded for unknown model', () => {
    expect(manager.isLoaded(modelId('test'))).toBe(false);
  });
});

describe('TextClassifier', () => {
  it('rejects unknown model', async () => {
    const manager = new ModelManager();
    const classifier = new TextClassifier(manager, {
      modelId: modelId('unknown'),
      labels: { 0: 'benign' },
      maxLength: 128,
      threshold: confidence(0.5),
    });
    await expect(classifier.classify('test')).rejects.toThrow(AiError);
  });
});

describe('AnomalyDetector', () => {
  let detector: AnomalyDetector;

  beforeEach(() => {
    const manager = new ModelManager();
    detector = new AnomalyDetector(manager, {
      modelId: modelId('test-anomaly'),
      threshold: anomalyScore(0.5),
      inputSize: 10,
    });
  });

  it('falls back to heuristic scoring when model is unavailable', async () => {
    const result = await detector.score({ cpu: 50, memory: 60 });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.isAnomaly).toBe(false);
    expect(result.features).toEqual({ cpu: 50, memory: 60 });
  });

  it('records and uses baseline for heuristic', async () => {
    detector.recordBaseline('cpu', [40, 42, 41, 43, 42]);
    const normal = await detector.score({ cpu: 42, memory: 50 });
    expect(normal.isAnomaly).toBe(false);

    const anomalous = await detector.score({ cpu: 999, memory: 50 });
    expect(anomalous.score).toBeGreaterThan(0);
  });

  it('updates threshold', async () => {
    detector.setThreshold(anomalyScore(0.9));
    const result = await detector.score({ x: 1 });
    expect(result).toBeDefined();
  });

  it('returns timestamp in result', async () => {
    const result = await detector.score({ cpu: 50 });
    expect(result.timestamp).toBeGreaterThan(0);
  });
});

describe('EmbeddingStore', () => {
  let store: EmbeddingStore;

  beforeEach(() => {
    store = new EmbeddingStore();
  });

  it('starts empty', () => {
    expect(store.size).toBe(0);
  });

  it('adds and retrieves entries', () => {
    const entry = {
      id: 'entry-1' as unknown as string,
      embedding: embedding([0.1, 0.2, 0.3]),
      metadata: { label: 'test' },
      timestamp: Date.now(),
    };
    store.add(entry);
    expect(store.size).toBe(1);
    expect(store.get('entry-1' as unknown as string)).toBe(entry);
  });

  it('removes entries', () => {
    const entry = {
      id: 'remove-me' as unknown as string,
      embedding: embedding([0.1, 0.2]),
      metadata: {},
      timestamp: Date.now(),
    };
    store.add(entry);
    expect(store.remove('remove-me' as unknown as string)).toBe(true);
    expect(store.size).toBe(0);
  });

  it('returns false when removing non-existent entry', () => {
    expect(store.remove('nope' as unknown as string)).toBe(false);
  });

  it('searches by cosine similarity', () => {
    const a = { id: 'a' as unknown as string, embedding: embedding([1, 0, 0]), metadata: {}, timestamp: 0 };
    const b = { id: 'b' as unknown as string, embedding: embedding([0.9, 0.1, 0]), metadata: {}, timestamp: 0 };
    const c = { id: 'c' as unknown as string, embedding: embedding([0, 1, 0]), metadata: {}, timestamp: 0 };
    store.add(a);
    store.add(b);
    store.add(c);

    const results = store.search(embedding([1, 0, 0]), 3, 'cosine');
    expect(results[0]!.entry.id).toBe('a');
    expect(results[1]!.entry.id).toBe('b');
  });

  it('searches by euclidean distance', () => {
    const a = { id: 'a' as unknown as string, embedding: embedding([0, 0]), metadata: {}, timestamp: 0 };
    const b = { id: 'b' as unknown as string, embedding: embedding([3, 4]), metadata: {}, timestamp: 0 };
    store.add(a);
    store.add(b);

    const results = store.search(embedding([0, 0]), 2, 'euclidean');
    expect(results[0]!.entry.id).toBe('a');
  });

  it('searches by dot product', () => {
    const a = { id: 'a' as unknown as string, embedding: embedding([5, 0]), metadata: {}, timestamp: 0 };
    const b = { id: 'b' as unknown as string, embedding: embedding([1, 0]), metadata: {}, timestamp: 0 };
    store.add(a);
    store.add(b);

    const results = store.search(embedding([5, 0]), 2, 'dot');
    expect(results[0]!.entry.id).toBe('a');
  });

  it('filters by metadata', () => {
    store.add({
      id: 'm1' as unknown as string,
      embedding: embedding([1, 2]),
      metadata: { type: 'malware' },
      timestamp: 0,
    });
    store.add({
      id: 'm2' as unknown as string,
      embedding: embedding([3, 4]),
      metadata: { type: 'benign' },
      timestamp: 0,
    });

    const filtered = store.searchByMetadata((meta) => meta.type === 'malware');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]!.id).toBe('m1' as unknown as string);
  });

  it('clears all entries', () => {
    store.add({
      id: 'x' as unknown as string,
      embedding: embedding([1]),
      metadata: {},
      timestamp: 0,
    });
    store.clear();
    expect(store.size).toBe(0);
  });

  it('handles empty search', () => {
    expect(store.search(embedding([1, 2, 3]), 5)).toHaveLength(0);
  });
});

describe('builtinModels', () => {
  it('has threat-classifier model', () => {
    const model = builtinModels['threat-classifier'];
    expect(model).toBeDefined();
    expect(model.capabilities).toContain('text_classification');
    expect(model.labels).toBeDefined();
    expect(model.labels![0]).toBe('benign');
  });

  it('has anomaly-detector model', () => {
    const model = builtinModels['anomaly-detector'];
    expect(model).toBeDefined();
    expect(model.capabilities).toContain('anomaly_detection');
  });
});

describe('createDefaultModelManager', () => {
  it('creates a new manager', () => {
    const manager = createDefaultModelManager();
    expect(manager).toBeInstanceOf(ModelManager);
  });
});
