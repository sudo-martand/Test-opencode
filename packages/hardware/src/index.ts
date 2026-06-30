import { uid } from '@cybersim/shared';

/* ── Branded IDs ── */

export type CpuId = string & { readonly __brand: unique symbol };
export type CoreId = string & { readonly __brand: unique symbol };
export type CacheId = string & { readonly __brand: unique symbol };
export type RegisterId = string & { readonly __brand: unique symbol };
export type MemoryAddressId = string & { readonly __brand: unique symbol };
export type PciDeviceId = string & { readonly __brand: unique symbol };
export type UsbDeviceId = string & { readonly __brand: unique symbol };
export type SpiDeviceId = string & { readonly __brand: unique symbol };
export type I2cDeviceId = string & { readonly __brand: unique symbol };
export type NvmeDeviceId = string & { readonly __brand: unique symbol };
export type FirmwareId = string & { readonly __brand: unique symbol };
export type UefiVariableId = string & { readonly __brand: unique symbol };
export type TpmPcrId = string & { readonly __brand: unique symbol };
export type JtagDeviceId = string & { readonly __brand: unique symbol };
export type SideChannelTraceId = string & { readonly __brand: unique symbol };
export type FaultInjectionId = string & { readonly __brand: unique symbol };
export type PcbComponentId = string & { readonly __brand: unique symbol };
export type SdrSampleId = string & { readonly __brand: unique symbol };
export type HardwareVulnerabilityId = string & { readonly __brand: unique symbol };

export function cpuId(): CpuId { return `cpu-${uid()}` as CpuId; }
export function coreId(): CoreId { return `core-${uid()}` as CoreId; }
export function cacheId(): CacheId { return `cache-${uid()}` as CacheId; }
export function registerId(): RegisterId { return `reg-${uid()}` as RegisterId; }
export function memoryAddressId(): MemoryAddressId { return `mem-${uid()}` as MemoryAddressId; }
export function pciDeviceId(): PciDeviceId { return `pci-${uid()}` as PciDeviceId; }
export function usbDeviceId(): UsbDeviceId { return `usb-${uid()}` as UsbDeviceId; }
export function spiDeviceId(): SpiDeviceId { return `spi-${uid()}` as SpiDeviceId; }
export function i2cDeviceId(): I2cDeviceId { return `i2c-${uid()}` as I2cDeviceId; }
export function nvmeDeviceId(): NvmeDeviceId { return `nvme-${uid()}` as NvmeDeviceId; }
export function firmwareId(): FirmwareId { return `fw-${uid()}` as FirmwareId; }
export function uefiVariableId(): UefiVariableId { return `uefi-${uid()}` as UefiVariableId; }
export function tpmPcrId(): TpmPcrId { return `pcr-${uid()}` as TpmPcrId; }
export function jtagDeviceId(): JtagDeviceId { return `jtag-${uid()}` as JtagDeviceId; }
export function sideChannelTraceId(): SideChannelTraceId { return `sc-${uid()}` as SideChannelTraceId; }
export function faultInjectionId(): FaultInjectionId { return `fi-${uid()}` as FaultInjectionId; }
export function pcbComponentId(): PcbComponentId { return `pcb-${uid()}` as PcbComponentId; }
export function sdrSampleId(): SdrSampleId { return `sdr-${uid()}` as SdrSampleId; }
export function hardwareVulnerabilityId(): HardwareVulnerabilityId { return `hwv-${uid()}` as HardwareVulnerabilityId; }

/* ── Enums ── */

export enum CpuArchitecture {
  x86_64 = 'x86_64',
  ARMv8_A = 'armv8_a',
  ARMv9_A = 'armv9_a',
  RISC_V_64 = 'risc_v_64',
  RISC_V_32 = 'risc_v_32',
  IA32 = 'ia32',
  ARM_Cortex_M = 'arm_cortex_m',
  ARM_Cortex_A = 'arm_cortex_a',
  POWER = 'power',
  MIPS = 'mips',
}

export enum MicroArchitecture {
  Skylake = 'skylake',
  CascadeLake = 'cascade_lake',
  IceLake = 'ice_lake',
  TigerLake = 'tiger_lake',
  AlderLake = 'alder_lake',
  RaptorLake = 'raptor_lake',
  Zen2 = 'zen2',
  Zen3 = 'zen3',
  Zen4 = 'zen4',
  Zen5 = 'zen5',
  Cortex_A76 = 'cortex_a76',
  Cortex_A78 = 'cortex_a78',
  Cortex_X1 = 'cortex_x1',
  Cortex_X2 = 'cortex_x2',
  Cortex_X3 = 'cortex_x3',
  Firestorm = 'firestorm',
  Icestorm = 'icestorm',
  U74 = 'u74',
  C906 = 'c906',
}

export enum CacheLevel {
  L1 = 1,
  L2 = 2,
  L3 = 3,
  L4 = 4,
}

export enum CacheType {
  Instruction = 'instruction',
  Data = 'data',
  Unified = 'unified',
}

export enum CachePolicy {
  WriteBack = 'write_back',
  WriteThrough = 'write_through',
  WriteCombine = 'write_combine',
  Uncached = 'uncached',
}

export enum BranchPredictorType {
  TwoBit = 'two_bit',
  GShare = 'g_share',
  TAGE = 'tage',
  TAGE_SC = 'tage_sc',
  Perceptron = 'perceptron',
  Hybrid = 'hybrid',
}

export enum ExecutionMode {
  InOrder = 'in_order',
  OutOfOrder = 'out_of_order',
  SuperScalar = 'superscalar',
  VLIW = 'vliw',
  SIMD = 'simd',
}

export enum SpeculativeVulnerability {
  SpectreV1 = 'spectre_v1',
  SpectreV2 = 'spectre_v2',
  SpectreV4 = 'spectre_v4',
  SpectreV5 = 'spectre_v5',
  Meltdown = 'meltdown',
  MeltdownV3 = 'meltdown_v3',
  MeltdownL1TF = 'meltdown_l1tf',
  MeltdownMFBDS = 'meltdown_mfbds',
  MeltdownMLPDS = 'meltdown_mlpds',
  MeltdownMSBDS = 'meltdown_msbds',
  Retbleed = 'retbleed',
  ZombieLoad = 'zombieload',
  RIDL = 'ridl',
  Fallout = 'fallout',
  MMIOStaleData = 'mmio_stale_data',
  Zenbleed = 'zenbleed',
  Downfall = 'downfall',
  Inception = 'inception',
  RFDS = 'rfds',
  Sinkclose = 'sinkclose',
}

export enum PciGeneration {
  Gen1 = 1,
  Gen2 = 2,
  Gen3 = 3,
  Gen4 = 4,
  Gen5 = 5,
  Gen6 = 6,
}

