import { describe, it, expect } from 'vitest';
import {
  RiskCoordinator, createDefaultRiskEnvironment,
  FairManager, ComplianceManager, AttackGraphManager,
  KpiManager, VendorManager, RiskManager,
  riskId, assetId, controlId, complianceFrameworkId,
  attackGraphNodeId, kpiId, vendorId, riskFindingId,
  RiskSeverity, RiskCategory, AssetType, ControlType,
  ControlEffectiveness, ComplianceFramework, KpiType,
  VendorRiskLevel, FindingStatus,
  createRiskEntry, createAsset, createControl,
  createFairAnalysis, createAttackGraphNode, createKpi,
  createVendor, createRiskFinding, createRiskScenario,
  getKnownRiskScenarios, assessNistCsf,
} from '../index';

// ─── Branded IDs ────────────────────────────────────────────────
describe('branded IDs', () => {
  it('generate unique IDs for all types', () => {
    const ids = [
      riskId(), assetId(), controlId(), complianceFrameworkId(),
      attackGraphNodeId(), kpiId(), vendorId(), riskFindingId(),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('generate unique IDs across multiple calls', () => {
    expect(new Set(Array.from({ length: 10 }, () => riskId())).size).toBe(10);
  });
});

// ─── Factory Functions ──────────────────────────────────────────
describe('factory functions', () => {
  it('createRiskEntry with defaults', () => {
    const r = createRiskEntry();
    expect(r.name).toBe('Sample Risk');
    expect(r.severity).toBe(RiskSeverity.MEDIUM);
    expect(r.inherentRisk).toBe(0.25);
  });
  it('createRiskEntry with overrides', () => {
    const r = createRiskEntry({ name: 'Custom Risk', severity: RiskSeverity.CRITICAL, likelihood: 0.9, impact: 0.8 });
    expect(r.name).toBe('Custom Risk');
    expect(r.severity).toBe(RiskSeverity.CRITICAL);
    expect(r.inherentRisk).toBeCloseTo(0.72, 10);
  });
  it('createAsset with defaults', () => {
    const a = createAsset();
    expect(a.name).toBe('Asset-1');
    expect(a.type).toBe(AssetType.SERVER);
    expect(a.criticality).toBe(0.7);
  });
  it('createAsset with overrides', () => {
    const a = createAsset({ name: 'Prod DB', type: AssetType.DATABASE, value: 2000000 });
    expect(a.name).toBe('Prod DB');
    expect(a.type).toBe(AssetType.DATABASE);
    expect(a.value).toBe(2000000);
  });
  it('createControl with defaults', () => {
    const c = createControl();
    expect(c.name).toBe('Control-1');
    expect(c.type).toBe(ControlType.PREVENTIVE);
    expect(c.effectiveness).toBe(ControlEffectiveness.HIGH);
  });
  it('createFairAnalysis with defaults', () => {
    const f = createFairAnalysis();
    expect(f.lossEventFrequency).toBe(5);
    expect(f.annualizedLossExpectancy).toBe(750000);
  });
  it('createAttackGraphNode with defaults', () => {
    const n = createAttackGraphNode();
    expect(n.name).toBe('Node-1');
    expect(n.depth).toBe(0);
    expect(n.probability).toBe(0.5);
  });
  it('createKpi with defaults', () => {
    const k = createKpi();
    expect(k.type).toBe(KpiType.MTTD);
    expect(k.currentValue).toBe(24);
    expect(k.threshold).toBe(48);
  });
  it('createVendor with defaults', () => {
    const v = createVendor();
    expect(v.name).toBe('Vendor-1');
    expect(v.riskLevel).toBe(VendorRiskLevel.MEDIUM);
    expect(v.contractValue).toBe(100000);
  });
  it('createRiskFinding with defaults', () => {
    const f = createRiskFinding();
    expect(f.severity).toBe('high');
    expect(f.mitigated).toBe(false);
  });
  it('createRiskScenario with defaults', () => {
    const s = createRiskScenario();
    expect(s.name).toBe('Scenario-1');
    expect(s.severity).toBe('high');
    expect(s.cvssScore).toBe(8.2);
  });
  it('getKnownRiskScenarios returns 8 scenarios', () => {
    const scenarios = getKnownRiskScenarios();
    expect(scenarios).toHaveLength(8);
  });
});

// ─── FairManager ─────────────────────────────────────────────────
describe('FairManager', () => {
  it('runAnalysis and getAnalysis', () => {
    const mgr = new FairManager();
    const aid = assetId();
    const analysis = mgr.runAnalysis(aid, 10, 0.5, 100000, 50000, 1000);
    expect(analysis.asset).toBe(aid);
    expect(analysis.threatEventFrequency).toBe(10);
    expect(analysis.vulnerability).toBe(0.5);
    expect(analysis.lossEventFrequency).toBe(5);
    expect(analysis.lossMagnitude.primary).toBe(100000);
    expect(analysis.lossMagnitude.secondary).toBe(50000);
    expect(analysis.annualizedLossExpectancy).toBe(5 * 150000);
    expect(mgr.getAnalysis(aid)).toEqual(analysis);
    expect(mgr.getAnalysis('nonexistent' as any)).toBeUndefined();
  });
  it('monteCarlo normal distribution', () => {
    const mgr = new FairManager();
    const result = mgr.monteCarlo(100000, 'NORMAL', 5000);
    expect(result.results).toHaveLength(5000);
    expect(result.mean).toBeGreaterThan(50000);
    expect(result.mean).toBeLessThan(150000);
    expect(result.percentile95).toBeGreaterThan(0);
    expect(result.percentile99).toBeGreaterThan(result.percentile95);
  });
  it('monteCarlo lognormal distribution', () => {
    const mgr = new FairManager();
    const result = mgr.monteCarlo(100000, 'LOGNORMAL', 5000);
    expect(result.results).toHaveLength(5000);
    expect(result.mean).toBeGreaterThan(0);
  });
  it('monteCarlo uniform distribution', () => {
    const mgr = new FairManager();
    const result = mgr.monteCarlo(100000, 'UNIFORM', 5000);
    expect(result.results).toHaveLength(5000);
    expect(result.mean).toBeGreaterThan(0);
  });
  it('calculateALE', () => {
    const mgr = new FairManager();
    expect(mgr.calculateALE(5, 150000)).toBe(750000);
    expect(mgr.calculateALE(0, 100000)).toBe(0);
  });
  it('getStats', () => {
    const mgr = new FairManager();
    expect(mgr.getStats()).toEqual({ totalAnalyses: 0, averageALE: 0, totalExposure: 0 });
    mgr.runAnalysis(assetId(), 10, 0.5, 100000, 50000, 500);
    mgr.runAnalysis(assetId(), 5, 0.3, 200000, 100000, 500);
    const stats = mgr.getStats();
    expect(stats.totalAnalyses).toBe(2);
    expect(stats.totalExposure).toBeGreaterThan(0);
    expect(stats.averageALE).toBeGreaterThan(0);
  });
  it('clear', () => {
    const mgr = new FairManager();
    mgr.runAnalysis(assetId(), 10, 0.5, 100000, 50000, 500);
    mgr.clear();
    expect(mgr.getStats().totalAnalyses).toBe(0);
  });
});

// ─── ComplianceManager ──────────────────────────────────────────
describe('ComplianceManager', () => {
  it('registerFramework and getFramework', () => {
    const mgr = new ComplianceManager();
    const id = mgr.registerFramework(ComplianceFramework.GDPR, [
      { id: 'r1', description: 'Requirement 1', compliant: true, evidence: [] },
      { id: 'r2', description: 'Requirement 2', compliant: false, evidence: [] },
    ]);
    const fw = mgr.getFramework(id);
    expect(fw).toBeDefined();
    expect(fw!.framework).toBe(ComplianceFramework.GDPR);
    expect(fw!.score).toBe(50);
    expect(fw!.requirements).toHaveLength(2);
  });
  it('listFrameworks', () => {
    const mgr = new ComplianceManager();
    mgr.registerFramework(ComplianceFramework.GDPR);
    mgr.registerFramework(ComplianceFramework.PCI_DSS);
    expect(mgr.listFrameworks()).toHaveLength(2);
  });
  it('updateRequirement', () => {
    const mgr = new ComplianceManager();
    const id = mgr.registerFramework(ComplianceFramework.GDPR, [
      { id: 'r1', description: 'Req 1', compliant: false, evidence: [] },
      { id: 'r2', description: 'Req 2', compliant: false, evidence: [] },
    ]);
    expect(mgr.updateRequirement(id, 'r1', true)).toBe(true);
    expect(mgr.getFramework(id)!.score).toBe(50);
    expect(mgr.updateRequirement('nonexistent' as any, 'r1', true)).toBe(false);
    expect(mgr.updateRequirement(id, 'r3', true)).toBe(false);
  });
  it('calculateComplianceScore', () => {
    const mgr = new ComplianceManager();
    const id = mgr.registerFramework(ComplianceFramework.PCI_DSS, [
      { id: 'r1', description: 'Req 1', compliant: true, evidence: [] },
      { id: 'r2', description: 'Req 2', compliant: false, evidence: [] },
      { id: 'r3', description: 'Req 3', compliant: true, evidence: [] },
    ]);
    expect(mgr.calculateComplianceScore(id)).toBe(67);
    expect(mgr.calculateComplianceScore('nonexistent' as any)).toBe(0);
  });
  it('listNonCompliantRequirements', () => {
    const mgr = new ComplianceManager();
    const id = mgr.registerFramework(ComplianceFramework.HIPAA, [
      { id: 'r1', description: 'Req 1', compliant: true, evidence: [] },
      { id: 'r2', description: 'Req 2', compliant: false, evidence: [] },
    ]);
    const nonCompliant = mgr.listNonCompliantRequirements(id);
    expect(nonCompliant).toHaveLength(1);
    expect(nonCompliant[0]!.id).toBe('r2');
    expect(mgr.listNonCompliantRequirements('nonexistent' as any)).toEqual([]);
  });
  it('removeFramework', () => {
    const mgr = new ComplianceManager();
    const id = mgr.registerFramework(ComplianceFramework.GDPR);
    expect(mgr.removeFramework(id)).toBe(true);
    expect(mgr.listFrameworks()).toHaveLength(0);
    expect(mgr.removeFramework('nonexistent' as any)).toBe(false);
  });
  it('clear', () => {
    const mgr = new ComplianceManager();
    mgr.registerFramework(ComplianceFramework.GDPR);
    mgr.clear();
    expect(mgr.listFrameworks()).toHaveLength(0);
  });
  it('getStats', () => {
    const mgr = new ComplianceManager();
    expect(mgr.getStats()).toEqual({ total: 0, averageScore: 0, compliantCount: 0, nonCompliantCount: 0 });
    mgr.registerFramework(ComplianceFramework.GDPR, [
      { id: 'r1', description: 'R1', compliant: true, evidence: [] },
      { id: 'r2', description: 'R2', compliant: false, evidence: [] },
    ]);
    const stats = mgr.getStats();
    expect(stats.total).toBe(1);
    expect(stats.averageScore).toBe(50);
    expect(stats.compliantCount).toBe(1);
    expect(stats.nonCompliantCount).toBe(1);
  });
});

// ─── AttackGraphManager ─────────────────────────────────────────
describe('AttackGraphManager', () => {
  it('addNode and getNode', () => {
    const mgr = new AttackGraphManager();
    const id = mgr.addNode({ name: 'Test Node', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5 });
    const node = mgr.getNode(id);
    expect(node).toBeDefined();
    expect(node!.name).toBe('Test Node');
  });
  it('addNodeDirect', () => {
    const mgr = new AttackGraphManager();
    const node = createAttackGraphNode({ name: 'Direct Node' });
    mgr.addNodeDirect(node);
    expect(mgr.getNode(node.id)).toEqual(node);
  });
  it('listNodes with filter', () => {
    const mgr = new AttackGraphManager();
    mgr.addNode({ name: 'N1', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5, cvssScore: 9.0 });
    mgr.addNode({ name: 'N2', exploits: [], preconditions: [], postconditions: [], depth: 1, probability: 0.5, cvssScore: 5.0 });
    expect(mgr.listNodes({ depth: 0 })).toHaveLength(1);
    expect(mgr.listNodes({ maxCvss: 6.0 })).toHaveLength(1);
    expect(mgr.listNodes({ depth: 1, maxCvss: 10.0 })).toHaveLength(1);
  });
  it('findShortestPath', () => {
    const mgr = new AttackGraphManager();
    const a = mgr.addNode({ name: 'A', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.9 });
    const b = mgr.addNode({ name: 'B', exploits: [], preconditions: [a], postconditions: [], depth: 1, probability: 0.7 });
    const c = mgr.addNode({ name: 'C', exploits: [], preconditions: [b], postconditions: [], depth: 2, probability: 0.5 });
    const d = mgr.addNode({ name: 'D', exploits: [], preconditions: [c], postconditions: [], depth: 3, probability: 0.3 });
    // Link postconditions
    const na = mgr.getNode(a)!; na.postconditions = [b];
    const nb = mgr.getNode(b)!; nb.postconditions = [c];
    const nc = mgr.getNode(c)!; nc.postconditions = [d];
    expect(mgr.findShortestPath(a, d)).toEqual([a, b, c, d]);
    expect(mgr.findShortestPath(a, a)).toEqual([a]);
    expect(mgr.findShortestPath(d, a)).toEqual([]);
  });
  it('findPathsToCrownJewel', () => {
    const mgr = new AttackGraphManager();
    const a = mgr.addNode({ name: 'A', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.9 });
    const b = mgr.addNode({ name: 'B', exploits: [], preconditions: [a], postconditions: [], depth: 1, probability: 0.7 });
    const c = mgr.addNode({ name: 'CJ', exploits: [], preconditions: [b], postconditions: [], depth: 2, probability: 0.5 });
    const na = mgr.getNode(a)!; na.postconditions = [b];
    const nb = mgr.getNode(b)!; nb.postconditions = [c];
    const paths = mgr.findPathsToCrownJewel(c);
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0]!.path).toContain(c);
    expect(paths[0]!.totalProbability).toBeGreaterThan(0);
  });
  it('removeNode', () => {
    const mgr = new AttackGraphManager();
    const id = mgr.addNode({ name: 'N', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5 });
    expect(mgr.removeNode(id)).toBe(true);
    expect(mgr.removeNode('nonexistent' as any)).toBe(false);
  });
  it('clear', () => {
    const mgr = new AttackGraphManager();
    mgr.addNode({ name: 'N', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5 });
    mgr.clear();
    expect(mgr.listNodes()).toHaveLength(0);
  });
  it('getStats', () => {
    const mgr = new AttackGraphManager();
    expect(mgr.getStats()).toEqual({ totalNodes: 0, maxDepth: 0, avgProbability: 0 });
    mgr.addNode({ name: 'N1', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5 });
    mgr.addNode({ name: 'N2', exploits: [], preconditions: [], postconditions: [], depth: 2, probability: 0.8 });
    const stats = mgr.getStats();
    expect(stats.totalNodes).toBe(2);
    expect(stats.maxDepth).toBe(2);
    expect(stats.avgProbability).toBe(0.65);
  });
});

// ─── KpiManager ─────────────────────────────────────────────────
describe('KpiManager', () => {
  it('register and get', () => {
    const mgr = new KpiManager();
    const id = mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    const kpi = mgr.get(id);
    expect(kpi).toBeDefined();
    expect(kpi!.type).toBe(KpiType.MTTD);
    expect(kpi!.history).toEqual([]);
  });
  it('registerDirect', () => {
    const mgr = new KpiManager();
    const kpi = createKpi();
    mgr.registerDirect(kpi);
    expect(mgr.get(kpi.id)).toEqual(kpi);
  });
  it('list with filter', () => {
    const mgr = new KpiManager();
    mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    mgr.register({ type: KpiType.PATCH_LATENCY, name: 'Patch', currentValue: 7, threshold: 14, unit: 'days', period: 'WEEKLY' });
    expect(mgr.list({ type: KpiType.MTTD })).toHaveLength(1);
    expect(mgr.list({ period: 'WEEKLY' })).toHaveLength(1);
  });
  it('update and trend', () => {
    const mgr = new KpiManager();
    const id = mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 48, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    expect(mgr.update(id, 24)).toBe(true);
    expect(mgr.get(id)!.currentValue).toBe(24);
    expect(mgr.get(id)!.history).toHaveLength(1);
    expect(mgr.update('nonexistent' as any, 10)).toBe(false);
  });
  it('calculateTrend', () => {
    const mgr = new KpiManager();
    const id = kpiId();
    mgr.registerDirect({
      id, type: KpiType.MTTD, name: 'MTTD', currentValue: 50, threshold: 48, unit: 'hours', trend: 'STABLE', period: 'MONTHLY', lastUpdated: Date.now(),
      history: [{ value: 80, timestamp: Date.now() - 2592000000 }, { value: 65, timestamp: Date.now() - 1296000000 }],
    });
    mgr.update(id, 40);
    expect(mgr.calculateTrend(id)).toBe('IMPROVING');
    expect(mgr.calculateTrend('nonexistent' as any)).toBe('STABLE');
  });
  it('getViolations', () => {
    const mgr = new KpiManager();
    mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    const id2 = mgr.register({ type: KpiType.PATCH_LATENCY, name: 'Patch', currentValue: 14, threshold: 7, unit: 'days', period: 'WEEKLY' });
    const violations = mgr.getViolations();
    expect(violations).toHaveLength(1);
    expect(violations[0]!.id).toBe(id2);
  });
  it('remove', () => {
    const mgr = new KpiManager();
    const id = mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    expect(mgr.remove(id)).toBe(true);
    expect(mgr.remove('nonexistent' as any)).toBe(false);
  });
  it('clear', () => {
    const mgr = new KpiManager();
    mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('getStats', () => {
    const mgr = new KpiManager();
    expect(mgr.getStats().total).toBe(0);
    mgr.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    mgr.register({ type: KpiType.PATCH_LATENCY, name: 'Patch', currentValue: 14, threshold: 7, unit: 'days', period: 'WEEKLY' });
    const stats = mgr.getStats();
    expect(stats.total).toBe(2);
    expect(stats.violating).toBe(1);
    expect(stats.byType[KpiType.MTTD]).toBe(1);
  });
});

// ─── VendorManager ──────────────────────────────────────────────
describe('VendorManager', () => {
  it('register and get', () => {
    const mgr = new VendorManager();
    const id = mgr.register({ name: 'VendorCo', category: 'Cloud', riskLevel: VendorRiskLevel.HIGH, criticality: 0.8, contractValue: 500000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: true });
    const v = mgr.get(id);
    expect(v).toBeDefined();
    expect(v!.name).toBe('VendorCo');
    expect(v!.riskLevel).toBe(VendorRiskLevel.HIGH);
  });
  it('registerDirect', () => {
    const mgr = new VendorManager();
    const v = createVendor();
    mgr.registerDirect(v);
    expect(mgr.get(v.id)).toEqual(v);
  });
  it('list with filter', () => {
    const mgr = new VendorManager();
    mgr.register({ name: 'V1', category: 'Cloud', riskLevel: VendorRiskLevel.CRITICAL, criticality: 0.9, contractValue: 1000000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: true });
    mgr.register({ name: 'V2', category: 'Office', riskLevel: VendorRiskLevel.LOW, criticality: 0.1, contractValue: 10000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    expect(mgr.list({ category: 'Cloud' })).toHaveLength(1);
    expect(mgr.list({ riskLevel: VendorRiskLevel.LOW })).toHaveLength(1);
  });
  it('listByRiskLevel', () => {
    const mgr = new VendorManager();
    mgr.register({ name: 'V1', category: 'A', riskLevel: VendorRiskLevel.CRITICAL, criticality: 0.9, contractValue: 100000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: true });
    mgr.register({ name: 'V2', category: 'B', riskLevel: VendorRiskLevel.LOW, criticality: 0.1, contractValue: 10000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    expect(mgr.listByRiskLevel(VendorRiskLevel.CRITICAL)).toHaveLength(1);
  });
  it('addAssessment', () => {
    const mgr = new VendorManager();
    const id = mgr.register({ name: 'V', category: 'A', riskLevel: VendorRiskLevel.MEDIUM, criticality: 0.5, contractValue: 50000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    expect(mgr.addAssessment(id, 85, ['Finding 1'])).toBe(true);
    expect(mgr.get(id)!.assessments).toHaveLength(1);
    expect(mgr.get(id)!.lastAssessmentDate).toBeDefined();
    expect(mgr.addAssessment('nonexistent' as any, 90, [])).toBe(false);
  });
  it('updateRiskLevel', () => {
    const mgr = new VendorManager();
    const id = mgr.register({ name: 'V', category: 'A', riskLevel: VendorRiskLevel.MEDIUM, criticality: 0.5, contractValue: 50000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    expect(mgr.updateRiskLevel(id, VendorRiskLevel.HIGH)).toBe(true);
    expect(mgr.get(id)!.riskLevel).toBe(VendorRiskLevel.HIGH);
    expect(mgr.updateRiskLevel('nonexistent' as any, VendorRiskLevel.CRITICAL)).toBe(false);
  });
  it('remove', () => {
    const mgr = new VendorManager();
    const id = mgr.register({ name: 'V', category: 'A', riskLevel: VendorRiskLevel.LOW, criticality: 0.1, contractValue: 10000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    expect(mgr.remove(id)).toBe(true);
    expect(mgr.remove('nonexistent' as any)).toBe(false);
  });
  it('clear', () => {
    const mgr = new VendorManager();
    mgr.register({ name: 'V', category: 'A', riskLevel: VendorRiskLevel.LOW, criticality: 0.1, contractValue: 10000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    mgr.clear();
    expect(mgr.list()).toHaveLength(0);
  });
  it('getStats', () => {
    const mgr = new VendorManager();
    expect(mgr.getStats()).toEqual({ total: 0, byRiskLevel: {}, averageScore: 0, criticalVendorCount: 0 });
    mgr.register({ name: 'V1', category: 'A', riskLevel: VendorRiskLevel.CRITICAL, criticality: 0.9, contractValue: 100000, assessments: [{ date: Date.now(), score: 85, findings: [] }], complianceCertifications: [], dataShared: [], accessToNetwork: true });
    const stats = mgr.getStats();
    expect(stats.total).toBe(1);
    expect(stats.criticalVendorCount).toBe(1);
    expect(stats.averageScore).toBe(85);
  });
});

// ─── RiskManager ────────────────────────────────────────────────
describe('RiskManager', () => {
  it('addFinding, getFinding, listFindings, clearFindings', () => {
    const mgr = new RiskManager();
    const f = createRiskFinding();
    mgr.addFinding(f);
    expect(mgr.getFinding(f.id)).toEqual(f);
    expect(mgr.listFindings()).toHaveLength(1);
    mgr.clearFindings();
    expect(mgr.listFindings()).toHaveLength(0);
  });
  it('mitigateFinding', () => {
    const mgr = new RiskManager();
    const f = createRiskFinding();
    mgr.addFinding(f);
    expect(mgr.mitigateFinding(f.id)).toBe(true);
    expect(mgr.getFinding(f.id)!.mitigated).toBe(true);
    expect(mgr.mitigateFinding('nonexistent' as any)).toBe(false);
  });
  it('filterFindingsBySeverity', () => {
    const mgr = new RiskManager();
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), severity: 'critical' }));
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), severity: 'high' }));
    expect(mgr.filterFindingsBySeverity('critical')).toHaveLength(1);
  });
  it('filterFindingsByCategory', () => {
    const mgr = new RiskManager();
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), category: RiskCategory.CYBER }));
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), category: RiskCategory.COMPLIANCE }));
    expect(mgr.filterFindingsByCategory(RiskCategory.CYBER)).toHaveLength(1);
  });
  it('filterFindingsUnmitigated', () => {
    const mgr = new RiskManager();
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), mitigated: true }));
    mgr.addFinding(createRiskFinding({ id: riskFindingId(), mitigated: false }));
    expect(mgr.filterFindingsUnmitigated()).toHaveLength(1);
  });
  it('addScenario, getScenario, listScenarios, clearScenarios', () => {
    const mgr = new RiskManager();
    const s = createRiskScenario();
    mgr.addScenario(s);
    expect(mgr.getScenario(s.id)).toEqual(s);
    mgr.clearScenarios();
    expect(mgr.listScenarios()).toHaveLength(0);
  });
  it('loadKnownScenarios', () => {
    const mgr = new RiskManager();
    expect(mgr.getTotalScenarios()).toBe(0);
    mgr.loadKnownScenarios();
    expect(mgr.getTotalScenarios()).toBe(8);
  });
  it('getTotalFindings / getTotalScenarios', () => {
    const mgr = new RiskManager();
    mgr.addFinding(createRiskFinding());
    mgr.addScenario(createRiskScenario());
    expect(mgr.getTotalFindings()).toBe(1);
    expect(mgr.getTotalScenarios()).toBe(1);
  });
});

