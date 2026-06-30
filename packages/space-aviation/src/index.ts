import { uid } from '@cybersim/shared';

// ─── Branded IDs ────────────────────────────────────────────────
export type SatelliteId = string & { readonly __brand: unique symbol };
export const satelliteId = (): SatelliteId => uid() as unknown as SatelliteId;

export type GroundStationId = string & { readonly __brand: unique symbol };
export const groundStationId = (): GroundStationId => uid() as unknown as GroundStationId;

export type AircraftId = string & { readonly __brand: unique symbol };
export const aircraftId = (): AircraftId => uid() as unknown as AircraftId;

export type UavId = string & { readonly __brand: unique symbol };
export const uavId = (): UavId => uid() as unknown as UavId;

export type AvionicsSystemId = string & { readonly __brand: unique symbol };
export const avionicsSystemId = (): AvionicsSystemId => uid() as unknown as AvionicsSystemId;

export type SpaceProtocolMessageId = string & { readonly __brand: unique symbol };
export const spaceProtocolMessageId = (): SpaceProtocolMessageId => uid() as unknown as SpaceProtocolMessageId;

export type GnssSignalId = string & { readonly __brand: unique symbol };
export const gnssSignalId = (): GnssSignalId => uid() as unknown as GnssSignalId;

export type AcarsMessageId = string & { readonly __brand: unique symbol };
export const acarsMessageId = (): AcarsMessageId => uid() as unknown as AcarsMessageId;

export type AdsBMessageId = string & { readonly __brand: unique symbol };
export const adsBMessageId = (): AdsBMessageId => uid() as unknown as AdsBMessageId;

export type MavLinkMessageId = string & { readonly __brand: unique symbol };
export const mavLinkMessageId = (): MavLinkMessageId => uid() as unknown as MavLinkMessageId;

export type SecurityFindingId = string & { readonly __brand: unique symbol };
export const securityFindingId = (): SecurityFindingId => uid() as unknown as SecurityFindingId;

export type AttackScenarioId = string & { readonly __brand: unique symbol };
export const attackScenarioId = (): AttackScenarioId => uid() as unknown as AttackScenarioId;

// ─── Enums ───────────────────────────────────────────────────────
export enum SatelliteType {
  GEO = 'GEO',
  MEO = 'MEO',
  LEO = 'LEO',
  SSO = 'SSO',
  HEO = 'HEO',
}
export enum SatelliteStatus {
  Operational = 'Operational',
  Degraded = 'Degraded',
  Safing = 'Safing',
  Offline = 'Offline',
  Deorbited = 'Deorbited',
}
export enum OrbitBand {
  L = 'L',
  S = 'S',
  C = 'C',
  X = 'X',
  Ku = 'Ku',
  Ka = 'Ka',
  V = 'V',
  W = 'W',
}
export enum CcsdsMessageType {
  Telecommand = 'Telecommand',
  Telemetry = 'Telemetry',
  AosFrame = 'AosFrame',
  FileDelivery = 'FileDelivery',
  SleForward = 'SleForward',
  SleReturn = 'SleReturn',
}
export enum GnssConstellation {
  GPS = 'GPS',
  GLONASS = 'GLONASS',
  Galileo = 'Galileo',
  BeiDou = 'BeiDou',
  IRNSS = 'IRNSS',
  QZSS = 'QZSS',
}
export enum GnssSignalBand {
  L1 = 'L1',
  L2 = 'L2',
  L5 = 'L5',
  E1 = 'E1',
  E5 = 'E5',
  E6 = 'E6',
  B1 = 'B1',
  B2 = 'B2',
  B3 = 'B3',
  G1 = 'G1',
  G2 = 'G2',
  G3 = 'G3',
}
export enum AircraftType {
  Commercial = 'Commercial',
  Cargo = 'Cargo',
  GeneralAviation = 'GeneralAviation',
  Military = 'Military',
  Helicopter = 'Helicopter',
  BusinessJet = 'BusinessJet',
}
export enum AcarsDataType {
  Position = 'Position',
  Weather = 'Weather',
  Engine = 'Engine',
  Fuel = 'Fuel',
  Maintenance = 'Maintenance',
  FlightPlan = 'FlightPlan',
  FreeText = 'FreeText',
}
export enum AdsBMessageType {
  Position = 'Position',
  Velocity = 'Velocity',
  Identification = 'Identification',
  Status = 'Status',
  TargetState = 'TargetState',
}
export enum MavLinkComponent {
  Autopilot = 'Autopilot',
  Camera = 'Camera',
  Gimbal = 'Gimbal',
  Battery = 'Battery',
  GCS = 'GCS',
  AntennaTracker = 'AntennaTracker',
}
export enum MavLinkMessageType {
  Heartbeat = 'Heartbeat',
  Attitude = 'Attitude',
  GlobalPosition = 'GlobalPosition',
  BatteryStatus = 'BatteryStatus',
  Command = 'Command',
  MissionItem = 'MissionItem',
}
export enum AvionicsSystemType {
  FMS = 'FMS',
  EFB = 'EFB',
  TCAS = 'TCAS',
  TAWS = 'TAWS',
  WeatherRadar = 'WeatherRadar',
  ILS = 'ILS',
  FlightDirector = 'FlightDirector',
  Autopilot = 'Autopilot',
}
export enum Arinc429Label {
  Latitude = '310',
  Longitude = '311',
  Altitude = '203',
  GroundSpeed = '312',
  TrueHeading = '314',
  Mach = '205',
  VerticalSpeed = '216',
}
export enum SatellitePayload {
  Comms = 'Comms',
  Navigation = 'Navigation',
  EarthObservation = 'EarthObservation',
  SIGINT = 'SIGINT',
  ELINT = 'ELINT',
  Weather = 'Weather',
  Science = 'Science',
  MissileWarning = 'MissileWarning',
  AmateurRadio = 'AmateurRadio',
}
export enum SpaceAttackType {
  GPSJamming = 'GPSJamming',
  GPSSpoofing = 'GPSSpoofing',
  SATCOMInterference = 'SATCOMInterference',
  CommandInjection = 'CommandInjection',
  TelemetryTampering = 'TelemetryTampering',
  ACARSInjection = 'ACARSInjection',
  ADSBSpoofing = 'ADSBSpoofing',
  AntiSatellite = 'AntiSatellite',
  GroundStationBreach = 'GroundStationBreach',
  LinkInterception = 'LinkInterception',
  Meaconing = 'Meaconing',
}
export enum Do326aSecurityLevel {
  A = 'A', // Catastrophic
  B = 'B', // Hazardous
  C = 'C', // Major
  D = 'D', // Minor
  E = 'E', // No Effect
}
export enum UavFlightMode {
  Manual = 'Manual',
  Stabilized = 'Stabilized',
  AltHold = 'AltHold',
  Loiter = 'Loiter',
  RTL = 'RTL',
  Auto = 'Auto',
  Guided = 'Guided',
  Circle = 'Circle',
  FollowMe = 'FollowMe',
}
export enum GroundStationCapability {
  TTCAntenna = 'TTCAntenna',
  CommsAntenna = 'CommsAntenna',
  DataDownlink = 'DataDownlink',
  Telecommand = 'Telecommand',
  Ranging = 'Ranging',
  DopplerTracking = 'DopplerTracking',
}

