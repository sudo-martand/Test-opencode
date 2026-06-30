import { describe, it, expect } from 'vitest';
import {
  FormalCoordinator, createDefaultFormalEnvironment,
  ModelManager, SpecificationManager, MutationTestingManager,
  RuntimeVerificationManager, DeterminismManager, FormalSecurityManager,
  formalModelId, verificationRunId, invariantId, propertyId,
  mutantId, specificationId, formalFindingId,
  FormalMethod, VerificationStatus, InvariantType, PropertyCategory,
  MutantStatus, MutationOperator, RuntimeMonitorType, DeterminismCheckType,
  createFormalSpecification, createFormalModelInstance, createPropertyInstance,
  createPropertyResult, createVerificationRun, createMutantInstance,
  createRuntimeMonitor, createDeterminismReport, createFormalFinding,
  getKnownFormalChallenges,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs', () => {
    const ids = [
      formalModelId(), verificationRunId(), invariantId(), propertyId(),
      mutantId(), specificationId(), formalFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => formalModelId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createFormalSpecification with defaults', () => {
    const s = createFormalSpecification();
    expect(s.name).toBe('Network Stack Model');
    expect(s.method).toBe(FormalMethod.TLA_PLUS);
    expect(s.targetComponent).toBe('network-stack');
  });
  it('createFormalSpecification with overrides', () => {
    const s = createFormalSpecification({ name: 'Custom', method: FormalMethod.ALLOY, targetComponent: 'auth' });
    expect(s.name).toBe('Custom');
    expect(s.method).toBe(FormalMethod.ALLOY);
    expect(s.targetComponent).toBe('auth');
  });
  it('createFormalModelInstance with defaults', () => {
    const m = createFormalModelInstance();
    expect(m.name).toBe('Network Stack TLA+ Model');
    expect(m.stateCount).toBe(1000);
    expect(m.depth).toBe(10);
  });
  it('createFormalModelInstance with overrides', () => {
    const m = createFormalModelInstance({ name: 'Custom Model', stateCount: 5000, depth: 20 });
    expect(m.name).toBe('Custom Model');
    expect(m.stateCount).toBe(5000);
    expect(m.depth).toBe(20);
  });
  it('createPropertyInstance with defaults', () => {
    const p = createPropertyInstance();
    expect(p.name).toBe('No Deadlock');
    expect(p.category).toBe(PropertyCategory.DEADLOCK_FREE);
    expect(p.isSafety).toBe(true);
    expect(p.isLiveness).toBe(false);
  });
  it('createPropertyInstance with overrides', () => {
    const p = createPropertyInstance({ name: 'Liveness', category: PropertyCategory.LIVENESS, isLiveness: true, isSafety: false });
    expect(p.name).toBe('Liveness');
    expect(p.isLiveness).toBe(true);
    expect(p.isSafety).toBe(false);
  });
  it('createPropertyResult with defaults', () => {
    const r = createPropertyResult();
    expect(r.result).toBe(true);
  });
  it('createVerificationRun with defaults', () => {
    const r = createVerificationRun();
    expect(r.status).toBe(VerificationStatus.PASSED);
    expect(r.statesExplored).toBe(500);
    expect(r.toolVersion).toBe('TLC 2.18');
  });
  it('createVerificationRun with overrides', () => {
    const r = createVerificationRun({ status: VerificationStatus.FAILED, statesExplored: 1000 });
    expect(r.status).toBe(VerificationStatus.FAILED);
    expect(r.statesExplored).toBe(1000);
  });
  it('createMutantInstance with defaults', () => {
    const m = createMutantInstance();
    expect(m.operator).toBe(MutationOperator.NEGATE_CONDITION);
    expect(m.status).toBe(MutantStatus.KILLED);
    expect(m.score).toBe(1.0);
  });
  it('createMutantInstance with overrides', () => {
    const m = createMutantInstance({ operator: MutationOperator.CHANGE_CONSTANT, status: MutantStatus.SURVIVED, score: 0 });
    expect(m.operator).toBe(MutationOperator.CHANGE_CONSTANT);
    expect(m.status).toBe(MutantStatus.SURVIVED);
    expect(m.score).toBe(0);
  });
  it('createRuntimeMonitor with defaults', () => {
    const m = createRuntimeMonitor();
    expect(m.type).toBe(RuntimeMonitorType.STATE_MONITOR);
    expect(m.enabled).toBe(true);
    expect(m.violations).toHaveLength(0);
  });
  it('createRuntimeMonitor with overrides', () => {
    const m = createRuntimeMonitor({ type: RuntimeMonitorType.EVENT_MONITOR, enabled: false, severity: 'CRITICAL' });
    expect(m.type).toBe(RuntimeMonitorType.EVENT_MONITOR);
    expect(m.enabled).toBe(false);
    expect(m.severity).toBe('CRITICAL');
  });
  it('createDeterminismReport with defaults', () => {
    const d = createDeterminismReport();
    expect(d.checkType).toBe(DeterminismCheckType.SEEDED_RNG);
    expect(d.consistent).toBe(true);
    expect(d.seed).toBe(42);
  });
  it('createDeterminismReport with overrides', () => {
    const d = createDeterminismReport({ checkType: DeterminismCheckType.ORDERED_EVENTS, consistent: false, seed: 99 });
    expect(d.checkType).toBe(DeterminismCheckType.ORDERED_EVENTS);
    expect(d.consistent).toBe(false);
    expect(d.seed).toBe(99);
  });
  it('createFormalFinding with defaults', () => {
    const f = createFormalFinding();
    expect(f.severity).toBe('HIGH');
    expect(f.mitigated).toBe(false);
  });
  it('getKnownFormalChallenges returns 7 challenges', () => {
    const challenges = getKnownFormalChallenges();
    expect(challenges).toHaveLength(7);
    expect(challenges[0]!.name).toBe('State Space Explosion');
    expect(challenges[6]!.name).toBe('Runtime Overhead of Formal Monitors');
  });
});

