import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type VehicleId = string & { readonly __brand: unique symbol };
export const vehicleId = (): VehicleId => uid() as unknown as VehicleId;

export type EcuId = string & { readonly __brand: unique symbol };
export const ecuId = (): EcuId => uid() as unknown as EcuId;

export type CanBusId = string & { readonly __brand: unique symbol };
export const canBusId = (): CanBusId => uid() as unknown as CanBusId;

export type CanMessageId = string & { readonly __brand: unique symbol };
export const canMessageId = (): CanMessageId => uid() as unknown as CanMessageId;

export type DiagnosticSessionId = string & { readonly __brand: unique symbol };
export const diagnosticSessionId = (): DiagnosticSessionId => uid() as unknown as DiagnosticSessionId;

export type DiagnosticTroubleCodeId = string & { readonly __brand: unique symbol };
export const diagnosticTroubleCodeId = (): DiagnosticTroubleCodeId => uid() as unknown as DiagnosticTroubleCodeId;

export type V2xMessageId = string & { readonly __brand: unique symbol };
export const v2xMessageId = (): V2xMessageId => uid() as unknown as V2xMessageId;

export type AutoSecurityFindingId = string & { readonly __brand: unique symbol };
export const autoSecurityFindingId = (): AutoSecurityFindingId => uid() as unknown as AutoSecurityFindingId;

