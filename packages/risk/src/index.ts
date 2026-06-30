import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type RiskId = string & { readonly __brand: unique symbol };
export const riskId = (): RiskId => uid() as unknown as RiskId;

export type AssetId = string & { readonly __brand: unique symbol };
export const assetId = (): AssetId => uid() as unknown as AssetId;

export type ControlId = string & { readonly __brand: unique symbol };
export const controlId = (): ControlId => uid() as unknown as ControlId;

export type ComplianceFrameworkId = string & { readonly __brand: unique symbol };
export const complianceFrameworkId = (): ComplianceFrameworkId => uid() as unknown as ComplianceFrameworkId;

export type AttackGraphNodeId = string & { readonly __brand: unique symbol };
export const attackGraphNodeId = (): AttackGraphNodeId => uid() as unknown as AttackGraphNodeId;

export type KpiId = string & { readonly __brand: unique symbol };
export const kpiId = (): KpiId => uid() as unknown as KpiId;

export type VendorId = string & { readonly __brand: unique symbol };
export const vendorId = (): VendorId => uid() as unknown as VendorId;

export type RiskFindingId = string & { readonly __brand: unique symbol };
export const riskFindingId = (): RiskFindingId => uid() as unknown as RiskFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum RiskSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFORMATIONAL = 'INFORMATIONAL',
}

export enum RiskCategory {
  STRATEGIC = 'STRATEGIC',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  COMPLIANCE = 'COMPLIANCE',
  REPUTATIONAL = 'REPUTATIONAL',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  CYBER = 'CYBER',
}

export enum AssetType {
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  APPLICATION = 'APPLICATION',
  NETWORK_DEVICE = 'NETWORK_DEVICE',
  ENDPOINT = 'ENDPOINT',
  DATA_STORE = 'DATA_STORE',
  CLOUD_RESOURCE = 'CLOUD_RESOURCE',
  OT_DEVICE = 'OT_DEVICE',
  IOT = 'IOT',
  PERSONNEL = 'PERSONNEL',
  FACILITY = 'FACILITY',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
}

export enum ControlType {
  PREVENTIVE = 'PREVENTIVE',
  DETECTIVE = 'DETECTIVE',
  CORRECTIVE = 'CORRECTIVE',
  DETERRENT = 'DETERRENT',
  COMPENSATING = 'COMPENSATING',
  DIRECTIVE = 'DIRECTIVE',
}

export enum ControlEffectiveness {
  VERY_HIGH = 'VERY_HIGH',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  VERY_LOW = 'VERY_LOW',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

export enum ComplianceFramework {
  GDPR = 'GDPR',
  PCI_DSS = 'PCI_DSS',
  HIPAA = 'HIPAA',
  SOX = 'SOX',
  SOC2 = 'SOC2',
  ISO_27001 = 'ISO_27001',
  FEDRAMP = 'FEDRAMP',
  NIST_CSF = 'NIST_CSF',
  NIST_800_53 = 'NIST_800_53',
  CIS = 'CIS',
  CCPA = 'CCPA',
}

export enum KpiType {
  VULNERABILITY_DENSITY = 'VULNERABILITY_DENSITY',
  PATCH_LATENCY = 'PATCH_LATENCY',
  MTTD = 'MTTD',
  MTTR = 'MTTR',
  CONTROL_EFFECTIVENESS = 'CONTROL_EFFECTIVENESS',
  COMPLIANCE_SCORE = 'COMPLIANCE_SCORE',
  RISK_SCORE = 'RISK_SCORE',
  INCIDENT_RATE = 'INCIDENT_RATE',
}

export enum VendorRiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MONITORED = 'MONITORED',
}

export enum FindingStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED = 'ACCEPTED',
  REMEDIATED = 'REMEDIATED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

// ─── Interfaces ──────────────────────────────────────────────────
export interface RiskRegisterEntry {
  id: RiskId;
  name: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  likelihood: number;
  impact: number;
  inherentRisk: number;
  residualRisk: number;
  affectedAssets: AssetId[];
  controls: ControlId[];
  status: FindingStatus;
  owner: string;
  dateIdentified: number;
  targetDate?: number;
}

export interface AssetInstance {
  id: AssetId;
  name: string;
  type: AssetType;
  owner: string;
  criticality: number;
  value: number;
  vulnerabilities: string[];
  location: string;
  dependencies: AssetId[];
  complianceFrameworks: ComplianceFramework[];
}

export interface ControlInstance {
  id: ControlId;
  name: string;
  type: ControlType;
  effectiveness: ControlEffectiveness;
  framework: ComplianceFramework;
  description: string;
  owner: string;
  implementationDate: number;
  lastReviewDate: number;
  evidence: string[];
}

export interface FairAnalysis {
  asset: AssetId;
  lossEventFrequency: number;
  threatEventFrequency: number;
  vulnerability: number;
  lossMagnitude: { primary: number; secondary: number };
  annualizedLossExpectancy: number;
  monteCarloIterations: number;
  confidenceInterval: { lower: number; upper: number; confidence: number };
  simulationResults: number[];
}

export interface NistCsfProfile {
  framework: 'NIST_CSF_2.0';
  currentProfile: { function: string; category: string; tier: number; score: number }[];
  targetProfile: { function: string; category: string; tier: number }[];
  overallMaturity: number;
  gaps: { function: string; category: string; gap: number; priority: string }[];
  lastAssessed: number;
}

export interface ComplianceFrameworkRecord {
  id: ComplianceFrameworkId;
  framework: ComplianceFramework;
  status: string;
  score: number;
  lastAudit: number;
  requirements: { id: string; description: string; compliant: boolean; evidence: string[] }[];
}

export interface AttackGraphNode {
  id: AttackGraphNodeId;
  name: string;
  cve?: string;
  cvssScore?: number;
  exploits: string[];
  preconditions: AttackGraphNodeId[];
  postconditions: AttackGraphNodeId[];
  depth: number;
  probability: number;
  assetAffected?: AssetId;
}

export interface KpiInstance {
  id: KpiId;
  type: KpiType;
  name: string;
  currentValue: number;
  threshold: number;
  unit: string;
  trend: string;
  period: string;
  lastUpdated: number;
  history: { value: number; timestamp: number }[];
}

export interface VendorInstance {
  id: VendorId;
  name: string;
  category: string;
  riskLevel: VendorRiskLevel;
  criticality: number;
  contractValue: number;
  assessments: { date: number; score: number; findings: string[] }[];
  complianceCertifications: ComplianceFramework[];
  dataShared: string[];
  accessToNetwork: boolean;
  lastAssessmentDate?: number;
}

export interface RiskFinding {
  id: RiskFindingId;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: RiskCategory;
  mitigated: boolean;
  timestamp: number;
}