// ─── ModelManager ───────────────────────────────────────────────
describe('ModelManager', () => {
  it('add, get, remove, list, clear', () => {
    const mgr = new ModelManager();
    const id = mgr.createModel({ name: 'Test Model', method: FormalMethod.TLA_PLUS });
    expect(mgr.getModel(id)).toBeDefined();
    expect(mgr.listModels()).toHaveLength(1);
    expect(mgr.listByMethod(FormalMethod.TLA_PLUS)).toHaveLength(1);
    expect(mgr.listByMethod(FormalMethod.ALLOY)).toHaveLength(0);
  });
  it('createModel stores config correctly', () => {
    const mgr = new ModelManager();
    const id = mgr.createModel({ name: 'RBAC Model', method: FormalMethod.ALLOY, stateCount: 5000, depth: 8 });
    const m = mgr.getModel(id);
    expect(m).toBeDefined();
    expect(m!.name).toBe('RBAC Model');
    expect(m!.method).toBe(FormalMethod.ALLOY);
    expect(m!.stateCount).toBe(5000);
    expect(m!.depth).toBe(8);
    expect(m!.verifications).toHaveLength(0);
  });
  it('getModel returns undefined for missing ID', () => {
    expect(new ModelManager().getModel('' as any)).toBeUndefined();
  });
  it('listModels returns empty array initially', () => {
    expect(new ModelManager().listModels()).toHaveLength(0);
  });
  it('listModels filters by method', () => {
    const mgr = new ModelManager();
    const id1 = mgr.createModel({ name: 'M1', method: FormalMethod.TLA_PLUS });
    const id2 = mgr.createModel({ name: 'M2', method: FormalMethod.ALLOY });
    const id3 = mgr.createModel({ name: 'M3', method: FormalMethod.TLA_PLUS });
    expect(mgr.listModels()).toHaveLength(3);
    expect(mgr.listModels({ method: FormalMethod.TLA_PLUS })).toHaveLength(2);
    expect(mgr.listModels({ method: FormalMethod.ALLOY })).toHaveLength(1);
  });
  it('runVerification creates verification on model', () => {
    const mgr = new ModelManager();
    const mid = mgr.createModel({ name: 'Test', method: FormalMethod.TLA_PLUS, propertiesChecked: [propertyId()] });
    const vid = mgr.runVerification(mid);
    const v = mgr.getVerification(vid);
    expect(v).toBeDefined();
    expect(v!.modelId).toBe(mid);
    expect(v!.status).toBeDefined();
    expect(v!.durationMs).toBeGreaterThan(0);
  });
  it('runVerification on model with no properties succeeds', () => {
    const mgr = new ModelManager();
    const mid = mgr.createModel({ name: 'Empty', method: FormalMethod.TLA_PLUS });
    const vid = mgr.runVerification(mid);
    const v = mgr.getVerification(vid);
    expect(v).toBeDefined();
    expect(v!.properties).toHaveLength(0);
  });
  it('runVerification throws on missing model', () => {
    const mgr = new ModelManager();
    expect(() => mgr.runVerification('' as any)).toThrow('not found');
  });
  it('listVerifications returns runs for model', () => {
    const mgr = new ModelManager();
    const mid = mgr.createModel({ name: 'Test', method: FormalMethod.TLA_PLUS });
    const v1 = mgr.runVerification(mid);
    const v2 = mgr.runVerification(mid);
    const runs = mgr.listVerifications(mid);
    expect(runs).toHaveLength(2);
    expect(runs[0]!.id).toBe(v1);
    expect(runs[1]!.id).toBe(v2);
  });
  it('listVerifications returns empty for missing model', () => {
    expect(new ModelManager().listVerifications('' as any)).toHaveLength(0);
  });
  it('getStats returns correct counts', () => {
    const mgr = new ModelManager();
    expect(mgr.getStats().totalModels).toBe(0);
    const mid = mgr.createModel({ name: 'M1', method: FormalMethod.TLA_PLUS });
    mgr.runVerification(mid);
    mgr.runVerification(mid);
    const stats = mgr.getStats();
    expect(stats.totalModels).toBe(1);
    expect(stats.totalVerifications).toBe(2);
    expect(stats.byMethod[FormalMethod.TLA_PLUS]).toBe(1);
  });
});