export enum UsbSpeed {
  Low = 'low',
  Full = 'full',
  High = 'high',
  Super = 'super',
  SuperPlus = 'super_plus',
  SuperPlus20Gbps = 'super_plus_20gbps',
}

export enum FirmwareType {
  UEFI = 'uefi',
  BIOS = 'bios',
  CoreBoot = 'coreboot',
  OpenFirmware = 'open_firmware',
  CustomRTOS = 'custom_rtos',
  BootROM = 'boot_rom',
}

export enum SecureBootState {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Audit = 'audit',
  Setup = 'setup',
  User = 'user',
  Deployed = 'deployed',
  Broken = 'broken',
}

export enum TpmState {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Active = 'active',
  Inactive = 'inactive',
  Owned = 'owned',
  Unowned = 'unowned',
  Locked = 'locked',
}

export enum SideChannelType {
  Timing = 'timing',
  CacheTiming = 'cache_timing',
  PowerAnalysis = 'power_analysis',
  Electromagnetic = 'electromagnetic',
  Acoustic = 'acoustic',
  Thermal = 'thermal',
  Optical = 'optical',
  PortContention = 'port_contention',
  Frequency = 'frequency',
}

export enum FaultInjectionType {
  VoltageGlitch = 'voltage_glitch',
  ClockGlitch = 'clock_glitch',
  ElectromagneticPulse = 'electromagnetic_pulse',
  Laser = 'laser',
  RowHammer = 'row_hammer',
  ECCBitFlip = 'ecc_bit_flip',
  Temperature = 'temperature',
  PowerDrop = 'power_drop',
}

export enum HardwareSecurityModuleType {
  TPM_2_0 = 'tpm_2_0',
  TPM_1_2 = 'tpm_1_2',
  PKCS11 = 'pkcs11',
  YubiKey = 'yubikey',
  SoloKey = 'solokey',
  Nitrokey = 'nitrokey',
  AWSCloudHSM = 'aws_cloudhsm',
  AzureHSM = 'azure_hsm',
}

/* ── Interfaces: CPU / Microarchitecture ── */

export interface CpuConfig {
  architecture: CpuArchitecture;
  microArch: MicroArchitecture;
  cores: number;
  threadsPerCore: number;
  baseFrequency: number;
  boostFrequency: number;
  tdp: number;
  lithography: number;
  executionMode: ExecutionMode;
  branchPredictor: BranchPredictorType;
  pipelineDepth: number;
  reorderBufferSize: number;
  l1Cache: CacheConfig;
  l2Cache: CacheConfig;
  l3Cache: CacheConfig | null;
  speculativeVulnerabilities: SpeculativeVulnerability[];
  mitigations: string[];
  cveIds: string[];
}

export interface CacheConfig {
  level: CacheLevel;
  type: CacheType;
  size: number;
  lineSize: number;
  associativity: number;
  policy: CachePolicy;
  latency: number;
}

export interface CpuInstance {
  id: CpuId;
  name: string;
  config: CpuConfig;
  cores: CoreInstance[];
  temperature: number;
  powerDraw: number;
  utilization: number;
  uptime: number;
  registers: CpuRegister[];
}

export interface CoreInstance {
  id: CoreId;
  index: number;
  frequency: number;
  utilization: number;
  temperature: number;
  instructionsRetired: bigint;
  cycles: bigint;
  ipc: number;
  branchMispredictions: number;
  cacheMisses: number;
}

export interface CpuRegister {
  id: RegisterId;
  name: string;
  size: number;
  value: bigint;
  readable: boolean;
  writable: boolean;
}

export interface CpuCacheLine {
  tag: number;
  valid: boolean;
  dirty: boolean;
  data: number[];
  lastAccess: number;
}

/* ── Interfaces: Memory ── */

export interface MemoryPage {
  address: number;
  size: number;
  flags: string[];
  mapped: boolean;
  content: Uint8Array;
}

export interface MemoryRegion {
  start: number;
  end: number;
  name: string;
  permissions: string[];
  type: string;
}

/* ── Interfaces: Buses ── */

export interface PciDevice {
  id: PciDeviceId;
  vendor: string;
  product: string;
  vendorId: number;
  deviceId: number;
  revision: number;
  classCode: number;
  subclass: number;
  bus: number;
  deviceNumber: number;
  function: number;
  generation: PciGeneration;
  bars: PciBar[];
  msiSupport: boolean;
  msiXSupport: boolean;
  acsSupport: boolean;
  powerManagement: boolean;
}

export interface PciBar {
  index: number;
  address: number;
  size: number;
  type: 'memory' | 'io';
  prefetchable: boolean;
}

export interface UsbDevice {
  id: UsbDeviceId;
  vendor: string;
  product: string;
  vendorId: number;
  productId: number;
  speed: UsbSpeed;
  classCode: number;
  subclass: number;
  protocol: number;
  configuration: number;
  interfaces: UsbInterface[];
  descriptor: string;
}

export interface UsbInterface {
  number: number;
  classCode: number;
  subclass: number;
  protocol: number;
  endpoints: number;
}

export interface SpiDevice {
  id: SpiDeviceId;
  name: string;
  mode: number;
  frequency: number;
  bitsPerWord: number;
  csPolarity: boolean;
  data: number[];
}

export interface I2cDevice {
  id: I2cDeviceId;
  name: string;
  address: number;
  frequency: number;
  data: number[];
}

export interface NvmeDevice {
  id: NvmeDeviceId;
  model: string;
  capacity: number;
  numQueues: number;
  queueDepth: number;
  maxSectors: number;
  firmware: string;
  temperature: number;
  powerState: number;
}

/* ── Interfaces: Firmware / UEFI ── */

export interface FirmwareConfig {
  type: FirmwareType;
  vendor: string;
  version: string;
  releaseDate: Date;
  size: number;
  secureBoot: SecureBootState;
  measuredBoot: boolean;
  tpmRequired: boolean;
  signatureRequired: boolean;
}

export interface FirmwareInstance {
  id: FirmwareId;
  config: FirmwareConfig;
  variables: UefiVariable[];
  bootEntries: BootEntry[];
  secureBootKeys: SecureBootKey[];
  tcgLog: TcgEventLogEntry[];
}

export interface UefiVariable {
  id: UefiVariableId;
  name: string;
  guid: string;
  attributes: string[];
  data: Uint8Array;
  vendor: boolean;
}

export interface BootEntry {
  id: string;
  name: string;
  devicePath: string;
  filePath: string;
  enabled: boolean;
  bootNext: boolean;
}

export interface SecureBootKey {
  name: string;
  type: 'PK' | 'KEK' | 'db' | 'dbx';
  certificate: string;
  hash: string;
  algorithm: string;
}

export interface TcgEventLogEntry {
  index: number;
  pcr: number;
  eventType: string;
  digest: string;
  description: string;
}

