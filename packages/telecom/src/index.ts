import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type TelecomNetworkFunctionId = string & { readonly __brand: unique symbol };
export const telecomNetworkFunctionId = (): TelecomNetworkFunctionId => uid() as unknown as TelecomNetworkFunctionId;

export type TelecomRanNodeId = string & { readonly __brand: unique symbol };
export const telecomRanNodeId = (): TelecomRanNodeId => uid() as unknown as TelecomRanNodeId;

export type TelecomImsSessionId = string & { readonly __brand: unique symbol };
export const telecomImsSessionId = (): TelecomImsSessionId => uid() as unknown as TelecomImsSessionId;

export type TelecomSignalingMessageId = string & { readonly __brand: unique symbol };
export const telecomSignalingMessageId = (): TelecomSignalingMessageId => uid() as unknown as TelecomSignalingMessageId;

export type TelecomSubscriberId = string & { readonly __brand: unique symbol };
export const telecomSubscriberId = (): TelecomSubscriberId => uid() as unknown as TelecomSubscriberId;

export type TelecomSliceId = string & { readonly __brand: unique symbol };
export const telecomSliceId = (): TelecomSliceId => uid() as unknown as TelecomSliceId;

export type TelecomSecurityFindingId = string & { readonly __brand: unique symbol };
export const telecomSecurityFindingId = (): TelecomSecurityFindingId => uid() as unknown as TelecomSecurityFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum NetworkFunctionType {
  AMF = 'AMF',
  SMF = 'SMF',
  UPF = 'UPF',
  UDM = 'UDM',
  AUSF = 'AUSF',
  PCF = 'PCF',
  NRF = 'NRF',
  NSSF = 'NSSF',
  NEF = 'NEF',
  SEPP = 'SEPP',
  MME = 'MME',
  SGW = 'SGW',
  PGW = 'PGW',
  HSS = 'HSS',
  PCRF = 'PCRF',
}

export enum RanNodeType {
  GNB_CU = 'GNB_CU',
  GNB_DU = 'GNB_DU',
  GNB_RU = 'GNB_RU',
  ENB = 'ENB',
  O_RAN_CU = 'O_RAN_CU',
  O_RAN_DU = 'O_RAN_DU',
  O_RAN_RU = 'O_RAN_RU',
}

export enum RanTechnology {
  NR = 'NR',
  LTE = 'LTE',
  NR_NR_DC = 'NR_NR_DC',
  EN_DC = 'EN_DC',
  NE_DC = 'NE_DC',
}

export enum SignalingProtocol {
  SS7_MAP = 'SS7_MAP',
  SS7_ISUP = 'SS7_ISUP',
  SS7_SCCP = 'SS7_SCCP',
  SS7_TCAP = 'SS7_TCAP',
  DIAMETER_S6A = 'DIAMETER_S6A',
  DIAMETER_GX = 'DIAMETER_GX',
  DIAMETER_GY = 'DIAMETER_GY',
  DIAMETER_RX = 'DIAMETER_RX',
  GTP_C = 'GTP_C',
  GTP_U = 'GTP_U',
}

export enum ImsNodeType {
  P_CSCF = 'P_CSCF',
  S_CSCF = 'S_CSCF',
  I_CSCF = 'I_CSCF',
  TAS = 'TAS',
  MRF = 'MRF',
  MGCF = 'MGCF',
  IBCF = 'IBCF',
}

export enum TelecomSecurityFindingSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TelecomAttackType {
  SS7_IMSI_CAPTURE = 'SS7_IMSI_CAPTURE',
  SS7_SMS_INTERCEPT = 'SS7_SMS_INTERCEPT',
  SS7_REDIRECT = 'SS7_REDIRECT',
  DIAMETER_CHARGING_FRAUD = 'DIAMETER_CHARGING_FRAUD',
  GTP_U_REFLECTION = 'GTP_U_REFLECTION',
  IMSI_CATCHER = 'IMSI_CATCHER',
  FAKE_GNB = 'FAKE_GNB',
  NETWORK_SLICE_BYPASS = 'NETWORK_SLICE_BYPASS',
  O_RAN_E2_INJECTION = 'O_RAN_E2_INJECTION',
  SIP_REGISTRATION_HIJACK = 'SIP_REGISTRATION_HIJACK',
  SIP_SESSION_TAMPERING = 'SIP_SESSION_TAMPERING',
  N32_INTERCONNECT_BREACH = 'N32_INTERCONNECT_BREACH',
  ROAMING_STEERING_FRAUD = 'ROAMING_STEERING_FRAUD',
  SIGNALING_STORM = 'SIGNALING_STORM',
}

export enum NetworkSliceType {
  ENHANCED_MOBILE_BROADBAND = 'ENHANCED_MOBILE_BROADBAND',
  ULTRA_RELIABLE_LOW_LATENCY = 'ULTRA_RELIABLE_LOW_LATENCY',
  MASSIVE_IOT = 'MASSIVE_IOT',
  V2X = 'V2X',
  MISSION_CRITICAL = 'MISSION_CRITICAL',
}