// ─── Interfaces ─────────────────────────────────────────────────
export interface Satellite {
  id: SatelliteId;
  name: string;
  type: SatelliteType;
  status: SatelliteStatus;
  orbitAltitude: number; // km
  orbitInclination: number; // degrees
  period: number; // minutes
  noradId: number;
  payloads: SatellitePayload[];
  bands: OrbitBand[];
  manufacturer: string;
  launchYear: number;
  expectedLifespan: number; // years
  station: GroundStationId | null;
}

export interface GroundStation {
  id: GroundStationId;
  name: string;
  lat: number;
  lon: number;
  capabilities: GroundStationCapability[];
  bands: OrbitBand[];
  connectedSatellites: SatelliteId[];
  uptimePercent: number;
  isCompromised: boolean;
}

export interface Aircraft {
  id: AircraftId;
  flight: string;
  type: AircraftType;
  registration: string;
  lat: number;
  lon: number;
  altitude: number; // feet
  speed: number; // knots
  heading: number; // degrees
  squawk: string;
  isOnGround: boolean;
}

export interface Uav {
  id: UavId;
  name: string;
  model: string;
  flightMode: UavFlightMode;
  lat: number;
  lon: number;
  altitude: number; // m AGL
  speed: number; // m/s
  batteryPercent: number;
  isArmed: boolean;
  homeLat: number;
  homeLon: number;
  geofenceRadius: number; // m
  insideGeofence: boolean;
}

export interface AvionicsSystem {
  id: AvionicsSystemId;
  type: AvionicsSystemType;
  aircraftId: AircraftId;
  isOnline: boolean;
  softwareVersion: string;
  lastCalibration: number; // timestamp
  hasIntegrityWarning: boolean;
}

export interface SpaceProtocolMessage {
  id: SpaceProtocolMessageId;
  type: CcsdsMessageType;
  source: string;
  destination: string;
  data: string;
  timestamp: number;
  isEncrypted: boolean;
  isValid: boolean;
  protocolVersion: string;
}

export interface GnssSignal {
  id: GnssSignalId;
  constellation: GnssConstellation;
  band: GnssSignalBand;
  signalType: 'civil' | 'military';
  prn: number;
  snr: number; // dB-Hz
  isJammed: boolean;
  isSpoofed: boolean;
  timestamp: number;
}

export interface AcarsMessage {
  id: AcarsMessageId;
  aircraftId: AircraftId;
  dataType: AcarsDataType;
  content: string;
  timestamp: number;
  isAuthenticated: boolean;
  isInjected: boolean;
}

export interface AdsBMessage {
  id: AdsBMessageId;
  aircraftId: AircraftId;
  messageType: AdsBMessageType;
  lat: number;
  lon: number;
  altitude: number;
  speed: number;
  heading: number;
  icao24: string;
  isSpoofed: boolean;
  timestamp: number;
}

export interface MavLinkMessage {
  id: MavLinkMessageId;
  sourceComponent: MavLinkComponent;
  targetComponent: MavLinkComponent;
  messageType: MavLinkMessageType;
  payload: Record<string, number>;
  timestamp: number;
  isAuthenticated: boolean;
}

export interface Arinc429Word {
  label: Arinc429Label;
  data: number;
  ssm: 'normal' | 'failure' | 'noData' | 'test';
  parity: 'even' | 'odd';
  source: string;
}

export interface LinkBudget {
  frequencyGHz: number;
  txPower: number; // dBm
  txGain: number; // dBi
  rxGain: number; // dBi
  distance: number; // km
  freeSpaceLoss: number; // dB
  atmosphericLoss: number; // dB
  rainLoss: number; // dB
  rxPower: number; // dBm
  rxSensitivity: number; // dBm
  margin: number; // dB
  isFeasible: boolean;
}

export interface SecurityFinding {
  id: SecurityFindingId;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  domain: 'space' | 'aviation' | 'uav';
  do326aLevel: Do326aSecurityLevel | null;
  mitigated: boolean;
  timestamp: number;
}

export interface AttackScenario {
  id: AttackScenarioId;
  type: SpaceAttackType;
  name: string;
  description: string;
  target: string;
  impact: string;
  mitreTechniqueId: string;
  cvssScore: number;
  isActive: boolean;
}

// ─── Factory Functions ──────────────────────────────────────────
export function createSatellite(overrides?: Partial<Satellite>): Satellite {
  return {
    id: satelliteId(),
    name: 'Satellite-1',
    type: SatelliteType.LEO,
    status: SatelliteStatus.Operational,
    orbitAltitude: 550,
    orbitInclination: 53,
    period: 95,
    noradId: 99999,
    payloads: [SatellitePayload.Comms],
    bands: [OrbitBand.Ku],
    manufacturer: 'SpaceCorp',
    launchYear: 2024,
    expectedLifespan: 5,
    station: null,
    ...overrides,
  };
}

export function createGroundStation(overrides?: Partial<GroundStation>): GroundStation {
  return {
    id: groundStationId(),
    name: 'Primary-GS',
    lat: 35.5,
    lon: -120.5,
    capabilities: [GroundStationCapability.TTCAntenna, GroundStationCapability.CommsAntenna],
    bands: [OrbitBand.S, OrbitBand.X],
    connectedSatellites: [],
    uptimePercent: 99.5,
    isCompromised: false,
    ...overrides,
  };
}

export function createAircraft(overrides?: Partial<Aircraft>): Aircraft {
  return {
    id: aircraftId(),
    flight: 'SA123',
    type: AircraftType.Commercial,
    registration: 'N12345',
    lat: 40.7,
    lon: -74.0,
    altitude: 35000,
    speed: 450,
    heading: 270,
    squawk: '1200',
    isOnGround: false,
    ...overrides,
  };
}