/* ── Interfaces: TPM ── */

export interface TpmDevice {
  id: string;
  type: HardwareSecurityModuleType;
  state: TpmState;
  version: string;
  pcrs: TpmPcr[];
  nvRam: NvRamIndex[];
  attestationKeys: string[];
  storageKeys: string[];
}

export interface TpmPcr {
  id: TpmPcrId;
  index: number;
  value: string;
  algorithm: string;
  bank: string;
}

export interface NvRamIndex {
  index: number;
  size: number;
  attributes: string[];
  data: Uint8Array;
}

/* ── Interfaces: JTAG / SWD ── */

export interface JtagDevice {
  id: JtagDeviceId;
  name: string;
  irLength: number;
  idCode: number;
  scanChain: JtagTap[];
  connected: boolean;
  frequency: number;
}

export interface JtagTap {
  name: string;
  irLength: number;
  idCode: number;
  instructions: JtagInstruction[];
  registers: JtagRegister[];
}

export interface JtagInstruction {
  code: number;
  name: string;
  description: string;
}

export interface JtagRegister {
  name: string;
  size: number;
  value: number[];
}

export interface JtagOperation {
  type: 'shift_ir' | 'shift_dr' | 'reset' | 'idcode' | 'bypass';
  data: number[];
  result: number[];
  timestamp: Date;
}

/* ── Interfaces: Side-Channels ── */

export interface SideChannelTrace {
  id: SideChannelTraceId;
  type: SideChannelType;
  samples: number[];
  sampleRate: number;
  duration: number;
  timestamp: Date;
  target: string;
  algorithm: string;
  leak: string;
  success: boolean;
  snr: number;
}

export interface SideChannelLeak {
  type: SideChannelType;
  description: string;
  severity: VulnerabilitySeverity;
  dataExposed: string;
  samplesRequired: number;
  successRate: number;
}

export type VulnerabilitySeverity = 'none' | 'low' | 'medium' | 'high' | 'critical';

/* ── Interfaces: Fault Injection ── */

export interface FaultInjectionAttempt {
  id: FaultInjectionId;
  type: FaultInjectionType;
  parameters: Record<string, number>;
  timestamp: Date;
  success: boolean;
  effect: string;
  target: string;
}

export interface RowHammerConfig {
  row: number;
  aggressorRows: number[];
  victimRow: number;
  bitFlips: number[];
  threshold: number;
}

/* ── Interfaces: PCB / Board ── */

export interface PcbComponent {
  id: PcbComponentId;
  reference: string;
  type: string;
  value: string;
  package: string;
  x: number;
  y: number;
  rotation: number;
  layer: number;
  pins: number;
  datasheet: string;
}

export interface PcbBoard {
  name: string;
  layers: number;
  dimensions: [number, number];
  components: PcbComponent[];
  traces: PcbTrace[];
  vias: PcbVia[];
}

export interface PcbTrace {
  from: string;
  to: string;
  layer: number;
  width: number;
  length: number;
}

export interface PcbVia {
  x: number;
  y: number;
  fromLayer: number;
  toLayer: number;
  diameter: number;
}

/* ── Interfaces: SDR ── */

export interface SdrConfig {
  centerFrequency: number;
  sampleRate: number;
  gain: number;
  bandwidth: number;
  modulation: ModulationType;
  antenna: string;
}

export enum ModulationType {
  BPSK = 'bpsk',
  QPSK = 'qpsk',
  QAM16 = 'qam16',
  QAM64 = 'qam64',
  QAM256 = 'qam256',
  ASK = 'ask',
  FSK = 'fsk',
  GMSK = 'gmsk',
  OFDM = 'ofdm',
  LoRa = 'lora',
  FM = 'fm',
  AM = 'am',
  SSB = 'ssb',
}

export interface SdrSample {
  id: SdrSampleId;
  iq: [number, number][];
  frequency: number;
  bandwidth: number;
  timestamp: Date;
  power: number;
  snr: number;
}

export interface SdrWaterfall {
  frequencyRange: [number, number];
  timeRange: [number, number];
  samples: number[][];
  maxPower: number;
  minPower: number;
}

/* ── Interfaces: Known Hardware Vulnerabilities ── */

export interface HardwareVulnerability {
  id: HardwareVulnerabilityId;
  name: string;
  cveIds: string[];
  type: SpeculativeVulnerability | string;
  architectures: CpuArchitecture[];
  microArchitectures: MicroArchitecture[];
  description: string;
  impact: string;
  severity: VulnerabilitySeverity;
  cvssScore: number;
  mitigations: string[];
  discovered: Date;
}

/* ── Hardware Vulnerability Knowledge Base ── */

