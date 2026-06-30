import { uid } from '@cybersim/shared';

/* ── Branded IDs ── */

export type PlcId = string & { readonly __brand: unique symbol };
export type RtuId = string & { readonly __brand: unique symbol };
export type HmiId = string & { readonly __brand: unique symbol };
export type ScadaId = string & { readonly __brand: unique symbol };
export type DcsId = string & { readonly __brand: unique symbol };
export type FieldDeviceId = string & { readonly __brand: unique symbol };
export type SafetySystemId = string & { readonly __brand: unique symbol };
export type AlarmId = string & { readonly __brand: unique symbol };
export type FieldbusId = string & { readonly __brand: unique symbol };
export type ProcessId = string & { readonly __brand: unique symbol };
export type IcsAttackId = string & { readonly __brand: unique symbol };
export type CellId = string & { readonly __brand: unique symbol };
export type ZoneId = string & { readonly __brand: unique symbol };

export function plcId(): PlcId { return `plc-${uid()}` as PlcId; }
export function rtuId(): RtuId { return `rtu-${uid()}` as RtuId; }
export function hmiId(): HmiId { return `hmi-${uid()}` as HmiId; }
export function scadaId(): ScadaId { return `scd-${uid()}` as ScadaId; }
export function dcsId(): DcsId { return `dcs-${uid()}` as DcsId; }
export function fieldDeviceId(): FieldDeviceId { return `dev-${uid()}` as FieldDeviceId; }
export function safetySystemId(): SafetySystemId { return `sis-${uid()}` as SafetySystemId; }
export function alarmId(): AlarmId { return `alm-${uid()}` as AlarmId; }
export function fieldbusId(): FieldbusId { return `bus-${uid()}` as FieldbusId; }
export function processId(): ProcessId { return `prc-${uid()}` as ProcessId; }
export function icsAttackId(): IcsAttackId { return `att-${uid()}` as IcsAttackId; }
export function cellId(): CellId { return `cel-${uid()}` as CellId; }
export function zoneId(): ZoneId { return `zne-${uid()}` as ZoneId; }

/* ── Enums ── */

export enum PurdueLevel {
  Level0_Process = 0,
  Level1_Control = 1,
  Level2_Supervisory = 2,
  Level3_SiteOperations = 3,
  Level4_Enterprise = 4,
  Level5_DMZ = 5,
}

export enum PlcVendor {
  Siemens = 'siemens',
  AllenBradley = 'allen_bradley',
  Schneider = 'schneider',
  Mitsubishi = 'mitsubishi',
  CODESYS = 'codesys',
  Omron = 'omron',
  Keyence = 'keyence',
  Panasonic = 'panasonic',
  Fatek = 'fatek',
  Delta = 'delta',
}

export enum PlcModel {
  S7_1200 = 's7_1200',
  S7_1500 = 's7_1500',
  S7_300 = 's7_300',
  S7_400 = 's7_400',
  ControlLogix_5570 = 'controllogix_5570',
  ControlLogix_5580 = 'controllogix_5580',
  CompactLogix_5380 = 'compactlogix_5380',
  CompactLogix_5480 = 'compactlogix_5480',
  MicroLogix_1400 = 'micrologix_1400',
  Modicon_M221 = 'modicon_m221',
  Modicon_M241 = 'modicon_m241',
  Modicon_M251 = 'modicon_m251',
  Modicon_M580 = 'modicon_m580',
  Modicon_Quantum = 'modicon_quantum',
  MELSEC_iQ_F = 'melsec_iq_f',
  MELSEC_iQ_L = 'melsec_iq_l',
  MELSEC_iQ_R = 'melsec_iq_r',
  CX3 = 'cx3',
  KV = 'kv',
  FP0H = 'fp0h',
  FBs = 'fbs',
  DVP = 'dvp',
  Codesys_Generic = 'codesys_generic',
}

export enum ProtocolType {
  ModbusRTU = 'modbus_rtu',
  ModbusTCP = 'modbus_tcp',
  ModbusASCII = 'modbus_ascii',
  DNP3 = 'dnp3',
  IEC60870_5_101 = 'iec60870_5_101',
  IEC60870_5_104 = 'iec60870_5_104',
  IEC61850_MMS = 'iec61850_mms',
  IEC61850_GOOSE = 'iec61850_goose',
  IEC61850_SV = 'iec61850_sv',
  Profibus_DP = 'profibus_dp',
  Profibus_PA = 'profibus_pa',
  Profinet_IO = 'profinet_io',
  EtherCAT = 'ethercat',
  CANopen = 'canopen',
  DeviceNet = 'devicenet',
  ControlNet = 'controlnet',
  HART = 'hart',
  FoundationFieldbus = 'foundation_fieldbus',
  OPC_DA = 'opc_da',
  OPC_UA = 'opc_ua',
  S7comm = 's7comm',
  S7commPlus = 's7comm_plus',
  CIP = 'cip',
  ModbusPlus = 'modbus_plus',
  MelsecNet = 'melsec_net',
  MelsecComm = 'melsec_comm',
  SLMP = 'slmp',
}

export enum SafetyIntegrityLevel {
  SIL1 = 1,
  SIL2 = 2,
  SIL3 = 3,
  SIL4 = 4,
}

export enum PlcStatus {
  Running = 'running',
  Stopped = 'stopped',
  Error = 'error',
  Maintenance = 'maintenance',
  Download = 'download',
  Startup = 'startup',
  Unknown = 'unknown',
}

export enum AlarmPriority {
  Journal = 0,
  Warning = 1,
  Important = 2,
  Urgent = 3,
  Critical = 4,
  Emergency = 5,
}

export enum AlarmState {
  Normal = 'normal',
  Active = 'active',
  Acknowledged = 'acknowledged',
  Shelved = 'shelved',
  Suppressed = 'suppressed',
  ReturnedToNormal = 'returned_to_normal',
}

export enum IcsAttackType {
  Triton = 'triton',
  Industroyer = 'industroyer',
  Industroyer2 = 'industroyer2',
  Stuxnet = 'stuxnet',
  Havex = 'havex',
  BlackEnergy = 'black_energy',
  CrashOverride = 'crash_override',
  EKANS = 'ekans',
  Pipedream = 'pipedream',
  INCONTROLLER = 'incontroller',
  COSMICENERGY = 'cosmic_energy',
  BadUSB = 'bad_usb',
  PlugX = 'plugx',
  NotPetya = 'notpetya',
}

export enum ProcessType {
  ChemicalReactor = 'chemical_reactor',
  DistillationColumn = 'distillation_column',
  Boiler = 'boiler',
  SteamTurbine = 'steam_turbine',
  GasTurbine = 'gas_turbine',
  Compressor = 'compressor',
  PumpStation = 'pump_station',
  ValveManifold = 'valve_manifold',
  ConveyorBelt = 'conveyor_belt',
  RoboticArm = 'robotic_arm',
  CNC_Machine = 'cnc_machine',
  PowerTransformer = 'power_transformer',
  CircuitBreaker = 'circuit_breaker',
  WaterTreatment = 'water_treatment',
  HVAC = 'hvac',
  Generator = 'generator',
  Motor = 'motor',
  Pipeline = 'pipeline',
}