export function createUav(overrides?: Partial<Uav>): Uav {
  return {
    id: uavId(),
    name: 'Quad-1',
    model: 'DJI Matrice 300',
    flightMode: UavFlightMode.Loiter,
    lat: 34.05,
    lon: -118.25,
    altitude: 50,
    speed: 5,
    batteryPercent: 85,
    isArmed: false,
    homeLat: 34.05,
    homeLon: -118.25,
    geofenceRadius: 500,
    insideGeofence: true,
    ...overrides,
  };
}

export function createAvionicsSystem(overrides?: Partial<AvionicsSystem>): AvionicsSystem {
  return {
    id: avionicsSystemId(),
    type: AvionicsSystemType.FMS,
    aircraftId: '' as AircraftId,
    isOnline: true,
    softwareVersion: '3.2.1',
    lastCalibration: Date.now(),
    hasIntegrityWarning: false,
    ...overrides,
  };
}

export function createSpaceProtocolMessage(overrides?: Partial<SpaceProtocolMessage>): SpaceProtocolMessage {
  return {
    id: spaceProtocolMessageId(),
    type: CcsdsMessageType.Telemetry,
    source: 'SAT-001',
    destination: 'GS-MAIN',
    data: 'hex:0A1B2C3D',
    timestamp: Date.now(),
    isEncrypted: false,
    isValid: true,
    protocolVersion: 'CCSDS 732.0-B-3',
    ...overrides,
  };
}