export function getKnownHardwareVulnerabilities(): HardwareVulnerability[] {
  return [
    {
      id: hardwareVulnerabilityId(),
      name: 'Spectre v1 (Bounds Check Bypass)',
      cveIds: ['CVE-2017-5753'],
      type: SpeculativeVulnerability.SpectreV1,
      architectures: [CpuArchitecture.x86_64, CpuArchitecture.ARMv8_A, CpuArchitecture.ARMv9_A],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.CascadeLake, MicroArchitecture.Zen2, MicroArchitecture.Zen3, MicroArchitecture.Cortex_A76],
      description: 'Bounds check bypass using speculative execution. An attacker trains the branch predictor to speculatively execute out-of-bounds access.',
      impact: 'Information disclosure across security boundaries (kernel memory read)',
      severity: 'high',
      cvssScore: 5.6,
      mitigations: ['LFENCE serialization', 'Array indexing bounds clamping', 'Retpoline', 'Compiler barriers'],
      discovered: new Date('2018-01-03'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Spectre v2 (Branch Target Injection)',
      cveIds: ['CVE-2017-5715'],
      type: SpeculativeVulnerability.SpectreV2,
      architectures: [CpuArchitecture.x86_64, CpuArchitecture.ARMv8_A],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.Zen2, MicroArchitecture.Zen3],
      description: 'Branch target injection poisoning the indirect branch predictor to redirect speculative execution to attacker-controlled gadgets.',
      impact: 'Information disclosure, cross-process information leak',
      severity: 'high',
      cvssScore: 5.6,
      mitigations: ['Retpoline', 'IBRS/IBPB', 'STIBP', 'CSDB serialization'],
      discovered: new Date('2018-01-03'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Meltdown (Rogue Data Cache Load)',
      cveIds: ['CVE-2017-5754'],
      type: SpeculativeVulnerability.Meltdown,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.CascadeLake, MicroArchitecture.IceLake],
      description: 'Out-of-order execution allows reading kernel memory from userspace by bypassing privilege checks during speculative execution.',
      impact: 'Complete kernel memory read from userspace',
      severity: 'critical',
      cvssScore: 5.6,
      mitigations: ['KAISER/KPTI (kernel page-table isolation)', 'Microcode update'],
      discovered: new Date('2018-01-03'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Meltdown v3 (Rogue System Register Read)',
      cveIds: ['CVE-2018-3640'],
      type: SpeculativeVulnerability.MeltdownV3,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.Zen2],
      description: 'Speculative access to system registers enables reading privileged state.',
      impact: 'Information disclosure of system register values',
      severity: 'high',
      cvssScore: 5.6,
      mitigations: ['Microcode update', 'OS workarounds'],
      discovered: new Date('2018-05-21'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'ZombieLoad (Fill Buffer Data Sampling)',
      cveIds: ['CVE-2019-11091', 'CVE-2018-12130', 'CVE-2018-12126', 'CVE-2018-12127'],
      type: SpeculativeVulnerability.ZombieLoad,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.CascadeLake, MicroArchitecture.IceLake],
      description: 'Microarchitectural data sampling (MDS) vulnerabilities allow leaking data from fill buffers, load ports, and store buffers across security boundaries.',
      impact: 'Cross-process and cross-privilege information leak',
      severity: 'high',
      cvssScore: 6.5,
      mitigations: ['Hardware microcode update', 'Software MDS mitigation (VERW instruction)', 'Hypervisor CPUID masking'],
      discovered: new Date('2019-05-14'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Retbleed (Return Address Injection)',
      cveIds: ['CVE-2022-26373', 'CVE-2022-29900', 'CVE-2022-29901'],
      type: SpeculativeVulnerability.Retbleed,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.Zen3],
      description: 'Return instructions can be used to inject speculative targets, bypassing existing Spectre v2 mitigations (Retpoline).',
      impact: 'Arbitrary speculative execution, information disclosure',
      severity: 'high',
      cvssScore: 6.5,
      mitigations: ['Enhanced IBRS (Intel)', 'LFENCE/JMP sequence (AMD)', 'Compiler mitigations'],
      discovered: new Date('2022-07-12'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Zenbleed (Zen 2 Data Leak)',
      cveIds: ['CVE-2023-20593'],
      type: SpeculativeVulnerability.Zenbleed,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Zen2],
      description: 'Floating-point unit optimization in Zen 2 processors can leak register contents across contexts.',
      impact: 'Cross-process information leak of sensitive data (keys, passwords)',
      severity: 'high',
      cvssScore: 6.5,
      mitigations: ['Microcode update', 'Setting DE_CFG[9] via MSR'],
      discovered: new Date('2023-07-24'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Downfall (Gather Data Sampling)',
      cveIds: ['CVE-2022-40982'],
      type: SpeculativeVulnerability.Downfall,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Skylake, MicroArchitecture.CascadeLake, MicroArchitecture.IceLake, MicroArchitecture.TigerLake],
      description: 'AVX2 gather instruction internally optimizes by reading from internal buffers, leaking data from other processes.',
      impact: 'Cross-process information leak from CPU internal buffers',
      severity: 'high',
      cvssScore: 6.5,
      mitigations: ['Microcode update disabling gather optimization'],
      discovered: new Date('2023-08-08'),
    },
    {
      id: hardwareVulnerabilityId(),
      name: 'Sinkclose (System Management Mode Privilege Escalation)',
      cveIds: ['CVE-2023-31315'],
      type: SpeculativeVulnerability.Sinkclose,
      architectures: [CpuArchitecture.x86_64],
      microArchitectures: [MicroArchitecture.Zen2, MicroArchitecture.Zen3, MicroArchitecture.Zen4],
      description: 'Vulnerability in AMD system management mode (SMM) allows arbitrary code execution with highest privilege, below the hypervisor.',
      impact: 'Complete system compromise, persistent firmware-level malware',
      severity: 'critical',
      cvssScore: 9.0,
      mitigations: ['SMM lock bit configuration', 'Firmware update', 'SMM supervisor mode'],
      discovered: new Date('2024-08-09'),
    },
  ];
}

/* ── Factory Functions ── */

export function createCacheConfig(
  level: CacheLevel,
  type: CacheType,
  size: number,
  overrides?: Partial<CacheConfig>,
): CacheConfig {
  return {
    level,
    type,
    size,
    lineSize: 64,
    associativity: 8,
    policy: CachePolicy.WriteBack,
    latency: level === CacheLevel.L1 ? 4 : level === CacheLevel.L2 ? 12 : 40,
    ...overrides,
  };
}

export function createCpuConfig(
  architecture: CpuArchitecture,
  microArch: MicroArchitecture,
  overrides?: Partial<CpuConfig>,
): CpuConfig {
  return {
    architecture,
    microArch,
    cores: 8,
    threadsPerCore: 2,
    baseFrequency: 3.6,
    boostFrequency: 5.0,
    tdp: 125,
    lithography: 7,
    executionMode: ExecutionMode.OutOfOrder,
    branchPredictor: BranchPredictorType.TAGE,
    pipelineDepth: 14,
    reorderBufferSize: 224,
    l1Cache: createCacheConfig(CacheLevel.L1, CacheType.Data, 32768, { latency: 4 }),
    l2Cache: createCacheConfig(CacheLevel.L2, CacheType.Unified, 524288, { latency: 12 }),
    l3Cache: createCacheConfig(CacheLevel.L3, CacheType.Unified, 16777216, { latency: 40 }),
    speculativeVulnerabilities: [],
    mitigations: [],
    cveIds: [],
    ...overrides,
  };
}

export function createCpuInstance(name: string, config: CpuConfig): CpuInstance {
  const cores: CoreInstance[] = Array.from({ length: config.cores }, (_, i) => ({
    id: coreId(),
    index: i,
    frequency: config.baseFrequency,
    utilization: 0,
    temperature: 40,
    instructionsRetired: 0n,
    cycles: 0n,
    ipc: 1.0,
    branchMispredictions: 0,
    cacheMisses: 0,
  }));

  return {
    id: cpuId(),
    name,
    config,
    cores,
    temperature: 40,
    powerDraw: config.tdp * 0.3,
    utilization: 0,
    uptime: 0,
    registers: [],
  };
}

export function createPciDevice(
  vendor: string, product: string, vendorId: number, deviceId: number, overrides?: Partial<PciDevice>,
): PciDevice {
  return {
    id: pciDeviceId(),
    vendor,
    product,
    vendorId,
    deviceId,
    revision: 0,
    classCode: 0,
    subclass: 0,
    bus: 0,
    deviceNumber: 0,
    function: 0,
    generation: PciGeneration.Gen4,
    bars: [],
    msiSupport: true,
    msiXSupport: true,
    acsSupport: false,
    powerManagement: true,
    ...overrides,
  };
}

