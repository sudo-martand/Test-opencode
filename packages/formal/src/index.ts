import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type FormalModelId = string & { readonly __brand: unique symbol };
export const formalModelId = (): FormalModelId => uid() as unknown as FormalModelId;

export type VerificationRunId = string & { readonly __brand: unique symbol };
export const verificationRunId = (): VerificationRunId => uid() as unknown as VerificationRunId;

export type InvariantId = string & { readonly __brand: unique symbol };
export const invariantId = (): InvariantId => uid() as unknown as InvariantId;

export type PropertyId = string & { readonly __brand: unique symbol };
export const propertyId = (): PropertyId => uid() as unknown as PropertyId;

export type MutantId = string & { readonly __brand: unique symbol };
export const mutantId = (): MutantId => uid() as unknown as MutantId;

export type SpecificationId = string & { readonly __brand: unique symbol };
export const specificationId = (): SpecificationId => uid() as unknown as SpecificationId;

export type FormalFindingId = string & { readonly __brand: unique symbol };
export const formalFindingId = (): FormalFindingId => uid() as unknown as FormalFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum FormalMethod {
  TLA_PLUS = 'TLA_PLUS',
  ALLOY = 'ALLOY',
  Z3_SMT = 'Z3_SMT',
  COQ = 'COQ',
  ISABELLE = 'ISABELLE',
  K_FRAMEWORK = 'K_FRAMEWORK',
  PROPERTY_BASED_TESTING = 'PROPERTY_BASED_TESTING',
  MUTATION_TESTING = 'MUTATION_TESTING',
  RUNTIME_VERIFICATION = 'RUNTIME_VERIFICATION',
  DETERMINISM_CHECK = 'DETERMINISM_CHECK',
}

export enum VerificationStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR',
  INCONCLUSIVE = 'INCONCLUSIVE',
  NOT_RUN = 'NOT_RUN',
}

export enum InvariantType {
  SAFETY = 'SAFETY',
  LIVENESS = 'LIVENESS',
  FAIRNESS = 'FAIRNESS',
  STATE_INVARIANT = 'STATE_INVARIANT',
  TYPE_INVARIANT = 'TYPE_INVARIANT',
  PROTOCOL_INVARIANT = 'PROTOCOL_INVARIANT',
  SECURITY_PROPERTY = 'SECURITY_PROPERTY',
  CONSENSUS_PROPERTY = 'CONSENSUS_PROPERTY',
}

export enum PropertyCategory {
  CORRECTNESS = 'CORRECTNESS',
  SAFETY = 'SAFETY',
  LIVENESS = 'LIVENESS',
  SECURITY = 'SECURITY',
  TERMINATION = 'TERMINATION',
  CONSISTENCY = 'CONSISTENCY',
  DETERMINISM = 'DETERMINISM',
  DEADLOCK_FREE = 'DEADLOCK_FREE',
}

export enum MutantStatus {
  KILLED = 'KILLED',
  SURVIVED = 'SURVIVED',
  TIMEOUT = 'TIMEOUT',
  EQUIVALENT = 'EQUIVALENT',
  INVALID = 'INVALID',
}

export enum MutationOperator {
  NEGATE_CONDITION = 'NEGATE_CONDITION',
  REPLACE_VARIABLE = 'REPLACE_VARIABLE',
  REMOVE_STATEMENT = 'REMOVE_STATEMENT',
  SWAP_ARGUMENTS = 'SWAP_ARGUMENTS',
  CHANGE_OPERATOR = 'CHANGE_OPERATOR',
  REMOVE_FUNCTION_CALL = 'REMOVE_FUNCTION_CALL',
  CHANGE_CONSTANT = 'CHANGE_CONSTANT',
  INVERT_BOOLEAN = 'INVERT_BOOLEAN',
}

export enum RuntimeMonitorType {
  STATE_MONITOR = 'STATE_MONITOR',
  EVENT_MONITOR = 'EVENT_MONITOR',
  TIMING_MONITOR = 'TIMING_MONITOR',
  SECURITY_MONITOR = 'SECURITY_MONITOR',
  RESOURCE_MONITOR = 'RESOURCE_MONITOR',
  PROTOCOL_MONITOR = 'PROTOCOL_MONITOR',
}