// ─── Enums ───────────────────────────────────────────────────────
export enum VehicleType {
  Passenger = 'Passenger',
  Truck = 'Truck',
  Bus = 'Bus',
  Motorcycle = 'Motorcycle',
  HeavyEquipment = 'HeavyEquipment',
  Rail = 'Rail',
  Marine = 'Marine',
}
export enum EcuType {
  Engine = 'Engine',
  Transmission = 'Transmission',
  ABS = 'ABS',
  Airbag = 'Airbag',
  Telematics = 'Telematics',
  Infotainment = 'Infotainment',
  InstrumentCluster = 'InstrumentCluster',
  BCM = 'BCM',
  Gateway = 'Gateway',
  EPS = 'EPS',
  ADAS = 'ADAS',
  Parking = 'Parking',
}
export enum CanProtocol {
  CAN20 = 'CAN20',
  CANFD = 'CANFD',
  CANXL = 'CANXL',
  CANopen = 'CANopen',
  J1939 = 'J1939',
}
export enum CanFrameType {
  Standard = 'Standard',
  Extended = 'Extended',
  FD = 'FD',
  Remote = 'Remote',
  Error = 'Error',
}
export enum DiagnosticService {
  DiagnosticSessionControl = '10',
  EcuReset = '11',
  SecurityAccess = '27',
  CommunicationControl = '28',
  TestorPresent = '3E',
  ReadDataByIdentifier = '22',
  ReadMemoryByAddress = '23',
  ReadScalingDataByIdentifier = '24',
  WriteDataByIdentifier = '2E',
  WriteMemoryByAddress = '3D',
  ClearDiagnosticInformation = '14',
  ReadDTCInformation = '19',
  InputOutputControlByIdentifier = '2F',
  RoutineControl = '31',
  RequestDownload = '34',
  RequestUpload = '35',
  TransferData = '36',
  RequestTransferExit = '37',
}
export enum DtcStatus {
  Active = 'Active',
  Stored = 'Stored',
  Pending = 'Pending',
  Confirmed = 'Confirmed',
}
export enum DtcSeverity {
  Critical = 'Critical',
  Major = 'Major',
  Minor = 'Minor',
  Warning = 'Warning',
}
export enum V2xMessageType {
  CAM = 'CAM',       // Cooperative Awareness Message
  DENM = 'DENM',     // Decentralized Environmental Notification
  BSM = 'BSM',       // Basic Safety Message
  SPaT = 'SPaT',     // Signal Phase and Timing
  MAPEM = 'MAPEM',   // Map Extended Message
  IVIM = 'IVIM',     // In-Vehicle Information
}
export enum V2xTechnology {
  DSRC = 'DSRC',
  CV2X = 'CV2X',
  NRV2X = 'NRV2X',
}
export enum AutoSecurityDomain {
  InVehicle = 'InVehicle',
  ExternalConnectivity = 'ExternalConnectivity',
  V2X = 'V2X',
  ADAS = 'ADAS',
  Charging = 'Charging',
}
export enum EvChargingProtocol {
  CCS = 'CCS',
  CHAdeMO = 'CHAdeMO',
  NACS = 'NACS',
  Type2 = 'Type2',
  GB_T = 'GB_T',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface Vehicle {
  id: VehicleId;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  ecus: EcuId[];
  canBuses: CanBusId[];
  softwareVersion: string;
  isIgnitionOn: boolean;
  speed: number; // km/h
  odometer: number; // km
}

export interface Ecu {
  id: EcuId;
  name: string;
  type: EcuType;
  vendor: string;
  hardwareVersion: string;
  softwareVersion: string;
  serialNumber: string;
  isOnline: boolean;
  isAuthenticated: boolean;
  diagnosticAddress: number;
  supportedServices: DiagnosticService[];
  session: DiagnosticSessionId | null;
  dtcs: DiagnosticTroubleCodeId[];
  flashCount: number;
  bootloaderVersion: string;
}

export interface CanBus {
  id: CanBusId;
  name: string;
  protocol: CanProtocol;
  bitrate: number; // kbps
  vehicleId: VehicleId;
  isActive: boolean;
  loadPercent: number;
}

export interface CanMessage {
  id: CanMessageId;
  busId: CanBusId;
  arbitrationId: number;
  frameType: CanFrameType;
  data: number[];
  dlc: number;
  timestamp: number;
  isRemoteFrame: boolean;
  isErrorFrame: boolean;
  isSpoofed: boolean;
}

export interface DiagnosticSession {
  id: DiagnosticSessionId;
  ecuId: EcuId;
  activeService: DiagnosticService;
  securityLevel: number; // 0 = default, 1-5 = extended
  isActive: boolean;
  startedAt: number;
  lastActivity: number;
  isAuthenticated: boolean;
}

export interface DiagnosticTroubleCode {
  id: DiagnosticTroubleCodeId;
  ecuId: EcuId;
  code: string; // e.g. P0123
  description: string;
  status: DtcStatus;
  severity: DtcSeverity;
  freezeFrame: Record<string, number>;
  occurrenceCount: number;
  firstOccurrence: number;
  lastOccurrence: number;
}

export interface V2xMessage {
  id: V2xMessageId;
  type: V2xMessageType;
  technology: V2xTechnology;
  sourceId: string;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  payload: Record<string, unknown>;
  timestamp: number;
  isAuthenticated: boolean;
  isSpoofed: boolean;
}

export interface AutoSecurityFinding {
  id: AutoSecurityFindingId;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  domain: AutoSecurityDomain;
  iso21434Clause: string;
  cweId: string;
  mitigated: boolean;
  timestamp: number;
}

export interface AutoAttackScenario {
  type: string;
  name: string;
  description: string;
  target: string;
  impact: string;
  cveId: string;
  cvssScore: number;
  iso21434Clause: string;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createVehicle(overrides?: Partial<Vehicle>): Vehicle {
  return {
    id: vehicleId(),
    vin: '1HGCM82633A004352',
    make: 'Generic Motors',
    model: 'Model-S',
    year: 2025,
    type: VehicleType.Passenger,
    ecus: [],
    canBuses: [],
    softwareVersion: '2.4.1',
    isIgnitionOn: false,
    speed: 0,
    odometer: 0,
    ...overrides,
  };
}

export function createEcu(overrides?: Partial<Ecu>): Ecu {
  return {
    id: ecuId(),
    name: 'ECM-1',
    type: EcuType.Engine,
    vendor: 'Bosch',
    hardwareVersion: 'HW-3.2',
    softwareVersion: 'SW-7.1.0',
    serialNumber: 'SN-12345',
    isOnline: true,
    isAuthenticated: true,
    diagnosticAddress: 0x7E0,
    supportedServices: [DiagnosticService.DiagnosticSessionControl, DiagnosticService.EcuReset,
      DiagnosticService.ReadDataByIdentifier, DiagnosticService.ReadDTCInformation,
      DiagnosticService.ClearDiagnosticInformation],
    session: null,
    dtcs: [],
    flashCount: 0,
    bootloaderVersion: 'BL-2.0',
    ...overrides,
  };
}

export function createCanBus(overrides?: Partial<CanBus>): CanBus {
  return {
    id: canBusId(),
    name: 'CAN-HS',
    protocol: CanProtocol.CANFD,
    bitrate: 500,
    vehicleId: '' as VehicleId,
    isActive: true,
    loadPercent: 15,
    ...overrides,
  };
}

export function createCanMessage(overrides?: Partial<CanMessage>): CanMessage {
  return {
    id: canMessageId(),
    busId: '' as CanBusId,
    arbitrationId: 0x123,
    frameType: CanFrameType.Standard,
    data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07],
    dlc: 8,
    timestamp: Date.now(),
    isRemoteFrame: false,
    isErrorFrame: false,
    isSpoofed: false,
    ...overrides,
  };
}

export function createDiagnosticSession(overrides?: Partial<DiagnosticSession>): DiagnosticSession {
  return {
    id: diagnosticSessionId(),
    ecuId: '' as EcuId,
    activeService: DiagnosticService.DiagnosticSessionControl,
    securityLevel: 0,
    isActive: true,
    startedAt: Date.now(),
    lastActivity: Date.now(),
    isAuthenticated: false,
    ...overrides,
  };
}

export function createDiagnosticTroubleCode(overrides?: Partial<DiagnosticTroubleCode>): DiagnosticTroubleCode {
  return {
    id: diagnosticTroubleCodeId(),
    ecuId: '' as EcuId,
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    status: DtcStatus.Active,
    severity: DtcSeverity.Major,
    freezeFrame: { rpm: 750, coolantTemp: 90, fuelTrim: 0 },
    occurrenceCount: 3,
    firstOccurrence: Date.now() - 86400000,
    lastOccurrence: Date.now(),
    ...overrides,
  };
}

export function createV2xMessage(overrides?: Partial<V2xMessage>): V2xMessage {
  return {
    id: v2xMessageId(),
    type: V2xMessageType.BSM,
    technology: V2xTechnology.CV2X,
    sourceId: 'VIN12345',
    lat: 40.71,
    lon: -74.01,
    speed: 45,
    heading: 90,
    payload: { brakeStatus: 0, steeringAngle: 0 },
    timestamp: Date.now(),
    isAuthenticated: true,
    isSpoofed: false,
    ...overrides,
  };
}

export function createAutoSecurityFinding(overrides?: Partial<AutoSecurityFinding>): AutoSecurityFinding {
  return {
    id: autoSecurityFindingId(),
    description: 'Unauthenticated diagnostic session',
    severity: 'high',
    domain: AutoSecurityDomain.InVehicle,
    iso21434Clause: 'CV-05-03',
    cweId: 'CWE-306',
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function getKnownAutoAttacks(): AutoAttackScenario[] {
  return [
    { type: 'CAN Injection', name: 'CAN Message Injection', description: 'Arbitrary CAN frame injection via OBD-II port or compromised telematics unit', target: 'CAN bus', impact: 'Engine control, brake override, instrument cluster manipulation', cveId: 'CVE-2023-29389', cvssScore: 8.2, iso21434Clause: 'CV-08-02' },
    { type: 'UDS Exploitation', name: 'Unauthorized Diagnostic Access', description: 'Security access bypass via dictionary attack or session downgrade', target: 'ECU diagnostic server', impact: 'ECU reflash, DTC clearing, immobilizer bypass', cveId: 'CVE-2021-32540', cvssScore: 7.5, iso21434Clause: 'CV-05-03' },
    { type: 'V2X Spoofing', name: 'BSM/CAM Message Forgery', description: 'Fabricated V2X safety messages causing hazardous behavior', target: 'V2X receiver', impact: 'False emergency braking, wrong-way driver alert spoofing', cveId: 'CVE-2023-35782', cvssScore: 8.8, iso21434Clause: 'CV-09-02' },
    { type: 'Telematics', name: 'Telematics Unit Remote Exploit', description: 'Remote code execution via cellular/Wi-Fi attack surface', target: 'TCU/IVI', impact: 'Full vehicle compromise, persistent access, data exfiltration', cveId: 'CVE-2024-23456', cvssScore: 9.0, iso21434Clause: 'CV-12-04' },
    { type: 'OBD-II', name: 'OBD-II Port Physical Attack', description: 'Physical access to OBD-II port enables CAN bus injection', target: 'OBD-II diagnostic port', impact: 'Comprehensive CAN bus access, ECU flashing, key programming', cveId: 'CVE-2020-12345', cvssScore: 6.2, iso21434Clause: 'CV-10-01' },
    { type: 'Charging', name: 'EV Charging Session Hijack', description: 'ISO 15118 protocol manipulation during charging session', target: 'EV charging controller', impact: 'Overcharge, billing fraud, grid-side attack vector', cveId: 'CVE-2023-42234', cvssScore: 7.1, iso21434Clause: 'CV-11-02' },
    { type: 'J1939', name: 'J1939 Heavy Vehicle Attack', description: 'J1939 message injection against heavy truck/equipment CAN bus', target: 'Truck/agricultural vehicle', impact: 'Engine derate, brake system manipulation, PTO control', cveId: 'CVE-2022-34567', cvssScore: 7.8, iso21434Clause: 'CV-08-04' },
    { type: 'ADAS', name: 'ADAS Sensor Manipulation', description: 'LiDAR/radar/camera sensor blinding or spoofing', target: 'Autonomous driving sensors', impact: 'False object detection, phantom braking, lane departure', cveId: 'CVE-2022-12345', cvssScore: 8.5, iso21434Clause: 'CV-06-03' },
    { type: 'Infotainment', name: 'IVI Application Injection', description: 'Malicious application sideloading on head unit', target: 'In-vehicle infotainment', impact: 'User data theft, microphone/camera access, CAN injection pivot', cveId: 'CVE-2023-56789', cvssScore: 7.6, iso21434Clause: 'CV-12-02' },
    { type: 'Keyless', name: 'Keyless Entry Relay Attack', description: 'Relay attack against passive keyless entry system', target: 'Immobilizer/RKE system', impact: 'Vehicle theft without key, unauthorized access', cveId: 'CVE-2021-34567', cvssScore: 5.9, iso21434Clause: 'CV-07-01' },
  ];
}

// ─── VehicleManager ─────────────────────────────────────────────
export class VehicleManager {
  private vehicles: Map<string, Vehicle> = new Map();
  add(v: Vehicle): void { this.vehicles.set(v.id, v); }
  get(id: VehicleId): Vehicle | undefined { return this.vehicles.get(id); }
  remove(id: VehicleId): void { this.vehicles.delete(id); }
  list(): Vehicle[] { return Array.from(this.vehicles.values()); }
  clear(): void { this.vehicles.clear(); }
  filterByType(type: VehicleType): Vehicle[] { return this.list().filter(v => v.type === type); }
  filterByMake(make: string): Vehicle[] { return this.list().filter(v => v.make.toLowerCase() === make.toLowerCase()); }
  filterByYearRange(min: number, max: number): Vehicle[] { return this.list().filter(v => v.year >= min && v.year <= max); }
  filterIgnitionOn(): Vehicle[] { return this.list().filter(v => v.isIgnitionOn); }
  getTotalCount(): number { return this.vehicles.size; }
}

// ─── EcuManager ─────────────────────────────────────────────────
export class EcuManager {
  private ecus: Map<string, Ecu> = new Map();
  add(e: Ecu): void { this.ecus.set(e.id, e); }
  get(id: EcuId): Ecu | undefined { return this.ecus.get(id); }
  remove(id: EcuId): void { this.ecus.delete(id); }
  list(): Ecu[] { return Array.from(this.ecus.values()); }
  clear(): void { this.ecus.clear(); }
  filterByType(type: EcuType): Ecu[] { return this.list().filter(e => e.type === type); }
  filterByVendor(vendor: string): Ecu[] { return this.list().filter(e => e.vendor.toLowerCase() === vendor.toLowerCase()); }
  filterOnline(): Ecu[] { return this.list().filter(e => e.isOnline); }
  filterOffline(): Ecu[] { return this.list().filter(e => !e.isOnline); }
  filterAuthenticated(): Ecu[] { return this.list().filter(e => e.isAuthenticated); }
  filterUnauthenticated(): Ecu[] { return this.list().filter(e => !e.isAuthenticated); }
  filterWithActiveSession(): Ecu[] { return this.list().filter(e => e.session !== null); }
  filterByService(service: DiagnosticService): Ecu[] {
    return this.list().filter(e => e.supportedServices.includes(service));
  }
  flashEcu(id: EcuId): boolean {
    const e = this.ecus.get(id);
    if (!e) return false;
    e.flashCount++;
    return true;
  }
  getTotalCount(): number { return this.ecus.size; }
}

// ─── CanBusManager ──────────────────────────────────────────────
export class CanBusManager {
  private buses: Map<string, CanBus> = new Map();
  add(b: CanBus): void { this.buses.set(b.id, b); }
  get(id: CanBusId): CanBus | undefined { return this.buses.get(id); }
  remove(id: CanBusId): void { this.buses.delete(id); }
  list(): CanBus[] { return Array.from(this.buses.values()); }
  clear(): void { this.buses.clear(); }
  filterByProtocol(protocol: CanProtocol): CanBus[] { return this.list().filter(b => b.protocol === protocol); }
  filterByVehicle(vehicleId: VehicleId): CanBus[] { return this.list().filter(b => b.vehicleId === vehicleId); }
  filterActive(): CanBus[] { return this.list().filter(b => b.isActive); }
  filterByLoadThreshold(maxLoad: number): CanBus[] { return this.list().filter(b => b.loadPercent <= maxLoad); }
  getTotalCount(): number { return this.buses.size; }
}

// ─── CanMessageManager ──────────────────────────────────────────
export class CanMessageManager {
  private messages: Map<string, CanMessage> = new Map();
  add(m: CanMessage): void { this.messages.set(m.id, m); }
  get(id: CanMessageId): CanMessage | undefined { return this.messages.get(id); }
  remove(id: CanMessageId): void { this.messages.delete(id); }
  list(): CanMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }
  filterByBus(busId: CanBusId): CanMessage[] { return this.list().filter(m => m.busId === busId); }
  filterByFrameType(type: CanFrameType): CanMessage[] { return this.list().filter(m => m.frameType === type); }
  filterSpoofed(): CanMessage[] { return this.list().filter(m => m.isSpoofed); }
  filterByArbitrationId(id: number): CanMessage[] { return this.list().filter(m => m.arbitrationId === id); }
  filterErrorFrames(): CanMessage[] { return this.list().filter(m => m.isErrorFrame); }
  filterRemoteFrames(): CanMessage[] { return this.list().filter(m => m.isRemoteFrame); }
  spoofMessage(id: CanMessageId): boolean {
    const m = this.messages.get(id);
    if (!m) return false;
    m.isSpoofed = true;
    return true;
  }
  getTotalCount(): number { return this.messages.size; }
}

// ─── DiagnosticManager ──────────────────────────────────────────
export class DiagnosticManager {
  private sessions: Map<string, DiagnosticSession> = new Map();
  private dtcs: Map<string, DiagnosticTroubleCode> = new Map();

  // Sessions
  addSession(s: DiagnosticSession): void { this.sessions.set(s.id, s); }
  getSession(id: DiagnosticSessionId): DiagnosticSession | undefined { return this.sessions.get(id); }
  removeSession(id: DiagnosticSessionId): void { this.sessions.delete(id); }
  listSessions(): DiagnosticSession[] { return Array.from(this.sessions.values()); }
  clearSessions(): void { this.sessions.clear(); }
  filterSessionsByEcu(ecuId: EcuId): DiagnosticSession[] { return this.listSessions().filter(s => s.ecuId === ecuId); }
  filterActiveSessions(): DiagnosticSession[] { return this.listSessions().filter(s => s.isActive); }
  filterAuthenticatedSessions(): DiagnosticSession[] { return this.listSessions().filter(s => s.isAuthenticated); }
  closeSession(id: DiagnosticSessionId): boolean {
    const s = this.sessions.get(id);
    if (!s) return false;
    s.isActive = false;
    return true;
  }

  // DTCs
  addDtc(dtc: DiagnosticTroubleCode): void { this.dtcs.set(dtc.id, dtc); }
  getDtc(id: DiagnosticTroubleCodeId): DiagnosticTroubleCode | undefined { return this.dtcs.get(id); }
  removeDtc(id: DiagnosticTroubleCodeId): void { this.dtcs.delete(id); }
  listDtcs(): DiagnosticTroubleCode[] { return Array.from(this.dtcs.values()); }
  clearDtcs(): void { this.dtcs.clear(); }
  filterDtcsByEcu(ecuId: EcuId): DiagnosticTroubleCode[] { return this.listDtcs().filter(d => d.ecuId === ecuId); }
  filterDtcsByStatus(status: DtcStatus): DiagnosticTroubleCode[] { return this.listDtcs().filter(d => d.status === status); }
  filterDtcsBySeverity(severity: DtcSeverity): DiagnosticTroubleCode[] { return this.listDtcs().filter(d => d.severity === severity); }
  filterActiveDtcs(): DiagnosticTroubleCode[] { return this.listDtcs().filter(d => d.status === DtcStatus.Active); }
  clearDtc(id: DiagnosticTroubleCodeId): boolean {
    const d = this.dtcs.get(id);
    if (!d) return false;
    d.status = DtcStatus.Stored;
    return true;
  }

  getTotalSessions(): number { return this.sessions.size; }
  getTotalDtcs(): number { return this.dtcs.size; }
}

// ─── V2xManager ─────────────────────────────────────────────────
export class V2xManager {
  private messages: Map<string, V2xMessage> = new Map();
  add(m: V2xMessage): void { this.messages.set(m.id, m); }
  get(id: V2xMessageId): V2xMessage | undefined { return this.messages.get(id); }
  remove(id: V2xMessageId): void { this.messages.delete(id); }
  list(): V2xMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }
  filterByType(type: V2xMessageType): V2xMessage[] { return this.list().filter(m => m.type === type); }
  filterByTechnology(tech: V2xTechnology): V2xMessage[] { return this.list().filter(m => m.technology === tech); }
  filterSpoofed(): V2xMessage[] { return this.list().filter(m => m.isSpoofed); }
  filterAuthenticated(): V2xMessage[] { return this.list().filter(m => m.isAuthenticated); }
  filterByRegion(latMin: number, latMax: number, lonMin: number, lonMax: number): V2xMessage[] {
    return this.list().filter(m => m.lat >= latMin && m.lat <= latMax && m.lon >= lonMin && m.lon <= lonMax);
  }
  spoofMessage(id: V2xMessageId): boolean {
    const m = this.messages.get(id);
    if (!m) return false;
    m.isSpoofed = true;
    return true;
  }
  getTotalCount(): number { return this.messages.size; }
}

// ─── SecurityManager ────────────────────────────────────────────
export class AutoSecurityManager {
  private findings: Map<string, AutoSecurityFinding> = new Map();
  private attacks: AutoAttackScenario[] = [];

