import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type SocialEngPhishingCampaignId = string & { readonly __brand: unique symbol };
export const phishingCampaignId = (): SocialEngPhishingCampaignId => uid() as unknown as SocialEngPhishingCampaignId;

export type SocialEngDeepfakeId = string & { readonly __brand: unique symbol };
export const deepfakeId = (): SocialEngDeepfakeId => uid() as unknown as SocialEngDeepfakeId;

export type SocialEngBecIncidentId = string & { readonly __brand: unique symbol };
export const becIncidentId = (): SocialEngBecIncidentId => uid() as unknown as SocialEngBecIncidentId;

export type SocialEngPretextingId = string & { readonly __brand: unique symbol };
export const pretextingId = (): SocialEngPretextingId => uid() as unknown as SocialEngPretextingId;

export type SocialEngInsiderThreatId = string & { readonly __brand: unique symbol };
export const insiderThreatId = (): SocialEngInsiderThreatId => uid() as unknown as SocialEngInsiderThreatId;

export type SocialEngOsintTargetId = string & { readonly __brand: unique symbol };
export const osintTargetId = (): SocialEngOsintTargetId => uid() as unknown as SocialEngOsintTargetId;

export type SocialEngFindingId = string & { readonly __brand: unique symbol };
export const socialEngFindingId = (): SocialEngFindingId => uid() as unknown as SocialEngFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum PhishingType {
  SPEAR = 'SPEAR',
  WHALING = 'WHALING',
  CLONE = 'CLONE',
  VISHING = 'VISHING',
  SMISHING = 'SMISHING',
  QUISHING = 'QUISHING',
  ANGLER = 'ANGLER',
  GENERIC = 'GENERIC',
}

export enum PhishingStatus {
  PLANNED = 'PLANNED',
  DEPLOYED = 'DEPLOYED',
  DETECTED = 'DETECTED',
  REPORTED = 'REPORTED',
  CONTAINED = 'CONTAINED',
  INVESTIGATING = 'INVESTIGATING',
  CLOSED = 'CLOSED',
}

export enum DeepfakeType {
  VOICE_CLONE = 'VOICE_CLONE',
  FACE_SWAP = 'FACE_SWAP',
  LIP_SYNC = 'LIP_SYNC',
  FULL_AVATAR = 'FULL_AVATAR',
  REALTIME = 'REALTIME',
}

export enum BecType {
  CEO_FRAUD = 'CEO_FRAUD',
  INVOICE_FRAUD = 'INVOICE_FRAUD',
  GIFT_CARD = 'GIFT_CARD',
  PAYROLL_DIVERSION = 'PAYROLL_DIVERSION',
  W2_PHISHING = 'W2_PHISHING',
  VENDOR_PAYMENT = 'VENDOR_PAYMENT',
}

export enum PretextType {
  IT_SUPPORT = 'IT_SUPPORT',
  VENDOR = 'VENDOR',
  COLLEAGUE = 'COLLEAGUE',
  AUTHORITY = 'AUTHORITY',
  LAW_ENFORCEMENT = 'LAW_ENFORCEMENT',
  RECRUITER = 'RECRUITER',
  CUSTOMER = 'CUSTOMER',
}

export enum InsiderThreatType {
  MALICIOUS = 'MALICIOUS',
  NEGLIGENT = 'NEGLIGENT',
  COMPROMISED = 'COMPROMISED',
  COLLUSIVE = 'COLLUSIVE',
  DISGRUNTLED = 'DISGRUNTLED',
  DEPARTING = 'DEPARTING',
  UNKNOWING = 'UNKNOWING',
}

export enum InsiderThreatSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  OBSERVED = 'OBSERVED',
}

export enum OsintDataType {
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  LOCATION = 'LOCATION',
  EMPLOYMENT = 'EMPLOYMENT',
  FINANCIAL = 'FINANCIAL',
  TECHNICAL_INFRASTRUCTURE = 'TECHNICAL_INFRASTRUCTURE',
  DARK_WEB = 'DARK_WEB',
}

export enum PsychologicalPrinciple {
  URGENCY = 'URGENCY',
  AUTHORITY = 'AUTHORITY',
  SCARCITY = 'SCARCITY',
  SOCIAL_PROOF = 'SOCIAL_PROOF',
  RECIPROCITY = 'RECIPROCITY',
  LIKING = 'LIKING',
  COMMITMENT_CONSISTENCY = 'COMMITMENT_CONSISTENCY',
}