export function createUsbDevice(vendor: string, product: string, vendorId: number, productId: number, overrides?: Partial<UsbDevice>): UsbDevice {
  return {
    id: usbDeviceId(),
    vendor,
    product,
    vendorId,
    productId,
    speed: UsbSpeed.High,
    classCode: 0,
    subclass: 0,
    protocol: 0,
    configuration: 1,
    interfaces: [],
    descriptor: 'USB device descriptor',
    ...overrides,
  };
}

export function createFirmware(config?: Partial<FirmwareConfig>): FirmwareInstance {
  return {
    id: firmwareId(),
    config: {
      type: FirmwareType.UEFI,
      vendor: 'American Megatrends',
      version: '5.19',
      releaseDate: new Date(),
      size: 16777216,
      secureBoot: SecureBootState.Enabled,
      measuredBoot: true,
      tpmRequired: true,
      signatureRequired: true,
      ...config,
    },
    variables: [],
    bootEntries: [],
    secureBootKeys: [],
    tcgLog: [],
  };
}

export function createTpmDevice(overrides?: Partial<TpmDevice>): TpmDevice {
  return {
    id: 'tpm-0',
    type: HardwareSecurityModuleType.TPM_2_0,
    state: TpmState.Active,
    version: '2.0',
    pcrs: Array.from({ length: 24 }, (_, i) => ({
      id: tpmPcrId(),
      index: i,
      value: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      algorithm: 'sha256',
      bank: i < 16 ? 'sha1' : 'sha256',
    })),
    nvRam: [],
    attestationKeys: [],
    storageKeys: [],
    ...overrides,
  };
}

export function createJtagDevice(name: string, idCode: number): JtagDevice {
  return {
    id: jtagDeviceId(),
    name,
    irLength: 4,
    idCode,
    scanChain: [],
    connected: true,
    frequency: 10000000,
  };
}

export function createSideChannelTrace(type: SideChannelType, target: string, algorithm: string, leak: string, success: boolean): SideChannelTrace {
  const sampleCount = 10000;
  return {
    id: sideChannelTraceId(),
    type,
    samples: Array.from({ length: sampleCount }, () => Math.random()),
    sampleRate: 1000000000,
    duration: 1.0,
    timestamp: new Date(),
    target,
    algorithm,
    leak,
    success,
    snr: success ? 15 + Math.random() * 10 : 2 + Math.random() * 3,
  };
}

export function createFaultInjection(type: FaultInjectionType, target: string, overrides?: Partial<FaultInjectionAttempt>): FaultInjectionAttempt {
  return {
    id: faultInjectionId(),
    type,
    parameters: type === FaultInjectionType.VoltageGlitch ? { voltageDrop: 0.5, duration: 100 } :
      type === FaultInjectionType.ClockGlitch ? { frequencyShift: 100, duration: 50 } :
      type === FaultInjectionType.RowHammer ? { row: 12345, iterations: 1000000 } : {},
    timestamp: new Date(),
    success: false,
    effect: '',
    target,
    ...overrides,
  };
}

export function createPcbComponent(reference: string, type: string, value: string, x: number, y: number): PcbComponent {
  return {
    id: pcbComponentId(),
    reference,
    type,
    value,
    package: 'SOT-23',
    x,
    y,
    rotation: 0,
    layer: 1,
    pins: 3,
    datasheet: '',
  };
}

export function createSdrConfig(overrides?: Partial<SdrConfig>): SdrConfig {
  return {
    centerFrequency: 2400000000,
    sampleRate: 20000000,
    gain: 30,
    bandwidth: 20000000,
    modulation: ModulationType.QPSK,
    antenna: 'Dipole',
    ...overrides,
  };
}

/* ── CPU Simulator ── */

export class CpuSimulator {
  private cpus: Map<CpuId, CpuInstance> = new Map();

  add(cpu: CpuInstance): CpuId {
    this.cpus.set(cpu.id, cpu);
    return cpu.id;
  }

  get(id: CpuId): CpuInstance | undefined {
    return this.cpus.get(id);
  }

  list(): CpuInstance[] {
    return Array.from(this.cpus.values());
  }

  remove(id: CpuId): boolean {
    return this.cpus.delete(id);
  }

  setUtilization(id: CpuId, utilization: number): boolean {
    const cpu = this.cpus.get(id);
    if (!cpu) return false;
    cpu.utilization = Math.min(100, Math.max(0, utilization));
    cpu.powerDraw = cpu.config.tdp * (0.3 + (cpu.utilization / 100) * 0.7);
    cpu.temperature = 40 + (cpu.utilization / 100) * 60;
    return true;
  }

  setCoreFrequency(cpuId: CpuId, coreIndex: number, frequency: number): boolean {
    const cpu = this.cpus.get(cpuId);
    if (!cpu || coreIndex >= cpu.cores.length) return false;
    cpu.cores[coreIndex]!.frequency = frequency;
    return true;
  }

  simulateCycle(cpuId: CpuId, instructions: number): boolean {
    const cpu = this.cpus.get(cpuId);
    if (!cpu) return false;

    for (const core of cpu.cores) {
      core.instructionsRetired += BigInt(Math.floor(instructions / cpu.cores.length));
      core.cycles += BigInt(Math.floor(instructions / core.ipc / cpu.cores.length));
      core.utilization = Math.min(100, core.utilization + Math.random() * 5);
    }
    cpu.uptime += 0.001;

    return true;
  }

  checkVulnerability(cpuId: CpuId, vuln: SpeculativeVulnerability): boolean {
    const cpu = this.cpus.get(cpuId);
    if (!cpu) return false;
    return cpu.config.speculativeVulnerabilities.includes(vuln);
  }

  applyMitigation(cpuId: CpuId, mitigation: string): boolean {
    const cpu = this.cpus.get(cpuId);
    if (!cpu) return false;
    if (!cpu.config.mitigations.includes(mitigation)) {
      cpu.config.mitigations.push(mitigation);
    }
    return true;
  }

  getStats(): { total: number; totalCores: number; avgUtilization: number; avgTemperature: number } {
    const all = this.list();
    let totalCores = 0;
    let totalUtil = 0;
    let totalTemp = 0;
    for (const cpu of all) {
      totalCores += cpu.cores.length;
      totalUtil += cpu.utilization;
      totalTemp += cpu.temperature;
    }
    return {
      total: all.length,
      totalCores,
      avgUtilization: all.length > 0 ? totalUtil / all.length : 0,
      avgTemperature: all.length > 0 ? totalTemp / all.length : 0,
    };
  }

  clear(): void {
    this.cpus.clear();
  }
}

/* ── Firmware Manager ── */

export class FirmwareManager {
  private firmware: Map<FirmwareId, FirmwareInstance> = new Map();