export enum NfStatus {
  ACTIVE = 'ACTIVE',
  DEGRADED = 'DEGRADED',
  OFFLINE = 'OFFLINE',
  COMPROMISED = 'COMPROMISED',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface NetworkFunctionInstance {
  id: TelecomNetworkFunctionId;
  type: NetworkFunctionType;
  vendor: string;
  version: string;
  status: NfStatus;
  region: string;
  lastHeartbeat: number;
  cpuUtilization: number;
  memoryUtilization: number;
  connectedFunctions: TelecomNetworkFunctionId[];
}

export interface RanNodeInstance {
  id: TelecomRanNodeId;
  type: RanNodeType;
  technology: RanTechnology;
  cells: { cellId: string; frequency: string; band: string; bandwidth: number; coverage: number; active: boolean }[];
  status: NfStatus;
  connectedTo: TelecomNetworkFunctionId[];
  supportedBands: string[];
  oRanVersion?: string;
  cpuUtilization: number;
  userLoad: number;
}

export interface ImsSessionInstance {
  id: TelecomImsSessionId;
  callingParty: string;
  calledParty: string;
  callId: string;
  sessionState: string;
  nodesInvolved: string[];
  startTime: number;
  endTime?: number;
  encrypted: boolean;
  mediaType: string;
}

export interface SignalingMessageInstance {
  id: TelecomSignalingMessageId;
  protocol: SignalingProtocol;
  source: string;
  destination: string;
  messageType: string;
  payloadSize: number;
  timestamp: number;
  integrity: string;
  inspectedByFirewall: boolean;
  securityAction?: string;
}

export interface SubscriberInstance {
  id: TelecomSubscriberId;
  imsi: string;
  msisdn: string;
  servingNode: TelecomNetworkFunctionId;
  currentRan?: TelecomRanNodeId;
  registered: boolean;
  roaming: boolean;
  homeNetwork: string;
  visitedNetwork?: string;
  slices: TelecomSliceId[];
  authenticationVector?: { rand: string; autn: string; xres: string; kasme: string };
  lastActivity: number;
}

export interface NetworkSliceInstance {
  id: TelecomSliceId;
  type: NetworkSliceType;
  sst: number;
  sd: string;
  status: NfStatus;
  allocatedBandwidth: number;
  utilizedBandwidth: number;
  latency: number;
  isolationLevel: string;
}

export interface TelecomSecurityFinding {
  id: TelecomSecurityFindingId;
  type: TelecomAttackType;
  severity: TelecomSecurityFindingSeverity;
  description: string;
  affectedComponent: string;
  timestamp: number;
  mitigated: boolean;
  mitreTechniqueId?: string;
  attackScenario?: {
    name: string;
    description: string;
    cve?: string;
    affectedVendors?: string[];
  };
}

export interface TelecomAttackScenario {
  name: string;
  description: string;
  cve?: string;
  affectedVendors?: string[];
}

// ─── Factory Functions ──────────────────────────────────────────
export function createNetworkFunction(overrides?: Partial<NetworkFunctionInstance>): NetworkFunctionInstance {
  return {
    id: telecomNetworkFunctionId(),
    type: NetworkFunctionType.AMF,
    vendor: 'Ericsson',
    version: '23.01',
    status: NfStatus.ACTIVE,
    region: 'us-east-1',
    lastHeartbeat: Date.now(),
    cpuUtilization: 35,
    memoryUtilization: 45,
    connectedFunctions: [],
    ...overrides,
  };
}

export function createRanNode(overrides?: Partial<RanNodeInstance>): RanNodeInstance {
  return {
    id: telecomRanNodeId(),
    type: RanNodeType.GNB_CU,
    technology: RanTechnology.NR,
    cells: [],
    status: NfStatus.ACTIVE,
    connectedTo: [],
    supportedBands: ['n78'],
    cpuUtilization: 20,
    userLoad: 30,
    ...overrides,
  };
}

export function createImsSession(overrides?: Partial<ImsSessionInstance>): ImsSessionInstance {
  return {
    id: telecomImsSessionId(),
    callingParty: 'tel:+12065551234',
    calledParty: 'tel:+12065555678',
    callId: 'call-001',
    sessionState: 'INITIATING',
    nodesInvolved: ['P-CSCF', 'S-CSCF'],
    startTime: Date.now(),
    encrypted: true,
    mediaType: 'AUDIO',
    ...overrides,
  };
}

export function createSignalingMessage(overrides?: Partial<SignalingMessageInstance>): SignalingMessageInstance {
  return {
    id: telecomSignalingMessageId(),
    protocol: SignalingProtocol.SS7_MAP,
    source: 'MME-01',
    destination: 'HSS-01',
    messageType: 'UpdateLocation',
    payloadSize: 256,
    timestamp: Date.now(),
    integrity: 'VALID',
    inspectedByFirewall: true,
    ...overrides,
  };
}

export function createSubscriber(overrides?: Partial<SubscriberInstance>): SubscriberInstance {
  return {
    id: telecomSubscriberId(),
    imsi: '310150123456789',
    msisdn: '+12065551234',
    servingNode: '' as TelecomNetworkFunctionId,
    registered: true,
    roaming: false,
    homeNetwork: '310150',
    slices: [],
    lastActivity: Date.now(),
    ...overrides,
  };
}

export function createNetworkSlice(overrides?: Partial<NetworkSliceInstance>): NetworkSliceInstance {
  return {
    id: telecomSliceId(),
    type: NetworkSliceType.ENHANCED_MOBILE_BROADBAND,
    sst: 1,
    sd: '000001',
    status: NfStatus.ACTIVE,
    allocatedBandwidth: 1000000,
    utilizedBandwidth: 450000,
    latency: 20,
    isolationLevel: 'LOGICAL',
    ...overrides,
  };
}

export function createTelecomSecurityFinding(overrides?: Partial<TelecomSecurityFinding>): TelecomSecurityFinding {
  return {
    id: telecomSecurityFindingId(),
    type: TelecomAttackType.SS7_IMSI_CAPTURE,
    severity: TelecomSecurityFindingSeverity.HIGH,
    description: 'SS7 IMSI capture detected',
    affectedComponent: 'STP-01',
    timestamp: Date.now(),
    mitigated: false,
    ...overrides,
  };
}

export function getKnownTelecomAttacks(): TelecomAttackScenario[] {
  return [
    {
      name: 'SS7 IMSI Capture and Location Tracking',
      description: 'Attackers query SS7 network (MAP SendAuthenticationInfo) to capture subscriber IMSI and track device location in real time',
      cve: 'CVE-2018-10663',
      affectedVendors: ['Ericsson', 'Nokia', 'Huawei', 'ZTE'],
    },
    {
      name: 'SS7 SMS Interception',
      description: 'Malicious party intercepts SMS messages by injecting forged MAP messages (ForwardSM, MT-ForwardSM) into the SS7 network',
      cve: 'CVE-2017-7365',
      affectedVendors: ['Ericsson', 'Nokia', 'Huawei'],
    },
    {
      name: 'SS7 Call Redirection',
      description: 'Attackers issue MAP UpdateLocation or InsertSubscriberData to redirect calls to attacker-controlled numbers',
      cve: 'CVE-2018-10664',
      affectedVendors: ['Ericsson', 'Nokia', 'Huawei', 'ZTE'],
    },
    {
      name: 'Diameter Credit Control Fraud',
      description: 'Diameter Gy interface manipulation to bypass credit control, enabling free data usage or monetary fraud',
      cve: 'CVE-2023-24682',
      affectedVendors: ['Ericsson', 'Nokia', 'Oracle'],
    },
    {
      name: 'GTP-U Reflection DDoS',
      description: 'Amplification DDoS using GTP-U tunnel endpoints to reflect traffic toward a target, achieving 40x+ amplification',
      cve: 'CVE-2021-25401',
      affectedVendors: ['Ericsson', 'Nokia', 'Samsung', 'Affirmed'],
    },
    {
      name: 'IMSI Catcher / Fake Base Station',
      description: 'Rogue base station (IMSI catcher) forces handsets to attach, capturing IMSI, encryption keys, and enabling MitM',
      cve: 'CVE-2019-16271',
      affectedVendors: ['All vendors (protocol-level vulnerability)'],
    },
    {
      name: 'Fake gNB / Rogue Base Station (5G NR)',
      description: 'Fake gNB exploits missing gNB authentication in initial attach to trick UEs into connecting to attacker-controlled infrastructure',
      cve: 'CVE-2023-35803',
      affectedVendors: ['Ericsson', 'Nokia', 'Samsung', 'Mavenir'],
    },
    {
      name: 'Network Slice Bypass / Lateral Movement',
      description: 'Compromised network slice tenant pivots to other slices via misconfigured NSSF or NSSF/AMF interconnection',
      cve: 'CVE-2024-12456',
      affectedVendors: ['Ericsson', 'Nokia', 'Affirmed'],
    },
    {
      name: 'O-RAN E2 Interface Injection',
      description: 'Injected messages into O-RAN E2 interface compromise near-real-time RIC control, enabling gNB parameter manipulation',
      cve: 'CVE-2024-23457',
      affectedVendors: ['Samsung', 'Mavenir', 'Rakuten', 'Fujitsu'],
    },
    {
      name: 'SIP Registration Hijacking',
      description: 'Attacker forges SIP REGISTER messages to hijack a subscriber\'s VoIP/IMS identity, enabling call/SMS interception',
      cve: 'CVE-2021-34149',
      affectedVendors: ['Ericsson', 'Nokia', 'Oracle', 'Metaswitch'],
    },
    {
      name: 'N32 Interconnect Security Breach',
      description: 'Roaming security breach via N32 interface between PLMNs - SEPP misconfiguration allows injection of forged signaling messages',
      cve: 'CVE-2024-12097',
      affectedVendors: ['Ericsson', 'Nokia', 'Huawei'],
    },
    {
      name: 'Signaling Storm / DoS on HSS/HLR',
      description: 'Massive volume of signaling messages (MAP/Diameter) floods HSS/HLR, causing network-wide service degradation',
      cve: 'CVE-2022-29552',
      affectedVendors: ['Ericsson', 'Nokia', 'Huawei', 'ZTE', 'Oracle'],
    },
  ];
}

// ─── NetworkFunctionManager ──────────────────────────────────────
export class NetworkFunctionManager {
  private functions: Map<string, NetworkFunctionInstance> = new Map();