export enum SocialEngineeringAttackType {
  PHISHING = 'PHISHING',
  DEEPFAKE = 'DEEPFAKE',
  BEC = 'BEC',
  PRETEXTING = 'PRETEXTING',
  INSIDER_THREAT = 'INSIDER_THREAT',
  OSINT = 'OSINT',
  WATERING_HOLE = 'WATERING_HOLE',
  PHYSICAL_TAILGATING = 'PHYSICAL_TAILGATING',
  PHYSICAL_BADGE_CLONE = 'PHYSICAL_BADGE_CLONE',
  PHYSICAL_DUMPSTER_DIVING = 'PHYSICAL_DUMPSTER_DIVING',
  MALVERTISING = 'MALVERTISING',
  VISHING = 'VISHING',
  SMISHING = 'SMISHING',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface PhishingCampaignInstance {
  id: SocialEngPhishingCampaignId;
  type: PhishingType;
  name: string;
  targetAudience: string;
  platform: string;
  lureContent: string;
  psychologicalPrinciples: PsychologicalPrinciple[];
  status: PhishingStatus;
  recipientsCount: number;
  clicksCount: number;
  credentialsHarvested: number;
  successRate: number;
  startDate: number;
  endDate?: number;
  pointsToPonder: string[];
}

export interface DeepfakeInstance {
  id: SocialEngDeepfakeId;
  type: DeepfakeType;
  targetPersona: string;
  generatedContent: string;
  platform: string;
  authenticityScore: number;
  detectionDifficulty: string;
  createdAt: number;
  deployed: boolean;
  detected: boolean;
}

export interface BecIncidentInstance {
  id: SocialEngBecIncidentId;
  type: BecType;
  targetName: string;
  targetRole: string;
  targetOrganization: string;
  lossAmount: number;
  detectionDate: number;
  resolved: boolean;
  recoveredAmount: number;
  impersonatedPersona: string;
  communicationChannel: string;
  psychologicalPrinciples: PsychologicalPrinciple[];
}

export interface PretextingScenarioInstance {
  id: SocialEngPretextingId;
  type: PretextType;
  persona: string;
  targetRole: string;
  goal: string;
  informationGathered: string[];
  successful: boolean;
  duration: number;
  psychologicalPrinciples: PsychologicalPrinciple[];
}

export interface InsiderThreatInstance {
  id: SocialEngInsiderThreatId;
  type: InsiderThreatType;
  severity: InsiderThreatSeverity;
  role: string;
  department: string;
  accessLevel: string;
  indicators: string[];
  dataExfiltrated: boolean;
  dataVolume?: number;
  colludedWith?: string;
  timeline: { event: string; timestamp: number }[];
  detected: boolean;
  contained: boolean;
  mitreTechniqueIds: string[];
}

export interface OsintTargetInstance {
  id: SocialEngOsintTargetId;
  targetName: string;
  knownEmails: string[];
  knownPhones: string[];
  socialMediaProfiles: { platform: string; url: string; activityLevel: string }[];
  employmentHistory: { company: string; role: string; years: string }[];
  technicalInfrastructure: string[];
  darkWebMentions: { source: string; snippet: string }[];
  riskScore: number;
  digitalFootprintSize: string;
}

export interface SocialEngFinding {
  id: SocialEngFindingId;
  description: string;
  attackType: SocialEngineeringAttackType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  mitigated: boolean;
  timestamp: number;
}

export interface KnownSocialEngScenario {
  name: string;
  description: string;
  attackTypes: SocialEngineeringAttackType[];
}

// ─── Factory Functions ──────────────────────────────────────────
export function createPhishingCampaign(overrides?: Partial<PhishingCampaignInstance>): PhishingCampaignInstance {
  return {
    id: phishingCampaignId(),
    type: PhishingType.GENERIC,
    name: 'Generic Phishing Campaign',
    targetAudience: 'General employees',
    platform: 'EMAIL',
    lureContent: 'Standard phishing lure',
    psychologicalPrinciples: [PsychologicalPrinciple.URGENCY],
    status: PhishingStatus.PLANNED,
    recipientsCount: 100,
    clicksCount: 0,
    credentialsHarvested: 0,
    successRate: 0,
    startDate: Date.now(),
    pointsToPonder: [],
    ...overrides,
  };
}

export function createDeepfake(overrides?: Partial<DeepfakeInstance>): DeepfakeInstance {
  return {
    id: deepfakeId(),
    type: DeepfakeType.VOICE_CLONE,
    targetPersona: 'CEO',
    generatedContent: 'Synthetic voice recording',
    platform: 'PHONE',
    authenticityScore: 85,
    detectionDifficulty: 'HARD',
    createdAt: Date.now(),
    deployed: false,
    detected: false,
    ...overrides,
  };
}

export function createBecIncident(overrides?: Partial<BecIncidentInstance>): BecIncidentInstance {
  return {
    id: becIncidentId(),
    type: BecType.CEO_FRAUD,
    targetName: 'John Doe',
    targetRole: 'CFO',
    targetOrganization: 'Acme Corp',
    lossAmount: 50000,
    detectionDate: Date.now(),
    resolved: false,
    recoveredAmount: 0,
    impersonatedPersona: 'CEO',
    communicationChannel: 'EMAIL',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.URGENCY],
    ...overrides,
  };
}

export function createPretextingScenario(overrides?: Partial<PretextingScenarioInstance>): PretextingScenarioInstance {
  return {
    id: pretextingId(),
    type: PretextType.IT_SUPPORT,
    persona: 'IT Support Technician',
    targetRole: 'Employee',
    goal: 'Obtain password reset',
    informationGathered: [],
    successful: false,
    duration: 15,
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY],
    ...overrides,
  };
}

export function createInsiderThreat(overrides?: Partial<InsiderThreatInstance>): InsiderThreatInstance {
  return {
    id: insiderThreatId(),
    type: InsiderThreatType.DISGRUNTLED,
    severity: InsiderThreatSeverity.MEDIUM,
    role: 'Software Engineer',
    department: 'Engineering',
    accessLevel: 'ELEVATED',
    indicators: [],
    dataExfiltrated: false,
    timeline: [],
    detected: false,
    contained: false,
    mitreTechniqueIds: ['T1567', 'T1059'],
    ...overrides,
  };
}