  provision(config?: Partial<FirmwareConfig>): FirmwareInstance {
    const fw = createFirmware(config);
    this.firmware.set(fw.id, fw);
    return fw;
  }

  get(id: FirmwareId): FirmwareInstance | undefined {
    return this.firmware.get(id);
  }

  list(): FirmwareInstance[] {
    return Array.from(this.firmware.values());
  }

  addVariable(fwId: FirmwareId, variable: UefiVariable): boolean {
    const fw = this.firmware.get(fwId);
    if (!fw) return false;
    fw.variables.push(variable);
    return true;
  }

  addBootEntry(fwId: FirmwareId, entry: BootEntry): boolean {
    const fw = this.firmware.get(fwId);
    if (!fw) return false;
    fw.bootEntries.push(entry);
    return true;
  }

  addTcgLogEntry(fwId: FirmwareId, entry: TcgEventLogEntry): boolean {
    const fw = this.firmware.get(fwId);
    if (!fw) return false;
    fw.tcgLog.push(entry);
    return true;
  }

  setSecureBootState(fwId: FirmwareId, state: SecureBootState): boolean {
    const fw = this.firmware.get(fwId);
    if (!fw) return false;
    fw.config.secureBoot = state;
    return true;
  }

  remove(id: FirmwareId): boolean {
    return this.firmware.delete(id);
  }

  clear(): void {
    this.firmware.clear();
  }
}

/* ── TPM Manager ── */

export class TpmManager {
  private devices: Map<string, TpmDevice> = new Map();

  provision(type: HardwareSecurityModuleType = HardwareSecurityModuleType.TPM_2_0): TpmDevice {
    const tpm = createTpmDevice({ type, state: TpmState.Unowned, version: type === HardwareSecurityModuleType.TPM_2_0 ? '2.0' : '1.2' });
    this.devices.set(tpm.id, tpm);
    return tpm;
  }

  get(id: string): TpmDevice | undefined {
    return this.devices.get(id);
  }

  list(): TpmDevice[] {
    return Array.from(this.devices.values());
  }

  takeOwnership(id: string, ownerAuth: string): boolean {
    const tpm = this.devices.get(id);
    if (!tpm || tpm.state === TpmState.Owned || tpm.state === TpmState.Locked) return false;
    tpm.state = TpmState.Owned;
    return true;
  }

  clearOwnership(id: string): boolean {
    const tpm = this.devices.get(id);
    if (!tpm || tpm.state !== TpmState.Owned) return false;
    tpm.state = TpmState.Unowned;
    return true;
  }

  seal(id: string, data: string, pcrSelection: number[]): boolean {
    const tpm = this.devices.get(id);
    if (!tpm || tpm.state !== TpmState.Owned) return false;
    return true;
  }

  unseal(id: string, pcrSelection: number[]): string | null {
    const tpm = this.devices.get(id);
    if (!tpm || tpm.state !== TpmState.Owned) return null;
    return 'unsealed-data';
  }

  remoteAttest(id: string, nonce: string): { quote: string; signature: string; pcrs: Record<number, string> } | null {
    const tpm = this.devices.get(id);
    if (!tpm || tpm.state !== TpmState.Owned) return null;
    return {
      quote: `quote-${nonce}`,
      signature: `sig-${nonce}`,
      pcrs: Object.fromEntries(tpm.pcrs.slice(0, 4).map((p) => [p.index, p.value])),
    };
  }

  remove(id: string): boolean {
    return this.devices.delete(id);
  }

  clear(): void {
    this.devices.clear();
  }
}

/* ── JTAG Manager ── */

export class JtagManager {
  private devices: Map<JtagDeviceId, JtagDevice> = new Map();
  private operations: JtagOperation[] = [];

  add(device: JtagDevice): JtagDeviceId {
    this.devices.set(device.id, device);
    return device.id;
  }

  get(id: JtagDeviceId): JtagDevice | undefined {
    return this.devices.get(id);
  }

  list(): JtagDevice[] {
    return Array.from(this.devices.values());
  }

  connect(id: JtagDeviceId): boolean {
    const dev = this.devices.get(id);
    if (!dev) return false;
    dev.connected = true;
    return true;
  }

  disconnect(id: JtagDeviceId): boolean {
    const dev = this.devices.get(id);
    if (!dev) return false;
    dev.connected = false;
    return true;
  }

  readIdCode(id: JtagDeviceId): number | null {
    const dev = this.devices.get(id);
    if (!dev || !dev.connected) return null;
    this.operations.push({
      type: 'idcode',
      data: [],
      result: [dev.idCode],
      timestamp: new Date(),
    });
    return dev.idCode;
  }

  readRegister(id: JtagDeviceId, tapName: string, registerName: string): number[] | null {
    const dev = this.devices.get(id);
    if (!dev || !dev.connected) return null;
    for (const tap of dev.scanChain) {
      if (tap.name === tapName) {
        for (const reg of tap.registers) {
          if (reg.name === registerName) {
            this.operations.push({
              type: 'shift_dr',
              data: [],
              result: reg.value,
              timestamp: new Date(),
            });
            return reg.value;
          }
        }
      }
    }
    return null;
  }

  shiftIr(id: JtagDeviceId, instruction: number[]): number[] | null {
    const dev = this.devices.get(id);
    if (!dev || !dev.connected) return null;
    this.operations.push({
      type: 'shift_ir',
      data: instruction,
      result: [],
      timestamp: new Date(),
    });
    return [];
  }

  shiftDr(id: JtagDeviceId, data: number[]): number[] | null {
    const dev = this.devices.get(id);
    if (!dev || !dev.connected) return null;
    this.operations.push({
      type: 'shift_dr',
      data,
      result: [],
      timestamp: new Date(),
    });
    return [];
  }

  getOperations(): JtagOperation[] {
    return this.operations;
  }

  remove(id: JtagDeviceId): boolean {
    return this.devices.delete(id);
  }

  clear(): void {
    this.devices.clear();
    this.operations = [];
  }
}

/* ── Side-Channel Manager ── */

export class SideChannelManager {
  private traces: Map<SideChannelTraceId, SideChannelTrace> = new Map();

  capture(type: SideChannelType, target: string, algorithm: string, leak: string, success: boolean): SideChannelTrace {
    const trace = createSideChannelTrace(type, target, algorithm, leak, success);
    this.traces.set(trace.id, trace);
    return trace;
  }

  get(id: SideChannelTraceId): SideChannelTrace | undefined {
    return this.traces.get(id);
  }

  list(): SideChannelTrace[] {
    return Array.from(this.traces.values());
  }

  listByType(type: SideChannelType): SideChannelTrace[] {
    return this.list().filter((t) => t.type === type);
  }

  listSuccessful(): SideChannelTrace[] {
    return this.list().filter((t) => t.success);
  }

  remove(id: SideChannelTraceId): boolean {
    return this.traces.delete(id);
  }