// ─── NistCsfAssessor ────────────────────────────────────────────
describe('assessNistCsf', () => {
  it('returns profile with gaps', () => {
    const current = [
      { function: 'Govern', category: 'Context', tier: 2, score: 60 },
      { function: 'Govern', category: 'Risk Management', tier: 1, score: 40 },
      { function: 'Identify', category: 'Asset Management', tier: 3, score: 80 },
    ];
    const profile = assessNistCsf(current);
    expect(profile.framework).toBe('NIST_CSF_2.0');
    expect(profile.overallMaturity).toBeGreaterThan(0);
    expect(profile.gaps.length).toBeGreaterThan(0);
    expect(profile.currentProfile).toHaveLength(3);
    expect(profile.targetProfile.length).toBeGreaterThan(0);
  });
  it('low maturity yields more gaps', () => {
    const current = [
      { function: 'Govern', category: 'Context', tier: 1, score: 20 },
      { function: 'Identify', category: 'Asset Management', tier: 1, score: 20 },
    ];
    const profile = assessNistCsf(current);
    const highGaps = profile.gaps.filter(g => g.priority === 'HIGH');
    expect(highGaps.length).toBeGreaterThan(0);
  });
});

// ─── RiskCoordinator ────────────────────────────────────────────
describe('RiskCoordinator', () => {
  it('composes all managers', () => {
    const coord = new RiskCoordinator();
    expect(coord.fair).toBeInstanceOf(FairManager);
    expect(coord.compliance).toBeInstanceOf(ComplianceManager);
    expect(coord.attackGraph).toBeInstanceOf(AttackGraphManager);
    expect(coord.kpis).toBeInstanceOf(KpiManager);
    expect(coord.vendors).toBeInstanceOf(VendorManager);
    expect(coord.riskMgr).toBeInstanceOf(RiskManager);
  });

  it('addRiskEntry, getRiskEntry, listRiskEntries', () => {
    const coord = new RiskCoordinator();
    const r = createRiskEntry();
    coord.addRiskEntry(r);
    expect(coord.getRiskEntry(r.id)).toEqual(r);
    expect(coord.listRiskEntries()).toHaveLength(1);
  });

  it('addAsset, getAsset, listAssets', () => {
    const coord = new RiskCoordinator();
    const a = createAsset();
    coord.addAsset(a);
    expect(coord.getAsset(a.id)).toEqual(a);
    expect(coord.listAssets()).toHaveLength(1);
  });

  it('addControl, getControl, listControls', () => {
    const coord = new RiskCoordinator();
    const c = createControl();
    coord.addControl(c);
    expect(coord.getControl(c.id)).toEqual(c);
    expect(coord.listControls()).toHaveLength(1);
  });

  it('getStats returns zeros for empty coordinator', () => {
    const coord = new RiskCoordinator();
    const stats = coord.getStats();
    expect(stats.riskEntryCount).toBe(0);
    expect(stats.assetCount).toBe(0);
    expect(stats.controlCount).toBe(0);
    expect(stats.fairAnalysisCount).toBe(0);
  });

  it('getStats reflects added resources', () => {
    const coord = new RiskCoordinator();
    coord.addRiskEntry(createRiskEntry());
    coord.addAsset(createAsset());
    coord.addControl(createControl());
    coord.fair.runAnalysis(assetId(), 10, 0.5, 100000, 50000, 500);
    coord.compliance.registerFramework(ComplianceFramework.GDPR);
    coord.attackGraph.addNode({ name: 'N', exploits: [], preconditions: [], postconditions: [], depth: 0, probability: 0.5 });
    coord.kpis.register({ type: KpiType.MTTD, name: 'MTTD', currentValue: 24, threshold: 48, unit: 'hours', period: 'MONTHLY' });
    coord.vendors.register({ name: 'V', category: 'A', riskLevel: VendorRiskLevel.LOW, criticality: 0.1, contractValue: 10000, assessments: [], complianceCertifications: [], dataShared: [], accessToNetwork: false });
    const stats = coord.getStats();
    expect(stats.riskEntryCount).toBe(1);
    expect(stats.assetCount).toBe(1);
    expect(stats.controlCount).toBe(1);
    expect(stats.fairAnalysisCount).toBe(1);
    expect(stats.complianceFrameworkCount).toBe(1);
    expect(stats.attackGraphNodeCount).toBe(1);
    expect(stats.kpiCount).toBe(1);
    expect(stats.vendorCount).toBe(1);
  });

  it('reset clears all managers', () => {
    const coord = new RiskCoordinator();
    coord.addRiskEntry(createRiskEntry());
    coord.addAsset(createAsset());
    coord.reset();
    expect(coord.riskRegister.size).toBe(0);
    expect(coord.assets.size).toBe(0);
    expect(coord.controls.size).toBe(0);
    expect(coord.fair.getStats().totalAnalyses).toBe(0);
  });
});