export function createOsintTarget(overrides?: Partial<OsintTargetInstance>): OsintTargetInstance {
  return {
    id: osintTargetId(),
    targetName: 'Target Person',
    knownEmails: [],
    knownPhones: [],
    socialMediaProfiles: [],
    employmentHistory: [],
    technicalInfrastructure: [],
    darkWebMentions: [],
    riskScore: 0,
    digitalFootprintSize: 'MINIMAL',
    ...overrides,
  };
}

export function createSocialEngFinding(overrides?: Partial<SocialEngFinding>): SocialEngFinding {
  return {
    id: socialEngFindingId(),
    description: 'Social engineering finding',
    attackType: SocialEngineeringAttackType.PHISHING,
    severity: 'high',
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function getKnownSocialEngAttacks(): KnownSocialEngScenario[] {
  return [
    { name: 'Spear Phishing', description: 'Targeted email campaign against specific individuals with personalized lures', attackTypes: [SocialEngineeringAttackType.PHISHING] },
    { name: 'Whaling', description: 'Phishing targeting C-level executives for high-value credential theft', attackTypes: [SocialEngineeringAttackType.PHISHING] },
    { name: 'CEO Fraud (BEC)', description: 'Impersonating CEO to trick finance into fraudulent wire transfers', attackTypes: [SocialEngineeringAttackType.BEC] },
    { name: 'Invoice Fraud (BEC)', description: 'Fake invoices from trusted vendors redirecting payments to attacker accounts', attackTypes: [SocialEngineeringAttackType.BEC] },
    { name: 'Voice Deepfake', description: 'AI-generated voice impersonation for vishing and authorization bypass', attackTypes: [SocialEngineeringAttackType.DEEPFAKE, SocialEngineeringAttackType.VISHING] },
    { name: 'Video Deepfake', description: 'AI-generated video impersonation for identity fraud and social engineering', attackTypes: [SocialEngineeringAttackType.DEEPFAKE] },
    { name: 'IT Support Pretexting', description: 'Caller impersonates IT support to trick employees into revealing credentials', attackTypes: [SocialEngineeringAttackType.PRETEXTING] },
    { name: 'Vendor Impersonation', description: 'Attacker poses as trusted vendor to obtain sensitive information', attackTypes: [SocialEngineeringAttackType.PRETEXTING] },
    { name: 'Insider Data Theft', description: 'Disgruntled employee exfiltrates sensitive data before departure', attackTypes: [SocialEngineeringAttackType.INSIDER_THREAT] },
    { name: 'Negligent Data Exposure', description: 'Employee accidentally exposes data through misconfigured sharing or lost device', attackTypes: [SocialEngineeringAttackType.INSIDER_THREAT] },
    { name: 'Watering Hole Attack', description: 'Compromising legitimate websites frequented by target organization', attackTypes: [SocialEngineeringAttackType.WATERING_HOLE] },
    { name: 'Tailgating', description: 'Unauthorized physical access by following authorized personnel through secured doors', attackTypes: [SocialEngineeringAttackType.PHYSICAL_TAILGATING] },
    { name: 'Badge Cloning', description: 'Cloning RFID access badges to gain unauthorized physical access', attackTypes: [SocialEngineeringAttackType.PHYSICAL_BADGE_CLONE] },
    { name: 'Dumpster Diving', description: 'Recovering sensitive documents or media from trash', attackTypes: [SocialEngineeringAttackType.PHYSICAL_DUMPSTER_DIVING] },
    { name: 'OSINT Social Media', description: 'Gathering intelligence from public social media profiles for targeting', attackTypes: [SocialEngineeringAttackType.OSINT] },
    { name: 'Malvertising', description: 'Malicious advertisements delivering malware through legitimate ad networks', attackTypes: [SocialEngineeringAttackType.MALVERTISING] },
    { name: 'Smishing', description: 'SMS-based phishing with malicious links or social engineering', attackTypes: [SocialEngineeringAttackType.SMISHING] },
    { name: 'Quishing', description: 'QR code phishing placing malicious QR codes in public or emailed locations', attackTypes: [SocialEngineeringAttackType.PHISHING] },
  ];
}

// ─── PhishingManager ────────────────────────────────────────────
export class PhishingManager {
  private campaigns: Map<string, PhishingCampaignInstance> = new Map();

  createCampaign(config: Omit<PhishingCampaignInstance, 'id' | 'status' | 'clicksCount' | 'credentialsHarvested' | 'successRate' | 'startDate'> & { status?: PhishingStatus; startDate?: number }): SocialEngPhishingCampaignId {
    const id = phishingCampaignId();
    this.campaigns.set(id, {
      id,
      status: PhishingStatus.PLANNED,
      clicksCount: 0,
      credentialsHarvested: 0,
      successRate: 0,
      startDate: Date.now(),
      ...config,
    } as PhishingCampaignInstance);
    return id;
  }

  getCampaign(id: SocialEngPhishingCampaignId): PhishingCampaignInstance | undefined { return this.campaigns.get(id); }
  listCampaigns(): PhishingCampaignInstance[] { return Array.from(this.campaigns.values()); }
  listByType(type: PhishingType): PhishingCampaignInstance[] { return this.listCampaigns().filter(c => c.type === type); }
  listByStatus(status: PhishingStatus): PhishingCampaignInstance[] { return this.listCampaigns().filter(c => c.status === status); }

  deployCampaign(id: SocialEngPhishingCampaignId): boolean {
    const c = this.campaigns.get(id);
    if (!c) return false;
    c.status = PhishingStatus.DEPLOYED;
    return true;
  }

  recordClick(id: SocialEngPhishingCampaignId): boolean {
    const c = this.campaigns.get(id);
    if (!c) return false;
    c.clicksCount++;
    c.successRate = c.recipientsCount > 0 ? (c.clicksCount / c.recipientsCount) * 100 : 0;
    return true;
  }

  harvestCredential(id: SocialEngPhishingCampaignId): boolean {
    const c = this.campaigns.get(id);
    if (!c) return false;
    c.credentialsHarvested++;
    return true;
  }

  closeCampaign(id: SocialEngPhishingCampaignId): boolean {
    const c = this.campaigns.get(id);
    if (!c) return false;
    c.status = PhishingStatus.CLOSED;
    c.endDate = Date.now();
    return true;
  }

  getStats(): { total: number; active: number; totalClicks: number; harvestRate: number; averageSuccessRate: number; byType: Record<string, number> } {
    const all = this.listCampaigns();
    const active = all.filter(c => c.status === PhishingStatus.DEPLOYED || c.status === PhishingStatus.PLANNED).length;
    const totalClicks = all.reduce((s, c) => s + c.clicksCount, 0);
    const totalHarvested = all.reduce((s, c) => s + c.credentialsHarvested, 0);
    const totalDeployed = all.filter(c => c.status !== PhishingStatus.PLANNED).length;
    const byType: Record<string, number> = {};
    for (const c of all) {
      byType[c.type] = (byType[c.type] || 0) + 1;
    }
    return {
      total: all.length,
      active,
      totalClicks,
      harvestRate: totalClicks > 0 ? (totalHarvested / totalClicks) * 100 : 0,
      averageSuccessRate: totalDeployed > 0 ? all.filter(c => c.status !== PhishingStatus.PLANNED).reduce((s, c) => s + c.successRate, 0) / totalDeployed : 0,
      byType,
    };
  }
}

// ─── DeepfakeManager ────────────────────────────────────────────
export class DeepfakeManager {
  private items: Map<string, DeepfakeInstance> = new Map();

  create(config: Omit<DeepfakeInstance, 'id' | 'createdAt' | 'deployed' | 'detected'> & { createdAt?: number; deployed?: boolean; detected?: boolean }): SocialEngDeepfakeId {
    const id = deepfakeId();
    this.items.set(id, {
      id,
      createdAt: Date.now(),
      deployed: false,
      detected: false,
      ...config,
    } as DeepfakeInstance);
    return id;
  }

  get(id: SocialEngDeepfakeId): DeepfakeInstance | undefined { return this.items.get(id); }
  list(): DeepfakeInstance[] { return Array.from(this.items.values()); }

  deploy(id: SocialEngDeepfakeId): boolean {
    const d = this.items.get(id);
    if (!d) return false;
    d.deployed = true;
    return true;
  }

  markDetected(id: SocialEngDeepfakeId): boolean {
    const d = this.items.get(id);
    if (!d) return false;
    d.detected = true;
    return true;
  }

  getStats(): { total: number; deployed: number; detected: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const d of all) {
      byType[d.type] = (byType[d.type] || 0) + 1;
    }
    return {
      total: all.length,
      deployed: all.filter(d => d.deployed).length,
      detected: all.filter(d => d.detected).length,
      byType,
    };
  }
}

// ─── BecManager ─────────────────────────────────────────────────
export class BecManager {
  private incidents: Map<string, BecIncidentInstance> = new Map();

  createIncident(config: Omit<BecIncidentInstance, 'id' | 'detectionDate' | 'resolved' | 'recoveredAmount'> & { detectionDate?: number; resolved?: boolean; recoveredAmount?: number }): SocialEngBecIncidentId {
    const id = becIncidentId();
    this.incidents.set(id, {
      id,
      detectionDate: Date.now(),
      resolved: false,
      recoveredAmount: 0,
      ...config,
    } as BecIncidentInstance);
    return id;
  }

  getIncident(id: SocialEngBecIncidentId): BecIncidentInstance | undefined { return this.incidents.get(id); }
  listIncidents(): BecIncidentInstance[] { return Array.from(this.incidents.values()); }
  listByType(type: BecType): BecIncidentInstance[] { return this.listIncidents().filter(i => i.type === type); }

  resolveIncident(id: SocialEngBecIncidentId, recovered: number): boolean {
    const i = this.incidents.get(id);
    if (!i) return false;
    i.resolved = true;
    i.recoveredAmount = recovered;
    return true;
  }

  getTotalLoss(): number { return this.listIncidents().reduce((s, i) => s + i.lossAmount, 0); }
  getTotalRecovered(): number { return this.listIncidents().reduce((s, i) => s + i.recoveredAmount, 0); }

  getStats(): { total: number; resolved: number; totalLoss: number; totalRecovered: number; byType: Record<string, number> } {
    const all = this.listIncidents();
    const byType: Record<string, number> = {};
    for (const i of all) {
      byType[i.type] = (byType[i.type] || 0) + 1;
    }
    return {
      total: all.length,
      resolved: all.filter(i => i.resolved).length,
      totalLoss: this.getTotalLoss(),
      totalRecovered: this.getTotalRecovered(),
      byType,
    };
  }
}

// ─── PretextingManager ──────────────────────────────────────────
export class PretextingManager {
  private scenarios: Map<string, PretextingScenarioInstance> = new Map();

  create(config: Omit<PretextingScenarioInstance, 'id' | 'informationGathered' | 'successful'> & { informationGathered?: string[]; successful?: boolean }): SocialEngPretextingId {
    const id = pretextingId();
    this.scenarios.set(id, {
      id,
      informationGathered: [],
      successful: false,
      ...config,
    } as PretextingScenarioInstance);
    return id;
  }

  get(id: SocialEngPretextingId): PretextingScenarioInstance | undefined { return this.scenarios.get(id); }
  list(): PretextingScenarioInstance[] { return Array.from(this.scenarios.values()); }
  listByType(type: PretextType): PretextingScenarioInstance[] { return this.list().filter(s => s.type === type); }

  markSuccessful(id: SocialEngPretextingId): boolean {
    const s = this.scenarios.get(id);
    if (!s) return false;
    s.successful = true;
    return true;
  }

  addGatheredInfo(id: SocialEngPretextingId, info: string): boolean {
    const s = this.scenarios.get(id);
    if (!s) return false;
    s.informationGathered.push(info);
    return true;
  }

  getStats(): { total: number; successful: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const s of all) {
      byType[s.type] = (byType[s.type] || 0) + 1;
    }
    return {
      total: all.length,
      successful: all.filter(s => s.successful).length,
      byType,
    };
  }
}