  addFinding(f: AutoSecurityFinding): void { this.findings.set(f.id, f); }
  getFinding(id: AutoSecurityFindingId): AutoSecurityFinding | undefined { return this.findings.get(id); }
  listFindings(): AutoSecurityFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }
  mitigateFinding(id: AutoSecurityFindingId): boolean {
    const f = this.findings.get(id);
    if (!f) return false;
    f.mitigated = true;
    return true;
  }
  filterFindingsBySeverity(severity: AutoSecurityFinding['severity']): AutoSecurityFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }
  filterFindingsByDomain(domain: AutoSecurityDomain): AutoSecurityFinding[] {
    return this.listFindings().filter(f => f.domain === domain);
  }
  filterFindingsUnmitigated(): AutoSecurityFinding[] { return this.listFindings().filter(f => !f.mitigated); }
  getTotalFindings(): number { return this.findings.size; }

  loadKnownAttacks(): void { this.attacks = getKnownAutoAttacks(); }
  getKnownAttacks(): AutoAttackScenario[] { return this.attacks; }
}

// ─── AutomotiveCoordinator ──────────────────────────────────────
export class AutomotiveCoordinator {
  readonly vehicles: VehicleManager;
  readonly ecus: EcuManager;
  readonly canBuses: CanBusManager;
  readonly canMessages: CanMessageManager;
  readonly diagnostics: DiagnosticManager;
  readonly v2x: V2xManager;
  readonly security: AutoSecurityManager;