  getStats(): { total: number; successful: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const t of all) {
      byType[t.type] = (byType[t.type] ?? 0) + 1;
    }
    return {
      total: all.length,
      successful: all.filter((t) => t.success).length,
      byType,
    };
  }

  clear(): void {
    this.traces.clear();
  }
}

/* ── Fault Injection Manager ── */

export class FaultInjectionManager {
  private attempts: Map<FaultInjectionId, FaultInjectionAttempt> = new Map();

  inject(type: FaultInjectionType, target: string, overrides?: Partial<FaultInjectionAttempt>): FaultInjectionAttempt {
    const attempt = createFaultInjection(type, target, overrides);
    this.attempts.set(attempt.id, attempt);
    return attempt;
  }

  get(id: FaultInjectionId): FaultInjectionAttempt | undefined {
    return this.attempts.get(id);
  }

  list(): FaultInjectionAttempt[] {
    return Array.from(this.attempts.values());
  }

  listByType(type: FaultInjectionType): FaultInjectionAttempt[] {
    return this.list().filter((a) => a.type === type);
  }

  listSuccessful(): FaultInjectionAttempt[] {
    return this.list().filter((a) => a.success);
  }

  remove(id: FaultInjectionId): boolean {
    return this.attempts.delete(id);
  }

  getStats(): { total: number; successful: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const a of all) {
      byType[a.type] = (byType[a.type] ?? 0) + 1;
    }
    return { total: all.length, successful: all.filter((a) => a.success).length, byType };
  }

  clear(): void {
    this.attempts.clear();
  }
}

/* ── Bus Manager ── */

export class BusManager {
  private pciDevices: Map<PciDeviceId, PciDevice> = new Map();
  private usbDevices: Map<UsbDeviceId, UsbDevice> = new Map();
  private spiDevices: Map<SpiDeviceId, SpiDevice> = new Map();
  private i2cDevices: Map<I2cDeviceId, I2cDevice> = new Map();
  private nvmeDevices: Map<NvmeDeviceId, NvmeDevice> = new Map();

  addPci(device: PciDevice): PciDeviceId {
    this.pciDevices.set(device.id, device);
    return device.id;
  }

  getPci(id: PciDeviceId): PciDevice | undefined {
    return this.pciDevices.get(id);
  }

  listPci(): PciDevice[] {
    return Array.from(this.pciDevices.values());
  }

  addUsb(device: UsbDevice): UsbDeviceId {
    this.usbDevices.set(device.id, device);
    return device.id;
  }

  getUsb(id: UsbDeviceId): UsbDevice | undefined {
    return this.usbDevices.get(id);
  }

  listUsb(): UsbDevice[] {
    return Array.from(this.usbDevices.values());
  }

  addSpi(device: SpiDevice): SpiDeviceId {
    this.spiDevices.set(device.id, device);
    return device.id;
  }

  getSpi(id: SpiDeviceId): SpiDevice | undefined {
    return this.spiDevices.get(id);
  }

  listSpi(): SpiDevice[] {
    return Array.from(this.spiDevices.values());
  }

  spiTransfer(deviceId: SpiDeviceId, data: number[]): number[] | null {
    const dev = this.spiDevices.get(deviceId);
    if (!dev) return null;
    dev.data.push(...data);
    return data.map(() => 0);
  }

  addI2c(device: I2cDevice): I2cDeviceId {
    this.i2cDevices.set(device.id, device);
    return device.id;
  }

  getI2c(id: I2cDeviceId): I2cDevice | undefined {
    return this.i2cDevices.get(id);
  }

  listI2c(): I2cDevice[] {
    return Array.from(this.i2cDevices.values());
  }

  i2cRead(deviceId: I2cDeviceId, register: number, length: number): number[] | null {
    const dev = this.i2cDevices.get(deviceId);
    if (!dev) return null;
    return dev.data.slice(register, register + length);
  }

  i2cWrite(deviceId: I2cDeviceId, register: number, data: number[]): boolean {
    const dev = this.i2cDevices.get(deviceId);
    if (!dev) return false;
    for (let i = 0; i < data.length; i++) {
      dev.data[register + i] = data[i]!;
    }
    return true;
  }

  addNvme(device: NvmeDevice): NvmeDeviceId {
    this.nvmeDevices.set(device.id, device);
    return device.id;
  }

  getNvme(id: NvmeDeviceId): NvmeDevice | undefined {
    return this.nvmeDevices.get(id);
  }

  listNvme(): NvmeDevice[] {
    return Array.from(this.nvmeDevices.values());
  }

  getStats(): { pci: number; usb: number; spi: number; i2c: number; nvme: number } {
    return {
      pci: this.pciDevices.size,
      usb: this.usbDevices.size,
      spi: this.spiDevices.size,
      i2c: this.i2cDevices.size,
      nvme: this.nvmeDevices.size,
    };
  }

  clear(): void {
    this.pciDevices.clear();
    this.usbDevices.clear();
    this.spiDevices.clear();
    this.i2cDevices.clear();
    this.nvmeDevices.clear();
  }
}

/* ── Hardware Coordinator ── */

export class HardwareCoordinator {
  cpuSimulator: CpuSimulator;
  firmwareManager: FirmwareManager;
  tpmManager: TpmManager;
  jtagManager: JtagManager;
  sideChannelManager: SideChannelManager;
  faultInjectionManager: FaultInjectionManager;
  busManager: BusManager;
  private vulnerabilities: HardwareVulnerability[] = [];

  constructor() {
    this.cpuSimulator = new CpuSimulator();
    this.firmwareManager = new FirmwareManager();
    this.tpmManager = new TpmManager();
    this.jtagManager = new JtagManager();
    this.sideChannelManager = new SideChannelManager();
    this.faultInjectionManager = new FaultInjectionManager();
    this.busManager = new BusManager();
    this.vulnerabilities = getKnownHardwareVulnerabilities();
  }

  getKnownVulnerabilities(): HardwareVulnerability[] {
    return this.vulnerabilities;
  }

  getVulnerabilitiesByArchitecture(arch: CpuArchitecture): HardwareVulnerability[] {
    return this.vulnerabilities.filter((v) => v.architectures.includes(arch));
  }

  getStats(): {
    cpus: number; cores: number; firmware: number; tpm: number;
    jtag: number; traces: number; faults: number;
    pci: number; usb: number; spi: number; i2c: number; nvme: number;
    vulnerabilities: number;
  } {
    const cpuStats = this.cpuSimulator.getStats();
    const busStats = this.busManager.getStats();
    return {
      cpus: cpuStats.total,
      cores: cpuStats.totalCores,
      firmware: this.firmwareManager.list().length,
      tpm: this.tpmManager.list().length,
      jtag: this.jtagManager.list().length,
      traces: this.sideChannelManager.list().length,
      faults: this.faultInjectionManager.list().length,
      pci: busStats.pci,
      usb: busStats.usb,
      spi: busStats.spi,
      i2c: busStats.i2c,
      nvme: busStats.nvme,
      vulnerabilities: this.vulnerabilities.length,
    };
  }