// ─── InsiderThreatManager ───────────────────────────────────────
export class InsiderThreatManager {
  private threats: Map<string, InsiderThreatInstance> = new Map();

  create(config: Omit<InsiderThreatInstance, 'id' | 'indicators' | 'dataExfiltrated' | 'timeline' | 'detected' | 'contained'> & { indicators?: string[]; dataExfiltrated?: boolean; timeline?: { event: string; timestamp: number }[]; detected?: boolean; contained?: boolean }): SocialEngInsiderThreatId {
    const id = insiderThreatId();
    this.threats.set(id, {
      id,
      indicators: [],
      dataExfiltrated: false,
      timeline: [],
      detected: false,
      contained: false,
      ...config,
    } as InsiderThreatInstance);
    return id;
  }

  get(id: SocialEngInsiderThreatId): InsiderThreatInstance | undefined { return this.threats.get(id); }
  list(): InsiderThreatInstance[] { return Array.from(this.threats.values()); }
  listByType(type: InsiderThreatType): InsiderThreatInstance[] { return this.list().filter(t => t.type === type); }
  listBySeverity(severity: InsiderThreatSeverity): InsiderThreatInstance[] { return this.list().filter(t => t.severity === severity); }

  addIndicator(id: SocialEngInsiderThreatId, indicator: string): boolean {
    const t = this.threats.get(id);
    if (!t) return false;
    t.indicators.push(indicator);
    return true;
  }

