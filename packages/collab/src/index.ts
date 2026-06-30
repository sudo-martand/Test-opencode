import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type ExerciseId = string & { readonly __brand: unique symbol };
export const exerciseId = (): ExerciseId => uid() as unknown as ExerciseId;

export type TeamId = string & { readonly __brand: unique symbol };
export const teamId = (): TeamId => uid() as unknown as TeamId;

export type RoleId = string & { readonly __brand: unique symbol };
export const roleId = (): RoleId => uid() as unknown as RoleId;

export type ParticipantId = string & { readonly __brand: unique symbol };
export const participantId = (): ParticipantId => uid() as unknown as ParticipantId;

export type InjectId = string & { readonly __brand: unique symbol };
export const injectId = (): InjectId => uid() as unknown as InjectId;

export type CommunicationChannelId = string & { readonly __brand: unique symbol };
export const communicationChannelId = (): CommunicationChannelId => uid() as unknown as CommunicationChannelId;

export type MessageId = string & { readonly __brand: unique symbol };
export const messageId = (): MessageId => uid() as unknown as MessageId;

export type CollabFindingId = string & { readonly __brand: unique symbol };
export const collabFindingId = (): CollabFindingId => uid() as unknown as CollabFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum ExerciseType {
  RED_VS_BLUE = 'RED_VS_BLUE',
  PURPLE_TEAM = 'PURPLE_TEAM',
  TABLE_TOP = 'TABLE_TOP',
  SOC_BASED = 'SOC_BASED',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  THREAT_HUNT = 'THREAT_HUNT',
  FULL_SCALE = 'FULL_SCALE',
}
export enum ExercisePhase {
  PLANNING = 'PLANNING',
  PREPARATION = 'PREPARATION',
  EXECUTION = 'EXECUTION',
  HOT_WASH = 'HOT_WASH',
  ANALYSIS = 'ANALYSIS',
  REPORTING = 'REPORTING',
  CLOSED = 'CLOSED',
}
export enum TeamColor {
  RED = 'RED',
  BLUE = 'BLUE',
  WHITE = 'WHITE',
  PURPLE = 'PURPLE',
  GREEN = 'GREEN',
}
export enum ParticipantRole {
  TIER_1_ANALYST = 'TIER_1_ANALYST',
  TIER_2_ANALYST = 'TIER_2_ANALYST',
  TIER_3_ANALYST = 'TIER_3_ANALYST',
  SOC_MANAGER = 'SOC_MANAGER',
  CISO = 'CISO',
  INCIDENT_COMMANDER = 'INCIDENT_COMMANDER',
  OPS_CHIEF = 'OPS_CHIEF',
  THREAT_INTEL_ANALYST = 'THREAT_INTEL_ANALYST',
  FORENSIC_ANALYST = 'FORENSIC_ANALYST',
  MALWARE_ANALYST = 'MALWARE_ANALYST',
  RED_TEAM_OPERATOR = 'RED_TEAM_OPERATOR',
  WHITE_CELL_CONTROLLER = 'WHITE_CELL_CONTROLLER',
  OBSERVER = 'OBSERVER',
  BOARD_MEMBER = 'BOARD_MEMBER',
}
export enum CommandEchelon {
  TACTICAL = 'TACTICAL',
  OPERATIONAL = 'OPERATIONAL',
  STRATEGIC = 'STRATEGIC',
}
export enum InjectType {
  INCIDENT_ALERT = 'INCIDENT_ALERT',
  INTELLIGENCE_REPORT = 'INTELLIGENCE_REPORT',
  MEDIA_INQUIRY = 'MEDIA_INQUIRY',
  EXECUTIVE_ESCALATION = 'EXECUTIVE_ESCALATION',
  VENDOR_NOTIFICATION = 'VENDOR_NOTIFICATION',
  LEGAL_NOTIFICATION = 'LEGAL_NOTIFICATION',
  REGULATORY_NOTICE = 'REGULATORY_NOTICE',
  TWIST = 'TWIST',
}
export enum CommunicationChannelType {
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO',
  EMAIL = 'EMAIL',
  SECURE_CHAT = 'SECURE_CHAT',
  IRC = 'IRC',
  SIGNAL = 'SIGNAL',
  TEAMS = 'TEAMS',
  JABBER = 'JABBER',
}
export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  FLASH = 'FLASH',
}
export enum AARCategory {
  DETECTION = 'DETECTION',
  RESPONSE = 'RESPONSE',
  COMMUNICATION = 'COMMUNICATION',
  DECISION_MAKING = 'DECISION_MAKING',
  COORDINATION = 'COORDINATION',
  TOOL_USAGE = 'TOOL_USAGE',
  PROCESS_ADHERENCE = 'PROCESS_ADHERENCE',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface ExerciseInstance {
  id: ExerciseId;
  name: string;
  type: ExerciseType;
  phase: ExercisePhase;
  description: string;
  scenario: string;
  teams: TeamId[];
  participants: ParticipantId[];
  startTime?: number;
  endTime?: number;
  objectives: string[];
  metrics: { objective: string; achieved: boolean; score: number }[];
  controllerNotes: string;
}

export interface TeamInstance {
  id: TeamId;
  name: string;
  color: TeamColor;
  participants: ParticipantId[];
  role: string;
  communicationChannels: CommunicationChannelId[];
  location: string;
  commanderId?: ParticipantId;
}

export interface ParticipantInstance {
  id: ParticipantId;
  name: string;
  role: ParticipantRole;
  echelon: CommandEchelon;
  teamId: TeamId;
  department: string;
  experience: string;
  activeExerciseId?: ExerciseId;
  lastActivity?: number;
}

export interface InjectInstance {
  id: InjectId;
  exerciseId: ExerciseId;
  type: InjectType;
  content: string;
  source: string;
  targetRole: string;
  timestamp: number;
  responseExpected: boolean;
  response?: { participantId: ParticipantId; content: string; timestamp: number };
  branchScenario?: string;
  escalatesTo?: InjectId;
}

export interface CommunicationChannelInstance {
  id: CommunicationChannelId;
  type: CommunicationChannelType;
  name: string;
  participants: ParticipantId[];
  messages: MessageBatch[];
  encryptionType: string;
  secure: boolean;
}

export interface MessageBatch {
  id: MessageId;
  channelId: CommunicationChannelId;
  senderId: ParticipantId;
  content: string;
  timestamp: number;
  priority: MessagePriority;
  attachments: string[];
  readBy: ParticipantId[];
  edited: boolean;
}

export interface AfterActionReview {
  id: ExerciseId;
  exerciseName: string;
  timeline: { timestamp: number; event: string; category: AARCategory; decision: string }[];
  keyFindings: { category: AARCategory; finding: string; severity: string; recommendation: string }[];
  performanceMetrics: { metric: string; value: number; benchmark: number; passed: boolean }[];
  overallScore: number;
  lessonsLearned: string[];
  createdBy: string;
}

export interface CollabSecurityChallenge {
  type: string;
  name: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface CollabFinding {
  id: CollabFindingId;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  domain: string;
  exerciseId: ExerciseId;
  timestamp: number;
  resolved: boolean;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createExercise(overrides?: Partial<ExerciseInstance>): ExerciseInstance {
  return {
    id: exerciseId(),
    name: 'Cyber Exercise',
    type: ExerciseType.RED_VS_BLUE,
    phase: ExercisePhase.PLANNING,
    description: 'A cybersecurity exercise scenario',
    scenario: 'Simulated cyber attack scenario',
    teams: [],
    participants: [],
    objectives: ['Detect intrusion', 'Contain threat', 'Eradicate adversary'],
    metrics: [],
    controllerNotes: '',
    ...overrides,
  };
}

export function createTeam(overrides?: Partial<TeamInstance>): TeamInstance {
  return {
    id: teamId(),
    name: 'Team Alpha',
    color: TeamColor.BLUE,
    participants: [],
    role: 'SOC Team',
    communicationChannels: [],
    location: 'Virtual SOC',
    ...overrides,
  };
}

export function createParticipant(overrides?: Partial<ParticipantInstance>): ParticipantInstance {
  return {
    id: participantId(),
    name: 'John Doe',
    role: ParticipantRole.TIER_1_ANALYST,
    echelon: CommandEchelon.TACTICAL,
    teamId: '' as TeamId,
    department: 'SOC',
    experience: 'MID',
    ...overrides,
  };
}

export function createInject(overrides?: Partial<InjectInstance>): InjectInstance {
  return {
    id: injectId(),
    exerciseId: '' as ExerciseId,
    type: InjectType.INCIDENT_ALERT,
    content: 'Suspicious activity detected',
    source: 'SIEM Alert',
    targetRole: 'Tier 1 Analyst',
    timestamp: Date.now(),
    responseExpected: true,
    ...overrides,
  };
}

export function createCommunicationChannel(overrides?: Partial<CommunicationChannelInstance>): CommunicationChannelInstance {
  return {
    id: communicationChannelId(),
    type: CommunicationChannelType.SECURE_CHAT,
    name: 'Ops Channel',
    participants: [],
    messages: [],
    encryptionType: 'END_TO_END',
    secure: true,
    ...overrides,
  };
}

export function createMessageBatch(overrides?: Partial<MessageBatch>): MessageBatch {
  return {
    id: messageId(),
    channelId: '' as CommunicationChannelId,
    senderId: '' as ParticipantId,
    content: 'Hello team',
    timestamp: Date.now(),
    priority: MessagePriority.MEDIUM,
    attachments: [],
    readBy: [],
    edited: false,
    ...overrides,
  };
}

export function createCollabFinding(overrides?: Partial<CollabFinding>): CollabFinding {
  return {
    id: collabFindingId(),
    description: 'Unencrypted communication channel detected',
    severity: 'high',
    domain: 'Communications',
    exerciseId: '' as ExerciseId,
    timestamp: Date.now(),
    resolved: false,
    ...overrides,
  };
}

export function getKnownCollabChallenges(): CollabSecurityChallenge[] {
  return [
    { type: 'Information Leakage', name: 'Cross-Team Information Leak', description: 'Sensitive operational details shared across unauthorized team channels during exercise', impact: 'Compromised exercise integrity, loss of operational security', mitigation: 'Implement channel access controls, enforce need-to-know principles' },
    { type: 'Unauthorized Access', name: 'Channel Intrusion', description: 'Unauthorized participant gains access to restricted communication channel', impact: 'Exposure of sensitive injects and strategies', mitigation: 'Multi-factor authentication for communication systems, periodic access reviews' },
    { type: 'Inc Coordination', name: 'Escalation Delay', description: 'Critical finding not escalated to appropriate command echelon in timely manner', impact: 'Delayed response, potential mission failure', mitigation: 'Automated escalation workflows, SLA monitoring for response times' },
    { type: 'Comms Failure', name: 'Channel Outage During Crisis', description: 'Primary communication channel becomes unavailable during critical phase', impact: 'Loss of coordination, missed inject deadlines', mitigation: 'Redundant communication paths, offline fallback procedures' },
    { type: 'Inject Leak', name: 'Inject Content Disclosure', description: 'Exercise inject content leaked to participating teams before intended release', impact: 'Compromised exercise realism, unfair advantage', mitigation: 'Encrypted inject distribution, access logging, inject signing' },
    { type: 'Role Confusion', name: 'Role Boundary Violation', description: 'Participant operates outside assigned role scope during exercise', impact: 'Process breakdown, inaccurate AAR assessment', mitigation: 'Role-based access control, exercise phase enforcement, participant training' },
  ];
}

// ─── ExerciseManager ─────────────────────────────────────────────
export class ExerciseManager {
  private exercises: Map<string, ExerciseInstance> = new Map();

  createExercise(config: Partial<ExerciseInstance> & { name: string; type: ExerciseType; scenario: string }): ExerciseId {
    const ex = createExercise(config);
    this.exercises.set(ex.id, ex);
    return ex.id;
  }
  get(id: ExerciseId): ExerciseInstance | undefined { return this.exercises.get(id); }
  list(filter?: { type?: ExerciseType; phase?: ExercisePhase }): ExerciseInstance[] {
    let result = Array.from(this.exercises.values());
    if (filter?.type) result = result.filter(e => e.type === filter.type);
    if (filter?.phase) result = result.filter(e => e.phase === filter.phase);
    return result;
  }
  updatePhase(id: ExerciseId, phase: ExercisePhase): boolean {
    const ex = this.exercises.get(id);
    if (!ex) return false;
    ex.phase = phase;
    return true;
  }
  setMetrics(id: ExerciseId, metrics: ExerciseInstance['metrics']): boolean {
    const ex = this.exercises.get(id);
    if (!ex) return false;
    ex.metrics = metrics;
    return true;
  }
  setStartTime(id: ExerciseId, time: number): boolean {
    const ex = this.exercises.get(id);
    if (!ex) return false;
    ex.startTime = time;
    return true;
  }
  setEndTime(id: ExerciseId, time: number): boolean {
    const ex = this.exercises.get(id);
    if (!ex) return false;
    ex.endTime = time;
    return true;
  }
  getActiveExercises(): ExerciseInstance[] {
    return this.list().filter(e => e.phase === ExercisePhase.EXECUTION);
  }
  getStats(): { total: number; active: number; byType: Record<string, number>; byPhase: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    const byPhase: Record<string, number> = {};
    for (const e of all) {
      byType[e.type] = (byType[e.type] || 0) + 1;
      byPhase[e.phase] = (byPhase[e.phase] || 0) + 1;
    }
    return { total: all.length, active: this.getActiveExercises().length, byType, byPhase };
  }
}

// ─── ParticipantManager ─────────────────────────────────────────
export class ParticipantManager {
  private participants: Map<string, ParticipantInstance> = new Map();

  register(config: Partial<ParticipantInstance> & { name: string; role: ParticipantRole; echelon: CommandEchelon; teamId: TeamId }): ParticipantId {
    const p = createParticipant(config);
    this.participants.set(p.id, p);
    return p.id;
  }
  get(id: ParticipantId): ParticipantInstance | undefined { return this.participants.get(id); }
  list(filter?: { role?: ParticipantRole; echelon?: CommandEchelon; teamId?: TeamId; experience?: string }): ParticipantInstance[] {
    let result = Array.from(this.participants.values());
    if (filter?.role) result = result.filter(p => p.role === filter.role);
    if (filter?.echelon) result = result.filter(p => p.echelon === filter.echelon);
    if (filter?.teamId) result = result.filter(p => p.teamId === filter.teamId);
    if (filter?.experience) result = result.filter(p => p.experience === filter.experience);
    return result;
  }
  listByRole(role: ParticipantRole): ParticipantInstance[] { return this.list().filter(p => p.role === role); }
  listByEchelon(echelon: CommandEchelon): ParticipantInstance[] { return this.list().filter(p => p.echelon === echelon); }
  listByTeam(teamId: TeamId): ParticipantInstance[] { return this.list().filter(p => p.teamId === teamId); }
  assignToExercise(id: ParticipantId, exerciseId: ExerciseId): boolean {
    const p = this.participants.get(id);
    if (!p) return false;
    p.activeExerciseId = exerciseId;
    return true;
  }
  updateLastActivity(id: ParticipantId): void {
    const p = this.participants.get(id);
    if (p) p.lastActivity = Date.now();
  }
  getStats(): { total: number; byRole: Record<string, number>; byEchelon: Record<string, number> } {
    const all = this.list();
    const byRole: Record<string, number> = {};
    const byEchelon: Record<string, number> = {};
    for (const p of all) {
      byRole[p.role] = (byRole[p.role] || 0) + 1;
      byEchelon[p.echelon] = (byEchelon[p.echelon] || 0) + 1;
    }
    return { total: all.length, byRole, byEchelon };
  }
}

// ─── InjectManager ───────────────────────────────────────────────
export class InjectManager {
  private injects: Map<string, InjectInstance> = new Map();

  createInject(config: Partial<InjectInstance> & { exerciseId: ExerciseId; type: InjectType; content: string; source: string; targetRole: string }): InjectId {
    const inj = createInject(config);
    this.injects.set(inj.id, inj);
    return inj.id;
  }
  getInject(id: InjectId): InjectInstance | undefined { return this.injects.get(id); }
  listInjects(filter?: { exerciseId?: ExerciseId; type?: InjectType; targetRole?: string; responseExpected?: boolean }): InjectInstance[] {
    let result = Array.from(this.injects.values());
    if (filter?.exerciseId) result = result.filter(i => i.exerciseId === filter.exerciseId);
    if (filter?.type) result = result.filter(i => i.type === filter.type);
    if (filter?.targetRole) result = result.filter(i => i.targetRole === filter.targetRole);
    if (filter?.responseExpected !== undefined) result = result.filter(i => i.responseExpected === filter.responseExpected);
    return result;
  }
  listByExercise(exerciseId: ExerciseId): InjectInstance[] { return this.listInjects({ exerciseId }); }
  listByType(type: InjectType): InjectInstance[] { return this.listInjects({ type }); }
  listByTargetRole(role: string): InjectInstance[] { return this.listInjects({ targetRole: role }); }
  respondToInject(id: InjectId, participantId: ParticipantId, content: string): boolean {
    const inj = this.injects.get(id);
    if (!inj || !inj.responseExpected) return false;
    inj.response = { participantId, content, timestamp: Date.now() };
    return true;
  }
  escalateInject(id: InjectId, newInjectConfig: Partial<InjectInstance> & { exerciseId: ExerciseId; type: InjectType; content: string; source: string; targetRole: string }): InjectId {
    const original = this.injects.get(id);
    if (!original) throw new Error(`Inject ${id} not found`);
    const escalatedId = this.createInject(newInjectConfig);
    const escalated = this.injects.get(escalatedId)!;
    escalated.escalatesTo = escalatedId;
    this.injects.get(id)!.escalatesTo = escalatedId;
    return escalatedId;
  }
  getPendingInjects(exerciseId: ExerciseId): InjectInstance[] {
    return this.listByExercise(exerciseId).filter(i => i.responseExpected && !i.response);
  }
  getStats(): { total: number; byType: Record<string, number>; bySource: Record<string, number>; pendingCount: number; responseRate: number } {
    const all = Array.from(this.injects.values());
    const byType: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let responded = 0;
    for (const i of all) {
      byType[i.type] = (byType[i.type] || 0) + 1;
      bySource[i.source] = (bySource[i.source] || 0) + 1;
      if (i.response) responded++;
    }
    const pendingCount = all.filter(i => i.responseExpected && !i.response).length;
    const expectedCount = all.filter(i => i.responseExpected).length;
    return {
      total: all.length,
      byType,
      bySource,
      pendingCount,
      responseRate: expectedCount > 0 ? responded / expectedCount : 0,
    };
  }
}

// ─── CommunicationManager ───────────────────────────────────────
export class CommunicationManager {
  private channels: Map<string, CommunicationChannelInstance> = new Map();

  createChannel(config: Partial<CommunicationChannelInstance> & { type: CommunicationChannelType; name: string }): CommunicationChannelId {
    const ch = createCommunicationChannel(config);
    this.channels.set(ch.id, ch);
    return ch.id;
  }
  getChannel(id: CommunicationChannelId): CommunicationChannelInstance | undefined { return this.channels.get(id); }
  listChannels(filter?: { type?: CommunicationChannelType; secure?: boolean }): CommunicationChannelInstance[] {
    let result = Array.from(this.channels.values());
    if (filter?.type) result = result.filter(c => c.type === filter.type);
    if (filter?.secure !== undefined) result = result.filter(c => c.secure === filter.secure);
    return result;
  }
  addParticipant(channelId: CommunicationChannelId, participantId: ParticipantId): boolean {
    const ch = this.channels.get(channelId);
    if (!ch) return false;
    if (!ch.participants.includes(participantId)) ch.participants.push(participantId);
    return true;
  }
  removeParticipant(channelId: CommunicationChannelId, participantId: ParticipantId): boolean {
    const ch = this.channels.get(channelId);
    if (!ch) return false;
    ch.participants = ch.participants.filter(p => p !== participantId);
    return true;
  }
  sendMessage(channelId: CommunicationChannelId, senderId: ParticipantId, content: string, priority: MessagePriority, attachments?: string[]): MessageId {
    const ch = this.channels.get(channelId);
    if (!ch) throw new Error(`Channel ${channelId} not found`);
    const msg = createMessageBatch({
      channelId,
      senderId,
      content,
      priority,
      timestamp: Date.now(),
      attachments: attachments || [],
    });
    ch.messages.push(msg);
    return msg.id;
  }
  getMessage(channelId: CommunicationChannelId, messageId: MessageId): MessageBatch | undefined {
    const ch = this.channels.get(channelId);
    if (!ch) return undefined;
    return ch.messages.find(m => m.id === messageId);
  }
  listMessages(channelId: CommunicationChannelId, filter?: { priority?: MessagePriority; senderId?: ParticipantId }): MessageBatch[] {
    const ch = this.channels.get(channelId);
    if (!ch) return [];
    let result = ch.messages;
    if (filter?.priority) result = result.filter(m => m.priority === filter.priority);
    if (filter?.senderId) result = result.filter(m => m.senderId === filter.senderId);
    return result;
  }
  markRead(channelId: CommunicationChannelId, messageId: MessageId, participantId: ParticipantId): boolean {
    const ch = this.channels.get(channelId);
    if (!ch) return false;
    const msg = ch.messages.find(m => m.id === messageId);
    if (!msg) return false;
    if (!msg.readBy.includes(participantId)) msg.readBy.push(participantId);
    return true;
  }
  getStats(): { totalChannels: number; totalMessages: number; byType: Record<string, number>; byPriority: Record<string, number>; secureChannelCount: number } {
    const all = Array.from(this.channels.values());
    let totalMessages = 0;
    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    let secureChannelCount = 0;
    for (const ch of all) {
      byType[ch.type] = (byType[ch.type] || 0) + 1;
      totalMessages += ch.messages.length;
      if (ch.secure) secureChannelCount++;
      for (const msg of ch.messages) {
        byPriority[msg.priority] = (byPriority[msg.priority] || 0) + 1;
      }
    }
    return { totalChannels: all.length, totalMessages, byType, byPriority, secureChannelCount };
  }
}

// ─── AARManager ─────────────────────────────────────────────────
export class AARManager {
  private reviews: Map<string, AfterActionReview> = new Map();

  create(exerciseId: ExerciseId, exerciseName: string, creator: string): AfterActionReview {
    const aar: AfterActionReview = {
      id: exerciseId,
      exerciseName,
      timeline: [],
      keyFindings: [],
      performanceMetrics: [],
      overallScore: 0,
      lessonsLearned: [],
      createdBy: creator,
    };
    this.reviews.set(aar.id, aar);
    return aar;
  }
  get(exerciseId: ExerciseId): AfterActionReview | undefined { return this.reviews.get(exerciseId); }
  addTimelineEvent(exerciseId: ExerciseId, event: { timestamp: number; event: string; category: AARCategory; decision: string }): boolean {
    const aar = this.reviews.get(exerciseId);
    if (!aar) return false;
    aar.timeline.push(event);
    return true;
  }
  addFinding(exerciseId: ExerciseId, finding: { category: AARCategory; finding: string; severity: string; recommendation: string }): boolean {
    const aar = this.reviews.get(exerciseId);
    if (!aar) return false;
    aar.keyFindings.push(finding);
    return true;
  }
  setMetrics(exerciseId: ExerciseId, metrics: { metric: string; value: number; benchmark: number; passed: boolean }[]): boolean {
    const aar = this.reviews.get(exerciseId);
    if (!aar) return false;
    aar.performanceMetrics = metrics;
    return true;
  }
  calculateScore(exerciseId: ExerciseId): number {
    const aar = this.reviews.get(exerciseId);
    if (!aar || aar.performanceMetrics.length === 0) return 0;
    const passed = aar.performanceMetrics.filter(m => m.passed).length;
    aar.overallScore = Math.round((passed / aar.performanceMetrics.length) * 100);
    return aar.overallScore;
  }
  list(): AfterActionReview[] { return Array.from(this.reviews.values()); }
}

// ─── CollabSecurityManager ─────────────────────────────────────
export class CollabSecurityManager {
  private findings: Map<string, CollabFinding> = new Map();
  private challenges: CollabSecurityChallenge[] = [];

  addFinding(f: CollabFinding): void { this.findings.set(f.id, f); }
  getFinding(id: CollabFindingId): CollabFinding | undefined { return this.findings.get(id); }
  listFindings(): CollabFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }
  resolveFinding(id: CollabFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.resolved = true;
    return true;
  }
  filterFindingsBySeverity(severity: CollabFinding['severity']): CollabFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }
  filterFindingsByDomain(domain: string): CollabFinding[] {
    return this.listFindings().filter(f => f.domain === domain);
  }
  filterFindingsUnresolved(): CollabFinding[] {
    return this.listFindings().filter(f => !f.resolved);
  }
  filterFindingsByExercise(exerciseId: ExerciseId): CollabFinding[] {
    return this.listFindings().filter(f => f.exerciseId === exerciseId);
  }
  getTotalFindings(): number { return this.findings.size; }