export interface RiskScenario {
  id: RiskFindingId;
  name: string;
  description: string;
  category: RiskCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: number;
  impact: string;
  mitigation: string;
  mitreTechniqueId: string;
  cvssScore: number;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createRiskEntry(overrides?: Partial<RiskRegisterEntry>): RiskRegisterEntry {
  const likelihood = overrides?.likelihood ?? 0.5;
  const impact = overrides?.impact ?? 0.5;
  return {
    id: riskId(),
    name: 'Sample Risk',
    description: 'A sample risk entry',
    category: RiskCategory.CYBER,
    severity: RiskSeverity.MEDIUM,
    likelihood,
    impact,
    inherentRisk: likelihood * impact,
    residualRisk: likelihood * impact * 0.5,
    affectedAssets: [],
    controls: [],
    status: FindingStatus.OPEN,
    owner: 'security-team',
    dateIdentified: Date.now(),
    ...overrides,
  };
}

export function createAsset(overrides?: Partial<AssetInstance>): AssetInstance {
  return {
    id: assetId(),
    name: 'Asset-1',
    type: AssetType.SERVER,
    owner: 'infra-team',
    criticality: 0.7,
    value: 500000,
    vulnerabilities: [],
    location: 'us-east-1',
    dependencies: [],
    complianceFrameworks: [],
    ...overrides,
  };
}

export function createControl(overrides?: Partial<ControlInstance>): ControlInstance {
  return {
    id: controlId(),
    name: 'Control-1',
    type: ControlType.PREVENTIVE,
    effectiveness: ControlEffectiveness.HIGH,
    framework: ComplianceFramework.ISO_27001,
    description: 'A security control',
    owner: 'security-team',
    implementationDate: Date.now() - 86400000 * 90,
    lastReviewDate: Date.now() - 86400000 * 30,
    evidence: [],
    ...overrides,
  };
}

export function createFairAnalysis(overrides?: Partial<FairAnalysis>): FairAnalysis {
  return {
    asset: assetId(),
    lossEventFrequency: 5,
    threatEventFrequency: 10,
    vulnerability: 0.5,
    lossMagnitude: { primary: 100000, secondary: 50000 },
    annualizedLossExpectancy: 750000,
    monteCarloIterations: 10000,
    confidenceInterval: { lower: 50000, upper: 2000000, confidence: 0.95 },
    simulationResults: [],
    ...overrides,
  };
}

export function createAttackGraphNode(overrides?: Partial<AttackGraphNode>): AttackGraphNode {
  return {
    id: attackGraphNodeId(),
    name: 'Node-1',
    exploits: [],
    preconditions: [],
    postconditions: [],
    depth: 0,
    probability: 0.5,
    ...overrides,
  };
}

export function createKpi(overrides?: Partial<KpiInstance>): KpiInstance {
  return {
    id: kpiId(),
    type: KpiType.MTTD,
    name: 'Mean Time to Detect',
    currentValue: 24,
    threshold: 48,
    unit: 'hours',
    trend: 'IMPROVING',
    period: 'MONTHLY',
    lastUpdated: Date.now(),
    history: [],
    ...overrides,
  };
}

export function createVendor(overrides?: Partial<VendorInstance>): VendorInstance {
  return {
    id: vendorId(),
    name: 'Vendor-1',
    category: 'Cloud Provider',
    riskLevel: VendorRiskLevel.MEDIUM,
    criticality: 0.5,
    contractValue: 100000,
    assessments: [],
    complianceCertifications: [],
    dataShared: [],
    accessToNetwork: false,
    ...overrides,
  };
}

export function createRiskFinding(overrides?: Partial<RiskFinding>): RiskFinding {
  return {
    id: riskFindingId(),
    description: 'Sample risk finding',
    severity: 'high',
    category: RiskCategory.CYBER,
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createRiskScenario(overrides?: Partial<RiskScenario>): RiskScenario {
  return {
    id: riskFindingId(),
    name: 'Scenario-1',
    description: 'A known risk scenario',
    category: RiskCategory.CYBER,
    severity: 'high',
    likelihood: 0.6,
    impact: 'Significant financial and reputational damage',
    mitigation: 'Implement multi-factor authentication and monitoring',
    mitreTechniqueId: 'T1078',
    cvssScore: 8.2,
    ...overrides,
  };
}

export function getKnownRiskScenarios(): RiskScenario[] {
  return [
    {
      id: riskFindingId(),
      name: 'Ransomware Attack',
      description: 'Malware encrypts critical systems and demands payment for decryption keys. Attackers often exfiltrate data prior to encryption for double-extortion',
      category: RiskCategory.CYBER,
      severity: 'critical',
      likelihood: 0.7,
      impact: 'Extended downtime, data loss, ransom payment, regulatory fines, reputational harm',
      mitigation: 'Offline backups, endpoint detection, least-privilege access, user training, patch management',
      mitreTechniqueId: 'T1486',
      cvssScore: 9.0,
    },
    {
      id: riskFindingId(),
      name: 'Insider Threat - Data Exfiltration',
      description: 'Privileged user exfiltrates intellectual property or sensitive data via removable media, email, or cloud storage',
      category: RiskCategory.CYBER,
      severity: 'high',
      likelihood: 0.4,
      impact: 'Loss of competitive advantage, IP theft, regulatory non-compliance, legal liability',
      mitigation: 'DLP controls, user behavior analytics, least-privilege, separation of duties, exit interviews',
      mitreTechniqueId: 'T1052',
      cvssScore: 7.5,
    },
    {
      id: riskFindingId(),
      name: 'Supply Chain Compromise',
      description: 'Third-party vendor or software provider compromise leads to backdoor insertion, credential theft, or network access',
      category: RiskCategory.SUPPLY_CHAIN,
      severity: 'critical',
      likelihood: 0.5,
      impact: 'Network compromise, data breach, persistent backdoor, lateral movement',
      mitigation: 'Vendor risk assessments, SBOM verification, supply chain transparency, zero-trust architecture',
      mitreTechniqueId: 'T1195',
      cvssScore: 8.8,
    },
    {
      id: riskFindingId(),
      name: 'Data Breach via Web Application Exploit',
      description: 'External attacker exploits web application vulnerability (SQLi, RCE, SSRF) to access backend databases and exfiltrate sensitive data',
      category: RiskCategory.CYBER,
      severity: 'high',
      likelihood: 0.6,
      impact: 'PII/PCI data loss, regulatory fines (GDPR, PCI-DSS), reputational damage, legal action',
      mitigation: 'WAF, secure coding practices, regular pentesting, input validation, network segmentation',
      mitreTechniqueId: 'T1190',
      cvssScore: 8.2,
    },
    {
      id: riskFindingId(),
      name: 'Compliance Violation (GDPR)',
      description: 'Failure to maintain adequate data protection controls results in regulatory non-compliance and supervisory action',
      category: RiskCategory.COMPLIANCE,
      severity: 'high',
      likelihood: 0.5,
      impact: 'Significant fines (up to 4% global revenue), mandatory breach notification, supervisory audits, business restrictions',
      mitigation: 'Data protection impact assessments, privacy controls, consent management, data mapping, DPO appointment',
      mitreTechniqueId: 'T1530',
      cvssScore: 7.0,
    },
    {
      id: riskFindingId(),
      name: 'Cloud Infrastructure Misconfiguration',
      description: 'Improperly configured cloud resources (S3 buckets, security groups, IAM policies) expose sensitive data to the internet',
      category: RiskCategory.CYBER,
      severity: 'high',
      likelihood: 0.65,
      impact: 'Data exposure, unauthorized access, compliance violation, credential leakage',
      mitigation: 'CSPM tools, IaC scanning, least-privilege IAM, network segmentation, cloud security training',
      mitreTechniqueId: 'T1525',
      cvssScore: 7.8,
    },
    {
      id: riskFindingId(),
      name: 'Social Engineering - CEO Fraud',
      description: 'Attackers impersonate senior executives to trick finance staff into initiating fraudulent wire transfers or purchasing gift cards',
      category: RiskCategory.OPERATIONAL,
      severity: 'high',
      likelihood: 0.5,
      impact: 'Direct financial loss $100K-$10M+, reputational damage, regulatory scrutiny',
      mitigation: 'Payment verification procedures, multi-channel confirmation, security awareness training, email filtering',
      mitreTechniqueId: 'T1566',
      cvssScore: 7.2,
    },
    {
      id: riskFindingId(),
      name: 'Distributed Denial of Service (DDoS)',
      description: 'Volumetric or application-layer DDoS attack renders internet-facing services unavailable to legitimate users',
      category: RiskCategory.OPERATIONAL,
      severity: 'medium',
      likelihood: 0.6,
      impact: 'Service outage, revenue loss, customer churn, SLA penalties, remediation costs',
      mitigation: 'DDoS protection services, rate limiting, CDN, anycast routing, traffic analysis, incident response plan',
      mitreTechniqueId: 'T1498',
      cvssScore: 6.5,
    },
  ];
}

// ─── FairManager ─────────────────────────────────────────────────
export class FairManager {
  private analyses: Map<string, FairAnalysis> = new Map();

  runAnalysis(assetId: AssetId, threatEventFrequency: number, vulnerability: number, primaryLoss: number, secondaryLoss: number, iterations: number = 10000): FairAnalysis {
    const lef = threatEventFrequency * vulnerability;
    const lm = primaryLoss + secondaryLoss;
    const ale = lef * lm;
    const simulation = this.monteCarlo(lm, 'LOGNORMAL', iterations);
    const sorted = [...simulation.results].sort((a, b) => a - b);
    const lower = sorted[Math.floor(sorted.length * 0.025)]!;
    const upper = sorted[Math.floor(sorted.length * 0.975)]!;
    const analysis: FairAnalysis = {
      asset: assetId,
      lossEventFrequency: lef,
      threatEventFrequency,
      vulnerability,
      lossMagnitude: { primary: primaryLoss, secondary: secondaryLoss },
      annualizedLossExpectancy: ale,
      monteCarloIterations: iterations,
      confidenceInterval: { lower, upper, confidence: 0.95 },
      simulationResults: simulation.results,
    };
    this.analyses.set(assetId, analysis);
    return analysis;
  }

  getAnalysis(assetId: AssetId): FairAnalysis | undefined {
    return this.analyses.get(assetId);
  }

  monteCarlo(assetValue: number, distribution: 'NORMAL' | 'LOGNORMAL' | 'UNIFORM', iterations: number): { results: number[]; mean: number; stdDev: number; percentile95: number; percentile99: number } {
    const results: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = (() => {
        switch (distribution) {
          case 'NORMAL': return assetValue + assetValue * 0.3 * z;
          case 'LOGNORMAL': return Math.exp(Math.log(assetValue) + 0.5 * z);
          case 'UNIFORM': return assetValue * 0.1 + Math.random() * assetValue * 1.8;
        }
      })();
      results.push(Math.max(0, value));
    }
    const mean = results.reduce((s, v) => s + v, 0) / iterations;
    const variance = results.reduce((s, v) => s + (v - mean) ** 2, 0) / iterations;
    const stdDev = Math.sqrt(variance);
    const sorted = [...results].sort((a, b) => a - b);
    const percentile95 = sorted[Math.floor(sorted.length * 0.95)]!;
    const percentile99 = sorted[Math.floor(sorted.length * 0.99)]!;
    return { results, mean, stdDev, percentile95, percentile99 };
  }

  calculateALE(lef: number, lm: number): number {
    return lef * lm;
  }

  getStats(): { totalAnalyses: number; averageALE: number; totalExposure: number } {
    const all = Array.from(this.analyses.values());
    const totalAnalyses = all.length;
    const totalExposure = all.reduce((s, a) => s + a.annualizedLossExpectancy, 0);
    const averageALE = totalAnalyses > 0 ? totalExposure / totalAnalyses : 0;
    return { totalAnalyses, averageALE, totalExposure };
  }

  clear(): void {
    this.analyses.clear();
  }
}

// ─── ComplianceManager ──────────────────────────────────────────
export class ComplianceManager {
  private frameworks: Map<string, ComplianceFrameworkRecord> = new Map();

  registerFramework(framework: ComplianceFramework, requirements: { id: string; description: string; compliant: boolean; evidence: string[] }[] = []): ComplianceFrameworkId {
    const id = complianceFrameworkId();
    this.frameworks.set(id, {
      id,
      framework,
      status: 'active',
      score: requirements.length > 0 ? Math.round((requirements.filter(r => r.compliant).length / requirements.length) * 100) : 0,
      lastAudit: Date.now(),
      requirements,
    });
    return id;
  }

  getFramework(id: ComplianceFrameworkId): ComplianceFrameworkRecord | undefined {
    return this.frameworks.get(id);
  }

  listFrameworks(): ComplianceFrameworkRecord[] {
    return Array.from(this.frameworks.values());
  }

  updateRequirement(frameworkId: ComplianceFrameworkId, reqId: string, compliant: boolean): boolean {
    const fw = this.frameworks.get(frameworkId);
    if (!fw) return false;
    const req = fw.requirements.find(r => r.id === reqId);
    if (!req) return false;
    req.compliant = compliant;
    fw.score = Math.round((fw.requirements.filter(r => r.compliant).length / fw.requirements.length) * 100);
    return true;
  }

  calculateComplianceScore(frameworkId: ComplianceFrameworkId): number {
    const fw = this.frameworks.get(frameworkId);
    if (!fw || fw.requirements.length === 0) return 0;
    return Math.round((fw.requirements.filter(r => r.compliant).length / fw.requirements.length) * 100);
  }

  listNonCompliantRequirements(frameworkId: ComplianceFrameworkId): { id: string; description: string; compliant: boolean; evidence: string[] }[] {
    const fw = this.frameworks.get(frameworkId);
    if (!fw) return [];
    return fw.requirements.filter(r => !r.compliant);
  }

  removeFramework(id: ComplianceFrameworkId): boolean {
    return this.frameworks.delete(id);
  }

  clear(): void {
    this.frameworks.clear();
  }

  getStats(): { total: number; averageScore: number; compliantCount: number; nonCompliantCount: number } {
    const all = this.listFrameworks();
    const total = all.length;
    const averageScore = total > 0 ? Math.round(all.reduce((s, f) => s + f.score, 0) / total) : 0;
    const compliantCount = all.reduce((s, f) => s + f.requirements.filter(r => r.compliant).length, 0);
    const nonCompliantCount = all.reduce((s, f) => s + f.requirements.filter(r => !r.compliant).length, 0);
    return { total, averageScore, compliantCount, nonCompliantCount };
  }
}

// ─── AttackGraphManager ─────────────────────────────────────────
export class AttackGraphManager {
  private nodes: Map<string, AttackGraphNode> = new Map();

  addNode(config: { name: string; cve?: string; cvssScore?: number; exploits: string[]; preconditions: AttackGraphNodeId[]; postconditions: AttackGraphNodeId[]; depth: number; probability: number; assetAffected?: AssetId }): AttackGraphNodeId {
    const id = attackGraphNodeId();
    const node: AttackGraphNode = { id, ...config };
    this.nodes.set(id, node);
    return id;
  }

  addNodeDirect(node: AttackGraphNode): void {
    this.nodes.set(node.id, node);
  }

  getNode(id: AttackGraphNodeId): AttackGraphNode | undefined {
    return this.nodes.get(id);
  }

  listNodes(filter?: { depth?: number; maxCvss?: number }): AttackGraphNode[] {
    let result = Array.from(this.nodes.values());
    if (filter?.depth !== undefined) {
      result = result.filter(n => n.depth === filter.depth);
    }
    if (filter?.maxCvss !== undefined) {
      result = result.filter(n => (n.cvssScore ?? 0) <= filter.maxCvss!);
    }
    return result;
  }

  findShortestPath(from: AttackGraphNodeId, to: AttackGraphNodeId): AttackGraphNodeId[] {
    if (from === to) return [from];
    const visited = new Set<AttackGraphNodeId>();
    const queue: { node: AttackGraphNodeId; path: AttackGraphNodeId[] }[] = [{ node: from, path: [from] }];
    visited.add(from);
    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = this.nodes.get(current.node);
      if (!node) continue;
      for (const postId of node.postconditions) {
        if (postId === to) return [...current.path, to];
        if (!visited.has(postId)) {
          visited.add(postId);
          queue.push({ node: postId, path: [...current.path, postId] });
        }
      }
    }
    return [];
  }

  findPathsToCrownJewel(crownJewelId: AttackGraphNodeId): { path: AttackGraphNodeId[]; totalProbability: number }[] {
    const allPaths: { path: AttackGraphNodeId[]; totalProbability: number }[] = [];
    const allNodes = this.listNodes();
    for (const node of allNodes) {
      if (node.id === crownJewelId) continue;
      const path = this.findShortestPath(node.id, crownJewelId);
      if (path.length > 0) {
        const totalProbability = path.reduce((p, nid) => {
          const n = this.nodes.get(nid);
          return p * (n?.probability ?? 1);
        }, 1);
        allPaths.push({ path, totalProbability });
      }
    }
    return allPaths.sort((a, b) => b.totalProbability - a.totalProbability);
  }

  removeNode(id: AttackGraphNodeId): boolean {
    return this.nodes.delete(id);
  }

  clear(): void {
    this.nodes.clear();
  }

  getStats(): { totalNodes: number; maxDepth: number; avgProbability: number } {
    const all = this.listNodes();
    const totalNodes = all.length;
    const maxDepth = all.reduce((m, n) => Math.max(m, n.depth), 0);
    const avgProbability = totalNodes > 0 ? all.reduce((s, n) => s + n.probability, 0) / totalNodes : 0;
    return { totalNodes, maxDepth, avgProbability: Math.round(avgProbability * 100) / 100 };
  }
}

// ─── KpiManager ─────────────────────────────────────────────────
export class KpiManager {
  private kpis: Map<string, KpiInstance> = new Map();