export function createGnssSignal(overrides?: Partial<GnssSignal>): GnssSignal {
  return {
    id: gnssSignalId(),
    constellation: GnssConstellation.GPS,
    band: GnssSignalBand.L1,
    signalType: 'civil',
    prn: 1,
    snr: 45,
    isJammed: false,
    isSpoofed: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createAcarsMessage(overrides?: Partial<AcarsMessage>): AcarsMessage {
  return {
    id: acarsMessageId(),
    aircraftId: '' as AircraftId,
    dataType: AcarsDataType.Position,
    content: 'POS N40.7 W074.0 ALT35000',
    timestamp: Date.now(),
    isAuthenticated: true,
    isInjected: false,
    ...overrides,
  };
}

export function createAdsBMessage(overrides?: Partial<AdsBMessage>): AdsBMessage {
  return {
    id: adsBMessageId(),
    aircraftId: '' as AircraftId,
    messageType: AdsBMessageType.Position,
    lat: 40.7,
    lon: -74.0,
    altitude: 35000,
    speed: 450,
    heading: 270,
    icao24: 'A1B2C3',
    isSpoofed: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createMavLinkMessage(overrides?: Partial<MavLinkMessage>): MavLinkMessage {
  return {
    id: mavLinkMessageId(),
    sourceComponent: MavLinkComponent.Autopilot,
    targetComponent: MavLinkComponent.GCS,
    messageType: MavLinkMessageType.Heartbeat,
    payload: { custom_mode: 0, type: 2, autopilot: 3 },
    timestamp: Date.now(),
    isAuthenticated: true,
    ...overrides,
  };
}

export function createArinc429Word(overrides?: Partial<Arinc429Word>): Arinc429Word {
  return {
    label: Arinc429Label.Altitude,
    data: 35000,
    ssm: 'normal',
    parity: 'even',
    source: 'ADC-1',
    ...overrides,
  };
}

export function createLinkBudget(overrides?: Partial<LinkBudget>): LinkBudget {
  const freq = 12; // GHz
  const dist = 35786; // GEO
  const fspl = 92.45 + 20 * Math.log10(freq) + 20 * Math.log10(dist);
  const txP = 20;
  const txG = 30;
  const rxG = 40;
  const atmLoss = 0.3;
  const rainLoss = 2.0;
  const rxP = txP + txG + rxG - fspl - atmLoss - rainLoss;
  const rxSens = -120;
  return {
    frequencyGHz: freq,
    txPower: txP,
    txGain: txG,
    rxGain: rxG,
    distance: dist,
    freeSpaceLoss: Math.round(fspl * 100) / 100,
    atmosphericLoss: atmLoss,
    rainLoss: rainLoss,
    rxPower: Math.round(rxP * 100) / 100,
    rxSensitivity: rxSens,
    margin: Math.round((rxP - rxSens) * 100) / 100,
    isFeasible: rxP > rxSens,
    ...overrides,
  };
}

export function createSecurityFinding(overrides?: Partial<SecurityFinding>): SecurityFinding {
  return {
    id: securityFindingId(),
    description: 'Unencrypted telemetry link',
    severity: 'high',
    domain: 'space',
    do326aLevel: Do326aSecurityLevel.C,
    mitigated: false,
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createAttackScenario(overrides?: Partial<AttackScenario>): AttackScenario {
  return {
    id: attackScenarioId(),
    type: SpaceAttackType.GPSSpoofing,
    name: 'GPS Spoofing Attack',
    description: 'Spoofed GPS signals cause navigation deviation',
    target: 'Civil aviation GPS receiver',
    impact: 'Aircraft navigation deviation up to 10nm',
    mitreTechniqueId: 'T1565.001',
    cvssScore: 8.1,
    isActive: false,
    ...overrides,
  };
}

export function getKnownSpaceAttacks(): AttackScenario[] {
  return [
    {
      id: attackScenarioId(),
      type: SpaceAttackType.GPSSpoofing,
      name: 'GPS Spoofing Pattern',
      description: 'Spoofed civil GPS signals causing time/frequency manipulation. Seen in maritime GPS incidents (2017 Black Sea)',
      target: 'L1 C/A civilian receivers',
      impact: 'Position/time offset, navigation failure, AIS/GPS time mismatch',
      mitreTechniqueId: 'T1565.001',
      cvssScore: 8.1,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.GPSJamming,
      name: 'GPS Jamming Pattern',
      description: 'Broadband GPS jamming for denial of service. Documented in military exercises and drone interdiction',
      target: 'L1/L2/L5 GNSS bands',
      impact: 'Complete loss of GPS reception within jamming radius',
      mitreTechniqueId: 'T1499',
      cvssScore: 7.5,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.SATCOMInterference,
      name: 'SATCOM Jamming Pattern',
      description: 'Uplink/downlink interference against commercial satellite communications',
      target: 'Ku/Ka band VSAT terminals',
      impact: 'Loss of satcom connectivity, degraded throughput',
      mitreTechniqueId: 'T1499',
      cvssScore: 6.5,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.CommandInjection,
      name: 'Satellite Command Injection',
      description: 'Unauthorized telecommand injection via compromised ground station or RF link',
      target: 'GEO/LEO satellite TT&C link',
      impact: 'Potential satellite maneuver, payload disable, or safing event',
      mitreTechniqueId: 'T1565.002',
      cvssScore: 9.0,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.ACARSInjection,
      name: 'ACARS Message Injection',
      description: 'Spurious ACARS messages injected into VHF/HF/SATCOM datalink',
      target: 'ACARS VHF/HF/SATCOM datalink',
      impact: 'False flight plan, diversion orders, weather data spoofing',
      mitreTechniqueId: 'T1565.001',
      cvssScore: 7.8,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.ADSBSpoofing,
      name: 'ADS-B Ghost Aircraft Injection',
      description: 'Fabricated ADS-B messages creating phantom aircraft or false position data',
      target: '1090 MHz ADS-B Out',
      impact: 'Air traffic control confusion, TCAS false alerts, airspace closure',
      mitreTechniqueId: 'T1565.001',
      cvssScore: 6.2,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.AntiSatellite,
      name: 'Anti-Satellite Weapon Pattern',
      description: 'Kinetic or non-kinetic ASAT capability against LEO satellites',
      target: 'LEO satellite constellation',
      impact: 'Satellite destruction, debris cloud, mission loss',
      mitreTechniqueId: 'T1499',
      cvssScore: 9.5,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.GroundStationBreach,
      name: 'Ground Station Cyber Intrusion',
      description: 'Network-based compromise of satellite ground station infrastructure',
      target: 'Satellite ground station IT/OT network',
      impact: 'Satellite command access, telemetry exfiltration, malware persistence',
      mitreTechniqueId: 'T1190',
      cvssScore: 8.8,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.Meaconing,
      name: 'GNSS Meaconing Attack',
      description: 'Reception and rebroadcast of GNSS signals with delay to cause position offset',
      target: 'GNSS receivers',
      impact: 'False position fix, timing offset, navigation error',
      mitreTechniqueId: 'T1565.001',
      cvssScore: 7.2,
      isActive: false,
    },
    {
      id: attackScenarioId(),
      type: SpaceAttackType.LinkInterception,
      name: 'SATCOM Link Interception',
      description: 'Passive interception of satellite communications for intelligence gathering',
      target: 'Commercial/government satellite links',
      impact: 'Data exfiltration, traffic analysis, metadata exposure',
      mitreTechniqueId: 'T1046',
      cvssScore: 5.5,
      isActive: false,
    },
  ];
}

// ─── SatelliteManager ───────────────────────────────────────────
export class SatelliteManager {
  private satellites: Map<string, Satellite> = new Map();

  add(sat: Satellite): void { this.satellites.set(sat.id, sat); }
  get(id: SatelliteId): Satellite | undefined { return this.satellites.get(id); }
  remove(id: SatelliteId): void { this.satellites.delete(id); }
  list(): Satellite[] { return Array.from(this.satellites.values()); }
  clear(): void { this.satellites.clear(); }

  filterByType(type: SatelliteType): Satellite[] {
    return this.list().filter(s => s.type === type);
  }
  filterByStatus(status: SatelliteStatus): Satellite[] {
    return this.list().filter(s => s.status === status);
  }
  filterByPayload(payload: SatellitePayload): Satellite[] {
    return this.list().filter(s => s.payloads.includes(payload));
  }
  filterByBand(band: OrbitBand): Satellite[] {
    return this.list().filter(s => s.bands.includes(band));
  }
  getGeoCount(): number { return this.filterByType(SatelliteType.GEO).length; }
  getLeoCcount(): number { return this.filterByType(SatelliteType.LEO).length; }
  getMeoCount(): number { return this.filterByType(SatelliteType.MEO).length; }
  getTotalCount(): number { return this.satellites.size; }
}

// ─── GroundStationManager ───────────────────────────────────────
export class GroundStationManager {
  private stations: Map<string, GroundStation> = new Map();

  add(gs: GroundStation): void { this.stations.set(gs.id, gs); }
  get(id: GroundStationId): GroundStation | undefined { return this.stations.get(id); }
  remove(id: GroundStationId): void { this.stations.delete(id); }
  list(): GroundStation[] { return Array.from(this.stations.values()); }
  clear(): void { this.stations.clear(); }

  filterByCapability(cap: GroundStationCapability): GroundStation[] {
    return this.list().filter(gs => gs.capabilities.includes(cap));
  }
  filterByBand(band: OrbitBand): GroundStation[] {
    return this.list().filter(gs => gs.bands.includes(band));
  }
  filterCompromised(): GroundStation[] {
    return this.list().filter(gs => gs.isCompromised);
  }
  getTotalCount(): number { return this.stations.size; }
}

// ─── AircraftManager ────────────────────────────────────────────
export class AircraftManager {
  private aircraft: Map<string, Aircraft> = new Map();

  add(ac: Aircraft): void { this.aircraft.set(ac.id, ac); }
  get(id: AircraftId): Aircraft | undefined { return this.aircraft.get(id); }
  remove(id: AircraftId): void { this.aircraft.delete(id); }
  list(): Aircraft[] { return Array.from(this.aircraft.values()); }
  clear(): void { this.aircraft.clear(); }

  filterByType(type: AircraftType): Aircraft[] {
    return this.list().filter(a => a.type === type);
  }
  filterByAltitude(min: number, max: number): Aircraft[] {
    return this.list().filter(a => a.altitude >= min && a.altitude <= max);
  }
  filterByRegion(latMin: number, latMax: number, lonMin: number, lonMax: number): Aircraft[] {
    return this.list().filter(a =>
      a.lat >= latMin && a.lat <= latMax &&
      a.lon >= lonMin && a.lon <= lonMax
    );
  }
  filterOnGround(): Aircraft[] {
    return this.list().filter(a => a.isOnGround);
  }
  getInAirCount(): number { return this.list().filter(a => !a.isOnGround).length; }
  getTotalCount(): number { return this.aircraft.size; }
}

// ─── UavManager ─────────────────────────────────────────────────
export class UavManager {
  private uavs: Map<string, Uav> = new Map();

  add(uav: Uav): void { this.uavs.set(uav.id, uav); }
  get(id: UavId): Uav | undefined { return this.uavs.get(id); }
  remove(id: UavId): void { this.uavs.delete(id); }
  list(): Uav[] { return Array.from(this.uavs.values()); }
  clear(): void { this.uavs.clear(); }

  filterByMode(mode: UavFlightMode): Uav[] {
    return this.list().filter(u => u.flightMode === mode);
  }
  filterArmed(): Uav[] { return this.list().filter(u => u.isArmed); }
  filterInsideGeofence(): Uav[] { return this.list().filter(u => u.insideGeofence); }
  filterOutsideGeofence(): Uav[] { return this.list().filter(u => !u.insideGeofence); }
  filterByBatteryThreshold(minPercent: number): Uav[] {
    return this.list().filter(u => u.batteryPercent <= minPercent);
  }
  updateGeofence(id: UavId, newRadius: number): boolean {
    const uav = this.uavs.get(id);
    if (!uav) return false;
    uav.geofenceRadius = newRadius;
    return true;
  }
  getTotalCount(): number { return this.uavs.size; }
}

// ─── AvionicsManager ────────────────────────────────────────────
export class AvionicsManager {
  private systems: Map<string, AvionicsSystem> = new Map();

  add(sys: AvionicsSystem): void { this.systems.set(sys.id, sys); }
  get(id: AvionicsSystemId): AvionicsSystem | undefined { return this.systems.get(id); }
  remove(id: AvionicsSystemId): void { this.systems.delete(id); }
  list(): AvionicsSystem[] { return Array.from(this.systems.values()); }
  clear(): void { this.systems.clear(); }

  filterByType(type: AvionicsSystemType): AvionicsSystem[] {
    return this.list().filter(s => s.type === type);
  }
  filterByAircraft(aircraftId: AircraftId): AvionicsSystem[] {
    return this.list().filter(s => s.aircraftId === aircraftId);
  }
  filterOnline(): AvionicsSystem[] { return this.list().filter(s => s.isOnline); }
  filterOffline(): AvionicsSystem[] { return this.list().filter(s => !s.isOnline); }
  filterIntegrityWarnings(): AvionicsSystem[] {
    return this.list().filter(s => s.hasIntegrityWarning);
  }
  getTotalCount(): number { return this.systems.size; }
}

// ─── MessageManagers ────────────────────────────────────────────
export class SpaceProtocolManager {
  private messages: Map<string, SpaceProtocolMessage> = new Map();

  add(msg: SpaceProtocolMessage): void { this.messages.set(msg.id, msg); }
  get(id: SpaceProtocolMessageId): SpaceProtocolMessage | undefined { return this.messages.get(id); }
  remove(id: SpaceProtocolMessageId): void { this.messages.delete(id); }
  list(): SpaceProtocolMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }

  filterByType(type: CcsdsMessageType): SpaceProtocolMessage[] {
    return this.list().filter(m => m.type === type);
  }
  filterBySource(source: string): SpaceProtocolMessage[] {
    return this.list().filter(m => m.source === source);
  }
  filterEncrypted(): SpaceProtocolMessage[] { return this.list().filter(m => m.isEncrypted); }
  filterInvalid(): SpaceProtocolMessage[] { return this.list().filter(m => !m.isValid); }
  getTotalCount(): number { return this.messages.size; }
}

export class GnssSignalManager {
  private signals: Map<string, GnssSignal> = new Map();

  add(sig: GnssSignal): void { this.signals.set(sig.id, sig); }
  get(id: GnssSignalId): GnssSignal | undefined { return this.signals.get(id); }
  remove(id: GnssSignalId): void { this.signals.delete(id); }
  list(): GnssSignal[] { return Array.from(this.signals.values()); }
  clear(): void { this.signals.clear(); }

  filterByConstellation(constellation: GnssConstellation): GnssSignal[] {
    return this.list().filter(s => s.constellation === constellation);
  }
  filterByBand(band: GnssSignalBand): GnssSignal[] {
    return this.list().filter(s => s.band === band);
  }
  filterJammed(): GnssSignal[] { return this.list().filter(s => s.isJammed); }
  filterSpoofed(): GnssSignal[] { return this.list().filter(s => s.isSpoofed); }
  filterMilitary(): GnssSignal[] { return this.list().filter(s => s.signalType === 'military'); }
  filterCivil(): GnssSignal[] { return this.list().filter(s => s.signalType === 'civil'); }
  getTotalCount(): number { return this.signals.size; }

  jamSignal(id: GnssSignalId): boolean {
    const sig = this.signals.get(id);
    if (!sig) return false;
    sig.isJammed = true;
    sig.snr = 0;
    return true;
  }

  spoofSignal(id: GnssSignalId): boolean {
    const sig = this.signals.get(id);
    if (!sig) return false;
    sig.isSpoofed = true;
    return true;
  }
}

export class AcarsManager {
  private messages: Map<string, AcarsMessage> = new Map();

  add(msg: AcarsMessage): void { this.messages.set(msg.id, msg); }
  get(id: AcarsMessageId): AcarsMessage | undefined { return this.messages.get(id); }
  remove(id: AcarsMessageId): void { this.messages.delete(id); }
  list(): AcarsMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }

  filterByDataType(type: AcarsDataType): AcarsMessage[] {
    return this.list().filter(m => m.dataType === type);
  }
  filterByAircraft(aircraftId: AircraftId): AcarsMessage[] {
    return this.list().filter(m => m.aircraftId === aircraftId);
  }
  filterAuthenticated(): AcarsMessage[] { return this.list().filter(m => m.isAuthenticated); }
  filterUnauthenticated(): AcarsMessage[] { return this.list().filter(m => !m.isAuthenticated); }
  filterInjected(): AcarsMessage[] { return this.list().filter(m => m.isInjected); }
  getTotalCount(): number { return this.messages.size; }
}

export class AdsBManager {
  private messages: Map<string, AdsBMessage> = new Map();

  add(msg: AdsBMessage): void { this.messages.set(msg.id, msg); }
  get(id: AdsBMessageId): AdsBMessage | undefined { return this.messages.get(id); }
  remove(id: AdsBMessageId): void { this.messages.delete(id); }
  list(): AdsBMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }

  filterByType(type: AdsBMessageType): AdsBMessage[] {
    return this.list().filter(m => m.messageType === type);
  }
  filterByAircraft(aircraftId: AircraftId): AdsBMessage[] {
    return this.list().filter(m => m.aircraftId === aircraftId);
  }
  filterSpoofed(): AdsBMessage[] { return this.list().filter(m => m.isSpoofed); }
  filterByRegion(latMin: number, latMax: number, lonMin: number, lonMax: number): AdsBMessage[] {
    return this.list().filter(m =>
      m.lat >= latMin && m.lat <= latMax &&
      m.lon >= lonMin && m.lon <= lonMax
    );
  }
  getTotalCount(): number { return this.messages.size; }
}

export class MavLinkManager {
  private messages: Map<string, MavLinkMessage> = new Map();

  add(msg: MavLinkMessage): void { this.messages.set(msg.id, msg); }
  get(id: MavLinkMessageId): MavLinkMessage | undefined { return this.messages.get(id); }
  remove(id: MavLinkMessageId): void { this.messages.delete(id); }
  list(): MavLinkMessage[] { return Array.from(this.messages.values()); }
  clear(): void { this.messages.clear(); }

  filterByComponent(component: MavLinkComponent): MavLinkMessage[] {
    return this.list().filter(m => m.sourceComponent === component);
  }
  filterByType(type: MavLinkMessageType): MavLinkMessage[] {
    return this.list().filter(m => m.messageType === type);
  }
  filterAuthenticated(): MavLinkMessage[] { return this.list().filter(m => m.isAuthenticated); }
  filterUnauthenticated(): MavLinkMessage[] { return this.list().filter(m => !m.isAuthenticated); }
  getTotalCount(): number { return this.messages.size; }
}

// ─── SecurityManager ────────────────────────────────────────────
export class SecurityManager {
  private findings: Map<string, SecurityFinding> = new Map();
  private scenarios: Map<string, AttackScenario> = new Map();

  addFinding(finding: SecurityFinding): void { this.findings.set(finding.id, finding); }
  getFinding(id: SecurityFindingId): SecurityFinding | undefined { return this.findings.get(id); }
  listFindings(): SecurityFinding[] { return Array.from(this.findings.values()); }
  clearFindings(): void { this.findings.clear(); }

  addScenario(scenario: AttackScenario): void { this.scenarios.set(scenario.id, scenario); }
  getScenario(id: AttackScenarioId): AttackScenario | undefined { return this.scenarios.get(id); }
  listScenarios(): AttackScenario[] { return Array.from(this.scenarios.values()); }
  clearScenarios(): void { this.scenarios.clear(); }

  mitigateFinding(id: SecurityFindingId): boolean {
    const finding = this.findings.get(id);
    if (!finding) return false;
    finding.mitigated = true;
    return true;
  }

  activateScenario(id: AttackScenarioId): boolean {
    const scenario = this.scenarios.get(id);
    if (!scenario) return false;
    scenario.isActive = true;
    return true;
  }

  deactivateScenario(id: AttackScenarioId): boolean {
    const scenario = this.scenarios.get(id);
    if (!scenario) return false;
    scenario.isActive = false;
    return true;
  }

  filterFindingsBySeverity(severity: SecurityFinding['severity']): SecurityFinding[] {
    return this.listFindings().filter(f => f.severity === severity);
  }

  filterFindingsByDomain(domain: SecurityFinding['domain']): SecurityFinding[] {
    return this.listFindings().filter(f => f.domain === domain);
  }

  filterFindingsUnmitigated(): SecurityFinding[] {
    return this.listFindings().filter(f => !f.mitigated);
  }

  filterActiveScenarios(): AttackScenario[] {
    return this.listScenarios().filter(s => s.isActive);
  }

  filterScenariosByType(type: SpaceAttackType): AttackScenario[] {
    return this.listScenarios().filter(s => s.type === type);
  }

  getTotalFindings(): number { return this.findings.size; }
  getTotalScenarios(): number { return this.scenarios.size; }
}

// ─── SpaceAviationCoordinator ───────────────────────────────────
export class SpaceAviationCoordinator {
  readonly satellites: SatelliteManager;
  readonly groundStations: GroundStationManager;
  readonly aircraft: AircraftManager;
  readonly uavs: UavManager;
  readonly avionics: AvionicsManager;
  readonly spaceProtocols: SpaceProtocolManager;
  readonly gnssSignals: GnssSignalManager;
  readonly acars: AcarsManager;
  readonly adsb: AdsBManager;
  readonly mavlink: MavLinkManager;
  readonly security: SecurityManager;

  constructor() {
    this.satellites = new SatelliteManager();
    this.groundStations = new GroundStationManager();
    this.aircraft = new AircraftManager();
    this.uavs = new UavManager();
    this.avionics = new AvionicsManager();
    this.spaceProtocols = new SpaceProtocolManager();
    this.gnssSignals = new GnssSignalManager();
    this.acars = new AcarsManager();
    this.adsb = new AdsBManager();
    this.mavlink = new MavLinkManager();
    this.security = new SecurityManager();
  }

  getStats(): {
    satelliteCount: number; groundStationCount: number; aircraftCount: number;
    uavCount: number; avionicsCount: number; spaceProtocolCount: number;
    gnssSignalCount: number; acarsCount: number; adsbCount: number;
    mavlinkCount: number; findingCount: number; scenarioCount: number;
    activeScenarioCount: number; unmitigatedFindingCount: number;
    jammedSignalCount: number; spoofedSignalCount: number;
  } {
    return {
      satelliteCount: this.satellites.getTotalCount(),
      groundStationCount: this.groundStations.getTotalCount(),
      aircraftCount: this.aircraft.getTotalCount(),
      uavCount: this.uavs.getTotalCount(),
      avionicsCount: this.avionics.getTotalCount(),
      spaceProtocolCount: this.spaceProtocols.getTotalCount(),
      gnssSignalCount: this.gnssSignals.getTotalCount(),
      acarsCount: this.acars.getTotalCount(),
      adsbCount: this.adsb.getTotalCount(),
      mavlinkCount: this.mavlink.getTotalCount(),
      findingCount: this.security.getTotalFindings(),
      scenarioCount: this.security.getTotalScenarios(),
      activeScenarioCount: this.security.filterActiveScenarios().length,
      unmitigatedFindingCount: this.security.filterFindingsUnmitigated().length,
      jammedSignalCount: this.gnssSignals.filterJammed().length,
      spoofedSignalCount: this.gnssSignals.filterSpoofed().length,
    };
  }

  reset(): void {
    this.satellites.clear();
    this.groundStations.clear();
    this.aircraft.clear();
    this.uavs.clear();
    this.avionics.clear();
    this.spaceProtocols.clear();
    this.gnssSignals.clear();
    this.acars.clear();
    this.adsb.clear();
    this.mavlink.clear();
    this.security.clearFindings();
    this.security.clearScenarios();
  }
}

// ─── Default Environment ────────────────────────────────────────
export function createDefaultSpaceAviationEnvironment(): SpaceAviationCoordinator {
  const coord = new SpaceAviationCoordinator();

  // Satellites
  const sat1 = createSatellite({
    name: 'Intelsat-901',
    type: SatelliteType.GEO,
    orbitAltitude: 35786,
    orbitInclination: 0,
    period: 1436,
    noradId: 12345,
    payloads: [SatellitePayload.Comms],
    bands: [OrbitBand.C, OrbitBand.Ku],
    manufacturer: 'Airbus Defence and Space',
    launchYear: 2022,
    expectedLifespan: 15,
  });
  const sat2 = createSatellite({
    name: 'Starlink-3012',
    type: SatelliteType.LEO,
    orbitAltitude: 550,
    orbitInclination: 53,
    period: 95,
    noradId: 67890,
    payloads: [SatellitePayload.Comms],
    bands: [OrbitBand.Ku, OrbitBand.Ka],
    manufacturer: 'SpaceX',
    launchYear: 2024,
    expectedLifespan: 5,
  });
  const sat3 = createSatellite({
    name: 'GPS-BIIF-10',
    type: SatelliteType.MEO,
    orbitAltitude: 20200,
    orbitInclination: 55,
    period: 720,
    noradId: 11111,
    payloads: [SatellitePayload.Navigation],
    bands: [OrbitBand.L],
    manufacturer: 'Lockheed Martin',
    launchYear: 2019,
    expectedLifespan: 12,
  });
  const sat4 = createSatellite({
    name: 'KH-11-7',
    type: SatelliteType.SSO,
    orbitAltitude: 350,
    orbitInclination: 97,
    period: 91,
    noradId: 22222,
    payloads: [SatellitePayload.EarthObservation, SatellitePayload.SIGINT],
    bands: [OrbitBand.X, OrbitBand.S],
    manufacturer: 'NRO',
    launchYear: 2023,
    expectedLifespan: 8,
  });
  coord.satellites.add(sat1);
  coord.satellites.add(sat2);
  coord.satellites.add(sat3);
  coord.satellites.add(sat4);

  // Ground stations
  const gs1 = createGroundStation({
    name: 'Svalbard Ground Station',
    lat: 78.23,
    lon: 15.39,
    capabilities: [GroundStationCapability.TTCAntenna, GroundStationCapability.DataDownlink,
      GroundStationCapability.Telecommand],
    bands: [OrbitBand.S, OrbitBand.X, OrbitBand.Ka],
    connectedSatellites: [sat1.id, sat2.id, sat4.id as SatelliteId],
    uptimePercent: 99.9,
  });
  const gs2 = createGroundStation({
    name: 'McMurdo Station',
    lat: -77.85,
    lon: 166.67,
    capabilities: [GroundStationCapability.TTCAntenna, GroundStationCapability.DataDownlink,
      GroundStationCapability.DopplerTracking],
    bands: [OrbitBand.S, OrbitBand.X],
    connectedSatellites: [sat4.id as SatelliteId],
    uptimePercent: 98.2,
  });
  coord.groundStations.add(gs1);
  coord.groundStations.add(gs2);

  // Update satellite station references
  const s1 = coord.satellites.get(sat1.id);
  const s2 = coord.satellites.get(sat2.id);
  const s4 = coord.satellites.get(sat4.id);
  if (s1) s1.station = gs1.id;
  if (s2) s2.station = gs1.id;
  if (s4) s4.station = gs1.id;

  // Aircraft
  const ac1 = createAircraft({
    flight: 'UAL123',
    type: AircraftType.Commercial,
    registration: 'N778UA',
    lat: 41.97,
    lon: -87.90,
    altitude: 37000,
    speed: 480,
    heading: 90,
    squawk: '6501',
  });
  const ac2 = createAircraft({
    flight: 'BAW456',
    type: AircraftType.Commercial,
    registration: 'G-EUUP',
    lat: 51.47,
    lon: -0.45,
    altitude: 0,
    speed: 0,
    heading: 270,
    squawk: '7004',
    isOnGround: true,
  });
  const ac3 = createAircraft({
    flight: 'DAL789',
    type: AircraftType.Commercial,
    registration: 'N394DL',
    lat: 33.94,
    lon: -118.41,
    altitude: 34000,
    speed: 450,
    heading: 180,
    squawk: '6032',
  });
  coord.aircraft.add(ac1);
  coord.aircraft.add(ac2);
  coord.aircraft.add(ac3);

  // UAVs
  coord.uavs.add(createUav({
    name: 'Reaper-1',
    model: 'MQ-9A Reaper',
    flightMode: UavFlightMode.Auto,
    lat: 32.5,
    lon: 42.3,
    altitude: 15000,
    speed: 80,
    batteryPercent: 60,
    isArmed: true,
    homeLat: 31.2,
    homeLon: 41.0,
    geofenceRadius: 50000,
    insideGeofence: true,
  }));
  coord.uavs.add(createUav({
    name: 'Quad-1',
    model: 'DJI Mavic 3',
    flightMode: UavFlightMode.Loiter,
    lat: 40.71,
    lon: -74.01,
    altitude: 80,
    speed: 2,
    batteryPercent: 72,
    isArmed: false,
    homeLat: 40.71,
    homeLon: -74.01,
    geofenceRadius: 400,
    insideGeofence: true,
  }));
  coord.uavs.add(createUav({
    name: 'Outlier-1',
    model: 'Custom FPV',
    flightMode: UavFlightMode.Manual,
    lat: 35.0,
    lon: -115.0,
    altitude: 300,
    speed: 15,
    batteryPercent: 30,
    isArmed: false,
    homeLat: 34.8,
    homeLon: -115.2,
    geofenceRadius: 200,
    insideGeofence: false,
  }));
  coord.uavs.add(createUav({
    name: 'Reaper-2',
    model: 'MQ-9A Reaper',
    flightMode: UavFlightMode.Guided,
    lat: 33.0,
    lon: 40.0,
    altitude: 14000,
    speed: 90,
    batteryPercent: 45,
    isArmed: true,
    homeLat: 31.2,
    homeLon: 41.0,
    geofenceRadius: 50000,
    insideGeofence: true,
  }));

  // Avionics
  coord.avionics.add(createAvionicsSystem({
    type: AvionicsSystemType.FMS,
    aircraftId: ac1.id,
    softwareVersion: 'FMS-U10.8A',
  }));
  coord.avionics.add(createAvionicsSystem({
    type: AvionicsSystemType.TCAS,
    aircraftId: ac1.id,
    softwareVersion: 'TCAS-7.1',
  }));
  coord.avionics.add(createAvionicsSystem({
    type: AvionicsSystemType.EFB,
    aircraftId: ac1.id,
    softwareVersion: 'EFB-2.4.1',
    lastCalibration: Date.now() - 86400000,
  }));
  coord.avionics.add(createAvionicsSystem({
    type: AvionicsSystemType.ILS,
    aircraftId: ac2.id,
    isOnline: false,
    softwareVersion: 'ILS-1.2',
    lastCalibration: Date.now() - 259200000,
  }));

  // Space protocols
  coord.spaceProtocols.add(createSpaceProtocolMessage({
    type: CcsdsMessageType.Telemetry,
    source: 'SAT-001',
    destination: 'GS-MAIN',
    data: 'TM:STATUS=OPERATIONAL;TEMP=22.5C;VOLT=28.2V',
    isEncrypted: true,
  }));
  coord.spaceProtocols.add(createSpaceProtocolMessage({
    type: CcsdsMessageType.FileDelivery,
    source: 'SAT-004',
    destination: 'GS-POLAR',
    data: 'CFDP:FILE=IMG_20240630_143022.TIFF;SIZE=1048576',
    isEncrypted: true,
  }));
  coord.spaceProtocols.add(createSpaceProtocolMessage({
    type: CcsdsMessageType.Telecommand,
    source: 'GS-MAIN',
    destination: 'SAT-001',
    data: 'TC:CMD=SUN_POINT;EXEC=IMMEDIATE',
    isEncrypted: true,
  }));

  // GNSS signals
  coord.gnssSignals.add(createGnssSignal({
    constellation: GnssConstellation.GPS,
    band: GnssSignalBand.L1,
    signalType: 'civil',
    prn: 1,
    snr: 42,
  }));
  coord.gnssSignals.add(createGnssSignal({
    constellation: GnssConstellation.GPS,
    band: GnssSignalBand.L2,
    signalType: 'military',
    prn: 1,
    snr: 38,
  }));
  coord.gnssSignals.add(createGnssSignal({
    constellation: GnssConstellation.Galileo,
    band: GnssSignalBand.E1,
    signalType: 'civil',
    prn: 11,
    snr: 40,
  }));
  coord.gnssSignals.add(createGnssSignal({
    constellation: GnssConstellation.BeiDou,
    band: GnssSignalBand.B1,
    signalType: 'civil',
    prn: 21,
    snr: 36,
  }));

  // ACARS
  coord.acars.add(createAcarsMessage({
    aircraftId: ac1.id,
    dataType: AcarsDataType.Position,
    content: 'POS N41.97 W087.90 ALT37000',
    isAuthenticated: true,
  }));
  coord.acars.add(createAcarsMessage({
    aircraftId: ac1.id,
    dataType: AcarsDataType.Engine,
    content: 'ENG EPR:1.42 1.44 EGT:580 590 N1:89.2 90.1',
    isAuthenticated: true,
  }));
  coord.acars.add(createAcarsMessage({
    aircraftId: ac3.id,
    dataType: AcarsDataType.Fuel,
    content: 'FUEL QTY:12500KG FLOW:2400KG/H',
    isAuthenticated: true,
  }));
  coord.acars.add(createAcarsMessage({
    aircraftId: ac2.id,
    dataType: AcarsDataType.FreeText,
    content: 'DISREGARD PREVIOUS DIVERSION ORDER',
    isAuthenticated: false,
    isInjected: true,
  }));

  // ADS-B
  coord.adsb.add(createAdsBMessage({
    aircraftId: ac1.id,
    messageType: AdsBMessageType.Position,
    lat: 41.97, lon: -87.90, altitude: 37000, speed: 480, heading: 90,
    icao24: 'A1B2C3',
  }));
  coord.adsb.add(createAdsBMessage({
    aircraftId: ac3.id,
    messageType: AdsBMessageType.Position,
    lat: 33.94, lon: -118.41, altitude: 34000, speed: 450, heading: 180,
    icao24: 'D4E5F6',
  }));

  // MAVLink
  coord.mavlink.add(createMavLinkMessage({
    sourceComponent: MavLinkComponent.Autopilot,
    targetComponent: MavLinkComponent.GCS,
    messageType: MavLinkMessageType.Heartbeat,
    payload: { custom_mode: 4, type: 2, autopilot: 3 },
  }));
  coord.mavlink.add(createMavLinkMessage({
    sourceComponent: MavLinkComponent.Battery,
    targetComponent: MavLinkComponent.GCS,
    messageType: MavLinkMessageType.BatteryStatus,
    payload: { voltage: 22.4, current: 1.2, remaining: 85 },
  }));

  // Security findings
  coord.security.addFinding(createSecurityFinding({
    description: 'Unencrypted ACARS VHF datalink allows message injection',
    severity: 'high', domain: 'aviation', do326aLevel: Do326aSecurityLevel.C,
  }));
  coord.security.addFinding(createSecurityFinding({
    description: 'Civil GPS L1 C/A signal vulnerable to spoofing - no authentication',
    severity: 'critical', domain: 'space', do326aLevel: Do326aSecurityLevel.A,
  }));
  coord.security.addFinding(createSecurityFinding({
    description: 'ADS-B messages lack authentication - ghost aircraft injection possible',
    severity: 'high', domain: 'aviation', do326aLevel: Do326aSecurityLevel.B,
  }));
  coord.security.addFinding(createSecurityFinding({
    description: 'Satellite command uplink uses default encryption keys',
    severity: 'critical', domain: 'space', do326aLevel: Do326aSecurityLevel.A,
  }));
  coord.security.addFinding(createSecurityFinding({
    description: 'UAV geofence can be disabled via unauthenticated MAVLink command',
    severity: 'medium', domain: 'uav', do326aLevel: null,
  }));

  // Attack scenarios
  coord.security.addScenario(getKnownSpaceAttacks()[0]!);
  coord.security.addScenario(getKnownSpaceAttacks()[3]!);
  coord.security.addScenario(getKnownSpaceAttacks()[4]!);
  coord.security.addScenario(getKnownSpaceAttacks()[5]!);
  coord.security.addScenario(getKnownSpaceAttacks()[7]!);

  return coord;
}