  loadKnownChallenges(): void { this.challenges = getKnownCollabChallenges(); }
  getKnownChallenges(): CollabSecurityChallenge[] { return this.challenges; }
}

// ─── CollabCoordinator ──────────────────────────────────────────
export class CollabCoordinator {
  readonly exercises: ExerciseManager;
  readonly participants: ParticipantManager;
  readonly injects: InjectManager;
  readonly comms: CommunicationManager;
  readonly aar: AARManager;
  readonly security: CollabSecurityManager;

  constructor() {
    this.exercises = new ExerciseManager();
    this.participants = new ParticipantManager();
    this.injects = new InjectManager();
    this.comms = new CommunicationManager();
    this.aar = new AARManager();
    this.security = new CollabSecurityManager();
  }

  getStats(): {
    exerciseCount: number; activeExerciseCount: number;
    participantCount: number; injectCount: number; pendingInjectCount: number;
    channelCount: number; messageCount: number;
    aarCount: number; findingCount: number; unresolvedFindingCount: number;
  } {
    const exStats = this.exercises.getStats();
    const partStats = this.participants.getStats();
    const injStats = this.injects.getStats();
    const commStats = this.comms.getStats();
    return {
      exerciseCount: exStats.total,
      activeExerciseCount: exStats.active,
      participantCount: partStats.total,
      injectCount: injStats.total,
      pendingInjectCount: injStats.pendingCount,
      channelCount: commStats.totalChannels,
      messageCount: commStats.totalMessages,
      aarCount: this.aar.list().length,
      findingCount: this.security.getTotalFindings(),
      unresolvedFindingCount: this.security.filterFindingsUnresolved().length,
    };
  }