  addTimelineEvent(id: SocialEngInsiderThreatId, event: string): boolean {
    const t = this.threats.get(id);
    if (!t) return false;
    t.timeline.push({ event, timestamp: Date.now() });
    return true;
  }

  markDetected(id: SocialEngInsiderThreatId): boolean {
    const t = this.threats.get(id);
    if (!t) return false;
    t.detected = true;
    return true;
  }

  markContained(id: SocialEngInsiderThreatId): boolean {
    const t = this.threats.get(id);
    if (!t) return false;
    t.contained = true;
    return true;
  }

  getStats(): { total: number; detected: number; contained: number; dataExfiltrated: number; byType: Record<string, number>; bySeverity: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    for (const t of all) {
      byType[t.type] = (byType[t.type] || 0) + 1;
      bySeverity[t.severity] = (bySeverity[t.severity] || 0) + 1;
    }
    return {
      total: all.length,
      detected: all.filter(t => t.detected).length,
      contained: all.filter(t => t.contained).length,
      dataExfiltrated: all.filter(t => t.dataExfiltrated).length,
      byType,
      bySeverity,
    };
  }
}

// ─── OsintManager ───────────────────────────────────────────────
export class OsintManager {
  private targets: Map<string, OsintTargetInstance> = new Map();

  createTarget(config: Omit<OsintTargetInstance, 'id' | 'knownEmails' | 'knownPhones' | 'socialMediaProfiles' | 'employmentHistory' | 'technicalInfrastructure' | 'darkWebMentions' | 'riskScore' | 'digitalFootprintSize'> & {
    knownEmails?: string[]; knownPhones?: string[]; socialMediaProfiles?: { platform: string; url: string; activityLevel: string }[];
    employmentHistory?: { company: string; role: string; years: string }[]; technicalInfrastructure?: string[];
    darkWebMentions?: { source: string; snippet: string }[]; riskScore?: number; digitalFootprintSize?: string;
  }): SocialEngOsintTargetId {
    const id = osintTargetId();
    this.targets.set(id, {
      id,
      knownEmails: [],
      knownPhones: [],
      socialMediaProfiles: [],
      employmentHistory: [],
      technicalInfrastructure: [],
      darkWebMentions: [],
      riskScore: 0,
      digitalFootprintSize: 'MINIMAL',
      ...config,
    } as OsintTargetInstance);
    return id;
  }

  getTarget(id: SocialEngOsintTargetId): OsintTargetInstance | undefined { return this.targets.get(id); }
  listTargets(): OsintTargetInstance[] { return Array.from(this.targets.values()); }

  addEmail(id: SocialEngOsintTargetId, email: string): boolean {
    const t = this.targets.get(id);
    if (!t) return false;
    t.knownEmails.push(email);
    this.updateFootprintSize(t);
    return true;
  }