  register(config: Omit<KpiInstance, 'id' | 'history' | 'trend' | 'lastUpdated'>): KpiId {
    const id = kpiId();
    this.kpis.set(id, {
      id,
      history: [],
      trend: 'STABLE',
      lastUpdated: Date.now(),
      ...config,
    });
    return id;
  }

  registerDirect(kpi: KpiInstance): void {
    this.kpis.set(kpi.id, kpi);
  }

  get(id: KpiId): KpiInstance | undefined {
    return this.kpis.get(id);
  }

  list(filter?: { type?: KpiType; period?: string }): KpiInstance[] {
    let result = Array.from(this.kpis.values());
    if (filter?.type) result = result.filter(k => k.type === filter.type);
    if (filter?.period) result = result.filter(k => k.period === filter.period);
    return result;
  }

  update(id: KpiId, value: number): boolean {
    const kpi = this.kpis.get(id);
    if (!kpi) return false;
    kpi.history.push({ value: kpi.currentValue, timestamp: kpi.lastUpdated });
    kpi.currentValue = value;
    kpi.lastUpdated = Date.now();
    kpi.trend = this.calculateTrendForHistory(kpi.history.map(h => h.value).concat(value));
    return true;
  }

  private calculateTrendForHistory(values: number[]): 'IMPROVING' | 'WORSENING' | 'STABLE' {
    if (values.length < 3) return 'STABLE';
    const recent = values.slice(-3);
    const avg = recent.reduce((s, v) => s + v, 0) / recent.length;
    const firstHalf = recent.slice(0, 2);
    const firstAvg = firstHalf.reduce((s, v) => s + v, 0) / firstHalf.length;
    const diff = avg - firstAvg;
    if (Math.abs(diff) < 0.05 * firstAvg) return 'STABLE';
    return diff > 0 ? 'WORSENING' : 'IMPROVING';
  }