// ─── SpecificationManager ───────────────────────────────────────
describe('SpecificationManager', () => {
  it('createSpec and getSpec', () => {
    const mgr = new SpecificationManager();
    const id = mgr.createSpec({ name: 'Test Spec', method: FormalMethod.TLA_PLUS, targetComponent: 'network' });
    const s = mgr.getSpec(id);
    expect(s).toBeDefined();
    expect(s!.name).toBe('Test Spec');
    expect(s!.method).toBe(FormalMethod.TLA_PLUS);
    expect(s!.targetComponent).toBe('network');
  });
  it('getSpec returns undefined for missing', () => {
    expect(new SpecificationManager().getSpec('' as any)).toBeUndefined();
  });
  it('listSpecs returns all specs', () => {
    const mgr = new SpecificationManager();
    mgr.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    mgr.createSpec({ name: 'S2', method: FormalMethod.ALLOY, targetComponent: 'auth' });
    expect(mgr.listSpecs()).toHaveLength(2);
  });
  it('listSpecs filters by method and target', () => {
    const mgr = new SpecificationManager();
    mgr.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    mgr.createSpec({ name: 'S2', method: FormalMethod.ALLOY, targetComponent: 'auth' });
    mgr.createSpec({ name: 'S3', method: FormalMethod.TLA_PLUS, targetComponent: 'crypto' });
    expect(mgr.listSpecs({ method: FormalMethod.TLA_PLUS })).toHaveLength(2);
    expect(mgr.listSpecs({ targetComponent: 'auth' })).toHaveLength(1);
    expect(mgr.listSpecs({ method: FormalMethod.ALLOY, targetComponent: 'auth' })).toHaveLength(1);
  });
  it('listByTargetComponent', () => {
    const mgr = new SpecificationManager();
    mgr.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    expect(mgr.listByTargetComponent('net')).toHaveLength(1);
    expect(mgr.listByTargetComponent('crypto')).toHaveLength(0);
  });
  it('addProperty adds to spec and returns ID', () => {
    const mgr = new SpecificationManager();
    const sid = mgr.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    const pid = mgr.addProperty(sid, { name: 'No Deadlock', category: PropertyCategory.DEADLOCK_FREE });
    expect(pid).toBeDefined();
    const p = mgr.getProperty(pid);
    expect(p).toBeDefined();
    expect(p!.name).toBe('No Deadlock');
    expect(p!.category).toBe(PropertyCategory.DEADLOCK_FREE);
    const spec = mgr.getSpec(sid);
    expect(spec!.properties).toContain(pid);
  });
  it('addProperty throws on missing spec', () => {
    const mgr = new SpecificationManager();
    expect(() => mgr.addProperty('' as any, { name: 'P1', category: PropertyCategory.SAFETY })).toThrow('not found');
  });
  it('getProperty returns undefined for missing', () => {
    expect(new SpecificationManager().getProperty('' as any)).toBeUndefined();
  });
  it('getStats returns correct counts', () => {
    const mgr = new SpecificationManager();
    expect(mgr.getStats().totalSpecs).toBe(0);
    const sid = mgr.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    mgr.addProperty(sid, { name: 'P1', category: PropertyCategory.SAFETY });
    mgr.addProperty(sid, { name: 'P2', category: PropertyCategory.LIVENESS });
    const stats = mgr.getStats();
    expect(stats.totalSpecs).toBe(1);
    expect(stats.totalProperties).toBe(2);
    expect(stats.byMethod[FormalMethod.TLA_PLUS]).toBe(1);
    expect(stats.byTarget['net']).toBe(1);
  });
});