  reset(): void {
    this.cpuSimulator.clear();
    this.firmwareManager.clear();
    this.tpmManager.clear();
    this.jtagManager.clear();
    this.sideChannelManager.clear();
    this.faultInjectionManager.clear();
    this.busManager.clear();
  }
}

export function createDefaultHardwareEnvironment(): HardwareCoordinator {
  const coord = new HardwareCoordinator();

  const cpu1 = createCpuInstance('AMD Ryzen 9 7950X', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.Zen4, {
    cores: 16,
    threadsPerCore: 2,
    baseFrequency: 4.5,
    boostFrequency: 5.7,
    tdp: 170,
    lithography: 5,
    speculativeVulnerabilities: [
      SpeculativeVulnerability.SpectreV1,
      SpeculativeVulnerability.SpectreV2,
      SpeculativeVulnerability.Retbleed,
      SpeculativeVulnerability.Zenbleed,
    ],
    mitigations: ['Retpoline', 'IBRS', 'IBPB'],
    cveIds: ['CVE-2017-5753', 'CVE-2017-5715', 'CVE-2022-26373', 'CVE-2023-20593'],
  }));
  coord.cpuSimulator.add(cpu1);

  const cpu2 = createCpuInstance('Intel Core i9-14900K', createCpuConfig(CpuArchitecture.x86_64, MicroArchitecture.RaptorLake, {
    cores: 24,
    threadsPerCore: 1,
    baseFrequency: 3.2,
    boostFrequency: 6.0,
    tdp: 125,
    lithography: 7,
    pipelineDepth: 19,
    reorderBufferSize: 256,
    speculativeVulnerabilities: [
      SpeculativeVulnerability.SpectreV1,
      SpeculativeVulnerability.SpectreV2,
      SpeculativeVulnerability.Meltdown,
      SpeculativeVulnerability.ZombieLoad,
      SpeculativeVulnerability.Retbleed,
      SpeculativeVulnerability.Downfall,
    ],
    mitigations: ['Retpoline', 'KPTI', 'IBRS', 'MDS clearing', 'Microcode update'],
    cveIds: ['CVE-2017-5753', 'CVE-2017-5715', 'CVE-2017-5754', 'CVE-2019-11091', 'CVE-2022-26373', 'CVE-2022-40982'],
  }));
  coord.cpuSimulator.add(cpu2);

  const fw = coord.firmwareManager.provision();
  coord.firmwareManager.addVariable(fw.id, {
    id: uefiVariableId(),
    name: 'SetupMode',
    guid: '8BE4DF61-93CA-11D2-AA0D-00E098032B8C',
    attributes: ['NV', 'BS', 'RT'],
    data: new Uint8Array([0]),
    vendor: true,
  });
  coord.firmwareManager.addBootEntry(fw.id, {
    id: 'boot0001',
    name: 'Windows Boot Manager',
    devicePath: 'HD(1,GPT,...)/File(\\EFI\\Microsoft\\Boot\\bootmgfw.efi)',
    filePath: '\\EFI\\Microsoft\\Boot\\bootmgfw.efi',
    enabled: true,
    bootNext: false,
  });
  coord.firmwareManager.addTcgLogEntry(fw.id, {
    index: 1,
    pcr: 0,
    eventType: 'EV_S_CRTM_VERSION',
    digest: '0xabcdef1234567890',
    description: 'CRTM version 1.0',
  });
  coord.firmwareManager.addTcgLogEntry(fw.id, {
    index: 2,
    pcr: 2,
    eventType: 'EV_EFI_BOOT_SERVICES_APPLICATION',
    digest: '0x1234567890abcdef',
    description: 'UEFI Boot Manager loaded',
  });

  const tpm = coord.tpmManager.provision();
  coord.tpmManager.takeOwnership(tpm.id, 'owner-auth-key');

  const jtag = createJtagDevice('STM32F4 Debug', 0x2BA01477);
  jtag.scanChain = [{
    name: 'CPU',
    irLength: 4,
    idCode: 0x2BA01477,
    instructions: [
      { code: 0b0000, name: 'EXTEST', description: 'External test' },
      { code: 0b0001, name: 'SAMPLE', description: 'Sample I/O' },
      { code: 0b0010, name: 'IDCODE', description: 'Read ID code' },
      { code: 0b1111, name: 'BYPASS', description: 'Bypass register' },
    ],
    registers: [
      { name: 'BOUNDARY', size: 144, value: Array.from({ length: 144 }, () => 0) },
      { name: 'BYPASS', size: 1, value: [0] },
      { name: 'IDCODE', size: 32, value: [0x2BA01477] },
    ],
  }];
  coord.jtagManager.add(jtag);

  coord.sideChannelManager.capture(
    SideChannelType.CacheTiming,
    'AES-256 on Cortex-A76',
    'AES T-table lookup',
    'AES key bytes 0-7 recovered via Flush+Reload',
    true,
  );
  coord.sideChannelManager.capture(
    SideChannelType.PowerAnalysis,
    'RSA-2048 on STM32F4',
    'RSA Montgomery multiplication',
    'Key bit sequence recovered via SPA',
    true,
  );
  coord.sideChannelManager.capture(
    SideChannelType.Timing,
    'ECDSA on P-256',
    'Scalar multiplication',
    'Insufficient SNR to recover nonce',
    false,
  );

  coord.faultInjectionManager.inject(
    FaultInjectionType.VoltageGlitch,
    'RISC-V Secure Boot',
    { parameters: { voltageDrop: 0.4, duration: 150 }, success: true, effect: 'Secure boot signature check bypassed' },
  );
  coord.faultInjectionManager.inject(
    FaultInjectionType.RowHammer,
    'DDR4 DIMM',
    { parameters: { row: 65535, iterations: 1000000 }, success: false, effect: 'No bit flips detected after 1M activations' },
  );

  const pciNic = createPciDevice('Intel', 'Ethernet Controller I225-V', 0x8086, 0x15F3, {
    bus: 1, device: 0, function: 0,
    bars: [{ index: 0, address: 0xFE000000, size: 1048576, type: 'memory', prefetchable: false }],
  });
  coord.busManager.addPci(pciNic);

  const usbFlash = createUsbDevice('SanDisk', 'Ultra Fit 256GB', 0x0781, 0x5583, {
    speed: UsbSpeed.SuperPlus,
    classCode: 8, subclass: 6, protocol: 80,
  });
  coord.busManager.addUsb(usbFlash);

  return coord;
}