  calculateTrend(id: KpiId): 'IMPROVING' | 'WORSENING' | 'STABLE' {
    const kpi = this.kpis.get(id);
    if (!kpi) return 'STABLE';
    return kpi.trend as 'IMPROVING' | 'WORSENING' | 'STABLE';
  }

  getViolations(): { id: KpiId; name: string; currentValue: number; threshold: number }[] {
    return this.list()
      .filter(k => k.currentValue >= k.threshold)
      .map(k => ({ id: k.id, name: k.name, currentValue: k.currentValue, threshold: k.threshold }));
  }

  remove(id: KpiId): boolean {
    return this.kpis.delete(id);
  }

  clear(): void {
    this.kpis.clear();
  }

  getStats(): { total: number; violating: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const k of all) {
      byType[k.type] = (byType[k.type] ?? 0) + 1;
    }
    return {
      total: all.length,
      violating: this.getViolations().length,
      byType,
    };
  }
}

// ─── VendorManager ──────────────────────────────────────────────
export class VendorManager {
  private vendors: Map<string, VendorInstance> = new Map();

  register(config: Omit<VendorInstance, 'id'>): VendorId {
    const id = vendorId();
    this.vendors.set(id, { id, ...config });
    return id;
  }

  registerDirect(vendor: VendorInstance): void {
    this.vendors.set(vendor.id, vendor);
  }