export enum DeterminismCheckType {
  SEEDED_RNG = 'SEEDED_RNG',
  FIXED_TIMESTEP = 'FIXED_TIMESTEP',
  ORDERED_EVENTS = 'ORDERED_EVENTS',
  NO_UNDEFINED_BEHAVIOR = 'NO_UNDEFINED_BEHAVIOR',
  REPRODUCIBLE_SCHEDULING = 'REPRODUCIBLE_SCHEDULING',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface FormalSpecification {
  id: SpecificationId;
  name: string;
  method: FormalMethod;
  description: string;
  targetComponent: string;
  properties: PropertyId[];
  specificationText: string;
  version: string;
  author: string;
  lastVerified: number;
}

export interface FormalModelInstance {
  id: FormalModelId;
  name: string;
  method: FormalMethod;
  specificationId: SpecificationId;
  stateCount: number;
  depth: number;
  propertiesChecked: PropertyId[];
  verifications: VerificationRunId[];
  created: number;
}

export interface PropertyInstance {
  id: PropertyId;
  name: string;
  category: PropertyCategory;
  invariantType: InvariantType;
  description: string;
  temporalFormula: string;
  isLiveness: boolean;
  isSafety: boolean;
}

export interface PropertyResult {
  propertyId: PropertyId;
  result: boolean;
  counterexample?: string;
}

export interface VerificationRun {
  id: VerificationRunId;
  modelId: FormalModelId;
  status: VerificationStatus;
  startTime: number;
  endTime?: number;
  properties: PropertyResult[];
  statesExplored?: number;
  errorsFound: string[];
  warnings: string[];
  durationMs?: number;
  toolVersion: string;
}

export interface MutantInstance {
  id: MutantId;
  name: string;
  operator: MutationOperator;
  originalCode: string;
  mutatedCode: string;
  status: MutantStatus;
  coveringTest?: string;
  killReason?: string;
  lineNumber: number;
  score: number;
}

export interface MutationTestResult {
  totalMutants: number;
  killedCount: number;
  survivedCount: number;
  equivalentCount: number;
  timeoutCount: number;
  killRate: number;
  mutants: MutantInstance[];
}

export interface RuntimeMonitor {
  id: InvariantId;
  type: RuntimeMonitorType;
  name: string;
  targetComponent: string;
  condition: string;
  enabled: boolean;
  violations: { timestamp: number; value: string; message: string }[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DeterminismReport {
  checkType: DeterminismCheckType;
  runId: string;
  seed: number;
  runCount: number;
  consistent: boolean;
  deviations: { run: number; difference: string }[];
  hashComparison: string[];
  timestamp: number;
}

export interface FormalChallenge {
  name: string;
  description: string;
  domain: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FormalFinding {
  id: FormalFindingId;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  method: FormalMethod;
  propertyId?: PropertyId;
  modelId?: FormalModelId;
  mitigated: boolean;
  timestamp: number;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createFormalSpecification(overrides?: Partial<FormalSpecification>): FormalSpecification {
  return {
    id: specificationId(),
    name: 'Network Stack Model',
    method: FormalMethod.TLA_PLUS,
    description: 'TLA+ specification of the TCP congestion control algorithm',
    targetComponent: 'network-stack',
    properties: [],
    specificationText: '---- MODULE NetworkStack ----\nVARIABLES seq, ack, window\nInit == seq = 0 /\\\n ack = 0 /\n window = 1\nNext == ...',
    version: '1.0.0',
    author: 'sim-admin',
    lastVerified: Date.now(),
    ...overrides,
  };
}

export function createFormalModelInstance(overrides?: Partial<FormalModelInstance>): FormalModelInstance {
  return {
    id: formalModelId(),
    name: 'Network Stack TLA+ Model',
    method: FormalMethod.TLA_PLUS,
    specificationId: '' as SpecificationId,
    stateCount: 1000,
    depth: 10,
    propertiesChecked: [],
    verifications: [],
    created: Date.now(),
    ...overrides,
  } as FormalModelInstance;
}

export function createPropertyInstance(overrides?: Partial<PropertyInstance>): PropertyInstance {
  return {
    id: propertyId(),
    name: 'No Deadlock',
    category: PropertyCategory.DEADLOCK_FREE,
    invariantType: InvariantType.SAFETY,
    description: 'The system never reaches a deadlock state',
    temporalFormula: '[]~(PC = "done" /\\ waiting)',
    isLiveness: false,
    isSafety: true,
    ...overrides,
  };
}

export function createPropertyResult(overrides?: Partial<PropertyResult>): PropertyResult {
  return {
    propertyId: '' as PropertyId,
    result: true,
    ...overrides,
  };
}

export function createVerificationRun(overrides?: Partial<VerificationRun>): VerificationRun {
  return {
    id: verificationRunId(),
    modelId: '' as FormalModelId,
    status: VerificationStatus.PASSED,
    startTime: Date.now(),
    endTime: Date.now() + 1000,
    properties: [],
    statesExplored: 500,
    errorsFound: [],
    warnings: [],
    durationMs: 1000,
    toolVersion: 'TLC 2.18',
    ...overrides,
  };
}

export function createMutantInstance(overrides?: Partial<MutantInstance>): MutantInstance {
  return {
    id: mutantId(),
    name: 'Negate condition in auth check',
    operator: MutationOperator.NEGATE_CONDITION,
    originalCode: 'if (user.role === "admin") { grantAccess(); }',
    mutatedCode: 'if (user.role !== "admin") { grantAccess(); }',
    status: MutantStatus.KILLED,
    coveringTest: 'test_admin_access_control',
    killReason: 'Test detected inverted authorization check',
    lineNumber: 42,
    score: 1.0,
    ...overrides,
  };
}

export function createRuntimeMonitor(overrides?: Partial<RuntimeMonitor>): RuntimeMonitor {
  return {
    id: invariantId(),
    type: RuntimeMonitorType.STATE_MONITOR,
    name: 'Scheduler Invariant Monitor',
    targetComponent: 'scheduler',
    condition: 'runningProcesses <= maxProcesses',
    enabled: true,
    violations: [],
    severity: 'HIGH',
    ...overrides,
  };
}

export function createDeterminismReport(overrides?: Partial<DeterminismReport>): DeterminismReport {
  return {
    checkType: DeterminismCheckType.SEEDED_RNG,
    runId: 'det-check-001',
    seed: 42,
    runCount: 5,
    consistent: true,
    deviations: [],
    hashComparison: ['abc123', 'abc123', 'abc123', 'abc123', 'abc123'],
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createFormalFinding(overrides?: Partial<FormalFinding>): FormalFinding {
  return {
    id: formalFindingId(),
    description: 'Unverified liveness property in consensus protocol',
    severity: 'HIGH',
    method: FormalMethod.TLA_PLUS,
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function getKnownFormalChallenges(): FormalChallenge[] {
  return [
    { name: 'State Space Explosion', description: 'Model checking faces exponential growth in state space, limiting verification depth', domain: 'TLA+/Alloy', severity: 'HIGH' },
    { name: 'Invariant Specification Incompleteness', description: 'Omitting critical invariants leads to false confidence in verification results', domain: 'All methods', severity: 'CRITICAL' },
    { name: 'Equivalence of Mutants', description: 'Semantically equivalent mutants are indistinguishable from viable mutations, inflating survival rates', domain: 'Mutation Testing', severity: 'MEDIUM' },
    { name: 'Undefined Behavior Modeling Gap', description: 'Formal models cannot capture all undefined behavior in real implementations', domain: 'Z3/K Framework', severity: 'HIGH' },
    { name: 'Temporal Logic Expressiveness', description: 'Some security properties resist encoding in LTL/CTL, leading to unverifiable requirements', domain: 'TLA+/Model Checking', severity: 'MEDIUM' },
    { name: 'Determinism in Distributed Simulations', description: 'Race conditions and clock skew make distributed simulation replay non-deterministic', domain: 'Determinism Checking', severity: 'HIGH' },
    { name: 'Runtime Overhead of Formal Monitors', description: 'Full runtime verification imposes unacceptable performance penalties in production', domain: 'Runtime Verification', severity: 'MEDIUM' },
  ];
}

// ─── ModelManager ───────────────────────────────────────────────
export class ModelManager {
  private models: Map<string, FormalModelInstance> = new Map();
  private verifications: Map<string, VerificationRun> = new Map();

  // Models
  createModel(config: Partial<FormalModelInstance> & { name: string; method: FormalMethod }): FormalModelId {
    const id = formalModelId();
    const model: FormalModelInstance = {
      id,
      name: config.name,
      method: config.method,
      specificationId: config.specificationId ?? '' as SpecificationId,
      stateCount: config.stateCount ?? 0,
      depth: config.depth ?? 0,
      propertiesChecked: config.propertiesChecked ?? [],
      verifications: [],
      created: Date.now(),
    };
    this.models.set(id, model);
    return id;
  }

  getModel(id: FormalModelId): FormalModelInstance | undefined {
    return this.models.get(id);
  }

  listModels(filter?: { method?: FormalMethod }): FormalModelInstance[] {
    let result = Array.from(this.models.values());
    if (filter?.method) {
      result = result.filter(m => m.method === filter.method);
    }
    return result;
  }

  listByMethod(method: FormalMethod): FormalModelInstance[] {
    return this.listModels({ method });
  }

  // Verifications
  runVerification(modelId: FormalModelId): VerificationRunId {
    const model = this.models.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found`);
    const runId = verificationRunId();
    const now = Date.now();
    const properties: PropertyResult[] = model.propertiesChecked.map(pid => ({
      propertyId: pid,
      result: Math.random() > 0.3,
    }));
    const hasFailures = properties.some(p => !p.result);
    const run: VerificationRun = {
      id: runId,
      modelId,
      status: hasFailures ? VerificationStatus.FAILED : VerificationStatus.PASSED,
      startTime: now,
      endTime: now + Math.floor(Math.random() * 5000) + 100,
      properties,
      statesExplored: model.stateCount ?? 100,
      errorsFound: hasFailures ? ['Property violation detected - see counterexample'] : [],
      warnings: [],
      durationMs: Math.floor(Math.random() * 5000) + 100,
      toolVersion: 'TLC 2.18',
    };
    this.verifications.set(runId, run);
    model.verifications.push(runId);
    return runId;
  }

  getVerification(id: VerificationRunId): VerificationRun | undefined {
    return this.verifications.get(id);
  }

  listVerifications(modelId: FormalModelId): VerificationRun[] {
    const model = this.models.get(modelId);
    if (!model) return [];
    return model.verifications.map(vId => this.verifications.get(vId)).filter(Boolean) as VerificationRun[];
  }

  getStats(): { totalModels: number; totalVerifications: number; passedCount: number; failedCount: number; runCount: number; byMethod: Record<string, number> } {
    const verifications = Array.from(this.verifications.values());
    const byMethod: Record<string, number> = {};
    Array.from(this.models.values()).forEach(m => {
      byMethod[m.method] = (byMethod[m.method] ?? 0) + 1;
    });
    return {
      totalModels: this.models.size,
      totalVerifications: verifications.length,
      passedCount: verifications.filter(v => v.status === VerificationStatus.PASSED).length,
      failedCount: verifications.filter(v => v.status === VerificationStatus.FAILED).length,
      runCount: verifications.length,
      byMethod,
    };
  }
}

// ─── SpecificationManager ───────────────────────────────────────
export class SpecificationManager {
  private specs: Map<string, FormalSpecification> = new Map();
  private properties: Map<string, PropertyInstance> = new Map();

  createSpec(config: Partial<FormalSpecification> & { name: string; method: FormalMethod; targetComponent: string }): SpecificationId {
    const id = specificationId();
    const spec: FormalSpecification = {
      id,
      name: config.name,
      method: config.method,
      description: config.description ?? '',
      targetComponent: config.targetComponent,
      properties: [],
      specificationText: config.specificationText ?? '',
      version: config.version ?? '1.0.0',
      author: config.author ?? 'sim-admin',
      lastVerified: Date.now(),
    };
    this.specs.set(id, spec);
    return id;
  }

  getSpec(id: SpecificationId): FormalSpecification | undefined {
    return this.specs.get(id);
  }

  listSpecs(filter?: { method?: FormalMethod; targetComponent?: string }): FormalSpecification[] {
    let result = Array.from(this.specs.values());
    if (filter?.method) result = result.filter(s => s.method === filter.method);
    if (filter?.targetComponent) result = result.filter(s => s.targetComponent === filter.targetComponent);
    return result;
  }

  listByTargetComponent(component: string): FormalSpecification[] {
    return this.listSpecs({ targetComponent: component });
  }

  addProperty(specId: SpecificationId, config: Partial<PropertyInstance> & { name: string; category: PropertyCategory }): PropertyId {
    const spec = this.specs.get(specId);
    if (!spec) throw new Error(`Specification ${specId} not found`);
    const id = propertyId();
    const prop: PropertyInstance = {
      id,
      name: config.name,
      category: config.category,
      invariantType: config.invariantType ?? InvariantType.SAFETY,
      description: config.description ?? '',
      temporalFormula: config.temporalFormula ?? '',
      isLiveness: config.isLiveness ?? false,
      isSafety: config.isSafety ?? false,
    };
    this.properties.set(id, prop);
    spec.properties.push(id);
    return id;
  }

  getProperty(id: PropertyId): PropertyInstance | undefined {
    return this.properties.get(id);
  }

  getStats(): { totalSpecs: number; totalProperties: number; byMethod: Record<string, number>; byTarget: Record<string, number> } {
    const byMethod: Record<string, number> = {};
    const byTarget: Record<string, number> = {};
    Array.from(this.specs.values()).forEach(s => {
      byMethod[s.method] = (byMethod[s.method] ?? 0) + 1;
      byTarget[s.targetComponent] = (byTarget[s.targetComponent] ?? 0) + 1;
    });
    return {
      totalSpecs: this.specs.size,
      totalProperties: this.properties.size,
      byMethod,
      byTarget,
    };
  }
}

// ─── MutationTestingManager ─────────────────────────────────────
export class MutationTestingManager {
  private mutants: Map<string, MutantInstance> = new Map();

  createMutation(original: string, operator: MutationOperator, overrides?: Partial<MutantInstance>): MutantId {
    const id = mutantId();
    const mutant: MutantInstance = {
      id,
      name: overrides?.name ?? `Mutation ${id}`,
      operator,
      originalCode: original,
      mutatedCode: overrides?.mutatedCode ?? original,
      status: MutantStatus.SURVIVED,
      lineNumber: overrides?.lineNumber ?? 1,
      score: 0,
      ...overrides,
    };
    this.mutants.set(id, mutant);
    return id;
  }

  getMutant(id: MutantId): MutantInstance | undefined {
    return this.mutants.get(id);
  }

  listMutants(filter?: { status?: MutantStatus; operator?: MutationOperator }): MutantInstance[] {
    let result = Array.from(this.mutants.values());
    if (filter?.status) result = result.filter(m => m.status === filter.status);
    if (filter?.operator) result = result.filter(m => m.operator === filter.operator);
    return result;
  }

  listByStatus(status: MutantStatus): MutantInstance[] {
    return this.listMutants({ status });
  }

  recordKill(id: MutantId, testName: string): boolean {
    const m = this.mutants.get(id);
    if (!m) return false;
    m.status = MutantStatus.KILLED;
    m.coveringTest = testName;
    m.killReason = `Killed by test: ${testName}`;
    m.score = 1.0;
    return true;
  }

  recordSurvival(id: MutantId): boolean {
    const m = this.mutants.get(id);
    if (!m) return false;
    m.status = MutantStatus.SURVIVED;
    m.score = 0;
    return true;
  }

  calculateKillRate(): number {
    const total = this.mutants.size;
    if (total === 0) return 0;
    const killed = this.listByStatus(MutantStatus.KILLED).length;
    return killed / total;
  }

  getStats(): { total: number; killed: number; survived: number; equivalent: number; killRate: number } {
    const total = this.mutants.size;
    const killed = this.listByStatus(MutantStatus.KILLED).length;
    const survived = this.listByStatus(MutantStatus.SURVIVED).length;
    const equivalent = this.listByStatus(MutantStatus.EQUIVALENT).length;
    return {
      total,
      killed,
      survived,
      equivalent,
      killRate: total > 0 ? killed / total : 0,
    };
  }
}

// ─── RuntimeVerificationManager ─────────────────────────────────
export class RuntimeVerificationManager {
  private monitors: Map<string, RuntimeMonitor> = new Map();

  createMonitor(config: Partial<RuntimeMonitor> & { name: string; type: RuntimeMonitorType; condition: string }): InvariantId {
    const id = invariantId();
    const monitor: RuntimeMonitor = {
      id,
      type: config.type,
      name: config.name,
      targetComponent: config.targetComponent ?? 'unknown',
      condition: config.condition,
      enabled: config.enabled ?? true,
      violations: [],
      severity: config.severity ?? 'MEDIUM',
    };
    this.monitors.set(id, monitor);
    return id;
  }

  getMonitor(id: InvariantId): RuntimeMonitor | undefined {
    return this.monitors.get(id);
  }

  listMonitors(filter?: { type?: RuntimeMonitorType; enabled?: boolean }): RuntimeMonitor[] {
    let result = Array.from(this.monitors.values());
    if (filter?.type) result = result.filter(m => m.type === filter.type);
    if (filter?.enabled !== undefined) result = result.filter(m => m.enabled === filter.enabled);
    return result;
  }

  listByType(type: RuntimeMonitorType): RuntimeMonitor[] {
    return this.listMonitors({ type });
  }

  enableMonitor(id: InvariantId): boolean {
    const m = this.monitors.get(id);
    if (!m) return false;
    m.enabled = true;
    return true;
  }

  disableMonitor(id: InvariantId): boolean {
    const m = this.monitors.get(id);
    if (!m) return false;
    m.enabled = false;
    return true;
  }

  recordViolation(id: InvariantId, value: string, message: string): boolean {
    const m = this.monitors.get(id);
    if (!m) return false;
    m.violations.push({ timestamp: Date.now(), value, message });
    return true;
  }

  getViolations(monitorId: InvariantId): RuntimeMonitor['violations'] {
    const m = this.monitors.get(monitorId);
    return m?.violations ?? [];
  }

  getStats(): { total: number; enabled: number; byType: Record<string, number>; totalViolations: number } {
    const byType: Record<string, number> = {};
    let totalViolations = 0;
    Array.from(this.monitors.values()).forEach(m => {
      byType[m.type] = (byType[m.type] ?? 0) + 1;
      totalViolations += m.violations.length;
    });
    return {
      total: this.monitors.size,
      enabled: this.listMonitors({ enabled: true }).length,
      byType,
      totalViolations,
    };
  }
}

// ─── DeterminismManager ─────────────────────────────────────────
export class DeterminismManager {
  private checks: Map<string, DeterminismReport> = new Map();

  runCheck(config: Partial<DeterminismReport> & { checkType: DeterminismCheckType; seed: number }): DeterminismReport {
    const runId = `det-${uid()}`;
    const runCount = config.runCount ?? 5;
    const consistent = config.consistent ?? true;
    const baseHash = `sha256-${config.seed}-${runCount}-${config.checkType}`;
    const hashComparison: string[] = [];
    const deviations: { run: number; difference: string }[] = [];
    for (let i = 0; i < runCount; i++) {
      if (consistent) {
        hashComparison.push(`sha256-${baseHash}-run${i}`);
      } else {
        hashComparison.push(`sha256-${baseHash}-run${i}-${i === 1 ? 'DEVIATION' : ''}`);
      }
    }
    if (!consistent) {
      deviations.push({ run: 1, difference: 'Hash mismatch at run index 1' });
    }
    const report: DeterminismReport = {
      checkType: config.checkType,
      runId,
      seed: config.seed,
      runCount,
      consistent,
      deviations,
      hashComparison,
      timestamp: Date.now(),
    };
    this.checks.set(runId, report);
    return report;
  }

  getCheck(runId: string): DeterminismReport | undefined {
    return this.checks.get(runId);
  }

  listChecks(filter?: { checkType?: DeterminismCheckType; consistent?: boolean }): DeterminismReport[] {
    let result = Array.from(this.checks.values());
    if (filter?.checkType) result = result.filter(c => c.checkType === filter.checkType);
    if (filter?.consistent !== undefined) result = result.filter(c => c.consistent === filter.consistent);
    return result;
  }

  getStats(): { total: number; consistentCount: number; inconsistentCount: number; passRate: number } {
    const entries = Array.from(this.checks.values());
    const consistentCount = entries.filter(c => c.consistent).length;
    return {
      total: entries.length,
      consistentCount,
      inconsistentCount: entries.length - consistentCount,
      passRate: entries.length > 0 ? consistentCount / entries.length : 0,
    };
  }
}

// ─── FormalSecurityManager ──────────────────────────────────────
export class FormalSecurityManager {
  private findings: Map<string, FormalFinding> = new Map();
  private challenges: FormalChallenge[] = [];

  addFinding(f: FormalFinding): void { this.findings.set(f.id, f); }
  getFinding(id: FormalFindingId): FormalFinding | undefined { return this.findings.get(id); }
  listFindings(): FormalFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }

  mitigateFinding(id: FormalFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.mitigated = true;
    return true;
  }

  filterFindingsBySeverity(severity: FormalFinding['severity']): FormalFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }

  filterFindingsByMethod(method: FormalMethod): FormalFinding[] {
    return this.listFindings().filter(f => f.method === method);
  }

  filterUnmitigated(): FormalFinding[] {
    return this.listFindings().filter(f => !f.mitigated);
  }

  loadKnownChallenges(): void { this.challenges = getKnownFormalChallenges(); }
  getKnownChallenges(): FormalChallenge[] { return this.challenges; }

  getTotalFindings(): number { return this.findings.size; }
}

// ─── FormalCoordinator ──────────────────────────────────────────
export class FormalCoordinator {
  models: ModelManager;
  specs: SpecificationManager;
  mutation: MutationTestingManager;
  runtime: RuntimeVerificationManager;
  determinism: DeterminismManager;
  security: FormalSecurityManager;

  constructor() {
    this.models = new ModelManager();
    this.specs = new SpecificationManager();
    this.mutation = new MutationTestingManager();
    this.runtime = new RuntimeVerificationManager();
    this.determinism = new DeterminismManager();
    this.security = new FormalSecurityManager();
  }

  getStats(): {
    modelCount: number; specCount: number; propertyCount: number;
    verificationCount: number; mutantCount: number; monitorCount: number;
    determinismCheckCount: number; findingCount: number; unmitigatedFindingCount: number;
    killRate: number; passRate: number;
  } {
    const mStats = this.models.getStats();
    const sStats = this.specs.getStats();
    const muStats = this.mutation.getStats();
    const rStats = this.runtime.getStats();
    const dStats = this.determinism.getStats();
    return {
      modelCount: mStats.totalModels,
      specCount: sStats.totalSpecs,
      propertyCount: sStats.totalProperties,
      verificationCount: mStats.totalVerifications,
      mutantCount: muStats.total,
      monitorCount: rStats.total,
      determinismCheckCount: dStats.total,
      findingCount: this.security.getTotalFindings(),
      unmitigatedFindingCount: this.security.filterUnmitigated().length,
      killRate: muStats.killRate,
      passRate: dStats.passRate,
    };
  }

  reset(): void {
    this.models = new ModelManager();
    this.specs = new SpecificationManager();
    this.mutation = new MutationTestingManager();
    this.runtime = new RuntimeVerificationManager();
    this.determinism = new DeterminismManager();
    this.security = new FormalSecurityManager();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultFormalEnvironment(): FormalCoordinator {
  const coord = new FormalCoordinator();

  // Specifications
  const specTla = coord.specs.createSpec({
    name: 'TCP Congestion Control',
    method: FormalMethod.TLA_PLUS,
    targetComponent: 'network-stack',
    description: 'TLA+ specification of TCP Reno congestion control algorithm with slow start, congestion avoidance, and fast recovery',
    specificationText: '---- MODULE TCPReno ----\nVARIABLES cwnd, ssthresh, state, dupAckCount\nInit == cwnd = 1 /\ ssthresh = 65535 /\ state = "slow_start"',
    version: '2.1.0',
    author: 'formal-team',
  });
  const specAlloy = coord.specs.createSpec({
    name: 'RBAC Access Control Model',
    method: FormalMethod.ALLOY,
    targetComponent: 'auth-service',
    description: 'Alloy specification of role-based access control with separation of duty constraints',
    specificationText: 'sig User, Role, Permission {}\nsig RoleAssignment { user: User, role: Role }\nsig PermissionAssignment { role: Role, perm: Permission }',
    version: '1.3.0',
    author: 'sec-arch',
  });
  const specZ3 = coord.specs.createSpec({
    name: 'Symbolic Execution Engine',
    method: FormalMethod.Z3_SMT,
    targetComponent: 'execution-engine',
    description: 'Z3 SMT solver constraints for symbolic execution of WASM bytecode',
    specificationText: '(declare-const x Int)\n(declare-const y Int)\n(assert (> x 0))\n(assert (= y (* x 2)))\n(check-sat)',
    version: '3.0.0',
    author: 'wasm-team',
  });
  const specCoq = coord.specs.createSpec({
    name: 'Cryptographic Implementation',
    method: FormalMethod.COQ,
    targetComponent: 'crypto-module',
    description: 'Coq mechanically verified AES-GCM implementation with constant-time guarantees',
    specificationText: 'Theorem encrypt_decrypt_correct : forall (k: key) (p: plaintext), decrypt k (encrypt k p) = p.',
    version: '1.0.0',
    author: 'crypto-team',
  });

  // Properties
  const propNoDeadlock = coord.specs.addProperty(specTla, {
    name: 'No Deadlock', category: PropertyCategory.DEADLOCK_FREE,
    invariantType: InvariantType.SAFETY, description: 'Connection state machine never deadlocks',
    temporalFormula: '[]~(state = "CLOSED" /\ pendingData > 0)', isLiveness: false, isSafety: true,
  });
  const propCongestionAvoidance = coord.specs.addProperty(specTla, {
    name: 'Congestion Avoidance', category: PropertyCategory.CORRECTNESS,
    invariantType: InvariantType.PROTOCOL_INVARIANT, description: 'cwnd never exceeds ssthresh+AW in congestion avoidance',
    temporalFormula: '[](state = "congestion_avoidance" => cwnd < ssthresh + AW)', isLiveness: false, isSafety: true,
  });
  const propSod = coord.specs.addProperty(specAlloy, {
    name: 'Separation of Duty', category: PropertyCategory.SECURITY,
    invariantType: InvariantType.SECURITY_PROPERTY, description: 'No user has conflicting roles',
    temporalFormula: 'all u: User | no disjoint r1, r2: u.roles | conflicting[r1, r2]', isLiveness: false, isSafety: true,
  });
  const propPrivilegeEscalation = coord.specs.addProperty(specAlloy, {
    name: 'No Privilege Escalation', category: PropertyCategory.SECURITY,
    invariantType: InvariantType.SECURITY_PROPERTY, description: 'Users cannot escalate privileges via role hierarchy',
    temporalFormula: 'all u: User | u.privileges in u.roles.privileges', isLiveness: false, isSafety: true,
  });
  const propPathSatisfiability = coord.specs.addProperty(specZ3, {
    name: 'Path Satisfiability', category: PropertyCategory.CORRECTNESS,
    invariantType: InvariantType.STATE_INVARIANT, description: 'Execution paths are satisfiable under given constraints',
    temporalFormula: '', isLiveness: false, isSafety: true,
  });
  const propEncryptDecrypt = coord.specs.addProperty(specCoq, {
    name: 'Encrypt-Decrypt Correctness', category: PropertyCategory.CORRECTNESS,
    invariantType: InvariantType.TYPE_INVARIANT, description: 'Decrypt(Encrypt(k, p), k) = p for all valid keys',
    temporalFormula: 'forall k p, decrypt k (encrypt k p) = p', isLiveness: false, isSafety: true,
  });
  const propTermination = coord.specs.addProperty(specCoq, {
    name: 'Termination of Decryption', category: PropertyCategory.TERMINATION,
    invariantType: InvariantType.LIVENESS, description: 'Decryption algorithm always terminates',
    temporalFormula: '<>(decrypt_state = "done")', isLiveness: true, isSafety: false,
  });
  const propLivenessProgress = coord.specs.addProperty(specTla, {
    name: 'Connection Progress', category: PropertyCategory.LIVENESS,
    invariantType: InvariantType.FAIRNESS, description: 'Data eventually delivered under fair scheduling',
    temporalFormula: '<>(delivered = pendingData)', isLiveness: true, isSafety: false,
  });

  // Models
  const modelId1 = coord.models.createModel({
    name: 'TCP Reno TLA+ Model', method: FormalMethod.TLA_PLUS,
    specificationId: specTla, stateCount: 15000, depth: 12,
    propertiesChecked: [propNoDeadlock, propCongestionAvoidance, propLivenessProgress],
  });
  const modelId2 = coord.models.createModel({
    name: 'RBAC Alloy Model', method: FormalMethod.ALLOY,
    specificationId: specAlloy, stateCount: 5000, depth: 8,
    propertiesChecked: [propSod, propPrivilegeEscalation],
  });
  const modelId3 = coord.models.createModel({
    name: 'Z3 Symbolic WASM Executor', method: FormalMethod.Z3_SMT,
    specificationId: specZ3, stateCount: 10000, depth: 20,
    propertiesChecked: [propPathSatisfiability],
  });
  const modelId4 = coord.models.createModel({
    name: 'AES-GCM Coq Model', method: FormalMethod.COQ,
    specificationId: specCoq, stateCount: 2000, depth: 6,
    propertiesChecked: [propEncryptDecrypt, propTermination],
  });

  // Verification runs
  for (let i = 0; i < 4; i++) {
    coord.models.runVerification(modelId1);
  }
  const vRun2 = coord.models.runVerification(modelId2);
  coord.models.runVerification(modelId3);
  coord.models.runVerification(modelId4);

  // Mutations
  coord.mutation.createMutation(
    'if (user.role === "admin") { grantAccess(); }',
    MutationOperator.NEGATE_CONDITION,
    { name: 'Negate admin auth check', mutatedCode: 'if (user.role !== "admin") { grantAccess(); }', status: MutantStatus.KILLED, coveringTest: 'test_admin_auth', killReason: 'Detected by authorization test', lineNumber: 42, score: 1.0 },
  );
  coord.mutation.createMutation(
    'const maxRetries = 3;',
    MutationOperator.CHANGE_CONSTANT,
    { name: 'Change max retries constant', mutatedCode: 'const maxRetries = 0;', status: MutantStatus.KILLED, coveringTest: 'test_retry_exhaustion', killReason: 'Detected by retry boundary test', lineNumber: 15, score: 1.0 },
  );
  coord.mutation.createMutation(
    'for (let i = 0; i < items.length; i++) {',
    MutationOperator.CHANGE_OPERATOR,
    { name: 'Change loop comparison operator', mutatedCode: 'for (let i = 0; i > items.length; i++) {', status: MutantStatus.KILLED, coveringTest: 'test_process_all_items', killReason: 'Detected by loop boundary test', lineNumber: 88, score: 1.0 },
  );
  coord.mutation.createMutation(
    'const total = sum(values);',
    MutationOperator.REMOVE_FUNCTION_CALL,
    { name: 'Remove sum call', mutatedCode: 'const total = 0;', status: MutantStatus.SURVIVED, lineNumber: 23, score: 0 },
  );
  coord.mutation.createMutation(
    'return a + b;',
    MutationOperator.SWAP_ARGUMENTS,
    { name: 'Swap addition arguments', mutatedCode: 'return b + a;', status: MutantStatus.SURVIVED, lineNumber: 7, score: 0 },
  );
  coord.mutation.createMutation(
    'const threshold = 10;',
    MutationOperator.CHANGE_CONSTANT,
    { name: 'Change threshold to equivalent value', mutatedCode: 'const threshold = 0xA;', status: MutantStatus.EQUIVALENT, lineNumber: 5, score: 0 },
  );

  // Runtime monitors
  coord.runtime.createMonitor({
    name: 'Scheduler Process Limit', type: RuntimeMonitorType.STATE_MONITOR,
    targetComponent: 'scheduler', condition: 'runningProcesses <= maxProcesses', severity: 'HIGH',
  });
  coord.runtime.createMonitor({
    name: 'Network Packet Integrity', type: RuntimeMonitorType.PROTOCOL_MONITOR,
    targetComponent: 'network-stack', condition: 'checksum(packet) == packet.checksum', severity: 'CRITICAL',
  });
  coord.runtime.createMonitor({
    name: 'Authentication Rate Limit', type: RuntimeMonitorType.SECURITY_MONITOR,
    targetComponent: 'auth-service', condition: 'failedAttempts < 5 per 30s window', severity: 'HIGH',
  });

  // Determinism checks
  coord.determinism.runCheck({
    checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, runCount: 5, consistent: true,
  });
  coord.determinism.runCheck({
    checkType: DeterminismCheckType.ORDERED_EVENTS, seed: 99, runCount: 3, consistent: false,
  });

  // Security findings
  coord.security.addFinding(createFormalFinding({
    description: 'Liveness property "Connection Progress" not verified for all execution paths',
    severity: 'HIGH', method: FormalMethod.TLA_PLUS, propertyId: propLivenessProgress, modelId: modelId1,
  }));
  coord.security.addFinding(createFormalFinding({
    description: 'Z3 model only covers 60% of WASM opcodes - symbolic execution incomplete',
    severity: 'CRITICAL', method: FormalMethod.Z3_SMT, modelId: modelId3,
  }));
  coord.security.addFinding(createFormalFinding({
    description: 'Two mutants survived mutation testing - access to unchecked code paths',
    severity: 'HIGH', method: FormalMethod.MUTATION_TESTING,
  }));
  coord.security.addFinding(createFormalFinding({
    description: 'Inconsistent determinism check detected in event ordering simulation',
    severity: 'MEDIUM', method: FormalMethod.DETERMINISM_CHECK,
  }));

  // Known challenges
  coord.security.loadKnownChallenges();

  return coord;
}