  deploy(config?: Partial<NetworkFunctionInstance>): TelecomNetworkFunctionId {
    const nf = createNetworkFunction(config);
    this.functions.set(nf.id, nf);
    return nf.id;
  }

  get(id: TelecomNetworkFunctionId): NetworkFunctionInstance | undefined {
    return this.functions.get(id);
  }

  remove(id: TelecomNetworkFunctionId): boolean {
    return this.functions.delete(id);
  }

  list(filter?: Partial<NetworkFunctionInstance>): NetworkFunctionInstance[] {
    let result = Array.from(this.functions.values());
    if (filter) {
      if (filter.type) result = result.filter(nf => nf.type === filter.type);
      if (filter.status) result = result.filter(nf => nf.status === filter.status);
      if (filter.region) result = result.filter(nf => nf.region === filter.region);
      if (filter.vendor) result = result.filter(nf => nf.vendor === filter.vendor);
    }
    return result;
  }

  listByType(type: NetworkFunctionType): NetworkFunctionInstance[] {
    return this.list().filter(nf => nf.type === type);
  }

  listByStatus(status: NfStatus): NetworkFunctionInstance[] {
    return this.list().filter(nf => nf.status === status);
  }

  listByRegion(region: string): NetworkFunctionInstance[] {
    return this.list().filter(nf => nf.region === region);
  }