  get(id: VendorId): VendorInstance | undefined {
    return this.vendors.get(id);
  }

  list(filter?: { category?: string; riskLevel?: VendorRiskLevel }): VendorInstance[] {
    let result = Array.from(this.vendors.values());
    if (filter?.category) result = result.filter(v => v.category === filter.category);
    if (filter?.riskLevel) result = result.filter(v => v.riskLevel === filter.riskLevel);
    return result;
  }

  listByRiskLevel(level: VendorRiskLevel): VendorInstance[] {
    return this.list().filter(v => v.riskLevel === level);
  }

  addAssessment(vendorId: VendorId, score: number, findings: string[]): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;
    vendor.assessments.push({ date: Date.now(), score, findings });
    vendor.lastAssessmentDate = Date.now();
    return true;
  }

  updateRiskLevel(vendorId: VendorId, level: VendorRiskLevel): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;
    vendor.riskLevel = level;
    return true;
  }

  remove(id: VendorId): boolean {
    return this.vendors.delete(id);
  }

  clear(): void {
    this.vendors.clear();
  }

  getStats(): { total: number; byRiskLevel: Record<string, number>; averageScore: number; criticalVendorCount: number } {
    const all = this.list();
    const byRiskLevel: Record<string, number> = {};
    let totalScore = 0;
    let scoreCount = 0;
    for (const v of all) {
      byRiskLevel[v.riskLevel] = (byRiskLevel[v.riskLevel] ?? 0) + 1;
      const lastAssess = v.assessments.length > 0 ? v.assessments[v.assessments.length - 1] : null;
      if (lastAssess) {
        totalScore += lastAssess.score;
        scoreCount++;
      }
    }
    return {
      total: all.length,
      byRiskLevel,
      averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
      criticalVendorCount: all.filter(v => v.riskLevel === VendorRiskLevel.CRITICAL).length,
    };
  }
}

// ─── RiskManager (security findings) ────────────────────────────
export class RiskManager {
  private findings: Map<string, RiskFinding> = new Map();
  private scenarios: Map<string, RiskScenario> = new Map();

  addFinding(finding: RiskFinding): void { this.findings.set(finding.id, finding); }
  getFinding(id: RiskFindingId): RiskFinding | undefined { return this.findings.get(id); }
  listFindings(): RiskFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }

  addScenario(scenario: RiskScenario): void { this.scenarios.set(scenario.id, scenario); }
  getScenario(id: RiskFindingId): RiskScenario | undefined { return this.scenarios.get(id); }
  listScenarios(): RiskScenario[] { return Array.from(this.scenarios.values()); }
  clearScenarios(): void { this.scenarios.clear(); }

  mitigateFinding(id: RiskFindingId): boolean {
    const finding = this.findings.get(id);
    if (!finding) return false;
    finding.mitigated = true;
    return true;
  }

  filterFindingsBySeverity(severity: RiskFinding['severity']): RiskFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }

  filterFindingsByCategory(category: RiskCategory): RiskFinding[] {
    return this.listFindings().filter(f => f.category === category);
  }

  filterFindingsUnmitigated(): RiskFinding[] {
    return this.listFindings().filter(f => !f.mitigated);
  }

  loadKnownScenarios(): void {
    const known = getKnownRiskScenarios();
    for (const s of known) this.addScenario(s);
  }

  getTotalFindings(): number { return this.findings.size; }
  getTotalScenarios(): number { return this.scenarios.size; }
}

// ─── NistCsfAssessor ────────────────────────────────────────────
export function assessNistCsf(currentProfile: { function: string; category: string; tier: number; score: number }[]): NistCsfProfile {
  const targetTiers: { function: string; category: string; tier: number }[] = [
    { function: 'Govern', category: 'Context', tier: 3 },
    { function: 'Govern', category: 'Risk Management', tier: 3 },
    { function: 'Govern', category: 'Roles', tier: 3 },
    { function: 'Govern', category: 'Policy', tier: 3 },
    { function: 'Govern', category: 'Oversight', tier: 3 },
    { function: 'Govern', category: 'Supply Chain', tier: 3 },
    { function: 'Identify', category: 'Asset Management', tier: 3 },
    { function: 'Identify', category: 'Risk Assessment', tier: 3 },
    { function: 'Identify', category: 'Improvement', tier: 3 },
    { function: 'Protect', category: 'Identity Management', tier: 3 },
    { function: 'Protect', category: 'Access Control', tier: 3 },
    { function: 'Protect', category: 'Awareness & Training', tier: 3 },
    { function: 'Protect', category: 'Data Security', tier: 3 },
    { function: 'Protect', category: 'Info Protection Processes', tier: 3 },
    { function: 'Protect', category: 'Protective Technology', tier: 3 },
    { function: 'Protect', category: 'Maintenance', tier: 3 },
    { function: 'Detect', category: 'Anomalies & Events', tier: 3 },
    { function: 'Detect', category: 'Continuous Monitoring', tier: 3 },
    { function: 'Detect', category: 'Detection Processes', tier: 3 },
    { function: 'Respond', category: 'Response Planning', tier: 3 },
    { function: 'Respond', category: 'Communications', tier: 3 },
    { function: 'Respond', category: 'Analysis', tier: 3 },
    { function: 'Respond', category: 'Mitigation', tier: 3 },
    { function: 'Respond', category: 'Improvements', tier: 3 },
    { function: 'Recover', category: 'Recovery Planning', tier: 3 },
    { function: 'Recover', category: 'Communications', tier: 3 },
    { function: 'Recover', category: 'Improvements', tier: 3 },
  ];

  const gaps: { function: string; category: string; gap: number; priority: string }[] = [];
  const currentMap = new Map(currentProfile.map(c => [`${c.function}:${c.category}`, c]));

  for (const target of targetTiers) {
    const current = currentMap.get(`${target.function}:${target.category}`);
    const currentTier = current?.tier ?? 1;
    const gap = target.tier - currentTier;
    if (gap > 0) {
      gaps.push({
        function: target.function,
        category: target.category,
        gap,
        priority: gap >= 2 ? 'HIGH' : gap === 1 ? 'MEDIUM' : 'LOW',
      });
    }
  }

  const overallMaturity = currentProfile.length > 0
    ? Math.round((currentProfile.reduce((s, c) => s + c.tier, 0) / currentProfile.length) * 10) / 10
    : 0;

  return {
    framework: 'NIST_CSF_2.0',
    currentProfile,
    targetProfile: targetTiers,
    overallMaturity,
    gaps,
    lastAssessed: Date.now(),
  };
}