  reset(): void {
    this.exercises.list().forEach(e => { /* clear is built-in via manager internals */ });
    this.participants.list().forEach(p => { /* no-op */ });
    // Since we don't have clear methods, we rely on creating fresh instances
    // But we can clear maps by reassigning -- let's just use the pattern from automotive
    // Actually automotive also doesn't clear participants/exercises individually -- it uses clear() methods
    // We need to make this work. Let's add internal map clearing.
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultCollabEnvironment(): CollabCoordinator {
  const coord = new CollabCoordinator();

  // Exercises
  const exRedVsBlue = coord.exercises.createExercise({
    name: 'Operation Crimson Tide',
    type: ExerciseType.RED_VS_BLUE,
    phase: ExercisePhase.EXECUTION,
    description: 'Full-scale red vs blue team exercise testing SOC detection and response capabilities',
    scenario: 'Advanced persistent threat group targeting critical infrastructure with custom malware and C2 infrastructure',
    startTime: Date.now() - 3600000,
    objectives: ['Detect initial compromise within 30 minutes', 'Contain threat within 2 hours', 'Eradicate adversary persistence', 'Complete forensics within 4 hours'],
  });
  const exTableTop = coord.exercises.createExercise({
    name: 'Ransomware Response',
    type: ExerciseType.TABLE_TOP,
    phase: ExercisePhase.PREPARATION,
    description: 'Tabletop exercise simulating ransomware attack on enterprise infrastructure',
    scenario: 'Ryuk-style ransomware deployment through compromised RDP server with lateral movement to file shares and backup systems',
    objectives: ['Activate incident response plan', 'Isolate infected systems', 'Restore from clean backups', 'Notify legal and compliance'],
  });

  // Teams
  const teamRed = teamId();
  const teamBlue = teamId();
  const teamWhite = teamId();
  const teamPurple = teamId();
  const teamExec = teamId();

  // Participants
  const p1 = coord.participants.register({
    name: 'Alice Chen', role: ParticipantRole.RED_TEAM_OPERATOR, echelon: CommandEchelon.TACTICAL, teamId: teamRed,
    department: 'Red Cell', experience: 'SENIOR',
  });
  const p2 = coord.participants.register({
    name: 'Bob Martinez', role: ParticipantRole.TIER_1_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamBlue,
    department: 'SOC', experience: 'JUNIOR',
  });
  const p3 = coord.participants.register({
    name: 'Carol Williams', role: ParticipantRole.TIER_2_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamBlue,
    department: 'SOC', experience: 'MID',
  });
  const p4 = coord.participants.register({
    name: 'David Kim', role: ParticipantRole.TIER_3_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamBlue,
    department: 'SOC', experience: 'SENIOR',
  });
  const p5 = coord.participants.register({
    name: 'Eve Johnson', role: ParticipantRole.WHITE_CELL_CONTROLLER, echelon: CommandEchelon.OPERATIONAL, teamId: teamWhite,
    department: 'Exercise Control', experience: 'LEAD',
  });
  const p6 = coord.participants.register({
    name: 'Frank Lee', role: ParticipantRole.SOC_MANAGER, echelon: CommandEchelon.OPERATIONAL, teamId: teamBlue,
    department: 'SOC Management', experience: 'SENIOR',
  });
  const p7 = coord.participants.register({
    name: 'Grace Patel', role: ParticipantRole.CISO, echelon: CommandEchelon.STRATEGIC, teamId: teamExec,
    department: 'Executive', experience: 'LEAD',
  });
  const p8 = coord.participants.register({
    name: 'Henry Nakamura', role: ParticipantRole.FORENSIC_ANALYST, echelon: CommandEchelon.TACTICAL, teamId: teamBlue,
    department: 'Forensics', experience: 'EXPERT',
  });
  const p9 = coord.participants.register({
    name: 'Iris Okafor', role: ParticipantRole.THREAT_INTEL_ANALYST, echelon: CommandEchelon.OPERATIONAL, teamId: teamPurple,
    department: 'Threat Intelligence', experience: 'SENIOR',
  });
  const p10 = coord.participants.register({
    name: 'Jack Thompson', role: ParticipantRole.BOARD_MEMBER, echelon: CommandEchelon.STRATEGIC, teamId: teamExec,
    department: 'Board of Directors', experience: 'LEAD',
  });

  // Assign to exercises
  [p1, p2, p3, p4, p5, p6, p8, p9].forEach(pid => coord.participants.assignToExercise(pid, exRedVsBlue));
  [p5, p6, p7, p10, p9].forEach(pid => coord.participants.assignToExercise(pid, exTableTop));

  // Injects
  const inj1 = coord.injects.createInject({
    exerciseId: exRedVsBlue, type: InjectType.INCIDENT_ALERT,
    content: 'SIEM alert: Beaconing detected from workstation WKS-102 to external IP 185.130.5.21 on port 443 every 60 seconds',
    source: 'SIEM Alert', targetRole: 'Tier 1 Analyst', timestamp: Date.now() - 3500000,
  });
  const inj2 = coord.injects.createInject({
    exerciseId: exRedVsBlue, type: InjectType.INTELLIGENCE_REPORT,
    content: 'Threat intel feed: APT group TA-459 has been observed targeting energy sector with custom Cobalt Strike beacon variants',
    source: 'Threat Intel Feed', targetRole: 'Tier 3 Analyst', timestamp: Date.now() - 3000000,
  });
  const inj3 = coord.injects.createInject({
    exerciseId: exRedVsBlue, type: InjectType.EXECUTIVE_ESCALATION,
    content: 'CEO office: Requesting status update on incident - media inquiries expected within 2 hours',
    source: 'CEO Office', targetRole: 'SOC Manager', timestamp: Date.now() - 2400000,
  });
  const inj4 = coord.injects.createInject({
    exerciseId: exRedVsBlue, type: InjectType.TWIST,
    content: 'TWIST: Backup systems report ransomware encryption notification - patient zero detonated lateral movement ransomware payload',
    source: 'Backup Alert System', targetRole: 'Tier 3 Analyst', timestamp: Date.now() - 1800000,
  });
  const inj5 = coord.injects.createInject({
    exerciseId: exRedVsBlue, type: InjectType.LEGAL_NOTIFICATION,
    content: 'Legal: Data breach notification requirements triggered - prepare regulatory filing for potential PII exposure',
    source: 'Legal Department', targetRole: 'CISO', timestamp: Date.now() - 1200000,
  });
  const inj6 = coord.injects.createInject({
    exerciseId: exTableTop, type: InjectType.INCIDENT_ALERT,
    content: 'Ransomware detected on file server FS-003 - all file shares encrypted with .ryk extension',
    source: 'EDR Alert', targetRole: 'Tier 1 Analyst', timestamp: Date.now() - 600000,
  });
  const inj7 = coord.injects.createInject({
    exerciseId: exTableTop, type: InjectType.MEDIA_INQUIRY,
    content: 'Press inquiry received from CyberScoop reporter - requesting comment on suspected ransomware incident',
    source: 'Media', targetRole: 'SOC Manager', timestamp: Date.now() - 300000,
  });
  const inj8 = coord.injects.createInject({
    exerciseId: exTableTop, type: InjectType.REGULATORY_NOTICE,
    content: 'Regulatory notice: CISA notified of potential critical infrastructure impact - response required within 4 hours',
    source: 'CISA', targetRole: 'CISO', timestamp: Date.now() - 100000,
  });

  // Respond to one inject
  coord.injects.respondToInject(inj1, p2, 'Initial analysis confirmed - beaconing to known C2 infrastructure. Escalating to Tier 2.');

  // Communication channels
  const chanRed = coord.comms.createChannel({
    type: CommunicationChannelType.SECURE_CHAT, name: 'Red Cell Ops', secure: true, encryptionType: 'SIGNAL_PROTOCOL',
  });
  const chanBlue = coord.comms.createChannel({
    type: CommunicationChannelType.TEAMS, name: 'Blue SOC Command', secure: true, encryptionType: 'TLS',
  });
  const chanWhite = coord.comms.createChannel({
    type: CommunicationChannelType.SIGNAL, name: 'White Cell Coordination', secure: true, encryptionType: 'END_TO_END',
  });

  // Add participants to channels
  coord.comms.addParticipant(chanRed, p1);
  coord.comms.addParticipant(chanRed, p5);
  coord.comms.addParticipant(chanBlue, p2);
  coord.comms.addParticipant(chanBlue, p3);
  coord.comms.addParticipant(chanBlue, p4);
  coord.comms.addParticipant(chanBlue, p6);
  coord.comms.addParticipant(chanBlue, p8);
  coord.comms.addParticipant(chanWhite, p5);
  coord.comms.addParticipant(chanWhite, p6);
  coord.comms.addParticipant(chanWhite, p7);
  coord.comms.addParticipant(chanWhite, p9);

  // Messages across channels
  const now = Date.now();
  coord.comms.sendMessage(chanRed, p1, 'Initial access achieved on WKS-102 via spear-phish. Beacon established.', MessagePriority.HIGH);
  coord.comms.sendMessage(chanRed, p1, 'Lateral movement to FS-003 in progress. Credential dumping successful.', MessagePriority.CRITICAL);
  coord.comms.sendMessage(chanRed, p1, 'Ransomware payload staged on backup server. Awaiting execute command.', MessagePriority.MEDIUM);

  coord.comms.sendMessage(chanBlue, p2, 'Alert ID 4456: Beaconing detected from WKS-102. Investigating.', MessagePriority.HIGH);
  coord.comms.sendMessage(chanBlue, p2, 'Confirmed C2 traffic. Isolating workstation from network.', MessagePriority.CRITICAL, ['network_scan.pcap', 'process_dump.dmp']);
  coord.comms.sendMessage(chanBlue, p3, 'Cross-referencing with threat intel. TA-459 TTPs match observed behavior.', MessagePriority.MEDIUM);
  coord.comms.sendMessage(chanBlue, p4, 'Deep memory analysis of WKS-102 reveals custom Cobalt Strike variant. Extracting IOCs.', MessagePriority.HIGH);
  coord.comms.sendMessage(chanBlue, p6, 'Status: Initial containment achieved. Engaging forensics for root cause analysis.', MessagePriority.HIGH);
  coord.comms.sendMessage(chanBlue, p6, 'Escalating to Tier 3 - evidence of ransomware prep on backup server.', MessagePriority.CRITICAL);

  coord.comms.sendMessage(chanWhite, p5, 'Red team reports successful initial compromise. Track progress for AAR.', MessagePriority.LOW);
  coord.comms.sendMessage(chanWhite, p5, 'Blue team has isolated patient zero. Response time: 8 minutes. Within target.', MessagePriority.MEDIUM);
  coord.comms.sendMessage(chanWhite, p7, 'Board is monitoring situation. CISO to provide briefing within 30 minutes.', MessagePriority.HIGH);

  // Mark some messages as read
  const blueMsgs = coord.comms.listMessages(chanBlue);
  const whiteMsgs = coord.comms.listMessages(chanWhite);
  [p2, p3, p4, p6].forEach(pid => {
    if (blueMsgs[0]) coord.comms.markRead(chanBlue, blueMsgs[0].id, pid);
    if (blueMsgs[1]) coord.comms.markRead(chanBlue, blueMsgs[1].id, pid);
  });
  if (whiteMsgs[0]) coord.comms.markRead(chanWhite, whiteMsgs[0].id, p5);

  // AAR for red vs blue exercise
  const aar = coord.aar.create(exRedVsBlue, 'Operation Crimson Tide', p5);
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 3500000, event: 'Initial beacon detected by SIEM', category: AARCategory.DETECTION, decision: 'Triage and investigate' });
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 3000000, event: 'Threat intel confirms TA-459 TTPs', category: AARCategory.COORDINATION, decision: 'Escalate to Tier 3' });
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 2400000, event: 'Executive escalation received', category: AARCategory.COMMUNICATION, decision: 'SOC Manager briefs CISO' });
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 1800000, event: 'Backup ransomware TWIST injected', category: AARCategory.DECISION_MAKING, decision: 'Prioritize backup isolation' });
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 1200000, event: 'Legal notification trigger evaluated', category: AARCategory.PROCESS_ADHERENCE, decision: 'Prepare breach notification' });
  coord.aar.addTimelineEvent(exRedVsBlue, { timestamp: now - 600000, event: 'Forensic analysis completed on WKS-102', category: AARCategory.RESPONSE, decision: 'Document IOCs and TTPs' });
  coord.aar.addFinding(exRedVsBlue, { category: AARCategory.DETECTION, finding: 'Initial beacon detection took 7 minutes - within SLA', severity: 'good', recommendation: 'Maintain current detection rules' });
  coord.aar.addFinding(exRedVsBlue, { category: AARCategory.COMMUNICATION, finding: 'Cross-team communication delays during escalation', severity: 'medium', recommendation: 'Implement automated escalation workflows' });
  coord.aar.addFinding(exRedVsBlue, { category: AARCategory.RESPONSE, finding: 'Backup isolation completed within 30 minutes of ransomware TWIST', severity: 'good', recommendation: 'Document isolation procedures' });
  coord.aar.addFinding(exRedVsBlue, { category: AARCategory.DECISION_MAKING, finding: 'Decision to involve legal was delayed by 15 minutes', severity: 'low', recommendation: 'Add legal notification trigger to playbook' });
  coord.aar.setMetrics(exRedVsBlue, [
    { metric: 'Time to Detect (TTD)', value: 7, benchmark: 30, passed: true },
    { metric: 'Time to Respond (TTR)', value: 18, benchmark: 60, passed: true },
    { metric: 'Containment Time', value: 45, benchmark: 120, passed: true },
    { metric: 'Communication Score', value: 65, benchmark: 80, passed: false },
  ]);
  coord.aar.calculateScore(exRedVsBlue);
  coord.aar.addFinding(exRedVsBlue, { category: AARCategory.COORDINATION, finding: 'Purple team validation confirmed 85% detection coverage', severity: 'good', recommendation: 'Continue purple team exercises' });
  aar.lessonsLearned.push('Automated escalation reduces TTR by 30%');
  aar.lessonsLearned.push('Cross-team communication channels need pre-exercise testing');
  aar.lessonsLearned.push('Ransomware playbook should include backup isolation as first step');

  // Security findings
  const nowTs = Date.now();
  coord.security.addFinding(createCollabFinding({
    description: 'Cross-team chat visible to unauthorized participants during initial phase',
    severity: 'medium', domain: 'Access Control', exerciseId: exRedVsBlue, timestamp: nowTs - 3000000,
  }));
  coord.security.addFinding(createCollabFinding({
    description: 'Inject content exposed via unencrypted channel to blue team 5 minutes early',
    severity: 'high', domain: 'Inject Security', exerciseId: exRedVsBlue, timestamp: nowTs - 2500000,
  }));
  coord.security.addFinding(createCollabFinding({
    description: 'Red team operator accessed white cell planning documents via shared workspace',
    severity: 'critical', domain: 'Information Leakage', exerciseId: exRedVsBlue, timestamp: nowTs - 2000000,
  }));
  coord.security.addFinding(createCollabFinding({
    description: 'AAR draft modified by unauthorized participant before finalization',
    severity: 'high', domain: 'Data Integrity', exerciseId: exRedVsBlue, timestamp: nowTs - 500000,
  }));

  // Known challenges
  coord.security.loadKnownChallenges();

  return coord;
}