export enum FieldbusState {
  Online = 'online',
  Offline = 'offline',
  Degraded = 'degraded',
  BusOff = 'bus_off',
  ErrorPassive = 'error_passive',
  ErrorActive = 'error_active',
}

export enum ScadaVendor {
  Wonderware = 'wonderware',
  WinCC = 'wincc',
  IFix = 'ifix',
  Ignition = 'ignition',
  VTScada = 'vtscada',
  AVEVA = 'aveva',
  GE_iFIX = 'ge_ifix',
  RockwellFactoryTalk = 'rockwell_factorytalk',
  Citect = 'citect',
  EcavaIntegraXor = 'ecava_integraxor',
}

export enum DcsVendor {
  EmersonDeltaV = 'emerson_deltav',
  HoneywellExperion = 'honeywell_experion',
  YokogawaCentum = 'yokogawa_centum',
  ABB_800xA = 'abb_800xa',
  SiemensPCS7 = 'siemens_pcs7',
  SiemensPCS_neo = 'siemens_pcs_neo',
  RockwellPlantPAx = 'rockwell_plantpax',
  SchneiderFoxboro = 'schneider_foxboro',
}

export enum SafetySystemType {
  EmergencyShutdown = 'emergency_shutdown',
  FireAndGas = 'fire_and_gas',
  BurnerManagement = 'burner_management',
  HighIntegrityPressure = 'high_integrity_pressure',
  TurbineControl = 'turbine_control',
  HIPPS = 'hipps',
}

/* ── Interfaces ── */