// ─── RiskCoordinator ────────────────────────────────────────────
export class RiskCoordinator {
  readonly riskRegister: Map<string, RiskRegisterEntry> = new Map();
  readonly assets: Map<string, AssetInstance> = new Map();
  readonly controls: Map<string, ControlInstance> = new Map();
  readonly fair: FairManager;
  readonly compliance: ComplianceManager;
  readonly attackGraph: AttackGraphManager;
  readonly kpis: KpiManager;
  readonly vendors: VendorManager;
  readonly riskMgr: RiskManager;

  constructor() {
    this.fair = new FairManager();
    this.compliance = new ComplianceManager();
    this.attackGraph = new AttackGraphManager();
    this.kpis = new KpiManager();
    this.vendors = new VendorManager();
    this.riskMgr = new RiskManager();
  }

  addRiskEntry(entry: RiskRegisterEntry): void { this.riskRegister.set(entry.id, entry); }
  getRiskEntry(id: RiskId): RiskRegisterEntry | undefined { return this.riskRegister.get(id); }
  listRiskEntries(): RiskRegisterEntry[] { return Array.from(this.riskRegister.values()); }

  addAsset(asset: AssetInstance): void { this.assets.set(asset.id, asset); }
  getAsset(id: AssetId): AssetInstance | undefined { return this.assets.get(id); }
  listAssets(): AssetInstance[] { return Array.from(this.assets.values()); }

  addControl(control: ControlInstance): void { this.controls.set(control.id, control); }
  getControl(id: ControlId): ControlInstance | undefined { return this.controls.get(id); }
  listControls(): ControlInstance[] { return Array.from(this.controls.values()); }

  getStats(): {
    riskEntryCount: number;
    assetCount: number;
    controlCount: number;
    fairAnalysisCount: number;
    complianceFrameworkCount: number;
    attackGraphNodeCount: number;
    kpiCount: number;
    vendorCount: number;
    findingCount: number;
    scenarioCount: number;
    averageComplianceScore: number;
    criticalRiskCount: number;
  } {
    return {
      riskEntryCount: this.riskRegister.size,
      assetCount: this.assets.size,
      controlCount: this.controls.size,
      fairAnalysisCount: this.fair.getStats().totalAnalyses,
      complianceFrameworkCount: this.compliance.getStats().total,
      attackGraphNodeCount: this.attackGraph.getStats().totalNodes,
      kpiCount: this.kpis.getStats().total,
      vendorCount: this.vendors.getStats().total,
      findingCount: this.riskMgr.getTotalFindings(),
      scenarioCount: this.riskMgr.getTotalScenarios(),
      averageComplianceScore: this.compliance.getStats().averageScore,
      criticalRiskCount: this.listRiskEntries().filter(r => r.severity === RiskSeverity.CRITICAL).length,
    };
  }