  constructor() {
    this.vehicles = new VehicleManager();
    this.ecus = new EcuManager();
    this.canBuses = new CanBusManager();
    this.canMessages = new CanMessageManager();
    this.diagnostics = new DiagnosticManager();
    this.v2x = new V2xManager();
    this.security = new AutoSecurityManager();
  }

  getStats(): {
    vehicleCount: number; ecuCount: number; canBusCount: number;
    canMessageCount: number; diagnosticSessionCount: number;
    dtcCount: number; activeDtcCount: number; v2xMessageCount: number;
    findingCount: number; unmitigatedFindingCount: number;
    spoofedCanCount: number; spoofedV2xCount: number;
  } {
    return {
      vehicleCount: this.vehicles.getTotalCount(),
      ecuCount: this.ecus.getTotalCount(),
      canBusCount: this.canBuses.getTotalCount(),
      canMessageCount: this.canMessages.getTotalCount(),
      diagnosticSessionCount: this.diagnostics.getTotalSessions(),
      dtcCount: this.diagnostics.getTotalDtcs(),
      activeDtcCount: this.diagnostics.filterActiveDtcs().length,
      v2xMessageCount: this.v2x.getTotalCount(),
      findingCount: this.security.getTotalFindings(),
      unmitigatedFindingCount: this.security.filterFindingsUnmitigated().length,
      spoofedCanCount: this.canMessages.filterSpoofed().length,
      spoofedV2xCount: this.v2x.filterSpoofed().length,
    };
  }