  connect(nf1Id: TelecomNetworkFunctionId, nf2Id: TelecomNetworkFunctionId): boolean {
    const nf1 = this.functions.get(nf1Id);
    const nf2 = this.functions.get(nf2Id);
    if (!nf1 || !nf2) return false;
    if (!nf1.connectedFunctions.includes(nf2Id)) nf1.connectedFunctions.push(nf2Id);
    if (!nf2.connectedFunctions.includes(nf1Id)) nf2.connectedFunctions.push(nf1Id);
    return true;
  }

  disconnect(nf1Id: TelecomNetworkFunctionId, nf2Id: TelecomNetworkFunctionId): boolean {
    const nf1 = this.functions.get(nf1Id);
    const nf2 = this.functions.get(nf2Id);
    if (!nf1 || !nf2) return false;
    nf1.connectedFunctions = nf1.connectedFunctions.filter(id => id !== nf2Id);
    nf2.connectedFunctions = nf2.connectedFunctions.filter(id => id !== nf1Id);
    return true;
  }

  updateStatus(id: TelecomNetworkFunctionId, status: NfStatus): boolean {
    const nf = this.functions.get(id);
    if (!nf) return false;
    nf.status = status;
    return true;
  }

  updateHeartbeat(id: TelecomNetworkFunctionId): void {
    const nf = this.functions.get(id);
    if (nf) nf.lastHeartbeat = Date.now();
  }

  getStats(): { total: number; byType: Record<string, number>; byStatus: Record<string, number>; byRegion: Record<string, number> } {
    const all = this.list();
    const total = all.length;
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    for (const nf of all) {
      byType[nf.type] = (byType[nf.type] || 0) + 1;
      byStatus[nf.status] = (byStatus[nf.status] || 0) + 1;
      byRegion[nf.region] = (byRegion[nf.region] || 0) + 1;
    }
    return { total, byType, byStatus, byRegion };
  }
}

// ─── RanManager ──────────────────────────────────────────────────
export class RanManager {
  private nodes: Map<string, RanNodeInstance> = new Map();

  deploy(config?: Partial<RanNodeInstance>): TelecomRanNodeId {
    const node = createRanNode(config);
    this.nodes.set(node.id, node);
    return node.id;
  }

  get(id: TelecomRanNodeId): RanNodeInstance | undefined {
    return this.nodes.get(id);
  }

  remove(id: TelecomRanNodeId): boolean {
    return this.nodes.delete(id);
  }

  list(filter?: Partial<RanNodeInstance>): RanNodeInstance[] {
    let result = Array.from(this.nodes.values());
    if (filter) {
      if (filter.type) result = result.filter(n => n.type === filter.type);
      if (filter.technology) result = result.filter(n => n.technology === filter.technology);
      if (filter.status) result = result.filter(n => n.status === filter.status);
    }
    return result;
  }

  listByType(type: RanNodeType): RanNodeInstance[] {
    return this.list().filter(n => n.type === type);
  }

  listByTechnology(tech: RanTechnology): RanNodeInstance[] {
    return this.list().filter(n => n.technology === tech);
  }

  listByStatus(status: NfStatus): RanNodeInstance[] {
    return this.list().filter(n => n.status === status);
  }

  addCell(ranId: TelecomRanNodeId, cellConfig: { cellId: string; frequency: string; band: string; bandwidth: number; coverage: number; active: boolean }): boolean {
    const node = this.nodes.get(ranId);
    if (!node) return false;
    node.cells.push({ ...cellConfig });
    return true;
  }

  removeCell(ranId: TelecomRanNodeId, cellId: string): boolean {
    const node = this.nodes.get(ranId);
    if (!node) return false;
    const idx = node.cells.findIndex(c => c.cellId === cellId);
    if (idx === -1) return false;
    node.cells.splice(idx, 1);
    return true;
  }

  connectToNf(ranId: TelecomRanNodeId, nfId: TelecomNetworkFunctionId): boolean {
    const node = this.nodes.get(ranId);
    if (!node) return false;
    if (!node.connectedTo.includes(nfId)) node.connectedTo.push(nfId);
    return true;
  }