export interface PlcConfig {
  vendor: PlcVendor;
  model: PlcModel;
  firmwareVersion: string;
  ipAddress: string;
  tcpPort: number;
  protocols: ProtocolType[];
  memorySize: number;
  cycleTime: number;
  retentiveMemory: boolean;
  authenticationEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface PlcInstance {
  id: PlcId;
  name: string;
  vendor: PlcVendor;
  model: PlcModel;
  status: PlcStatus;
  config: PlcConfig;
  zone: ZoneId | null;
  cell: CellId | null;
  purdueLevel: PurdueLevel;
  deployedAt: Date;
  lastScanTime: Date;
  tags: string[];
}

export interface RtuConfig {
  vendor: string;
  model: string;
  ipAddress: string;
  serialPorts: number;
  protocols: ProtocolType[];
  hasBattery: boolean;
  remoteAccess: boolean;
}

export interface RtuInstance {
  id: RtuId;
  name: string;
  config: RtuConfig;
  purdueLevel: PurdueLevel;
  status: PlcStatus;
  deployedAt: Date;
  lastContact: Date | null;
  tags: string[];
}

export interface FieldDeviceConfig {
  deviceType: ProcessType;
  vendor: string;
  model: string;
  protocol: ProtocolType;
  address: number;
}

export interface SensorConfig extends FieldDeviceConfig {
  measurementRange: [number, number];
  unit: string;
  accuracy: number;
  updateRate: number;
}

export interface ActuatorConfig extends FieldDeviceConfig {
  actuationType: 'analog' | 'digital' | 'pwm';
  responseTime: number;
  range: [number, number];
}

export interface FieldDevice {
  id: FieldDeviceId;
  name: string;
  config: FieldDeviceConfig | SensorConfig | ActuatorConfig;
  plId: PlcId | RtuId | null;
  tags: string[];
}

export interface HmiConfig {
  vendor: ScadaVendor | string;
  version: string;
  screenCount: number;
  hasAlarmSummary: boolean;
  hasTrending: boolean;
  hasEventLog: boolean;
  hasUserAuth: boolean;
  remoteAccess: boolean;
}

export interface HmiInstance {
  id: HmiId;
  name: string;
  config: HmiConfig;
  purdueLevel: PurdueLevel;
  connectedPlcs: PlcId[];
  deployedAt: Date;
  tags: string[];
}

export interface ScadaConfig {
  vendor: ScadaVendor;
  version: string;
  hasHistorian: boolean;
  hasAlarmManagement: boolean;
  hasReporting: boolean;
  hasUserManagement: boolean;
  hasWebAccess: boolean;
  hasRedundancy: boolean;
  maxTags: number;
}

export interface ScadaInstance {
  id: ScadaId;
  name: string;
  config: ScadaConfig;
  purdueLevel: PurdueLevel;
  connectedHmis: HmiId[];
  connectedPlcs: PlcId[];
  deployedAt: Date;
  tags: string[];
}

export interface DcsConfig {
  vendor: DcsVendor;
  version: string;
  controllers: number;
  ioChannels: number;
  hasRedundancy: boolean;
  hasSafetyIntegration: boolean;
  hasBatchControl: boolean;
  hasAdvancedControl: boolean;
}

export interface DcsInstance {
  id: DcsId;
  name: string;
  config: DcsConfig;
  purdueLevel: PurdueLevel;
  deployedAt: Date;
  tags: string[];
}

export interface SafetySystemConfig {
  type: SafetySystemType;
  sil: SafetyIntegrityLevel;
  vendor: string;
  version: string;
  logicSolver: string;
  hasVoting: boolean;
  votingScheme: '1oo1' | '1oo2' | '2oo2' | '2oo3' | '2oo4';
  testInterval: number;
  proofTestInterval: number;
}

export interface SafetySystemInstance {
  id: SafetySystemId;
  name: string;
  config: SafetySystemConfig;
  purdueLevel: PurdueLevel;
  connectedPlcs: PlcId[];
  deployedAt: Date;
  lastTestDate: Date | null;
  tags: string[];
}

export interface FieldbusConfig {
  protocol: ProtocolType;
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: 'none' | 'even' | 'odd';
  slaveCount: number;
  maxResponseTime: number;
}

export interface FieldbusMessage {
  id: string;
  protocol: ProtocolType;
  source: string;
  destination: string;
  functionCode: number;
  data: number[];
  timestamp: Date;
  isResponse: boolean;
  error: boolean;
}

export interface FieldbusNetwork {
  id: FieldbusId;
  name: string;
  config: FieldbusConfig;
  state: FieldbusState;
  messages: FieldbusMessage[];
}

export interface ProcessVariable {
  name: string;
  value: number;
  unit: string;
  setpoint: number;
  min: number;
  max: number;
  alarmHigh: number;
  alarmLow: number;
  alarmHighHigh: number;
  alarmLowLow: number;
  timestamp: Date;
  quality: 'good' | 'bad' | 'uncertain' | 'substituted';
}

export interface PhysicalProcess {
  id: ProcessId;
  type: ProcessType;
  name: string;
  variables: ProcessVariable[];
  state: 'running' | 'stopped' | 'startup' | 'shutdown' | 'emergency' | 'degraded';
  lastUpdated: Date;
}

export interface AlarmConfig {
  tag: string;
  description: string;
  priority: AlarmPriority;
  type: 'hi_hi' | 'hi' | 'lo' | 'lo_lo' | 'rate_of_change' | 'deviation' | 'bad_quality' | 'roc';
  limitValue: number;
  deadband: number;
  onDelay: number;
  offDelay: number;
  shelveDuration: number;
  requiresAck: boolean;
}

export interface AlarmInstance {
  id: AlarmId;
  config: AlarmConfig;
  state: AlarmState;
  sourceId: PlcId | RtuId | ProcessId | null;
  raisedAt: Date | null;
  acknowledgedAt: Date | null;
  returnedAt: Date | null;
  shelvedUntil: Date | null;
  acknowledgedBy: string | null;
  operatorNote: string;
}

export interface IcsAttack {
  id: IcsAttackId;
  type: IcsAttackType;
  name: string;
  targetProtocols: ProtocolType[];
  targetVendors: PlcVendor[];
  targetModels: PlcModel[];
  mappedSections: string[];
  description: string;
  estimatedImpact: string;
  mitreIcsTechniques: string[];
}

export interface Zone {
  id: ZoneId;
  name: string;
  purdueLevel: PurdueLevel;
  description: string;
}

export interface Cell {
  id: CellId;
  name: string;
  zoneId: ZoneId;
  description: string;
}

export interface OtIcsStats {
  totalPlcs: number;
  runningPlcs: number;
  errorPlcs: number;
  totalRtus: number;
  totalHmis: number;
  totalScadas: number;
  totalDcs: number;
  totalSafetySystems: number;
  totalFieldDevices: number;
  totalFieldbuses: number;
  totalProcesses: number;
  totalCells: number;
  totalZones: number;
  activeAlarms: number;
  totalAttacks: number;
}

/* ── Defaults ── */

const PLC_DEFAULTS: Record<PlcVendor, Partial<PlcConfig>> = {
  [PlcVendor.Siemens]: { firmwareVersion: 'V4.5', tcpPort: 102, protocols: [ProtocolType.S7comm, ProtocolType.Profibus_DP, ProtocolType.Profinet_IO], memorySize: 1024, cycleTime: 10, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.AllenBradley]: { firmwareVersion: '34.011', tcpPort: 44818, protocols: [ProtocolType.CIP, ProtocolType.EthernetIP], memorySize: 2048, cycleTime: 5, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Schneider]: { firmwareVersion: '6.0', tcpPort: 502, protocols: [ProtocolType.ModbusTCP, ProtocolType.IEC60870_5_104], memorySize: 512, cycleTime: 20, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Mitsubishi]: { firmwareVersion: '1.30L', tcpPort: 5007, protocols: [ProtocolType.MelsecComm, ProtocolType.SLMP], memorySize: 256, cycleTime: 15, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.CODESYS]: { firmwareVersion: '3.5.19', tcpPort: 11740, protocols: [ProtocolType.ModbusTCP, ProtocolType.OPC_UA], memorySize: 1024, cycleTime: 10, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Omron]: { firmwareVersion: '1.1', tcpPort: 9600, protocols: [ProtocolType.CIP, ProtocolType.EthernetIP], memorySize: 512, cycleTime: 10, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Keyence]: { firmwareVersion: '1.0', tcpPort: 8501, protocols: [ProtocolType.SLMP, ProtocolType.ModbusTCP], memorySize: 256, cycleTime: 5, retentiveMemory: false, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Panasonic]: { firmwareVersion: '2.5', tcpPort: 502, protocols: [ProtocolType.ModbusTCP, ProtocolType.MelsecNet], memorySize: 128, cycleTime: 20, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Fatek]: { firmwareVersion: '4.0', tcpPort: 502, protocols: [ProtocolType.ModbusTCP], memorySize: 64, cycleTime: 30, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
  [PlcVendor.Delta]: { firmwareVersion: '3.0', tcpPort: 502, protocols: [ProtocolType.ModbusTCP], memorySize: 128, cycleTime: 15, retentiveMemory: true, authenticationEnabled: false, encryptionEnabled: false },
};

const MODEL_PURDUE_MAP: Partial<Record<PlcModel, PurdueLevel>> = {
  [PlcModel.S7_1200]: PurdueLevel.Level1_Control,
  [PlcModel.S7_1500]: PurdueLevel.Level1_Control,
  [PlcModel.S7_300]: PurdueLevel.Level1_Control,
  [PlcModel.S7_400]: PurdueLevel.Level1_Control,
  [PlcModel.ControlLogix_5570]: PurdueLevel.Level1_Control,
  [PlcModel.ControlLogix_5580]: PurdueLevel.Level1_Control,
  [PlcModel.CompactLogix_5380]: PurdueLevel.Level1_Control,
  [PlcModel.CompactLogix_5480]: PurdueLevel.Level1_Control,
  [PlcModel.MicroLogix_1400]: PurdueLevel.Level1_Control,
  [PlcModel.Modicon_M580]: PurdueLevel.Level1_Control,
  [PlcModel.Modicon_Quantum]: PurdueLevel.Level1_Control,
  [PlcModel.MELSEC_iQ_R]: PurdueLevel.Level1_Control,
};

/* ── Factory Functions ── */

export function createPlcConfig(vendor: PlcVendor, model: PlcModel, overrides?: Partial<PlcConfig>): PlcConfig {
  const def = PLC_DEFAULTS[vendor] ?? {};
  return {
    vendor,
    model,
    ipAddress: '192.168.1.1',
    firmwareVersion: def.firmwareVersion ?? '1.0',
    tcpPort: def.tcpPort ?? 502,
    protocols: (def.protocols ?? [ProtocolType.ModbusTCP]) as ProtocolType[],
    memorySize: def.memorySize ?? 256,
    cycleTime: def.cycleTime ?? 20,
    retentiveMemory: def.retentiveMemory ?? false,
    authenticationEnabled: def.authenticationEnabled ?? false,
    encryptionEnabled: def.encryptionEnabled ?? false,
    ...overrides,
  };
}

export function createPlc(
  name: string,
  vendor: PlcVendor,
  model: PlcModel,
  overrides?: Partial<PlcConfig>,
): PlcInstance {
  return {
    id: plcId(),
    name,
    vendor,
    model,
    status: PlcStatus.Running,
    config: createPlcConfig(vendor, model, overrides),
    zone: null,
    cell: null,
    purdueLevel: MODEL_PURDUE_MAP[model] ?? PurdueLevel.Level1_Control,
    deployedAt: new Date(),
    lastScanTime: new Date(),
    tags: [vendor, model],
  };
}

export function createRtu(name: string, overrides?: Partial<RtuConfig>): RtuInstance {
  return {
    id: rtuId(),
    name,
    config: {
      vendor: 'Schweitzer',
      model: 'SEL-3622',
      ipAddress: '10.0.1.1',
      serialPorts: 4,
      protocols: [ProtocolType.DNP3, ProtocolType.ModbusTCP],
      hasBattery: true,
      remoteAccess: true,
      ...overrides,
    },
    purdueLevel: PurdueLevel.Level1_Control,
    status: PlcStatus.Running,
    deployedAt: new Date(),
    lastContact: new Date(),
    tags: ['rtu', 'remote'],
  };
}

export function createSensor(
  name: string,
  deviceType: ProcessType,
  overrides?: Partial<SensorConfig>,
): FieldDevice {
  return {
    id: fieldDeviceId(),
    name,
    config: {
      deviceType,
      vendor: 'Siemens',
      model: 'SITRANS P320',
      protocol: ProtocolType.Profibus_PA,
      address: 1,
      measurementRange: [0, 100],
      unit: 'bar',
      accuracy: 0.5,
      updateRate: 100,
      ...overrides,
    } as SensorConfig,
    plId: null,
    tags: ['sensor', deviceType],
  };
}

export function createActuator(
  name: string,
  deviceType: ProcessType,
  overrides?: Partial<ActuatorConfig>,
): FieldDevice {
  return {
    id: fieldDeviceId(),
    name,
    config: {
      deviceType,
      vendor: 'Siemens',
      model: 'SIPART PS2',
      protocol: ProtocolType.Profibus_PA,
      address: 2,
      actuationType: 'analog',
      responseTime: 100,
      range: [0, 100],
      ...overrides,
    } as ActuatorConfig,
    plId: null,
    tags: ['actuator', deviceType],
  };
}

export function createHmi(name: string, overrides?: Partial<HmiConfig>): HmiInstance {
  return {
    id: hmiId(),
    name,
    config: {
      vendor: 'Siemens',
      version: 'WinCC V7.5',
      screenCount: 12,
      hasAlarmSummary: true,
      hasTrending: true,
      hasEventLog: true,
      hasUserAuth: true,
      remoteAccess: false,
      ...overrides,
    },
    purdueLevel: PurdueLevel.Level2_Supervisory,
    connectedPlcs: [],
    deployedAt: new Date(),
    tags: ['hmi', 'operator'],
  };
}

export function createScada(name: string, overrides?: Partial<ScadaConfig>): ScadaInstance {
  return {
    id: scadaId(),
    name,
    config: {
      vendor: ScadaVendor.Wonderware,
      version: '2023',
      hasHistorian: true,
      hasAlarmManagement: true,
      hasReporting: true,
      hasUserManagement: true,
      hasWebAccess: true,
      hasRedundancy: true,
      maxTags: 50000,
      ...overrides,
    },
    purdueLevel: PurdueLevel.Level2_Supervisory,
    connectedHmis: [],
    connectedPlcs: [],
    deployedAt: new Date(),
    tags: ['scada', 'control_room'],
  };
}

export function createDcs(name: string, overrides?: Partial<DcsConfig>): DcsInstance {
  return {
    id: dcsId(),
    name,
    config: {
      vendor: DcsVendor.EmersonDeltaV,
      version: '14.3',
      controllers: 8,
      ioChannels: 4096,
      hasRedundancy: true,
      hasSafetyIntegration: true,
      hasBatchControl: true,
      hasAdvancedControl: true,
      ...overrides,
    },
    purdueLevel: PurdueLevel.Level2_Supervisory,
    deployedAt: new Date(),
    tags: ['dcs', 'process_control'],
  };
}

export function createSafetySystem(
  name: string,
  type: SafetySystemType,
  sil: SafetyIntegrityLevel,
  overrides?: Partial<SafetySystemConfig>,
): SafetySystemInstance {
  return {
    id: safetySystemId(),
    name,
    config: {
      type,
      sil,
      vendor: 'Honeywell',
      version: 'Safety Manager 4.0',
      logicSolver: 'Safety Manager',
      hasVoting: true,
      votingScheme: '2oo3',
      testInterval: 8760,
      proofTestInterval: 52560,
      ...overrides,
    },
    purdueLevel: PurdueLevel.Level1_Control,
    connectedPlcs: [],
    deployedAt: new Date(),
    lastTestDate: null,
    tags: ['safety', `sil${sil}`, type],
  };
}

export function createFieldbusNetwork(
  name: string,
  protocol: ProtocolType,
  overrides?: Partial<FieldbusConfig>,
): FieldbusNetwork {
  return {
    id: fieldbusId(),
    name,
    config: {
      protocol,
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      slaveCount: 32,
      maxResponseTime: 100,
      ...overrides,
    },
    state: FieldbusState.Online,
    messages: [],
  };
}

export function createProcess(
  name: string,
  type: ProcessType,
  variables: ProcessVariable[] = [],
): PhysicalProcess {
  return {
    id: processId(),
    type,
    name,
    variables: variables.length > 0 ? variables : [
      { name: 'pressure', value: 50, unit: 'bar', setpoint: 50, min: 0, max: 100, alarmHigh: 80, alarmLow: 20, alarmHighHigh: 90, alarmLowLow: 10, timestamp: new Date(), quality: 'good' },
      { name: 'temperature', value: 150, unit: '°C', setpoint: 150, min: 0, max: 300, alarmHigh: 250, alarmLow: 50, alarmHighHigh: 280, alarmLowLow: 10, timestamp: new Date(), quality: 'good' },
      { name: 'flow', value: 100, unit: 'L/min', setpoint: 100, min: 0, max: 200, alarmHigh: 180, alarmLow: 20, alarmHighHigh: 190, alarmLowLow: 5, timestamp: new Date(), quality: 'good' },
    ],
    state: 'running',
    lastUpdated: new Date(),
  };
}

export function createAlarm(config: AlarmConfig, sourceId?: PlcId | RtuId | ProcessId): AlarmInstance {
  return {
    id: alarmId(),
    config,
    state: AlarmState.Normal,
    sourceId: sourceId ?? null,
    raisedAt: null,
    acknowledgedAt: null,
    returnedAt: null,
    shelvedUntil: null,
    acknowledgedBy: null,
    operatorNote: '',
  };
}

export function createZone(name: string, purdueLevel: PurdueLevel, description = ''): Zone {
  return { id: zoneId(), name, purdueLevel, description };
}

export function createCell(name: string, zoneId: ZoneId, description = ''): Cell {
  return { id: cellId(), name, zoneId, description };
}

/* ── Known ICS Attacks ── */

export function getKnownIcsAttacks(): IcsAttack[] {
  return [
    {
      id: icsAttackId(),
      type: IcsAttackType.Triton,
      name: 'TRITON/Trisis',
      targetProtocols: [ProtocolType.S7comm, ProtocolType.Profibus_DP],
      targetVendors: [PlcVendor.Schneider],
      targetModels: [PlcModel.Modicon_M580, PlcModel.Modicon_Quantum],
      mappedSections: ['Safety Instrumented System', 'SIS bypass'],
      description: 'Targets Schneider Electric Triconex safety instrumented system (SIS) controllers. Overwrites proprietary firmware to reprogram SIS logic.',
      estimatedImpact: 'Loss of safety functions, potential physical damage',
      mitreIcsTechniques: ['T0831', 'T0853', 'T0894'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.Industroyer,
      name: 'Industroyer/CrashOverride',
      targetProtocols: [ProtocolType.IEC60870_5_104, ProtocolType.IEC61850_MMS, ProtocolType.IEC61850_GOOSE, ProtocolType.OPC_DA],
      targetVendors: [],
      targetModels: [],
      mappedSections: ['Substation automation', 'Power grid control'],
      description: 'Modular malware targeting electrical substations. Speaks IEC 60870-5-104, IEC 61850, and OPC DA protocols natively.',
      estimatedImpact: 'Substation breaker manipulation, power outage',
      mitreIcsTechniques: ['T0831', 'T0842', 'T0885', 'T0896'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.Stuxnet,
      name: 'Stuxnet',
      targetProtocols: [ProtocolType.Profibus_DP, ProtocolType.S7comm],
      targetVendors: [PlcVendor.Siemens],
      targetModels: [PlcModel.S7_300, PlcModel.S7_400],
      mappedSections: ['Nuclear centrifuge control', 'PLC rootkit'],
      description: 'Targets Siemens S7-300/400 PLCs controlling uranium centrifuges. Modifies frequency converter output to overspin centrifuges while replaying normal sensor readings.',
      estimatedImpact: 'Physical destruction of centrifuges',
      mitreIcsTechniques: ['T0839', 'T0847', 'T0854', 'T0869'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.Havex,
      name: 'Havex/OT-Safe',
      targetProtocols: [ProtocolType.OPC_DA, ProtocolType.OPC_UA],
      targetVendors: [],
      targetModels: [],
      mappedSections: ['SCADA enumeration', 'OPC scan'],
      description: 'RAT targeting industrial control systems. Uses OPC DA/UA protocol to scan for SCADA systems and steal process data.',
      estimatedImpact: 'Reconnaissance, data exfiltration',
      mitreIcsTechniques: ['T0801', 'T0811', 'T0812'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.BlackEnergy,
      name: 'BlackEnergy',
      targetProtocols: [ProtocolType.IEC60870_5_104, ProtocolType.OPC_DA],
      targetVendors: [],
      targetModels: [],
      mappedSections: ['SCADA HMI', 'Process control'],
      description: 'Used in 2015 Ukraine power grid attack. Leveraged HMI access to open breakers via SCADA control. Included KillDisk component to damage systems.',
      estimatedImpact: 'Regional power outage affecting 225K customers',
      mitreIcsTechniques: ['T0811', 'T0883', 'T0896'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.Pipedream,
      name: 'Pipedream/INCONTROLLER',
      targetProtocols: [ProtocolType.ModbusTCP, ProtocolType.OPC_UA, ProtocolType.S7comm, ProtocolType.EtherCAT],
      targetVendors: [PlcVendor.Siemens, PlcVendor.AllenBradley, PlcVendor.Schneider, PlcVendor.Omron, PlcVendor.CODESYS],
      targetModels: [],
      mappedSections: ['PLC manipulation', 'OT payload framework'],
      description: 'Multi-vendor OT attack framework targeting controllers from multiple vendors. Uses CODESYS runtime exploitation and OPC UA discovery.',
      estimatedImpact: 'Multi-vendor industrial process disruption',
      mitreIcsTechniques: ['T0831', 'T0835', 'T0847', 'T0896'],
    },
    {
      id: icsAttackId(),
      type: IcsAttackType.COSMICENERGY,
      name: 'COSMICENERGY',
      targetProtocols: [ProtocolType.IEC60870_5_104],
      targetVendors: [],
      targetModels: [],
      mappedSections: ['Power grid', 'Telecontrol'],
      description: 'Targets IEC 60870-5-104 telecontrol protocol used in European power grid. Disconnects remote terminal units from control centers.',
      estimatedImpact: 'Loss of remote monitoring and control of substations',
      mitreIcsTechniques: ['T0833', 'T0842', 'T0896'],
    },
  ];
}

/* ── Alarm Criteria ── */

const ALARM_PRIORITY_COLORS: Record<AlarmPriority, string> = {
  [AlarmPriority.Journal]: 'gray',
  [AlarmPriority.Warning]: 'yellow',
  [AlarmPriority.Important]: 'orange',
  [AlarmPriority.Urgent]: 'darkorange',
  [AlarmPriority.Critical]: 'red',
  [AlarmPriority.Emergency]: 'magenta',
};

export function alarmColor(priority: AlarmPriority): string {
  return ALARM_PRIORITY_COLORS[priority];
}

export function alarmPriorityLabel(priority: AlarmPriority): string {
  const labels: Record<AlarmPriority, string> = {
    [AlarmPriority.Journal]: 'Journal',
    [AlarmPriority.Warning]: 'Warning',
    [AlarmPriority.Important]: 'Important',
    [AlarmPriority.Urgent]: 'Urgent',
    [AlarmPriority.Critical]: 'Critical',
    [AlarmPriority.Emergency]: 'Emergency',
  };
  return labels[priority];
}

/* ── Managers ── */

export class PlcManager {
  private plcs: Map<PlcId, PlcInstance> = new Map();
  private rtus: Map<RtuId, RtuInstance> = new Map();
  private fieldDevices: Map<FieldDeviceId, FieldDevice> = new Map();

  deployPlc(name: string, vendor: PlcVendor, model: PlcModel, config?: Partial<PlcConfig>): PlcInstance {
    const plc = createPlc(name, vendor, model, config);
    this.plcs.set(plc.id, plc);
    return plc;
  }

  getPlc(id: PlcId): PlcInstance | undefined {
    return this.plcs.get(id);
  }

  listPlcs(): PlcInstance[] {
    return Array.from(this.plcs.values());
  }

  listPlcsByVendor(vendor: PlcVendor): PlcInstance[] {
    return this.listPlcs().filter((p) => p.vendor === vendor);
  }

  listPlcsByStatus(status: PlcStatus): PlcInstance[] {
    return this.listPlcs().filter((p) => p.status === status);
  }

  listPlcsByZone(zone: ZoneId): PlcInstance[] {
    return this.listPlcs().filter((p) => p.zone === zone);
  }

  removePlc(id: PlcId): boolean {
    return this.plcs.delete(id);
  }

  setPlcStatus(id: PlcId, status: PlcStatus): boolean {
    const plc = this.plcs.get(id);
    if (!plc) return false;
    plc.status = status;
    return true;
  }

  assignPlcToCell(id: PlcId, cell: CellId): boolean {
    const plc = this.plcs.get(id);
    if (!plc) return false;
    plc.cell = cell;
    return true;
  }

  assignPlcToZone(id: PlcId, zone: ZoneId): boolean {
    const plc = this.plcs.get(id);
    if (!plc) return false;
    plc.zone = zone;
    return true;
  }

  updateScanTime(id: PlcId): boolean {
    const plc = this.plcs.get(id);
    if (!plc) return false;
    plc.lastScanTime = new Date();
    return true;
  }

  deployRtu(name: string, config?: Partial<RtuConfig>): RtuInstance {
    const rtu = createRtu(name, config);
    this.rtus.set(rtu.id, rtu);
    return rtu;
  }

  getRtu(id: RtuId): RtuInstance | undefined {
    return this.rtus.get(id);
  }

  listRtus(): RtuInstance[] {
    return Array.from(this.rtus.values());
  }

  removeRtu(id: RtuId): boolean {
    return this.rtus.delete(id);
  }

  addFieldDevice(device: FieldDevice): FieldDeviceId {
    this.fieldDevices.set(device.id, device);
    return device.id;
  }

  attachFieldDeviceToController(deviceId: FieldDeviceId, controllerId: PlcId | RtuId): boolean {
    const device = this.fieldDevices.get(deviceId);
    if (!device || (!this.plcs.has(controllerId as PlcId) && !this.rtus.has(controllerId as RtuId))) return false;
    device.plId = controllerId;
    return true;
  }

  getFieldDevice(id: FieldDeviceId): FieldDevice | undefined {
    return this.fieldDevices.get(id);
  }

  listFieldDevices(): FieldDevice[] {
    return Array.from(this.fieldDevices.values());
  }

  listFieldDevicesByController(controllerId: PlcId | RtuId): FieldDevice[] {
    return this.listFieldDevices().filter((d) => d.plId === controllerId);
  }

  removeFieldDevice(id: FieldDeviceId): boolean {
    return this.fieldDevices.delete(id);
  }

  getStats(): { plcs: number; running: number; error: number; rtus: number; devices: number } {
    return {
      plcs: this.plcs.size,
      running: this.listPlcs().filter((p) => p.status === PlcStatus.Running).length,
      error: this.listPlcs().filter((p) => p.status === PlcStatus.Error).length,
      rtus: this.rtus.size,
      devices: this.fieldDevices.size,
    };
  }

  clear(): void {
    this.plcs.clear();
    this.rtus.clear();
    this.fieldDevices.clear();
  }
}

export class FieldbusManager {
  private networks: Map<FieldbusId, FieldbusNetwork> = new Map();

  createNetwork(name: string, protocol: ProtocolType, config?: Partial<FieldbusConfig>): FieldbusNetwork {
    const net = createFieldbusNetwork(name, protocol, config);
    this.networks.set(net.id, net);
    return net;
  }

  getNetwork(id: FieldbusId): FieldbusNetwork | undefined {
    return this.networks.get(id);
  }

  listNetworks(): FieldbusNetwork[] {
    return Array.from(this.networks.values());
  }

  listNetworksByProtocol(protocol: ProtocolType): FieldbusNetwork[] {
    return this.listNetworks().filter((n) => n.config.protocol === protocol);
  }

  removeNetwork(id: FieldbusId): boolean {
    return this.networks.delete(id);
  }

  setNetworkState(id: FieldbusId, state: FieldbusState): boolean {
    const net = this.networks.get(id);
    if (!net) return false;
    net.state = state;
    return true;
  }

  sendMessage(
    networkId: FieldbusId,
    protocol: ProtocolType,
    source: string,
    destination: string,
    functionCode: number,
    data: number[],
    isResponse = false,
    error = false,
  ): FieldbusMessage | null {
    const net = this.networks.get(networkId);
    if (!net || net.state !== FieldbusState.Online) return null;

    const msg: FieldbusMessage = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      protocol,
      source,
      destination,
      functionCode,
      data,
      timestamp: new Date(),
      isResponse,
      error,
    };
    net.messages.push(msg);
    return msg;
  }

  getMessages(id: FieldbusId): FieldbusMessage[] {
    return this.networks.get(id)?.messages ?? [];
  }

  getStats(): { total: number; online: number; offline: number; messages: number } {
    const all = this.listNetworks();
    const totalMessages = all.reduce((sum, n) => sum + n.messages.length, 0);
    return {
      total: all.length,
      online: all.filter((n) => n.state === FieldbusState.Online).length,
      offline: all.filter((n) => n.state === FieldbusState.Offline).length,
      messages: totalMessages,
    };
  }

  clear(): void {
    this.networks.clear();
  }
}

export class ScadaManager {
  private hmis: Map<HmiId, HmiInstance> = new Map();
  private scadas: Map<ScadaId, ScadaInstance> = new Map();
  private dcs: Map<DcsId, DcsInstance> = new Map();
  private safetySystems: Map<SafetySystemId, SafetySystemInstance> = new Map();

  deployHmi(name: string, config?: Partial<HmiConfig>): HmiInstance {
    const hmi = createHmi(name, config);
    this.hmis.set(hmi.id, hmi);
    return hmi;
  }

  getHmi(id: HmiId): HmiInstance | undefined {
    return this.hmis.get(id);
  }

  listHmis(): HmiInstance[] {
    return Array.from(this.hmis.values());
  }

  removeHmi(id: HmiId): boolean {
    return this.hmis.delete(id);
  }

  connectHmiToPlc(hmiId: HmiId, plcId: PlcId): boolean {
    const hmi = this.hmis.get(hmiId);
    const plc = this.plcManager?.getPlc(plcId);
    if (!hmi || !plc) return false;
    if (!hmi.connectedPlcs.includes(plcId)) {
      hmi.connectedPlcs.push(plcId);
    }
    return true;
  }

  private plcManager: PlcManager | null = null;

  setPlcManager(pm: PlcManager): void {
    this.plcManager = pm;
  }

  deployScada(name: string, config?: Partial<ScadaConfig>): ScadaInstance {
    const scada = createScada(name, config);
    this.scadas.set(scada.id, scada);
    return scada;
  }

  getScada(id: ScadaId): ScadaInstance | undefined {
    return this.scadas.get(id);
  }

  listScadas(): ScadaInstance[] {
    return Array.from(this.scadas.values());
  }

  removeScada(id: ScadaId): boolean {
    return this.scadas.delete(id);
  }

  connectScadaToHmi(scadaId: ScadaId, hmiId: HmiId): boolean {
    const scada = this.scadas.get(scadaId);
    const hmi = this.hmis.get(hmiId);
    if (!scada || !hmi) return false;
    if (!scada.connectedHmis.includes(hmiId)) {
      scada.connectedHmis.push(hmiId);
    }
    return true;
  }

  connectScadaToPlc(scadaId: ScadaId, plcId: PlcId): boolean {
    const scada = this.scadas.get(scadaId);
    if (!scada) return false;
    if (!scada.connectedPlcs.includes(plcId)) {
      scada.connectedPlcs.push(plcId);
    }
    return true;
  }

  deployDcs(name: string, config?: Partial<DcsConfig>): DcsInstance {
    const dcsSys = createDcs(name, config);
    this.dcs.set(dcsSys.id, dcsSys);
    return dcsSys;
  }

  getDcs(id: DcsId): DcsInstance | undefined {
    return this.dcs.get(id);
  }

  listDcs(): DcsInstance[] {
    return Array.from(this.dcs.values());
  }

  removeDcs(id: DcsId): boolean {
    return this.dcs.delete(id);
  }

  deploySafetySystem(
    name: string,
    type: SafetySystemType,
    sil: SafetyIntegrityLevel,
    config?: Partial<SafetySystemConfig>,
  ): SafetySystemInstance {
    const sis = createSafetySystem(name, type, sil, config);
    this.safetySystems.set(sis.id, sis);
    return sis;
  }

  getSafetySystem(id: SafetySystemId): SafetySystemInstance | undefined {
    return this.safetySystems.get(id);
  }

  listSafetySystems(): SafetySystemInstance[] {
    return Array.from(this.safetySystems.values());
  }

  removeSafetySystem(id: SafetySystemId): boolean {
    return this.safetySystems.delete(id);
  }

  getStats(): { hmis: number; scadas: number; dcs: number; safetySystems: number } {
    return {
      hmis: this.hmis.size,
      scadas: this.scadas.size,
      dcs: this.dcs.size,
      safetySystems: this.safetySystems.size,
    };
  }

  clear(): void {
    this.hmis.clear();
    this.scadas.clear();
    this.dcs.clear();
    this.safetySystems.clear();
  }
}

export class AlarmManager {
  private alarms: Map<AlarmId, AlarmInstance> = new Map();
  private zones: Map<ZoneId, Zone> = new Map();
  private cells: Map<CellId, Cell> = new Map();
  private processes: Map<ProcessId, PhysicalProcess> = new Map();

  createAlarm(config: AlarmConfig, sourceId?: PlcId | RtuId | ProcessId): AlarmInstance {
    const alarm = createAlarm(config, sourceId);
    this.alarms.set(alarm.id, alarm);
    return alarm;
  }

  getAlarm(id: AlarmId): AlarmInstance | undefined {
    return this.alarms.get(id);
  }

  listAlarms(): AlarmInstance[] {
    return Array.from(this.alarms.values());
  }

  listActiveAlarms(): AlarmInstance[] {
    return this.listAlarms().filter((a) => a.state === AlarmState.Active || a.state === AlarmState.Acknowledged);
  }

  listAlarmsByPriority(priority: AlarmPriority): AlarmInstance[] {
    return this.listAlarms().filter((a) => a.config.priority === priority);
  }

  listAlarmsBySource(sourceId: PlcId | RtuId | ProcessId): AlarmInstance[] {
    return this.listAlarms().filter((a) => a.sourceId === sourceId);
  }

  removeAlarm(id: AlarmId): boolean {
    return this.alarms.delete(id);
  }

  raiseAlarm(id: AlarmId): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || alarm.state !== AlarmState.Normal) return false;
    alarm.state = AlarmState.Active;
    alarm.raisedAt = new Date();
    return true;
  }

  acknowledgeAlarm(id: AlarmId, operator: string): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || (alarm.state !== AlarmState.Active && alarm.state !== AlarmState.Acknowledged)) return false;
    alarm.state = AlarmState.Acknowledged;
    alarm.acknowledgedAt = new Date();
    alarm.acknowledgedBy = operator;
    return true;
  }

  returnToNormal(id: AlarmId): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || alarm.state === AlarmState.Normal) return false;
    alarm.state = AlarmState.ReturnedToNormal;
    alarm.returnedAt = new Date();
    return true;
  }