  reset(): void {
    this.riskRegister.clear();
    this.assets.clear();
    this.controls.clear();
    this.fair.clear();
    this.compliance.clear();
    this.attackGraph.clear();
    this.kpis.clear();
    this.vendors.clear();
    this.riskMgr.clearFindings();
    this.riskMgr.clearScenarios();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultRiskEnvironment(): RiskCoordinator {
  const coord = new RiskCoordinator();

  // Assets
  const db = createAsset({
    name: 'Critical Database Server',
    type: AssetType.DATABASE,
    criticality: 0.95,
    value: 2500000,
    vulnerabilities: ['CVE-2024-21626', 'Default admin credentials'],
    location: 'us-east-1a',
    complianceFrameworks: [ComplianceFramework.GDPR, ComplianceFramework.PCI_DSS],
  });
  const web = createAsset({
    name: 'Web Application Server',
    type: AssetType.SERVER,
    criticality: 0.8,
    value: 1200000,
    vulnerabilities: ['CVE-2024-27198', 'TLS 1.0 enabled'],
    location: 'us-east-1a',
    complianceFrameworks: [ComplianceFramework.PCI_DSS],
  });
  const ad = createAsset({
    name: 'Active Directory Domain Controller',
    type: AssetType.SERVER,
    criticality: 0.9,
    value: 1800000,
    vulnerabilities: ['Weak Kerberos encryption', 'Legacy NTLM v1 enabled'],
    location: 'us-east-1a',
    complianceFrameworks: [ComplianceFramework.SOX, ComplianceFramework.ISO_27001],
  });
  const cloud = createAsset({
    name: 'Cloud Storage Bucket',
    type: AssetType.CLOUD_RESOURCE,
    criticality: 0.7,
    value: 800000,
    vulnerabilities: ['Public read access enabled', 'No encryption at rest'],
    location: 'aws-us-east-1',
    complianceFrameworks: [ComplianceFramework.GDPR, ComplianceFramework.SOC2],
  });
  const endpoint = createAsset({
    name: 'Employee Workstation',
    type: AssetType.ENDPOINT,
    criticality: 0.4,
    value: 50000,
    vulnerabilities: ['Unpatched OS', 'No EDR'],
    location: 'corp-office',
    complianceFrameworks: [],
  });
  coord.addAsset(db);
  coord.addAsset(web);
  coord.addAsset(ad);
  coord.addAsset(cloud);
  coord.addAsset(endpoint);

  // Controls
  const mfa = createControl({
    name: 'Multi-Factor Authentication',
    type: ControlType.PREVENTIVE,
    effectiveness: ControlEffectiveness.VERY_HIGH,
    framework: ComplianceFramework.ISO_27001,
    description: 'MFA for all administrative access and remote connectivity',
    owner: 'identity-team',
    evidence: ['Control implemented via Duo Security', 'Covers 95% of admin accounts'],
  });
  const soar = createControl({
    name: 'SOAR Incident Response Playbook',
    type: ControlType.CORRECTIVE,
    effectiveness: ControlEffectiveness.HIGH,
    framework: ComplianceFramework.NIST_CSF,
    description: 'Automated incident response playbook for common attack scenarios',
    owner: 'soc-team',
    evidence: ['Splunk SOAR configured', '12 playbooks active'],
  });
  const enc = createControl({
    name: 'Data Encryption (At Rest & In Transit)',
    type: ControlType.PREVENTIVE,
    effectiveness: ControlEffectiveness.HIGH,
    framework: ComplianceFramework.GDPR,
    description: 'AES-256 encryption for data at rest, TLS 1.3 for data in transit',
    owner: 'infra-team',
    evidence: ['KMS key rotation quarterly', 'TLS 1.3 enforced across all services'],
  });
  const backup = createControl({
    name: 'Offline Backup & Recovery',
    type: ControlType.CORRECTIVE,
    effectiveness: ControlEffectiveness.VERY_HIGH,
    framework: ComplianceFramework.NIST_CSF,
    description: 'Immutable offline backups with tested recovery procedures',
    owner: 'infra-team',
    evidence: ['Daily automated backups', 'Quarterly recovery drills', 'Air-gapped storage'],
  });
  coord.addControl(mfa);
  coord.addControl(soar);
  coord.addControl(enc);
  coord.addControl(backup);

  // Risk register entries
  const r1 = createRiskEntry({
    name: 'Ransomware Attack on Critical Infrastructure',
    description: 'Ransomware encrypts database and web servers causing extended downtime and data loss',
    category: RiskCategory.CYBER,
    severity: RiskSeverity.CRITICAL,
    likelihood: 0.7,
    impact: 0.9,
    inherentRisk: 0.63,
    residualRisk: 0.12,
    affectedAssets: [db.id, web.id],
    controls: [backup.id, mfa.id, soar.id],
    owner: 'ciso',
    status: FindingStatus.OPEN,
  });
  const r2 = createRiskEntry({
    name: 'Insider Threat - Privileged Account Abuse',
    description: 'Disgruntled administrator exfiltrates sensitive data or modifies production systems',
    category: RiskCategory.CYBER,
    severity: RiskSeverity.HIGH,
    likelihood: 0.4,
    impact: 0.8,
    inherentRisk: 0.32,
    residualRisk: 0.10,
    affectedAssets: [ad.id, db.id],
    controls: [mfa.id, soar.id],
    owner: 'iso-manager',
    status: FindingStatus.IN_PROGRESS,
  });
  const r3 = createRiskEntry({
    name: 'Supply Chain - Cloud Provider Outage',
    description: 'Critical cloud provider experiences extended service outage affecting hosted applications',
    category: RiskCategory.SUPPLY_CHAIN,
    severity: RiskSeverity.HIGH,
    likelihood: 0.5,
    impact: 0.7,
    inherentRisk: 0.35,
    residualRisk: 0.08,
    affectedAssets: [cloud.id, web.id],
    controls: [backup.id],
    owner: 'cloud-architect',
    status: FindingStatus.ACCEPTED,
  });
  const r4 = createRiskEntry({
    name: 'Data Breach via Web Application',
    description: 'SQL injection or RCE vulnerability in web application leads to database exfiltration of PII',
    category: RiskCategory.CYBER,
    severity: RiskSeverity.CRITICAL,
    likelihood: 0.6,
    impact: 0.9,
    inherentRisk: 0.54,
    residualRisk: 0.15,
    affectedAssets: [web.id, db.id],
    controls: [enc.id, mfa.id, soar.id],
    owner: 'appsec-team',
    status: FindingStatus.OPEN,
  });
  const r5 = createRiskEntry({
    name: 'GDPR Compliance Violation',
    description: 'Failure to maintain adequate data protection controls results in regulatory sanctions',
    category: RiskCategory.COMPLIANCE,
    severity: RiskSeverity.HIGH,
    likelihood: 0.5,
    impact: 0.7,
    inherentRisk: 0.35,
    residualRisk: 0.10,
    affectedAssets: [db.id, cloud.id],
    controls: [enc.id],
    owner: 'dpo',
    status: FindingStatus.OPEN,
  });
  const r6 = createRiskEntry({
    name: 'Cloud Infrastructure Misconfiguration',
    description: 'Improperly configured cloud resources expose sensitive data to the internet',
    category: RiskCategory.CYBER,
    severity: RiskSeverity.HIGH,
    likelihood: 0.65,
    impact: 0.7,
    inherentRisk: 0.455,
    residualRisk: 0.12,
    affectedAssets: [cloud.id],
    controls: [enc.id],
    owner: 'cloud-architect',
    status: FindingStatus.OPEN,
  });
  coord.addRiskEntry(r1);
  coord.addRiskEntry(r2);
  coord.addRiskEntry(r3);
  coord.addRiskEntry(r4);
  coord.addRiskEntry(r5);
  coord.addRiskEntry(r6);

  // FAIR analysis
  coord.fair.runAnalysis(db.id, 10, 0.5, 1500000, 750000, 5000);

  // Compliance frameworks
  const gdprId = coord.compliance.registerFramework(ComplianceFramework.GDPR, [
    { id: 'GDPR-5', description: 'Lawful processing of personal data', compliant: true, evidence: ['Consent management platform deployed'] },
    { id: 'GDPR-17', description: 'Data Protection Impact Assessment (DPIA)', compliant: true, evidence: ['DPIA completed for all high-risk processing'] },
    { id: 'GDPR-32', description: 'Security of processing - appropriate technical measures', compliant: true, evidence: ['Encryption at rest and in transit'] },
    { id: 'GDPR-33', description: 'Breach notification within 72 hours', compliant: false, evidence: [] },
    { id: 'GDPR-35', description: 'Data Protection Officer appointment', compliant: true, evidence: ['DPO appointed and registered'] },
    { id: 'GDPR-25', description: 'Data protection by design and default', compliant: false, evidence: ['Privacy review process not formalized'] },
  ]);
  const pciId = coord.compliance.registerFramework(ComplianceFramework.PCI_DSS, [
    { id: 'PCI-1', description: 'Firewall configuration to protect cardholder data', compliant: true, evidence: ['Strict egress filtering in place'] },
    { id: 'PCI-3', description: 'Protect stored cardholder data (encryption)', compliant: true, evidence: ['AES-256 encryption for CHD'] },
    { id: 'PCI-4', description: 'Encrypt transmission of cardholder data across open networks', compliant: true, evidence: ['TLS 1.3 enforced'] },
    { id: 'PCI-7', description: 'Restrict access to cardholder data by business need-to-know', compliant: false, evidence: [] },
    { id: 'PCI-8', description: 'Assign unique IDs to all system users', compliant: true, evidence: ['SSO with unique accounts'] },
    { id: 'PCI-10', description: 'Track and monitor all access to network resources and cardholder data', compliant: false, evidence: ['Logging gaps in legacy systems'] },
    { id: 'PCI-11', description: 'Regularly test security systems and processes', compliant: true, evidence: ['Quarterly ASV scans, annual penetration tests'] },
  ]);

  // Attack graph
  const ag1 = createAttackGraphNode({ name: 'External Network Access', cve: 'CVE-2024-27198', cvssScore: 9.8, exploits: ['Port scan', 'Service enumeration', 'Version fingerprinting'], depth: 0, probability: 0.9 });
  const ag2 = createAttackGraphNode({ name: 'Web Application Compromise', cve: 'CVE-2024-21626', cvssScore: 8.6, exploits: ['Path traversal', 'RCE via file upload'], depth: 1, probability: 0.7 });
  const ag3 = createAttackGraphNode({ name: 'Credential Theft', exploits: ['Phishing', 'Password spraying', 'Kerberoasting'], depth: 1, probability: 0.6 });
  const ag4 = createAttackGraphNode({ name: 'Database Access', cve: 'CVE-2024-27198', cvssScore: 7.5, exploits: ['SQL injection', 'Default credentials'], depth: 2, probability: 0.8 });
  const ag5 = createAttackGraphNode({ name: 'Privilege Escalation', exploits: ['Token manipulation', 'Kerberos delegation abuse'], depth: 2, probability: 0.5, assetAffected: ad.id });
  const ag6 = createAttackGraphNode({ name: 'Data Exfiltration', exploits: ['Outbound TLS tunnel', 'DNS tunnelling'], depth: 3, probability: 0.9, assetAffected: db.id });
  const ag7 = createAttackGraphNode({ name: 'Lateral Movement to AD', exploits: ['Pass-the-hash', 'Pass-the-ticket'], depth: 3, probability: 0.7, assetAffected: ad.id });
  const ag8 = createAttackGraphNode({ name: 'Crown Jewel - Domain Admin Access', exploits: ['DCSync', 'Golden ticket'], depth: 4, probability: 0.6, assetAffected: ad.id });
  // Link nodes: preconditions and postconditions
  ag1.preconditions = []; ag1.postconditions = [ag2.id, ag3.id];
  ag2.preconditions = [ag1.id]; ag2.postconditions = [ag4.id];
  ag3.preconditions = [ag1.id]; ag3.postconditions = [ag5.id];
  ag4.preconditions = [ag2.id]; ag4.postconditions = [ag6.id];
  ag5.preconditions = [ag3.id]; ag5.postconditions = [ag6.id, ag7.id];
  ag6.preconditions = [ag4.id, ag5.id]; ag6.postconditions = [ag8.id];
  ag7.preconditions = [ag5.id]; ag7.postconditions = [ag8.id];
  ag8.preconditions = [ag7.id, ag6.id]; ag8.postconditions = [];
  coord.attackGraph.addNodeDirect(ag1);
  coord.attackGraph.addNodeDirect(ag2);
  coord.attackGraph.addNodeDirect(ag3);
  coord.attackGraph.addNodeDirect(ag4);
  coord.attackGraph.addNodeDirect(ag5);
  coord.attackGraph.addNodeDirect(ag6);
  coord.attackGraph.addNodeDirect(ag7);
  coord.attackGraph.addNodeDirect(ag8);

  // KPIs
  coord.kpis.registerDirect(createKpi({
    type: KpiType.PATCH_LATENCY,
    name: 'Patch Latency (Critical CVEs)',
    currentValue: 14,
    threshold: 7,
    unit: 'days',
    trend: 'WORSENING',
    period: 'WEEKLY',
    history: [{ value: 10, timestamp: Date.now() - 604800000 }, { value: 12, timestamp: Date.now() - 302400000 }],
  }));
  coord.kpis.registerDirect(createKpi({
    type: KpiType.MTTD,
    name: 'Mean Time to Detect',
    currentValue: 24,
    threshold: 48,
    unit: 'hours',
    trend: 'IMPROVING',
    period: 'MONTHLY',
    history: [{ value: 36, timestamp: Date.now() - 2592000000 }, { value: 30, timestamp: Date.now() - 1296000000 }],
  }));
  coord.kpis.registerDirect(createKpi({
    type: KpiType.CONTROL_EFFECTIVENESS,
    name: 'Control Effectiveness Score',
    currentValue: 78,
    threshold: 70,
    unit: 'percent',
    trend: 'STABLE',
    period: 'MONTHLY',
    history: [{ value: 76, timestamp: Date.now() - 2592000000 }],
  }));
  coord.kpis.registerDirect(createKpi({
    type: KpiType.RISK_SCORE,
    name: 'Overall Risk Score',
    currentValue: 45,
    threshold: 60,
    unit: 'score',
    trend: 'IMPROVING',
    period: 'MONTHLY',
    history: [{ value: 52, timestamp: Date.now() - 2592000000 }, { value: 48, timestamp: Date.now() - 1296000000 }],
  }));
  coord.kpis.registerDirect(createKpi({
    type: KpiType.VULNERABILITY_DENSITY,
    name: 'Vulnerability Density',
    currentValue: 0.15,
    threshold: 0.2,
    unit: 'vulns/asset',
    trend: 'IMPROVING',
    period: 'MONTHLY',
    history: [{ value: 0.22, timestamp: Date.now() - 2592000000 }],
  }));

  // Vendors
  coord.vendors.registerDirect(createVendor({
    name: 'AWS (Amazon Web Services)',
    category: 'Cloud Provider',
    riskLevel: VendorRiskLevel.CRITICAL,
    criticality: 0.95,
    contractValue: 5000000,
    assessments: [{ date: Date.now() - 86400000 * 30, score: 88, findings: ['SOC 2 Type II report reviewed', 'No critical findings'] }],
    complianceCertifications: [ComplianceFramework.SOC2, ComplianceFramework.ISO_27001, ComplianceFramework.FEDRAMP],
    dataShared: ['Infrastructure logs', 'Customer data (encrypted)'],
    accessToNetwork: true,
    lastAssessmentDate: Date.now() - 86400000 * 30,
  }));
  coord.vendors.registerDirect(createVendor({
    name: 'Splunk Inc.',
    category: 'Software Vendor',
    riskLevel: VendorRiskLevel.MEDIUM,
    criticality: 0.65,
    contractValue: 750000,
    assessments: [{ date: Date.now() - 86400000 * 60, score: 75, findings: ['Minor findings in access controls', 'Remediation plan in progress'] }],
    complianceCertifications: [ComplianceFramework.SOC2, ComplianceFramework.ISO_27001],
    dataShared: ['Security events', 'User activity logs'],
    accessToNetwork: false,
    lastAssessmentDate: Date.now() - 86400000 * 60,
  }));
  coord.vendors.registerDirect(createVendor({
    name: 'OfficeWorks Supplies',
    category: 'Office Supplies',
    riskLevel: VendorRiskLevel.LOW,
    criticality: 0.1,
    contractValue: 25000,
    assessments: [],
    complianceCertifications: [],
    dataShared: [],
    accessToNetwork: false,
  }));

  // Risk findings
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'Critical database server has default admin credentials enabled',
    severity: 'critical', category: RiskCategory.CYBER,
  }));
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'Public cloud storage bucket allows anonymous read access',
    severity: 'high', category: RiskCategory.CYBER,
  }));
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'GDPR breach notification process not formally documented',
    severity: 'high', category: RiskCategory.COMPLIANCE,
  }));
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'Legacy NTLM v1 still enabled on domain controllers',
    severity: 'medium', category: RiskCategory.CYBER,
  }));
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'PCI DSS access control requirement not fully implemented',
    severity: 'high', category: RiskCategory.COMPLIANCE,
  }));
  coord.riskMgr.addFinding(createRiskFinding({
    description: 'No automated vulnerability scanning for employee endpoints',
    severity: 'medium', category: RiskCategory.OPERATIONAL,
  }));

  // Known scenarios
  coord.riskMgr.loadKnownScenarios();

  return coord;
}