  updateLoad(ranId: TelecomRanNodeId, load: number): boolean {
    const node = this.nodes.get(ranId);
    if (!node) return false;
    node.userLoad = Math.max(0, Math.min(100, load));
    return true;
  }

  setCellActive(ranId: TelecomRanNodeId, cellId: string, active: boolean): boolean {
    const node = this.nodes.get(ranId);
    if (!node) return false;
    const cell = node.cells.find(c => c.cellId === cellId);
    if (!cell) return false;
    cell.active = active;
    return true;
  }

  getStats(): { total: number; byType: Record<string, number>; byTechnology: Record<string, number>; byStatus: Record<string, number>; totalCells: number; activeCells: number } {
    const all = this.list();
    const total = all.length;
    const byType: Record<string, number> = {};
    const byTechnology: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalCells = 0;
    let activeCells = 0;
    for (const n of all) {
      byType[n.type] = (byType[n.type] || 0) + 1;
      byTechnology[n.technology] = (byTechnology[n.technology] || 0) + 1;
      byStatus[n.status] = (byStatus[n.status] || 0) + 1;
      totalCells += n.cells.length;
      activeCells += n.cells.filter(c => c.active).length;
    }
    return { total, byType, byTechnology, byStatus, totalCells, activeCells };
  }
}

// ─── ImsManager ──────────────────────────────────────────────────
export class ImsManager {
  private sessions: Map<string, ImsSessionInstance> = new Map();

  createSession(config?: Partial<ImsSessionInstance>): TelecomImsSessionId {
    const session = createImsSession(config);
    this.sessions.set(session.id, session);
    return session.id;
  }

  getSession(id: TelecomImsSessionId): ImsSessionInstance | undefined {
    return this.sessions.get(id);
  }

  listSessions(filter?: Partial<ImsSessionInstance>): ImsSessionInstance[] {
    let result = Array.from(this.sessions.values());
    if (filter) {
      if (filter.sessionState) result = result.filter(s => s.sessionState === filter.sessionState);
      if (filter.mediaType) result = result.filter(s => s.mediaType === filter.mediaType);
    }
    return result;
  }

  updateSessionState(id: TelecomImsSessionId, state: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    session.sessionState = state;
    return true;
  }

  terminateSession(id: TelecomImsSessionId): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    session.sessionState = 'TERMINATED';
    session.endTime = Date.now();
    return true;
  }

  getActiveSessionCount(): number {
    return this.listSessions().filter(s => s.sessionState !== 'TERMINATED').length;
  }

  getStats(): { total: number; active: number; byState: Record<string, number>; byMediaType: Record<string, number> } {
    const all = this.listSessions();
    const total = all.length;
    const active = all.filter(s => s.sessionState !== 'TERMINATED').length;
    const byState: Record<string, number> = {};
    const byMediaType: Record<string, number> = {};
    for (const s of all) {
      byState[s.sessionState] = (byState[s.sessionState] || 0) + 1;
      byMediaType[s.mediaType] = (byMediaType[s.mediaType] || 0) + 1;
    }
    return { total, active, byState, byMediaType };
  }
}

// ─── SignalingManager ────────────────────────────────────────────
export class SignalingManager {
  private messages: Map<string, SignalingMessageInstance> = new Map();
  private blockedCount = 0;
  private tamperedCount = 0;

  sendMessage(config?: Partial<SignalingMessageInstance>): TelecomSignalingMessageId {
    const msg = createSignalingMessage(config);
    this.messages.set(msg.id, msg);
    if (msg.securityAction === 'BLOCK') this.blockedCount++;
    if (msg.integrity !== 'VALID') this.tamperedCount++;
    return msg.id;
  }

  getMessage(id: TelecomSignalingMessageId): SignalingMessageInstance | undefined {
    return this.messages.get(id);
  }

  listMessages(filter?: Partial<SignalingMessageInstance>): SignalingMessageInstance[] {
    let result = Array.from(this.messages.values());
    if (filter) {
      if (filter.protocol) result = result.filter(m => m.protocol === filter.protocol);
      if (filter.integrity) result = result.filter(m => m.integrity === filter.integrity);
      if (filter.source) result = result.filter(m => m.source === filter.source);
    }
    return result;
  }

  listByProtocol(protocol: SignalingProtocol): SignalingMessageInstance[] {
    return this.listMessages().filter(m => m.protocol === protocol);
  }

  listByIntegrity(integrity: string): SignalingMessageInstance[] {
    return this.listMessages().filter(m => m.integrity === integrity);
  }

  getStats(): { total: number; byProtocol: Record<string, number>; byIntegrity: Record<string, number>; blockedCount: number; tamperedCount: number } {
    const all = this.listMessages();
    const total = all.length;
    const byProtocol: Record<string, number> = {};
    const byIntegrity: Record<string, number> = {};
    for (const m of all) {
      byProtocol[m.protocol] = (byProtocol[m.protocol] || 0) + 1;
      byIntegrity[m.integrity] = (byIntegrity[m.integrity] || 0) + 1;
    }
    return { total, byProtocol, byIntegrity, blockedCount: this.blockedCount, tamperedCount: this.tamperedCount };
  }
}