  shelveAlarm(id: AlarmId, durationMinutes: number): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || alarm.state !== AlarmState.Active) return false;
    alarm.state = AlarmState.Shelved;
    alarm.shelvedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
    return true;
  }

  unshelveAlarm(id: AlarmId): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || alarm.state !== AlarmState.Shelved) return false;
    alarm.state = AlarmState.Active;
    alarm.shelvedUntil = null;
    return true;
  }

  suppressAlarm(id: AlarmId): boolean {
    const alarm = this.alarms.get(id);
    if (!alarm || alarm.state === AlarmState.Normal) return false;
    alarm.state = AlarmState.Suppressed;
    return true;
  }

  addProcess(process: PhysicalProcess): ProcessId {
    this.processes.set(process.id, process);
    return process.id;
  }

  getProcess(id: ProcessId): PhysicalProcess | undefined {
    return this.processes.get(id);
  }

  listProcesses(): PhysicalProcess[] {
    return Array.from(this.processes.values());
  }

  removeProcess(id: ProcessId): boolean {
    return this.processes.delete(id);
  }

  updateProcessVariable(processId: ProcessId, variableName: string, value: number, quality?: ProcessVariable['quality']): boolean {
    const process = this.processes.get(processId);
    if (!process) return false;
    const variable = process.variables.find((v) => v.name === variableName);
    if (!variable) return false;
    variable.value = value;
    variable.timestamp = new Date();
    if (quality) variable.quality = quality;

    if (value >= variable.alarmHighHigh || value <= variable.alarmLowLow) {
      const alarms = this.listAlarms().filter((a) => a.sourceId === processId);
      const hasHiHi = alarms.some((a) => a.config.type === 'hi_hi' && a.config.tag === `${process.name}_${variableName}_hihi`);
      if (!hasHiHi) {
        this.createAlarm(
          { tag: `${process.name}_${variableName}_hihi`, description: `${variable.name} high-high alarm`, priority: AlarmPriority.Critical, type: 'hi_hi', limitValue: variable.alarmHighHigh, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 30, requiresAck: true },
          processId,
        );
      }
    } else if (value >= variable.alarmHigh || value <= variable.alarmLow) {
      const alarms = this.listAlarms().filter((a) => a.sourceId === processId);
      const hasHi = alarms.some((a) => a.config.type === 'hi' && a.config.tag === `${process.name}_${variableName}_hi`);
      if (!hasHi) {
        this.createAlarm(
          { tag: `${process.name}_${variableName}_hi`, description: `${variable.name} high alarm`, priority: AlarmPriority.Urgent, type: 'hi', limitValue: variable.alarmHigh, deadband: 0, onDelay: 0, offDelay: 0, shelveDuration: 30, requiresAck: true },
          processId,
        );
      }
    }

    process.lastUpdated = new Date();
    return true;
  }

  setProcessState(processId: ProcessId, state: PhysicalProcess['state']): boolean {
    const process = this.processes.get(processId);
    if (!process) return false;
    process.state = state;
    process.lastUpdated = new Date();
    return true;
  }

  addZone(zone: Zone): ZoneId {
    this.zones.set(zone.id, zone);
    return zone.id;
  }

  getZone(id: ZoneId): Zone | undefined {
    return this.zones.get(id);
  }

  listZones(): Zone[] {
    return Array.from(this.zones.values());
  }

  removeZone(id: ZoneId): boolean {
    return this.zones.delete(id);
  }

  addCell(cell: Cell): CellId {
    this.cells.set(cell.id, cell);
    return cell.id;
  }

  getCell(id: CellId): Cell | undefined {
    return this.cells.get(id);
  }

  listCells(): Cell[] {
    return Array.from(this.cells.values());
  }

  listCellsByZone(zoneId: ZoneId): Cell[] {
    return this.listCells().filter((c) => c.zoneId === zoneId);
  }

  removeCell(id: CellId): boolean {
    return this.cells.delete(id);
  }

  getStats(): { total: number; active: number; zones: number; cells: number; processes: number } {
    return {
      total: this.alarms.size,
      active: this.listActiveAlarms().length,
      zones: this.zones.size,
      cells: this.cells.size,
      processes: this.processes.size,
    };
  }

  clear(): void {
    this.alarms.clear();
    this.zones.clear();
    this.cells.clear();
    this.processes.clear();
  }
}