// ─── Default Environment ───────────────────────────────────────
describe('createDefaultRiskEnvironment', () => {
  it('returns a coordinator with populated resources', () => {
    const coord = createDefaultRiskEnvironment();
    const stats = coord.getStats();
    expect(stats.riskEntryCount).toBe(6);
    expect(stats.assetCount).toBe(5);
    expect(stats.controlCount).toBe(4);
    expect(stats.fairAnalysisCount).toBe(1);
    expect(stats.complianceFrameworkCount).toBe(2);
    expect(stats.attackGraphNodeCount).toBe(8);
    expect(stats.kpiCount).toBe(5);
    expect(stats.vendorCount).toBe(3);
    expect(stats.findingCount).toBe(6);
    expect(stats.scenarioCount).toBe(8);
  });

  it('has diverse assets', () => {
    const coord = createDefaultRiskEnvironment();
    const assets = coord.listAssets();
    expect(assets.some(a => a.type === AssetType.DATABASE)).toBe(true);
    expect(assets.some(a => a.type === AssetType.SERVER)).toBe(true);
    expect(assets.some(a => a.type === AssetType.CLOUD_RESOURCE)).toBe(true);
    expect(assets.some(a => a.type === AssetType.ENDPOINT)).toBe(true);
  });

  it('has diverse risk severities', () => {
    const coord = createDefaultRiskEnvironment();
    const entries = coord.listRiskEntries();
    expect(entries.filter(r => r.severity === RiskSeverity.CRITICAL)).toHaveLength(2);
    expect(entries.filter(r => r.severity === RiskSeverity.HIGH)).toHaveLength(4);
    expect(entries.every(r => r.affectedAssets.length > 0)).toBe(true);
  });

  it('has controls with different types', () => {
    const coord = createDefaultRiskEnvironment();
    const controls = coord.listControls();
    expect(controls.some(c => c.type === ControlType.PREVENTIVE)).toBe(true);
    expect(controls.some(c => c.type === ControlType.CORRECTIVE)).toBe(true);
    expect(controls.every(c => c.evidence.length > 0)).toBe(true);
  });

  it('has FAIR analysis on database asset', () => {
    const coord = createDefaultRiskEnvironment();
    const dbAsset = coord.listAssets().find(a => a.name === 'Critical Database Server')!;
    const analysis = coord.fair.getAnalysis(dbAsset.id);
    expect(analysis).toBeDefined();
    expect(analysis!.annualizedLossExpectancy).toBeGreaterThan(0);
    expect(analysis!.monteCarloIterations).toBe(5000);
  });

  it('has compliance frameworks with requirements', () => {
    const coord = createDefaultRiskEnvironment();
    const frameworks = coord.compliance.listFrameworks();
    expect(frameworks).toHaveLength(2);
    const gdpr = frameworks.find(f => f.framework === ComplianceFramework.GDPR);
    expect(gdpr).toBeDefined();
    expect(gdpr!.requirements.length).toBeGreaterThan(0);
    expect(gdpr!.requirements.some(r => !r.compliant)).toBe(true);
    const pci = frameworks.find(f => f.framework === ComplianceFramework.PCI_DSS);
    expect(pci).toBeDefined();
    expect(pci!.requirements.length).toBeGreaterThan(0);
  });

  it('has attack graph with paths to crown jewel', () => {
    const coord = createDefaultRiskEnvironment();
    const nodes = coord.attackGraph.listNodes();
    expect(nodes).toHaveLength(8);
    const crownJewel = nodes.find(n => n.name === 'Crown Jewel - Domain Admin Access');
    expect(crownJewel).toBeDefined();
    expect(crownJewel!.depth).toBe(4);
    const paths = coord.attackGraph.findPathsToCrownJewel(crownJewel!.id);
    expect(paths.length).toBeGreaterThan(0);
  });

  it('has KPIs with different types', () => {
    const coord = createDefaultRiskEnvironment();
    const kpis = coord.kpis.list();
    expect(kpis.some(k => k.type === KpiType.PATCH_LATENCY)).toBe(true);
    expect(kpis.some(k => k.type === KpiType.MTTD)).toBe(true);
    expect(kpis.some(k => k.type === KpiType.CONTROL_EFFECTIVENESS)).toBe(true);
    expect(kpis.some(k => k.type === KpiType.RISK_SCORE)).toBe(true);
    expect(kpis.some(k => k.type === KpiType.VULNERABILITY_DENSITY)).toBe(true);
    expect(kpis.some(k => k.trend === 'WORSENING')).toBe(true);
    expect(kpis.some(k => k.trend === 'IMPROVING')).toBe(true);
    expect(kpis.some(k => k.trend === 'STABLE')).toBe(true);
  });

  it('has vendors with varied risk levels', () => {
    const coord = createDefaultRiskEnvironment();
    expect(coord.vendors.listByRiskLevel(VendorRiskLevel.CRITICAL)).toHaveLength(1);
    expect(coord.vendors.listByRiskLevel(VendorRiskLevel.MEDIUM)).toHaveLength(1);
    expect(coord.vendors.listByRiskLevel(VendorRiskLevel.LOW)).toHaveLength(1);
  });

  it('has unmitigated risk findings across categories', () => {
    const coord = createDefaultRiskEnvironment();
    expect(coord.riskMgr.filterFindingsUnmitigated()).toHaveLength(6);
    expect(coord.riskMgr.filterFindingsByCategory(RiskCategory.CYBER).length).toBeGreaterThan(0);
    expect(coord.riskMgr.filterFindingsByCategory(RiskCategory.COMPLIANCE).length).toBeGreaterThan(0);
  });

  it('loads known risk scenarios', () => {
    const coord = createDefaultRiskEnvironment();
    expect(coord.riskMgr.getTotalScenarios()).toBe(8);
  });

  it('has critical risks identified', () => {
    const coord = createDefaultRiskEnvironment();
    const stats = coord.getStats();
    expect(stats.criticalRiskCount).toBe(2);
  });

  it('has average compliance score', () => {
    const coord = createDefaultRiskEnvironment();
    const stats = coord.getStats();
    expect(stats.averageComplianceScore).toBeGreaterThan(0);
  });
});