// ─── MutationTestingManager ─────────────────────────────────────
describe('MutationTestingManager', () => {
  it('createMutation and getMutant', () => {
    const mgr = new MutationTestingManager();
    const id = mgr.createMutation('original code', MutationOperator.NEGATE_CONDITION);
    const m = mgr.getMutant(id);
    expect(m).toBeDefined();
    expect(m!.operator).toBe(MutationOperator.NEGATE_CONDITION);
    expect(m!.status).toBe(MutantStatus.SURVIVED);
  });
  it('createMutation with overrides', () => {
    const mgr = new MutationTestingManager();
    const id = mgr.createMutation('original', MutationOperator.CHANGE_CONSTANT, { name: 'Custom', lineNumber: 10, status: MutantStatus.KILLED });
    const m = mgr.getMutant(id);
    expect(m!.name).toBe('Custom');
    expect(m!.lineNumber).toBe(10);
    expect(m!.status).toBe(MutantStatus.KILLED);
  });
  it('getMutant returns undefined for missing', () => {
    expect(new MutationTestingManager().getMutant('' as any)).toBeUndefined();
  });
  it('listMutants returns all', () => {
    const mgr = new MutationTestingManager();
    mgr.createMutation('a', MutationOperator.NEGATE_CONDITION);
    mgr.createMutation('b', MutationOperator.CHANGE_CONSTANT);
    expect(mgr.listMutants()).toHaveLength(2);
  });
  it('listMutants filters by status and operator', () => {
    const mgr = new MutationTestingManager();
    mgr.createMutation('a', MutationOperator.NEGATE_CONDITION, { status: MutantStatus.KILLED });
    mgr.createMutation('b', MutationOperator.CHANGE_CONSTANT);
    mgr.createMutation('c', MutationOperator.NEGATE_CONDITION);
    expect(mgr.listMutants({ status: MutantStatus.KILLED })).toHaveLength(1);
    expect(mgr.listMutants({ operator: MutationOperator.NEGATE_CONDITION })).toHaveLength(2);
  });
  it('listByStatus filters correctly', () => {
    const mgr = new MutationTestingManager();
    mgr.createMutation('a', MutationOperator.NEGATE_CONDITION, { status: MutantStatus.KILLED });
    mgr.createMutation('b', MutationOperator.CHANGE_CONSTANT, { status: MutantStatus.EQUIVALENT });
    expect(mgr.listByStatus(MutantStatus.KILLED)).toHaveLength(1);
    expect(mgr.listByStatus(MutantStatus.EQUIVALENT)).toHaveLength(1);
    expect(mgr.listByStatus(MutantStatus.SURVIVED)).toHaveLength(0);
  });
  it('recordKill updates mutant', () => {
    const mgr = new MutationTestingManager();
    const id = mgr.createMutation('original', MutationOperator.NEGATE_CONDITION);
    expect(mgr.recordKill(id, 'test_auth')).toBe(true);
    const m = mgr.getMutant(id);
    expect(m!.status).toBe(MutantStatus.KILLED);
    expect(m!.coveringTest).toBe('test_auth');
    expect(m!.score).toBe(1.0);
  });
  it('recordKill returns false for missing', () => {
    expect(new MutationTestingManager().recordKill('' as any, 'test')).toBe(false);
  });
  it('recordSurvival updates mutant', () => {
    const mgr = new MutationTestingManager();
    const id = mgr.createMutation('original', MutationOperator.NEGATE_CONDITION, { status: MutantStatus.KILLED, score: 1.0 });
    expect(mgr.recordSurvival(id)).toBe(true);
    const m = mgr.getMutant(id);
    expect(m!.status).toBe(MutantStatus.SURVIVED);
    expect(m!.score).toBe(0);
  });
  it('recordSurvival returns false for missing', () => {
    expect(new MutationTestingManager().recordSurvival('' as any)).toBe(false);
  });
  it('calculateKillRate returns 0 when empty', () => {
    expect(new MutationTestingManager().calculateKillRate()).toBe(0);
  });
  it('calculateKillRate returns correct rate', () => {
    const mgr = new MutationTestingManager();
    const id1 = mgr.createMutation('a', MutationOperator.NEGATE_CONDITION);
    const id2 = mgr.createMutation('b', MutationOperator.CHANGE_CONSTANT);
    mgr.recordKill(id1, 'test1');
    expect(mgr.calculateKillRate()).toBe(0.5);
  });
  it('getStats returns correct counts', () => {
    const mgr = new MutationTestingManager();
    const id1 = mgr.createMutation('a', MutationOperator.NEGATE_CONDITION);
    mgr.createMutation('b', MutationOperator.CHANGE_CONSTANT, { status: MutantStatus.EQUIVALENT });
    mgr.createMutation('c', MutationOperator.SWAP_ARGUMENTS, { status: MutantStatus.SURVIVED });
    mgr.recordKill(id1, 'test1');
    const stats = mgr.getStats();
    expect(stats.total).toBe(3);
    expect(stats.killed).toBe(1);
    expect(stats.survived).toBe(1);
    expect(stats.equivalent).toBe(1);
    expect(stats.killRate).toBeCloseTo(0.333, 1);
  });
});