/* ── OT/ICS Coordinator ── */

export class OtIcsCoordinator {
  plcManager: PlcManager;
  fieldbusManager: FieldbusManager;
  scadaManager: ScadaManager;
  alarmManager: AlarmManager;
  private attacks: Map<IcsAttackId, IcsAttack> = new Map();
  private startedAt: Date;

  constructor() {
    this.plcManager = new PlcManager();
    this.fieldbusManager = new FieldbusManager();
    this.scadaManager = new ScadaManager();
    this.alarmManager = new AlarmManager();
    this.startedAt = new Date();

    this.scadaManager.setPlcManager(this.plcManager);
  }

  registerAttack(attack: IcsAttack): IcsAttackId {
    this.attacks.set(attack.id, attack);
    return attack.id;
  }

  getKnownAttacks(): IcsAttack[] {
    return Array.from(this.attacks.values());
  }

  getAttack(id: IcsAttackId): IcsAttack | undefined {
    return this.attacks.get(id);
  }

  getStats(): OtIcsStats {
    const plcStats = this.plcManager.getStats();
    const fbStats = this.fieldbusManager.getStats();
    const scadaStats = this.scadaManager.getStats();
    const alarmStats = this.alarmManager.getStats();

    return {
      totalPlcs: plcStats.plcs,
      runningPlcs: plcStats.running,
      errorPlcs: plcStats.error,
      totalRtus: plcStats.rtus,
      totalHmis: scadaStats.hmis,
      totalScadas: scadaStats.scadas,
      totalDcs: scadaStats.dcs,
      totalSafetySystems: scadaStats.safetySystems,
      totalFieldDevices: plcStats.devices,
      totalFieldbuses: fbStats.total,
      totalProcesses: alarmStats.processes,
      totalCells: alarmStats.cells,
      totalZones: alarmStats.zones,
      activeAlarms: alarmStats.active,
      totalAttacks: this.attacks.size,
    };
  }