  addPhone(id: SocialEngOsintTargetId, phone: string): boolean {
    const t = this.targets.get(id);
    if (!t) return false;
    t.knownPhones.push(phone);
    this.updateFootprintSize(t);
    return true;
  }

  addSocialProfile(id: SocialEngOsintTargetId, profile: { platform: string; url: string; activityLevel: string }): boolean {
    const t = this.targets.get(id);
    if (!t) return false;
    t.socialMediaProfiles.push(profile);
    this.updateFootprintSize(t);
    return true;
  }

  addDarkWebMention(id: SocialEngOsintTargetId, mention: { source: string; snippet: string }): boolean {
    const t = this.targets.get(id);
    if (!t) return false;
    t.darkWebMentions.push(mention);
    this.updateFootprintSize(t);
    return true;
  }

  calculateRiskScore(id: SocialEngOsintTargetId): number {
    const t = this.targets.get(id);
    if (!t) return 0;
    let score = 0;
    score += t.knownEmails.length * 5;
    score += t.knownPhones.length * 10;
    score += t.socialMediaProfiles.length * 8;
    score += t.employmentHistory.length * 6;
    score += t.technicalInfrastructure.length * 12;
    score += t.darkWebMentions.length * 20;
    t.riskScore = Math.min(100, score);
    return t.riskScore;
  }

  private updateFootprintSize(t: OsintTargetInstance): void {
    const totalPoints = t.knownEmails.length + t.knownPhones.length + t.socialMediaProfiles.length + t.employmentHistory.length + t.technicalInfrastructure.length + t.darkWebMentions.length;
    if (totalPoints >= 15) t.digitalFootprintSize = 'EXTREME';
    else if (totalPoints >= 8) t.digitalFootprintSize = 'EXTENSIVE';
    else if (totalPoints >= 3) t.digitalFootprintSize = 'MODERATE';
    else t.digitalFootprintSize = 'MINIMAL';
  }

  getStats(): { total: number; averageRiskScore: number; byFootprintSize: Record<string, number> } {
    const all = this.listTargets();
    const byFootprintSize: Record<string, number> = {};
    for (const t of all) {
      byFootprintSize[t.digitalFootprintSize] = (byFootprintSize[t.digitalFootprintSize] || 0) + 1;
    }
    return {
      total: all.length,
      averageRiskScore: all.length > 0 ? all.reduce((s, t) => s + t.riskScore, 0) / all.length : 0,
      byFootprintSize,
    };
  }
}

// ─── SocialEngSecurityManager ───────────────────────────────────
export class SocialEngSecurityManager {
  private findings: Map<string, SocialEngFinding> = new Map();
  private attackTypes: SocialEngineeringAttackType[] = [];
  private knownScenarios: KnownSocialEngScenario[] = [];

  addFinding(f: SocialEngFinding): void { this.findings.set(f.id, f); }
  getFinding(id: SocialEngFindingId): SocialEngFinding | undefined { return this.findings.get(id); }
  listFindings(): SocialEngFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }

  mitigateFinding(id: SocialEngFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.mitigated = true;
    return true;
  }

  filterFindingsBySeverity(severity: SocialEngFinding['severity']): SocialEngFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }

  filterFindingsByAttackType(type: SocialEngineeringAttackType): SocialEngFinding[] {
    return this.listFindings().filter(f => f.attackType === type);
  }

  filterFindingsUnmitigated(): SocialEngFinding[] { return this.listFindings().filter(f => !f.mitigated); }
  getTotalFindings(): number { return this.findings.size; }

  loadKnownScenarios(): void { this.knownScenarios = getKnownSocialEngAttacks(); }
  getKnownScenarios(): KnownSocialEngScenario[] { return this.knownScenarios; }
  getAttackTypes(): SocialEngineeringAttackType[] { return this.attackTypes; }
  setAttackTypes(types: SocialEngineeringAttackType[]): void { this.attackTypes = types; }
}

// ─── SocialEngCoordinator ───────────────────────────────────────
export class SocialEngCoordinator {
  readonly phishing: PhishingManager;
  readonly deepfakes: DeepfakeManager;
  readonly bec: BecManager;
  readonly pretexting: PretextingManager;
  readonly insiderThreats: InsiderThreatManager;
  readonly osint: OsintManager;
  readonly security: SocialEngSecurityManager;

  constructor() {
    this.phishing = new PhishingManager();
    this.deepfakes = new DeepfakeManager();
    this.bec = new BecManager();
    this.pretexting = new PretextingManager();
    this.insiderThreats = new InsiderThreatManager();
    this.osint = new OsintManager();
    this.security = new SocialEngSecurityManager();
  }

  getStats(): {
    phishingCampaignCount: number; deepfakeCount: number; becCount: number;
    pretextingCount: number; insiderThreatCount: number; osintTargetCount: number;
    findingCount: number; unmitigatedFindingCount: number;
    totalPhishingClicks: number; totalBecLoss: number; totalBecRecovered: number;
    insiderThreatsDetected: number; insiderThreatsContained: number;
  } {
    const phishingStats = this.phishing.getStats();
    const becStats = this.bec.getStats();
    const insiderStats = this.insiderThreats.getStats();
    return {
      phishingCampaignCount: phishingStats.total,
      deepfakeCount: this.deepfakes.getStats().total,
      becCount: becStats.total,
      pretextingCount: this.pretexting.getStats().total,
      insiderThreatCount: insiderStats.total,
      osintTargetCount: this.osint.getStats().total,
      findingCount: this.security.getTotalFindings(),
      unmitigatedFindingCount: this.security.filterFindingsUnmitigated().length,
      totalPhishingClicks: phishingStats.totalClicks,
      totalBecLoss: becStats.totalLoss,
      totalBecRecovered: becStats.totalRecovered,
      insiderThreatsDetected: insiderStats.detected,
      insiderThreatsContained: insiderStats.contained,
    };
  }