// ─── RuntimeVerificationManager ─────────────────────────────────
describe('RuntimeVerificationManager', () => {
  it('createMonitor and getMonitor', () => {
    const mgr = new RuntimeVerificationManager();
    const id = mgr.createMonitor({ name: 'Test Monitor', type: RuntimeMonitorType.STATE_MONITOR, condition: 'x > 0' });
    const m = mgr.getMonitor(id);
    expect(m).toBeDefined();
    expect(m!.name).toBe('Test Monitor');
    expect(m!.type).toBe(RuntimeMonitorType.STATE_MONITOR);
    expect(m!.condition).toBe('x > 0');
    expect(m!.enabled).toBe(true);
  });
  it('getMonitor returns undefined for missing', () => {
    expect(new RuntimeVerificationManager().getMonitor('' as any)).toBeUndefined();
  });
  it('listMonitors returns all', () => {
    const mgr = new RuntimeVerificationManager();
    mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    mgr.createMonitor({ name: 'M2', type: RuntimeMonitorType.EVENT_MONITOR, condition: 'c2' });
    expect(mgr.listMonitors()).toHaveLength(2);
  });
  it('listMonitors filters by type and enabled', () => {
    const mgr = new RuntimeVerificationManager();
    mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    mgr.createMonitor({ name: 'M2', type: RuntimeMonitorType.EVENT_MONITOR, condition: 'c2' });
    const m3 = mgr.createMonitor({ name: 'M3', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c3', enabled: false });
    expect(mgr.listMonitors({ type: RuntimeMonitorType.STATE_MONITOR })).toHaveLength(2);
    expect(mgr.listMonitors({ enabled: true })).toHaveLength(2);
    expect(mgr.listMonitors({ enabled: false })).toHaveLength(1);
  });
  it('listByType returns monitors of type', () => {
    const mgr = new RuntimeVerificationManager();
    mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    mgr.createMonitor({ name: 'M2', type: RuntimeMonitorType.TIMING_MONITOR, condition: 'c2' });
    expect(mgr.listByType(RuntimeMonitorType.STATE_MONITOR)).toHaveLength(1);
    expect(mgr.listByType(RuntimeMonitorType.TIMING_MONITOR)).toHaveLength(1);
  });
  it('enableMonitor and disableMonitor', () => {
    const mgr = new RuntimeVerificationManager();
    const id = mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1', enabled: false });
    expect(mgr.enableMonitor(id)).toBe(true);
    expect(mgr.getMonitor(id)!.enabled).toBe(true);
    expect(mgr.disableMonitor(id)).toBe(true);
    expect(mgr.getMonitor(id)!.enabled).toBe(false);
  });
  it('enableMonitor returns false for missing', () => {
    expect(new RuntimeVerificationManager().enableMonitor('' as any)).toBe(false);
  });
  it('disableMonitor returns false for missing', () => {
    expect(new RuntimeVerificationManager().disableMonitor('' as any)).toBe(false);
  });
  it('recordViolation adds violation', () => {
    const mgr = new RuntimeVerificationManager();
    const id = mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    expect(mgr.recordViolation(id, 'value', 'violation message')).toBe(true);
    expect(mgr.getMonitor(id)!.violations).toHaveLength(1);
    expect(mgr.getMonitor(id)!.violations[0]!.value).toBe('value');
    expect(mgr.getMonitor(id)!.violations[0]!.message).toBe('violation message');
  });
  it('recordViolation returns false for missing', () => {
    expect(new RuntimeVerificationManager().recordViolation('' as any, 'v', 'm')).toBe(false);
  });
  it('getViolations returns empty for missing monitor', () => {
    expect(new RuntimeVerificationManager().getViolations('' as any)).toHaveLength(0);
  });
  it('getViolations returns violations for monitor', () => {
    const mgr = new RuntimeVerificationManager();
    const id = mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    mgr.recordViolation(id, 'v1', 'msg1');
    mgr.recordViolation(id, 'v2', 'msg2');
    expect(mgr.getViolations(id)).toHaveLength(2);
  });
  it('getStats returns correct counts', () => {
    const mgr = new RuntimeVerificationManager();
    expect(mgr.getStats().total).toBe(0);
    const id = mgr.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    mgr.createMonitor({ name: 'M2', type: RuntimeMonitorType.EVENT_MONITOR, condition: 'c2', enabled: false });
    mgr.recordViolation(id, 'v1', 'msg1');
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.enabled).toBe(1);
    expect(stats.byType[RuntimeMonitorType.STATE_MONITOR]).toBe(1);
    expect(stats.byType[RuntimeMonitorType.EVENT_MONITOR]).toBe(1);
    expect(stats.totalViolations).toBe(1);
  });
});

// ─── DeterminismManager ─────────────────────────────────────────
describe('DeterminismManager', () => {
  it('runCheck creates report', () => {
    const mgr = new DeterminismManager();
    const r = mgr.runCheck({ checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, runCount: 5, consistent: true });
    expect(r.consistent).toBe(true);
    expect(r.seed).toBe(42);
    expect(r.runCount).toBe(5);
    expect(r.hashComparison).toHaveLength(5);
    expect(r.deviations).toHaveLength(0);
  });
  it('runCheck inconsistent report has deviations', () => {
    const mgr = new DeterminismManager();
    const r = mgr.runCheck({ checkType: DeterminismCheckType.ORDERED_EVENTS, seed: 99, runCount: 3, consistent: false });
    expect(r.consistent).toBe(false);
    expect(r.deviations).toHaveLength(1);
    expect(r.deviations[0]!.difference).toContain('Hash mismatch');
  });
  it('getCheck returns report by runId', () => {
    const mgr = new DeterminismManager();
    const r = mgr.runCheck({ checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, consistent: true });
    const fetched = mgr.getCheck(r.runId);
    expect(fetched).toBeDefined();
    expect(fetched!.runId).toBe(r.runId);
  });
  it('getCheck returns undefined for missing runId', () => {
    expect(new DeterminismManager().getCheck('missing')).toBeUndefined();
  });
  it('listChecks returns all', () => {
    const mgr = new DeterminismManager();
    mgr.runCheck({ checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, consistent: true });
    mgr.runCheck({ checkType: DeterminismCheckType.FIXED_TIMESTEP, seed: 1, consistent: true });
    expect(mgr.listChecks()).toHaveLength(2);
  });
  it('listChecks filters by type and consistent', () => {
    const mgr = new DeterminismManager();
    mgr.runCheck({ checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, consistent: true });
    mgr.runCheck({ checkType: DeterminismCheckType.ORDERED_EVENTS, seed: 99, consistent: false });
    expect(mgr.listChecks({ checkType: DeterminismCheckType.SEEDED_RNG })).toHaveLength(1);
    expect(mgr.listChecks({ consistent: true })).toHaveLength(1);
    expect(mgr.listChecks({ consistent: false })).toHaveLength(1);
  });
  it('getStats returns correct counts', () => {
    const mgr = new DeterminismManager();
    expect(mgr.getStats().total).toBe(0);
    mgr.runCheck({ checkType: DeterminismCheckType.SEEDED_RNG, seed: 42, consistent: true });
    mgr.runCheck({ checkType: DeterminismCheckType.ORDERED_EVENTS, seed: 99, consistent: false });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.consistentCount).toBe(1);
    expect(stats.inconsistentCount).toBe(1);
    expect(stats.passRate).toBe(0.5);
  });
});