// ─── TelecomSecurityManager ──────────────────────────────────────
export class TelecomSecurityManager {
  private findings: Map<string, TelecomSecurityFinding> = new Map();
  private attacks: TelecomAttackScenario[] = [];

  addFinding(overrides?: Partial<TelecomSecurityFinding>): TelecomSecurityFindingId {
    const finding = createTelecomSecurityFinding(overrides);
    this.findings.set(finding.id, finding);
    return finding.id;
  }

  getFinding(id: TelecomSecurityFindingId): TelecomSecurityFinding | undefined {
    return this.findings.get(id);
  }

  listFindings(filter?: Partial<TelecomSecurityFinding>): TelecomSecurityFinding[] {
    let result = Array.from(this.findings.values());
    if (filter) {
      if (filter.severity) result = result.filter(f => f.severity === filter.severity);
      if (filter.type) result = result.filter(f => f.type === filter.type);
      if (filter.mitigated !== undefined) result = result.filter(f => f.mitigated === filter.mitigated);
    }
    return result;
  }

  listBySeverity(severity: TelecomSecurityFindingSeverity): TelecomSecurityFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }

  listByType(type: TelecomAttackType): TelecomSecurityFinding[] {
    return this.listFindings().filter(f => f.type === type);
  }

  mitigateFinding(id: TelecomSecurityFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.mitigated = true;
    return true;
  }

  getStats(): { total: number; active: number; bySeverity: Record<string, number>; byType: Record<string, number> } {
    const all = this.listFindings();
    const total = all.length;
    const active = all.filter(f => !f.mitigated).length;
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    for (const f of all) {
      bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
      byType[f.type] = (byType[f.type] || 0) + 1;
    }
    return { total, active, bySeverity, byType };
  }

  loadKnownAttacks(): void { this.attacks = getKnownTelecomAttacks(); }
  getKnownAttacks(): TelecomAttackScenario[] { return this.attacks; }
}

// ─── TelecomCoordinator ──────────────────────────────────────────
export class TelecomCoordinator {
  readonly networkFunctions: NetworkFunctionManager;
  readonly ran: RanManager;
  readonly ims: ImsManager;
  readonly signaling: SignalingManager;
  readonly security: TelecomSecurityManager;
  readonly subscribers: Map<TelecomSubscriberId, SubscriberInstance>;
  readonly slices: Map<TelecomSliceId, NetworkSliceInstance>;

  constructor() {
    this.networkFunctions = new NetworkFunctionManager();
    this.ran = new RanManager();
    this.ims = new ImsManager();
    this.signaling = new SignalingManager();
    this.security = new TelecomSecurityManager();
    this.subscribers = new Map();
    this.slices = new Map();
  }

  addSubscriber(config?: Partial<SubscriberInstance>): TelecomSubscriberId {
    const sub = createSubscriber(config);
    this.subscribers.set(sub.id, sub);
    return sub.id;
  }

  addSlice(config?: Partial<NetworkSliceInstance>): TelecomSliceId {
    const slice = createNetworkSlice(config);
    this.slices.set(slice.id, slice);
    return slice.id;
  }

  getSubscriber(id: TelecomSubscriberId): SubscriberInstance | undefined {
    return this.subscribers.get(id);
  }

  getSlice(id: TelecomSliceId): NetworkSliceInstance | undefined {
    return this.slices.get(id);
  }

  getStats(): {
    nfCount: number; ranCount: number; imsTotal: number; imsActive: number;
    signalingTotal: number; signalingBlocked: number; signalingTampered: number;
    findingCount: number; activeFindingCount: number;
    subscriberCount: number; sliceCount: number;
  } {
    const nfStats = this.networkFunctions.getStats();
    const ranStats = this.ran.getStats();
    const imsStats = this.ims.getStats();
    const sigStats = this.signaling.getStats();
    const secStats = this.security.getStats();
    return {
      nfCount: nfStats.total,
      ranCount: ranStats.total,
      imsTotal: imsStats.total,
      imsActive: imsStats.active,
      signalingTotal: sigStats.total,
      signalingBlocked: sigStats.blockedCount,
      signalingTampered: sigStats.tamperedCount,
      findingCount: secStats.total,
      activeFindingCount: secStats.active,
      subscriberCount: this.subscribers.size,
      sliceCount: this.slices.size,
    };
  }