  reset(): void {
    this.phishing.listCampaigns().forEach(c => this.phishing.closeCampaign(c.id));
    this.deepfakes.list().forEach(d => this.deepfakes.markDetected(d.id));
    this.security.clearFindings();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultSocialEngEnvironment(): SocialEngCoordinator {
  const coord = new SocialEngCoordinator();

  // Phishing campaigns
  coord.phishing.createCampaign({
    type: PhishingType.SPEAR,
    name: 'Spear Phish - C-Level',
    targetAudience: 'C-level executives',
    platform: 'EMAIL',
    lureContent: 'Personalized email referencing recent board decisions with malicious PDF attachment',
    psychologicalPrinciples: [PsychologicalPrinciple.URGENCY, PsychologicalPrinciple.AUTHORITY],
    recipientsCount: 12,
    pointsToPonder: ['Spear phishing targets specific individuals with highly customized lures', 'C-level credentials provide access to most sensitive corporate data'],
    startDate: Date.now() - 86400000 * 3,
  });
  coord.phishing.createCampaign({
    type: PhishingType.WHALING,
    name: 'Whaling - Finance Wire Transfer',
    targetAudience: 'Finance department',
    platform: 'EMAIL',
    lureContent: 'Urgent wire transfer request appearing to come from CEO with spoofed domain',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.URGENCY, PsychologicalPrinciple.SCARCITY],
    recipientsCount: 5,
    pointsToPonder: ['Whaling targets high-value individuals like CFOs and finance directors', 'BEC attacks often combine whaling with domain spoofing'],
    startDate: Date.now() - 86400000 * 5,
  });
  coord.phishing.createCampaign({
    type: PhishingType.VISHING,
    name: 'Vishing - IT Help Desk',
    targetAudience: 'IT department',
    platform: 'PHONE',
    lureContent: 'Caller posing as vendor support requesting VPN credentials for urgent patch',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.URGENCY],
    recipientsCount: 20,
    pointsToPonder: ['Vishing (voice phishing) bypasses email security controls', 'Deepfake voice technology makes vishing increasingly convincing'],
    startDate: Date.now() - 86400000 * 2,
  });
  coord.phishing.createCampaign({
    type: PhishingType.SMISHING,
    name: 'Smishing - HR Policy Update',
    targetAudience: 'All employees',
    platform: 'SMS',
    lureContent: 'Fake HR notification about policy changes with malicious link shortened via URL shortener',
    psychologicalPrinciples: [PsychologicalPrinciple.URGENCY, PsychologicalPrinciple.AUTHORITY],
    recipientsCount: 500,
    pointsToPonder: ['Smishing exploits trust in SMS as a communication channel', 'Mobile devices often have weaker security controls than desktops'],
    startDate: Date.now() - 86400000,
  });

  // Deepfakes
  coord.deepfakes.create({
    type: DeepfakeType.VOICE_CLONE,
    targetPersona: 'CEO Sarah Chen',
    generatedContent: 'Synthetic voice recording instructing finance to approve urgent wire transfer',
    platform: 'PHONE',
    authenticityScore: 94,
    detectionDifficulty: 'EXTREME',
  });
  coord.deepfakes.create({
    type: DeepfakeType.FACE_SWAP,
    targetPersona: 'CFO Michael Roberts',
    generatedContent: 'Deepfake video of CFO requesting credentials via video call',
    platform: 'VIDEO_CONFERENCE',
    authenticityScore: 78,
    detectionDifficulty: 'HARD',
  });