// ─── FormalSecurityManager ──────────────────────────────────────
describe('FormalSecurityManager', () => {
  it('addFinding and getFinding', () => {
    const mgr = new FormalSecurityManager();
    const f = createFormalFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
  });
  it('getFinding returns undefined for missing', () => {
    expect(new FormalSecurityManager().getFinding('' as any)).toBeUndefined();
  });
  it('listFindings returns all', () => {
    const mgr = new FormalSecurityManager();
    mgr.addFinding(createFormalFinding());
    mgr.addFinding(createFormalFinding({ description: 'Second finding' }));
    expect(mgr.listFindings()).toHaveLength(2);
  });
  it('mitigateFinding updates finding', () => {
    const mgr = new FormalSecurityManager();
    const f = createFormalFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
  });
  it('mitigateFinding returns false for missing', () => {
    expect(new FormalSecurityManager().mitigateFinding('' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new FormalSecurityManager();
    mgr.addFinding(createFormalFinding({ severity: 'HIGH' }));
    mgr.addFinding(createFormalFinding({ severity: 'CRITICAL' }));
    mgr.addFinding(createFormalFinding({ severity: 'LOW' }));
    expect(mgr.filterFindingsBySeverity('HIGH')).toHaveLength(1);
    expect(mgr.filterFindingsBySeverity('CRITICAL')).toHaveLength(1);
  });
  it('filterFindingsByMethod', () => {
    const mgr = new FormalSecurityManager();
    mgr.addFinding(createFormalFinding({ method: FormalMethod.TLA_PLUS }));
    mgr.addFinding(createFormalFinding({ method: FormalMethod.Z3_SMT }));
    expect(mgr.filterFindingsByMethod(FormalMethod.TLA_PLUS)).toHaveLength(1);
  });
  it('filterUnmitigated returns only unmitigated', () => {
    const mgr = new FormalSecurityManager();
    const f1 = createFormalFinding();
    const f2 = createFormalFinding({ description: 'mitigated' });
    mgr.addFinding(f1);
    mgr.addFinding(f2);
    mgr.mitigateFinding(f2.id);
    expect(mgr.filterUnmitigated()).toHaveLength(1);
    expect(mgr.filterUnmitigated()[0]!.id).toBe(f1.id);
  });
  it('loadKnownChallenges loads challenges', () => {
    const mgr = new FormalSecurityManager();
    mgr.loadKnownChallenges();
    expect(mgr.getKnownChallenges()).toHaveLength(7);
  });
  it('getTotalFindings returns count', () => {
    const mgr = new FormalSecurityManager();
    expect(mgr.getTotalFindings()).toBe(0);
    mgr.addFinding(createFormalFinding());
    expect(mgr.getTotalFindings()).toBe(1);
  });
  it('clearFindings removes all', () => {
    const mgr = new FormalSecurityManager();
    mgr.addFinding(createFormalFinding());
    mgr.addFinding(createFormalFinding());
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
});

// ─── FormalCoordinator ──────────────────────────────────────────
describe('FormalCoordinator', () => {
  it('constructor initializes all managers', () => {
    const coord = new FormalCoordinator();
    expect(coord.models).toBeInstanceOf(ModelManager);
    expect(coord.specs).toBeInstanceOf(SpecificationManager);
    expect(coord.mutation).toBeInstanceOf(MutationTestingManager);
    expect(coord.runtime).toBeInstanceOf(RuntimeVerificationManager);
    expect(coord.determinism).toBeInstanceOf(DeterminismManager);
    expect(coord.security).toBeInstanceOf(FormalSecurityManager);
  });
  it('getStats returns zeros initially', () => {
    const coord = new FormalCoordinator();
    const stats = coord.getStats();
    expect(stats.modelCount).toBe(0);
    expect(stats.specCount).toBe(0);
    expect(stats.propertyCount).toBe(0);
    expect(stats.verificationCount).toBe(0);
    expect(stats.mutantCount).toBe(0);
    expect(stats.monitorCount).toBe(0);
    expect(stats.determinismCheckCount).toBe(0);
    expect(stats.findingCount).toBe(0);
    expect(stats.killRate).toBe(0);
    expect(stats.passRate).toBe(0);
  });
  it('getStats after adding data', () => {
    const coord = new FormalCoordinator();
    coord.models.createModel({ name: 'M1', method: FormalMethod.TLA_PLUS });
    coord.specs.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    coord.mutation.createMutation('a', MutationOperator.NEGATE_CONDITION);
    coord.runtime.createMonitor({ name: 'M1', type: RuntimeMonitorType.STATE_MONITOR, condition: 'c1' });
    const stats = coord.getStats();
    expect(stats.modelCount).toBe(1);
    expect(stats.specCount).toBe(1);
    expect(stats.mutantCount).toBe(1);
    expect(stats.monitorCount).toBe(1);
  });
  it('reset clears all data', () => {
    const coord = new FormalCoordinator();
    coord.models.createModel({ name: 'M1', method: FormalMethod.TLA_PLUS });
    coord.specs.createSpec({ name: 'S1', method: FormalMethod.TLA_PLUS, targetComponent: 'net' });
    coord.reset();
    const stats = coord.getStats();
    expect(stats.modelCount).toBe(0);
    expect(stats.specCount).toBe(0);
  });
});

// ─── Default Environment ────────────────────────────────────────
describe('createDefaultFormalEnvironment', () => {
  it('creates coordinator with pre-configured data', () => {
    const env = createDefaultFormalEnvironment();
    const stats = env.getStats();
    expect(stats.modelCount).toBeGreaterThanOrEqual(4);
    expect(stats.specCount).toBeGreaterThanOrEqual(4);
    expect(stats.propertyCount).toBeGreaterThanOrEqual(8);
    expect(stats.verificationCount).toBeGreaterThanOrEqual(6);
    expect(stats.mutantCount).toBeGreaterThanOrEqual(6);
    expect(stats.monitorCount).toBeGreaterThanOrEqual(3);
    expect(stats.determinismCheckCount).toBeGreaterThanOrEqual(2);
    expect(stats.findingCount).toBeGreaterThanOrEqual(4);
  });
  it('has models with verifications', () => {
    const env = createDefaultFormalEnvironment();
    const models = env.models.listModels();
    expect(models).toHaveLength(4);
    expect(env.models.listByMethod(FormalMethod.TLA_PLUS)).toHaveLength(1);
    expect(env.models.listByMethod(FormalMethod.ALLOY)).toHaveLength(1);
    expect(env.models.listByMethod(FormalMethod.Z3_SMT)).toHaveLength(1);
    expect(env.models.listByMethod(FormalMethod.COQ)).toHaveLength(1);
  });
  it('has verification runs', () => {
    const env = createDefaultFormalEnvironment();
    const models = env.models.listModels();
    models.forEach(m => {
      expect(m.verifications.length).toBeGreaterThan(0);
    });
    const stats = env.models.getStats();
    expect(stats.totalVerifications).toBeGreaterThan(0);
  });
  it('has specifications with properties', () => {
    const env = createDefaultFormalEnvironment();
    const specs = env.specs.listSpecs();
    specs.forEach(s => {
      expect(s.properties.length).toBeGreaterThan(0);
    });
    expect(env.specs.getStats().totalProperties).toBeGreaterThanOrEqual(8);
  });
  it('has mutations with varied statuses', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.mutation.listByStatus(MutantStatus.KILLED)).toHaveLength(3);
    expect(env.mutation.listByStatus(MutantStatus.SURVIVED)).toHaveLength(2);
    expect(env.mutation.listByStatus(MutantStatus.EQUIVALENT)).toHaveLength(1);
  });
  it('has runtime monitors', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.runtime.listByType(RuntimeMonitorType.STATE_MONITOR)).toHaveLength(1);
    expect(env.runtime.listByType(RuntimeMonitorType.PROTOCOL_MONITOR)).toHaveLength(1);
    expect(env.runtime.listByType(RuntimeMonitorType.SECURITY_MONITOR)).toHaveLength(1);
  });
  it('has determinism checks (1 consistent, 1 inconsistent)', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.determinism.listChecks({ consistent: true })).toHaveLength(1);
    expect(env.determinism.listChecks({ consistent: false })).toHaveLength(1);
  });
  it('has security findings', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.security.getTotalFindings()).toBe(4);
    expect(env.security.filterUnmitigated()).toHaveLength(4);
  });
  it('has known challenges loaded', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.security.getKnownChallenges()).toHaveLength(7);
  });
  it('has properties with correct categories', () => {
    const env = createDefaultFormalEnvironment();
    const specs = env.specs.listSpecs();
    const tlaSpec = specs.find(s => s.method === FormalMethod.TLA_PLUS);
    expect(tlaSpec).toBeDefined();
    expect(tlaSpec!.properties.length).toBeGreaterThanOrEqual(3);
    const alloySpec = specs.find(s => s.method === FormalMethod.ALLOY);
    expect(alloySpec).toBeDefined();
    expect(alloySpec!.properties.length).toBeGreaterThanOrEqual(2);
  });
  it('stats reflect all data', () => {
    const env = createDefaultFormalEnvironment();
    const stats = env.getStats();
    expect(stats.modelCount).toBe(4);
    expect(stats.mutantCount).toBe(6);
    expect(stats.monitorCount).toBe(3);
    expect(stats.determinismCheckCount).toBe(2);
    expect(stats.findingCount).toBe(4);
    expect(stats.unmitigatedFindingCount).toBe(4);
    expect(stats.killRate).toBe(0.5);
  });
  it('reset clears environment', () => {
    const env = createDefaultFormalEnvironment();
    expect(env.getStats().modelCount).toBe(4);
    env.reset();
    expect(env.getStats().modelCount).toBe(0);
    expect(env.getStats().specCount).toBe(0);
  });
});

// ─── Enum Completeness ──────────────────────────────────────────
describe('enum completeness', () => {
  it('FormalMethod has all values', () => {
    expect(Object.keys(FormalMethod)).toHaveLength(10);
  });
  it('VerificationStatus has all values', () => {
    expect(Object.keys(VerificationStatus)).toHaveLength(6);
  });
  it('InvariantType has all values', () => {
    expect(Object.keys(InvariantType)).toHaveLength(8);
  });
  it('PropertyCategory has all values', () => {
    expect(Object.keys(PropertyCategory)).toHaveLength(8);
  });
  it('MutantStatus has all values', () => {
    expect(Object.keys(MutantStatus)).toHaveLength(5);
  });
  it('MutationOperator has all values', () => {
    expect(Object.keys(MutationOperator)).toHaveLength(8);
  });
  it('RuntimeMonitorType has all values', () => {
    expect(Object.keys(RuntimeMonitorType)).toHaveLength(6);
  });
  it('DeterminismCheckType has all values', () => {
    expect(Object.keys(DeterminismCheckType)).toHaveLength(5);
  });
});