  reset(): void {
    this.subscribers.clear();
    this.slices.clear();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultTelecomEnvironment(): TelecomCoordinator {
  const coord = new TelecomCoordinator();

  // Network Functions (10)
  const nfAmf = coord.networkFunctions.deploy({ type: NetworkFunctionType.AMF, vendor: 'Ericsson', version: '23.01', region: 'us-east-1' });
  const nfSmf = coord.networkFunctions.deploy({ type: NetworkFunctionType.SMF, vendor: 'Nokia', version: '22.11', region: 'us-east-1' });
  const nfUpf1 = coord.networkFunctions.deploy({ type: NetworkFunctionType.UPF, vendor: 'Ericsson', version: '23.01', region: 'us-east-1' });
  const nfUpf2 = coord.networkFunctions.deploy({ type: NetworkFunctionType.UPF, vendor: 'Ericsson', version: '23.01', region: 'eu-west-1' });
  const nfUdm = coord.networkFunctions.deploy({ type: NetworkFunctionType.UDM, vendor: 'Nokia', version: '22.11', region: 'us-east-1' });
  const nfAusf = coord.networkFunctions.deploy({ type: NetworkFunctionType.AUSF, vendor: 'Ericsson', version: '23.01', region: 'us-east-1' });
  const nfPcf = coord.networkFunctions.deploy({ type: NetworkFunctionType.PCF, vendor: 'Nokia', version: '22.11', region: 'eu-west-1' });
  const nfNrf = coord.networkFunctions.deploy({ type: NetworkFunctionType.NRF, vendor: 'Ericsson', version: '23.01', region: 'us-east-1' });
  const nfNssf = coord.networkFunctions.deploy({ type: NetworkFunctionType.NSSF, vendor: 'Nokia', version: '22.11', region: 'us-east-1' });
  const nfSepp = coord.networkFunctions.deploy({ type: NetworkFunctionType.SEPP, vendor: 'Ericsson', version: '23.01', region: 'eu-west-1' });

  // Connect NFs
  coord.networkFunctions.connect(nfAmf, nfSmf);
  coord.networkFunctions.connect(nfAmf, nfUpf1);
  coord.networkFunctions.connect(nfAmf, nfUdm);
  coord.networkFunctions.connect(nfAmf, nfAusf);
  coord.networkFunctions.connect(nfSmf, nfUpf1);
  coord.networkFunctions.connect(nfSmf, nfPcf);
  coord.networkFunctions.connect(nfSmf, nfNrf);
  coord.networkFunctions.connect(nfNrf, nfNssf);

  // RAN Nodes (3)
  const ranCu = coord.ran.deploy({ type: RanNodeType.GNB_CU, technology: RanTechnology.NR, supportedBands: ['n78', 'n79'], cpuUtilization: 35, userLoad: 55 });
  const ranDu = coord.ran.deploy({ type: RanNodeType.GNB_DU, technology: RanTechnology.NR, supportedBands: ['n78'], cpuUtilization: 60, userLoad: 70 });
  const ranEnb = coord.ran.deploy({ type: RanNodeType.ENB, technology: RanTechnology.LTE, supportedBands: ['B1', 'B3', 'B7'], cpuUtilization: 25, userLoad: 40 });

  // Add cells
  coord.ran.addCell(ranCu, { cellId: 'cell-001', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 500, active: true });
  coord.ran.addCell(ranCu, { cellId: 'cell-002', frequency: '4700', band: 'n79', bandwidth: 100, coverage: 300, active: true });
  coord.ran.addCell(ranDu, { cellId: 'cell-003', frequency: '3500', band: 'n78', bandwidth: 100, coverage: 200, active: true });
  coord.ran.addCell(ranEnb, { cellId: 'cell-004', frequency: '2100', band: 'B1', bandwidth: 20, coverage: 1000, active: true });
  coord.ran.addCell(ranEnb, { cellId: 'cell-005', frequency: '1800', band: 'B3', bandwidth: 20, coverage: 800, active: false });

  // Connect RAN to NFs
  coord.ran.connectToNf(ranCu, nfAmf);
  coord.ran.connectToNf(ranDu, nfAmf);

  // IMS Sessions (3)
  const ims1 = coord.ims.createSession({
    callingParty: 'tel:+12065551234', calledParty: 'tel:+12065555678',
    callId: 'call-001', sessionState: 'ANSWERED', nodesInvolved: ['P-CSCF', 'S-CSCF', 'TAS'],
    mediaType: 'AUDIO', encrypted: true, startTime: Date.now() - 120000,
  });
  const ims2 = coord.ims.createSession({
    callingParty: 'tel:+12065555678', calledParty: 'tel:+12065559012',
    callId: 'call-002', sessionState: 'RINGING', nodesInvolved: ['P-CSCF', 'S-CSCF'],
    mediaType: 'VIDEO', encrypted: true, startTime: Date.now() - 30000,
  });
  const ims3 = coord.ims.createSession({
    callingParty: 'tel:+12065559012', calledParty: 'tel:+12065551234',
    callId: 'call-003', sessionState: 'TERMINATED', nodesInvolved: ['P-CSCF', 'S-CSCF', 'MGCF'],
    mediaType: 'AUDIO', encrypted: false, startTime: Date.now() - 600000, endTime: Date.now() - 590000,
  });

  // Signaling Messages (10)
  coord.signaling.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'MME-01', destination: 'HSS-01', messageType: 'UpdateLocation', payloadSize: 256, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'HSS-01', destination: 'MME-01', messageType: 'InsertSubscriberData', payloadSize: 384, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'VLR-01', destination: 'HLR-01', messageType: 'SendAuthInfo', payloadSize: 192, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'STP-01', destination: 'HLR-01', messageType: 'UpdateLocation', payloadSize: 256, integrity: 'SPOOFED', inspectedByFirewall: false, securityAction: 'BLOCK' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.SS7_MAP, source: 'STP-02', destination: 'HSS-01', messageType: 'CancelLocation', payloadSize: 128, integrity: 'TAMPERED', inspectedByFirewall: true, securityAction: 'ALERT' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.DIAMETER_S6A, source: 'MME-01', destination: 'HSS-01', messageType: 'Diameter-CCR', payloadSize: 512, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.DIAMETER_GX, source: 'PGW-01', destination: 'PCRF-01', messageType: 'Diameter-CCR', payloadSize: 640, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.DIAMETER_GY, source: 'OCS-01', destination: 'PGW-01', messageType: 'Diameter-CCA', payloadSize: 320, integrity: 'VALID', inspectedByFirewall: false, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.GTP_C, source: 'MME-01', destination: 'SGW-01', messageType: 'GTP-CreateSession', payloadSize: 448, integrity: 'VALID', inspectedByFirewall: true, securityAction: 'ALLOW' });
  coord.signaling.sendMessage({ protocol: SignalingProtocol.GTP_U, source: 'SGW-01', destination: 'PGW-01', messageType: 'GTP-ModifyBearer', payloadSize: 160, integrity: 'TAMPERED', inspectedByFirewall: true, securityAction: 'BLOCK' });