  reset(): void {
    this.plcManager.clear();
    this.fieldbusManager.clear();
    this.scadaManager.clear();
    this.alarmManager.clear();
    this.attacks.clear();
    this.startedAt = new Date();
    this.scadaManager.setPlcManager(this.plcManager);
  }
}

export function createDefaultOtIcsEnvironment(): OtIcsCoordinator {
  const coord = new OtIcsCoordinator();

  const zone0 = createZone('Process Area A', PurdueLevel.Level0_Process, 'Physical process equipment');
  const zone1 = createZone('Control Room 1', PurdueLevel.Level1_Control, 'PLC and RTU cabinets');
  const zone2 = createZone('Supervisory Network', PurdueLevel.Level2_Supervisory, 'HMI and SCADA servers');
  const zone3 = createZone('Site Operations', PurdueLevel.Level3_SiteOperations, 'Operations center');

  coord.alarmManager.addZone(zone0);
  coord.alarmManager.addZone(zone1);
  coord.alarmManager.addZone(zone2);
  coord.alarmManager.addZone(zone3);

  const cellA = createCell('Reactor Cell A', zone1.id, 'Chemical reactor control cell');
  const cellB = createCell('Boiler Cell B', zone1.id, 'Steam boiler control cell');
  coord.alarmManager.addCell(cellA);
  coord.alarmManager.addCell(cellB);

  const plc1 = coord.plcManager.deployPlc('S7-1500 Reactor Controller', PlcVendor.Siemens, PlcModel.S7_1500, { ipAddress: '10.0.10.10' });
  coord.plcManager.assignPlcToZone(plc1.id, zone1.id);
  coord.plcManager.assignPlcToCell(plc1.id, cellA.id);

  const plc2 = coord.plcManager.deployPlc('ControlLogix Packing Line', PlcVendor.AllenBradley, PlcModel.ControlLogix_5580, { ipAddress: '10.0.10.20' });
  coord.plcManager.assignPlcToZone(plc2.id, zone1.id);
  coord.plcManager.assignPlcToCell(plc2.id, cellB.id);

  const plc3 = coord.plcManager.deployPlc('Modicon M580 Safety PLC', PlcVendor.Schneider, PlcModel.Modicon_M580, { ipAddress: '10.0.10.30' });
  coord.plcManager.assignPlcToZone(plc3.id, zone1.id);
  coord.plcManager.assignPlcToCell(plc3.id, cellA.id);

  const rtu1 = coord.plcManager.deployRtu('SEL-3622 Remote Station A', { ipAddress: '10.0.20.1' });
  const rtu2 = coord.plcManager.deployRtu('SEL-3622 Remote Station B', { ipAddress: '10.0.20.2' });

  const sensor1 = createSensor('Pressure Transmitter PT-101', ProcessType.ChemicalReactor, { address: 1, measurementRange: [0, 400], unit: 'bar', accuracy: 0.1 });
  const sensor2 = createSensor('Temperature Transmitter TT-201', ProcessType.ChemicalReactor, { address: 2, measurementRange: [0, 500], unit: '°C', accuracy: 0.5 });
  const actuator1 = createActuator('Control Valve CV-301', ProcessType.ChemicalReactor, { address: 3, actuationType: 'analog', responseTime: 50 });
  const actuator2 = createActuator('Solenoid Valve SV-401', ProcessType.PumpStation, { address: 4, actuationType: 'digital', responseTime: 20 });

  coord.plcManager.addFieldDevice(sensor1);
  coord.plcManager.addFieldDevice(sensor2);
  coord.plcManager.addFieldDevice(actuator1);
  coord.plcManager.addFieldDevice(actuator2);

  coord.plcManager.attachFieldDeviceToController(sensor1.id, plc1.id);
  coord.plcManager.attachFieldDeviceToController(sensor2.id, plc1.id);
  coord.plcManager.attachFieldDeviceToController(actuator1.id, plc1.id);
  coord.plcManager.attachFieldDeviceToController(actuator2.id, plc2.id);

  const profibusNet = coord.fieldbusManager.createNetwork('Profibus PA Loop 1', ProtocolType.Profibus_PA, { baudRate: 31250, slaveCount: 16 });
  const modbusNet = coord.fieldbusManager.createNetwork('Modbus TCP Cell A', ProtocolType.ModbusTCP, { baudRate: 100000000, slaveCount: 8 });

  const hmi1 = coord.scadaManager.deployHmi('Operator Console 1', { vendor: 'Siemens', version: 'WinCC V7.5 SP2', screenCount: 24 });
  const hmi2 = coord.scadaManager.deployHmi('Operator Console 2', { vendor: 'Rockwell', version: 'FactoryTalk View 14.0', screenCount: 12 });

  coord.scadaManager.connectHmiToPlc(hmi1.id, plc1.id);
  coord.scadaManager.connectHmiToPlc(hmi1.id, plc3.id);
  coord.scadaManager.connectHmiToPlc(hmi2.id, plc2.id);

  const scada = coord.scadaManager.deployScada('Plant SCADA Server', { vendor: ScadaVendor.Wonderware, version: '2023 R2' });
  coord.scadaManager.connectScadaToHmi(scada.id, hmi1.id);
  coord.scadaManager.connectScadaToHmi(scada.id, hmi2.id);
  coord.scadaManager.connectScadaToPlc(scada.id, plc1.id);
  coord.scadaManager.connectScadaToPlc(scada.id, plc2.id);
  coord.scadaManager.connectScadaToPlc(scada.id, plc3.id);

  const dcs = coord.scadaManager.deployDcs('DeltaV Process Controller', { vendor: DcsVendor.EmersonDeltaV, controllers: 16 });
  const sis = coord.scadaManager.deploySafetySystem('ESD-101 Emergency Shutdown', SafetySystemType.EmergencyShutdown, SafetyIntegrityLevel.SIL3);

  const reactor = createProcess('Chemical Reactor R-101', ProcessType.ChemicalReactor);
  const boiler = createProcess('Steam Boiler B-201', ProcessType.Boiler, [
    { name: 'drum_level', value: 50, unit: '%', setpoint: 50, min: 0, max: 100, alarmHigh: 80, alarmLow: 20, alarmHighHigh: 90, alarmLowLow: 10, timestamp: new Date(), quality: 'good' },
    { name: 'steam_pressure', value: 40, unit: 'bar', setpoint: 42, min: 0, max: 60, alarmHigh: 55, alarmLow: 30, alarmHighHigh: 58, alarmLowLow: 25, timestamp: new Date(), quality: 'good' },
    { name: 'feedwater_flow', value: 200, unit: 'L/min', setpoint: 200, min: 0, max: 400, alarmHigh: 350, alarmLow: 50, alarmHighHigh: 380, alarmLowLow: 20, timestamp: new Date(), quality: 'good' },
  ]);

  coord.alarmManager.addProcess(reactor);
  coord.alarmManager.addProcess(boiler);

  for (const attack of getKnownIcsAttacks()) {
    coord.registerAttack(attack);
  }

  return coord;
}