  reset(): void {
    this.vehicles.clear();
    this.ecus.clear();
    this.canBuses.clear();
    this.canMessages.clear();
    this.diagnostics.clearSessions();
    this.diagnostics.clearDtcs();
    this.v2x.clear();
    this.security.clearFindings();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultAutomotiveEnvironment(): AutomotiveCoordinator {
  const coord = new AutomotiveCoordinator();

  // Vehicle
  const v = createVehicle({
    make: 'Tesla', model: 'Model 3', year: 2025, type: VehicleType.Passenger, vin: '5YJ3E1EAXPF123456',
    softwareVersion: '2025.12.5',
  });

  // ECUs
  const ecuEngine = createEcu({
    name: 'ECM-1', type: EcuType.Engine, vendor: 'Bosch',
    softwareVersion: 'SW-7.1.0', diagnosticAddress: 0x7E0,
    supportedServices: [DiagnosticService.DiagnosticSessionControl, DiagnosticService.EcuReset,
      DiagnosticService.ReadDataByIdentifier, DiagnosticService.WriteDataByIdentifier,
      DiagnosticService.ReadDTCInformation, DiagnosticService.ClearDiagnosticInformation,
      DiagnosticService.SecurityAccess, DiagnosticService.RoutineControl],
  });
  const ecuAbs = createEcu({
    name: 'ABS-1', type: EcuType.ABS, vendor: 'Continental',
    softwareVersion: 'SW-3.2.1', diagnosticAddress: 0x7E1,
  });
  const ecuTcu = createEcu({
    name: 'TCU-1', type: EcuType.Telematics, vendor: 'Qualcomm',
    softwareVersion: 'SW-5.0.3', diagnosticAddress: 0x7E2,
  });
  const ecuBcm = createEcu({
    name: 'BCM-1', type: EcuType.BCM, vendor: 'Valeo',
    softwareVersion: 'SW-2.1.0', diagnosticAddress: 0x7E3,
    isAuthenticated: false,
  });
  const ecuAdas = createEcu({
    name: 'ADAS-1', type: EcuType.ADAS, vendor: 'Mobileye',
    softwareVersion: 'SW-4.2.0', diagnosticAddress: 0x7E4,
    supportedServices: [DiagnosticService.DiagnosticSessionControl, DiagnosticService.ReadDataByIdentifier],
  });
  const ecuGateway = createEcu({
    name: 'GW-1', type: EcuType.Gateway, vendor: 'NXP',
    softwareVersion: 'SW-3.0.0', diagnosticAddress: 0x7E5,
    supportedServices: [DiagnosticService.DiagnosticSessionControl, DiagnosticService.SecurityAccess,
      DiagnosticService.CommunicationControl],
  });

  coord.ecus.add(ecuEngine);
  coord.ecus.add(ecuAbs);
  coord.ecus.add(ecuTcu);
  coord.ecus.add(ecuBcm);
  coord.ecus.add(ecuAdas);
  coord.ecus.add(ecuGateway);

  // CAN buses
  const busPowertrain = createCanBus({ name: 'Powertrain-CAN', protocol: CanProtocol.CANFD, bitrate: 500, vehicleId: v.id, loadPercent: 25 });
  const busChassis = createCanBus({ name: 'Chassis-CAN', protocol: CanProtocol.CANFD, bitrate: 500, vehicleId: v.id, loadPercent: 10 });
  const busInfotainment = createCanBus({ name: 'Infotainment-CAN', protocol: CanProtocol.CAN20, bitrate: 125, vehicleId: v.id, loadPercent: 40 });
  const busDiagnostic = createCanBus({ name: 'Diagnostic-CAN', protocol: CanProtocol.CANFD, bitrate: 2000, vehicleId: v.id, loadPercent: 5 });

  coord.canBuses.add(busPowertrain);
  coord.canBuses.add(busChassis);
  coord.canBuses.add(busInfotainment);
  coord.canBuses.add(busDiagnostic);

  // Update vehicle ECUs and buses
  v.ecus = [ecuEngine.id, ecuAbs.id, ecuTcu.id, ecuBcm.id, ecuAdas.id, ecuGateway.id];
  v.canBuses = [busPowertrain.id, busChassis.id, busInfotainment.id, busDiagnostic.id];
  coord.vehicles.add(v);

  // CAN messages
  coord.canMessages.add(createCanMessage({
    busId: busPowertrain.id, arbitrationId: 0x201, data: [0x41, 0x00, 0x00, 0x00, 0x1A, 0x00, 0x00, 0x00],
    frameType: CanFrameType.Standard,
  }));
  coord.canMessages.add(createCanMessage({
    busId: busPowertrain.id, arbitrationId: 0x211, data: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    frameType: CanFrameType.Standard, isSpoofed: true,
  }));
  coord.canMessages.add(createCanMessage({
    busId: busChassis.id, arbitrationId: 0x300, data: [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    frameType: CanFrameType.Standard,
  }));
  coord.canMessages.add(createCanMessage({
    busId: busDiagnostic.id, arbitrationId: 0x7E0, data: [0x02, 0x10, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00],
    frameType: CanFrameType.FD, dlc: 64,
  }));

  // Diagnostic sessions
  coord.diagnostics.addSession(createDiagnosticSession({
    ecuId: ecuEngine.id, activeService: DiagnosticService.DiagnosticSessionControl,
    securityLevel: 0, isActive: true, isAuthenticated: false,
  }));
  coord.diagnostics.addSession(createDiagnosticSession({
    ecuId: ecuGateway.id, activeService: DiagnosticService.SecurityAccess,
    securityLevel: 3, isActive: true, isAuthenticated: true,
  }));

  // DTCs
  coord.diagnostics.addDtc(createDiagnosticTroubleCode({
    ecuId: ecuEngine.id, code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected',
    status: DtcStatus.Active, severity: DtcSeverity.Major,
    freezeFrame: { rpm: 650, coolantTemp: 95, fuelTrim: -5 },
    occurrenceCount: 5,
  }));
  coord.diagnostics.addDtc(createDiagnosticTroubleCode({
    ecuId: ecuBcm.id, code: 'U0100', description: 'Lost Communication With ECM/PCM',
    status: DtcStatus.Stored, severity: DtcSeverity.Minor,
    freezeFrame: { voltage: 12.3 },
    occurrenceCount: 2,
  }));

  // V2X messages
  coord.v2x.add(createV2xMessage({
    type: V2xMessageType.BSM, technology: V2xTechnology.CV2X,
    sourceId: v.vin, lat: 37.77, lon: -122.42, speed: 65, heading: 180,
    payload: { brakeStatus: 0, steeringAngle: 0, brakePressure: 120 },
  }));
  coord.v2x.add(createV2xMessage({
    type: V2xMessageType.CAM, technology: V2xTechnology.DSRC,
    sourceId: 'OTHER-VIN', lat: 37.78, lon: -122.41, speed: 50, heading: 0,
    payload: { vehicleRole: 0, longitudinalAcceleration: 0 },
    isAuthenticated: true,
  }));
  coord.v2x.add(createV2xMessage({
    type: V2xMessageType.DENM, technology: V2xTechnology.CV2X,
    sourceId: 'RSU-001', lat: 37.77, lon: -122.42, speed: 0, heading: 0,
    payload: { causeCode: 1, subCauseCode: 2, detectionTime: Date.now() },
    isAuthenticated: false, isSpoofed: true,
  }));

  // Security findings
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'BCM lacks authentication - CAN injection via compromised BCM possible',
    severity: 'high', domain: AutoSecurityDomain.InVehicle, iso21434Clause: 'CV-05-03', cweId: 'CWE-306',
  }));
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'Unauthenticated diagnostic session on engine ECU allows reflash without authorization',
    severity: 'critical', domain: AutoSecurityDomain.InVehicle, iso21434Clause: 'CV-05-03', cweId: 'CWE-306',
  }));
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'Spoofed CAN message detected on powertrain bus - potential engine control manipulation',
    severity: 'critical', domain: AutoSecurityDomain.InVehicle, iso21434Clause: 'CV-08-02', cweId: 'CWE-345',
  }));
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'Unauthenticated V2X DENM message - potential traffic hazard spoofing',
    severity: 'high', domain: AutoSecurityDomain.V2X, iso21434Clause: 'CV-09-02', cweId: 'CWE-346',
  }));
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'Telematics ECU (TCU) exposed on cellular network - remote attack surface',
    severity: 'critical', domain: AutoSecurityDomain.ExternalConnectivity, iso21434Clause: 'CV-12-04', cweId: 'CWE-119',
  }));
  coord.security.addFinding(createAutoSecurityFinding({
    description: 'ADAS LiDAR calibration expired - potential sensor manipulation',
    severity: 'medium', domain: AutoSecurityDomain.ADAS, iso21434Clause: 'CV-06-03', cweId: 'CWE-1188',
  }));

  // Known attacks
  coord.security.loadKnownAttacks();

  return coord;
}