  // Subscribers (2)
  const subHome = coord.addSubscriber({
    imsi: '310150123456789', msisdn: '+12065551234',
    servingNode: nfAmf, currentRan: ranCu,
    registered: true, roaming: false, homeNetwork: '310150',
    authenticationVector: { rand: 'a1b2c3d4e5f6a7b8c9d0e1f2', autn: 'f1e2d3c4b5a69788', xres: '1234567890abcdef', kasme: 'abcdef1234567890abcdef1234567890' },
  });
  const subRoaming = coord.addSubscriber({
    imsi: '234501234567890', msisdn: '+447700900123',
    servingNode: nfAmf, currentRan: ranEnb,
    registered: true, roaming: true, homeNetwork: '23450', visitedNetwork: '310150',
    authenticationVector: { rand: 'b2c3d4e5f6a7b8c9d0e1f2a3', autn: 'g2h3i4j5k6l7m8n9', xres: 'abcdef0123456789', kasme: '9876543210fedcba9876543210fedcba' },
  });
  // Assign slices
  if (subHome) {
    const sliceE = coord.addSlice({ type: NetworkSliceType.ENHANCED_MOBILE_BROADBAND, sst: 1, sd: '000001', allocatedBandwidth: 1000000, utilizedBandwidth: 450000, latency: 20, isolationLevel: 'LOGICAL' });
    if (sliceE) { const s = coord.subscribers.get(subHome); if (s) s.slices.push(sliceE); }
  }
  if (subRoaming) {
    const sliceU = coord.addSlice({ type: NetworkSliceType.ULTRA_RELIABLE_LOW_LATENCY, sst: 2, sd: '000002', allocatedBandwidth: 50000, utilizedBandwidth: 12000, latency: 5, isolationLevel: 'PHYSICAL' });
    if (sliceU) { const s = coord.subscribers.get(subRoaming); if (s) s.slices.push(sliceU); }
  }

  // Security findings (6)
  coord.security.addFinding({
    type: TelecomAttackType.SS7_IMSI_CAPTURE, severity: TelecomSecurityFindingSeverity.HIGH,
    description: 'SS7 MAP SendAuthInfo query from unauthorized STP - possible IMSI capture in progress',
    affectedComponent: 'STP-02', mitreTechniqueId: 'T1552.004',
  });
  coord.security.addFinding({
    type: TelecomAttackType.SS7_SMS_INTERCEPT, severity: TelecomSecurityFindingSeverity.CRITICAL,
    description: 'Suspicious MT-ForwardSM routed through unauthorized STP - SMS interception detected',
    affectedComponent: 'SMSC-01', mitreTechniqueId: 'T1583.002',
  });
  coord.security.addFinding({
    type: TelecomAttackType.IMSI_CATCHER, severity: TelecomSecurityFindingSeverity.CRITICAL,
    description: 'Unknown eNB detected broadcasting PLMN 310-150 with abnormal signal parameters',
    affectedComponent: 'RAN-Cell-004', mitreTechniqueId: 'T1460.001',
  });
  coord.security.addFinding({
    type: TelecomAttackType.GTP_U_REFLECTION, severity: TelecomSecurityFindingSeverity.HIGH,
    description: 'GTP-U tunnel endpoint reflects traffic to external IP - potential amplification DDoS',
    affectedComponent: 'UPF-01', mitreTechniqueId: 'T1498.002',
  });
  coord.security.addFinding({
    type: TelecomAttackType.SIGNALING_STORM, severity: TelecomSecurityFindingSeverity.MEDIUM,
    description: 'Elevated signaling volume from MME-01 to HSS-01 exceeds baseline threshold by 300%',
    affectedComponent: 'HSS-01', mitreTechniqueId: 'T1499.001',
  });
  coord.security.addFinding({
    type: TelecomAttackType.SIP_REGISTRATION_HIJACK, severity: TelecomSecurityFindingSeverity.HIGH,
    description: 'SIP REGISTER from unknown IP attempting to overwrite subscriber binding',
    affectedComponent: 'S-CSCF-01', mitreTechniqueId: 'T1584.001',
  });

  // Known attacks
  coord.security.loadKnownAttacks();

  return coord;
}