  // BEC incidents
  coord.bec.createIncident({
    type: BecType.CEO_FRAUD,
    targetName: 'Sarah Chen',
    targetRole: 'CEO',
    targetOrganization: 'Acme Corporation',
    lossAmount: 50000,
    impersonatedPersona: 'Board Chairman',
    communicationChannel: 'EMAIL',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.URGENCY],
  });
  coord.bec.createIncident({
    type: BecType.INVOICE_FRAUD,
    targetName: 'John Smith',
    targetRole: 'Accounts Payable',
    targetOrganization: 'TechCorp Inc.',
    lossAmount: 230000,
    impersonatedPersona: 'Vendor - DataSys Solutions',
    communicationChannel: 'EMAIL',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.SOCIAL_PROOF],
  });
  coord.bec.createIncident({
    type: BecType.PAYROLL_DIVERSION,
    targetName: 'Alice Johnson',
    targetRole: 'Payroll Manager',
    targetOrganization: 'Global Services LLC',
    lossAmount: 85000,
    impersonatedPersona: 'Employee requesting direct deposit change',
    communicationChannel: 'EMAIL',
    psychologicalPrinciples: [PsychologicalPrinciple.LIKING, PsychologicalPrinciple.COMMITMENT_CONSISTENCY],
  });

  // Pretexting scenarios
  coord.pretexting.create({
    type: PretextType.IT_SUPPORT,
    persona: 'IT Support Technician - Mark',
    targetRole: 'HR Director',
    goal: 'Obtain Active Directory admin credentials',
    psychologicalPrinciples: [PsychologicalPrinciple.AUTHORITY, PsychologicalPrinciple.URGENCY],
    duration: 12,
  });
  coord.pretexting.create({
    type: PretextType.VENDOR,
    persona: 'Sales Rep - Jessica from CloudSecure',
    targetRole: 'Security Engineer',
    goal: 'Gather information about internal security tools and vendors',
    psychologicalPrinciples: [PsychologicalPrinciple.LIKING, PsychologicalPrinciple.RECIPROCITY],
    duration: 22,
  });

  // Insider threats
  coord.insiderThreats.create({
    type: InsiderThreatType.DISGRUNTLED,
    severity: InsiderThreatSeverity.HIGH,
    role: 'Senior Developer',
    department: 'Engineering',
    accessLevel: 'CRITICAL',
    dataExfiltrated: false,
    mitreTechniqueIds: ['T1567', 'T1059', 'T1078'],
  });
  coord.insiderThreats.create({
    type: InsiderThreatType.NEGLIGENT,
    severity: InsiderThreatSeverity.MEDIUM,
    role: 'Contractor',
    department: 'Professional Services',
    accessLevel: 'ELEVATED',
    dataExfiltrated: false,
    mitreTechniqueIds: ['T1098', 'T1566'],
  });
  coord.insiderThreats.create({
    type: InsiderThreatType.COMPROMISED,
    severity: InsiderThreatSeverity.CRITICAL,
    role: 'Financial Analyst',
    department: 'Finance',
    accessLevel: 'ELEVATED',
    dataExfiltrated: true,
    dataVolume: 2500,
    colludedWith: 'External threat actor - APT41',
    mitreTechniqueIds: ['T1048', 'T1095', 'T1053'],
  });

  // OSINT targets
  const execTarget = coord.osint.createTarget({
    targetName: 'Dr. Elizabeth Warren - CTO',
    digitalFootprintSize: 'EXTREME',
    riskScore: 72,
  });
  coord.osint.addEmail(execTarget, 'ewarren@company.com');
  coord.osint.addEmail(execTarget, 'elizabeth.warren@personal.com');
  coord.osint.addPhone(execTarget, '+1-555-0100');
  coord.osint.addSocialProfile(execTarget, { platform: 'LinkedIn', url: 'https://linkedin.com/in/elizabeth-warren', activityLevel: 'HIGH' });
  coord.osint.addSocialProfile(execTarget, { platform: 'Twitter', url: 'https://twitter.com/ewarren', activityLevel: 'MODERATE' });
  coord.osint.addSocialProfile(execTarget, { platform: 'GitHub', url: 'https://github.com/ewarren', activityLevel: 'LOW' });
  coord.osint.addSocialProfile(execTarget, { platform: 'Medium', url: 'https://medium.com/@elizabeth.warren', activityLevel: 'HIGH' });
  coord.osint.addDarkWebMention(execTarget, { source: 'BreachForums', snippet: 'Corp email dump - ewarren@company.com appears in 2024 breach' });
  coord.osint.calculateRiskScore(execTarget);

  const avgTarget = coord.osint.createTarget({
    targetName: 'James Miller - Staff Engineer',
    digitalFootprintSize: 'MODERATE',
    riskScore: 28,
  });
  coord.osint.addEmail(avgTarget, 'jmiller@company.com');
  coord.osint.addSocialProfile(avgTarget, { platform: 'LinkedIn', url: 'https://linkedin.com/in/james-miller', activityLevel: 'LOW' });
  coord.osint.addSocialProfile(avgTarget, { platform: 'GitHub', url: 'https://github.com/jmiller', activityLevel: 'LOW' });
  coord.osint.calculateRiskScore(avgTarget);

  // Security findings
  const findings: SocialEngFinding[] = [
    { id: socialEngFindingId(), description: 'Spear phishing campaign targeting C-level - high risk of credential compromise', attackType: SocialEngineeringAttackType.PHISHING, severity: 'critical', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'Deepfake voice clone of CEO detected in wire transfer fraud attempt', attackType: SocialEngineeringAttackType.DEEPFAKE, severity: 'critical', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'BEC invoice fraud resulted in $230k loss to TechCorp', attackType: SocialEngineeringAttackType.BEC, severity: 'critical', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'IT support pretexting attempt - AD admin credentials at risk', attackType: SocialEngineeringAttackType.PRETEXTING, severity: 'high', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'Compromised financial analyst exfiltrated 2.5GB of sensitive data', attackType: SocialEngineeringAttackType.INSIDER_THREAT, severity: 'critical', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'OSINT on CTO revealed extensive digital footprint including breached credentials', attackType: SocialEngineeringAttackType.OSINT, severity: 'high', mitigated: false, timestamp: Date.now() },
    { id: socialEngFindingId(), description: 'Smishing campaign deployed to 500 employees - potential credential harvesting', attackType: SocialEngineeringAttackType.SMISHING, severity: 'high', mitigated: false, timestamp: Date.now() },
  ];
  for (const f of findings) coord.security.addFinding(f);

  // Attack types
  coord.security.setAttackTypes(Object.values(SocialEngineeringAttackType));

  // Known scenarios
  coord.security.loadKnownScenarios();

  return coord;
}
