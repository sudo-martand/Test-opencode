import { uid, type UID } from '@cybersim/shared';

export type CaseId = UID & { readonly __brand: unique symbol };
export type EvidenceId = UID & { readonly __brand: unique symbol };
export type ArtifactId = UID & { readonly __brand: unique symbol };
export type IoCId = UID & { readonly __brand: unique symbol };
export type TimelineEventId = UID & { readonly __brand: unique symbol };

export function caseId(): CaseId {
  return `case-${uid()}` as CaseId;
}

export function evidenceId(): EvidenceId {
  return `ev-${uid()}` as EvidenceId;
}

export function artifactId(): ArtifactId {
  return `art-${uid()}` as ArtifactId;
}

export function iocId(): IoCId {
  return `ioc-${uid()}` as IoCId;
}

export function timelineEventId(): TimelineEventId {
  return `tl-${uid()}` as TimelineEventId;
}

export enum EvidenceType {
  MemoryDump = 'memory_dump',
  DiskImage = 'disk_image',
  PacketCapture = 'packet_capture',
  FileSystemImage = 'filesystem_image',
  LogFile = 'log_file',
  RegistryHive = 'registry_hive',
  EventLog = 'event_log',
  ProcessDump = 'process_dump',
  FirmwareImage = 'firmware_image',
}

export enum EvidenceStatus {
  Pending = 'pending',
  Acquiring = 'acquiring',
  Acquired = 'acquired',
  Analyzing = 'analyzing',
  Analyzed = 'analyzed',
  Failed = 'failed',
}

export enum CaseStatus {
  Open = 'open',
  Active = 'active',
  PendingReview = 'pending_review',
  Closed = 'closed',
  Archived = 'archived',
}

export enum ArtifactCategory {
  Process = 'process',
  Network = 'network',
  FileSystem = 'filesystem',
  Registry = 'registry',
  Memory = 'memory',
  Malware = 'malware',
  IoC = 'indicator',
  Log = 'log',
}

export enum IndicatorType {
  IpAddress = 'ip_address',
  Domain = 'domain',
  Url = 'url',
  Hash = 'hash',
  Email = 'email',
  FilePath = 'file_path',
  RegistryKey = 'registry_key',
  Mutex = 'mutex',
  NamedPipe = 'named_pipe',
  ServiceName = 'service_name',
  ProcessName = 'process_name',
  YaraRule = 'yara_rule',
  SigmaRule = 'sigma_rule',
}

export enum MemoryRegionProtection {
  Read = 'r',
  ReadWrite = 'rw',
  ReadExecute = 'rx',
  ReadWriteExecute = 'rwx',
  WriteCopy = 'wc',
  Guard = 'g',
}

export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp',
  DNS = 'dns',
  HTTP = 'http',
  HTTPS = 'https',
  TLS = 'tls',
  SMB = 'smb',
  FTP = 'ftp',
  SSH = 'ssh',
  Modbus = 'modbus',
  DNP3 = 'dnp3',
}

export enum FileSystemType {
  NTFS = 'ntfs',
  FAT32 = 'fat32',
  EXT4 = 'ext4',
  EXT3 = 'ext3',
  EXT2 = 'ext2',
  APFS = 'apfs',
  HFS = 'hfs',
  XFS = 'xfs',
  ZFS = 'zfs',
  BTRFS = 'btrfs',
  EXFAT = 'exfat',
}

export interface ForensicCase {
  id: CaseId;
  name: string;
  description: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  analyst: string;
  organization: string;
  tags: string[];
  evidence: EvidenceId[];
}

export interface Evidence {
  id: EvidenceId;
  type: EvidenceType;
  status: EvidenceStatus;
  source: string;
  description: string;
  acquiredAt: Date;
  size: number;
  hash: string;
  hashAlgorithm: string;
  tags: string[];
  artifacts: ArtifactId[];
}

export interface Artifact {
  id: ArtifactId;
  category: ArtifactCategory;
  type: string;
  name: string;
  description: string;
  discoveredAt: Date;
  sourceEvidence: EvidenceId;
  relevance: number;
  tags: string[];
  raw: Record<string, unknown>;
}

export interface ProcessInfo {
  pid: number;
  ppid: number;
  name: string;
  path: string;
  commandLine: string;
  startTime: Date | null;
  exitTime: Date | null;
  user: string;
  integrity: string;
  threads: number;
  handles: number;
  parentProcess: string;
  children: string[];
  memoryRegions: MemoryRegion[];
  loadedModules: string[];
  networkConnections: ProcessConnection[];
}

export interface MemoryRegion {
  address: string;
  size: number;
  protection: MemoryRegionProtection;
  mappedFile: string | null;
  isShared: boolean;
  isExecutable: boolean;
  isWritable: boolean;
  tags: string[];
}

export interface ProcessConnection {
  protocol: NetworkProtocol;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  pid: number;
  processName: string;
}

export interface KernelModule {
  name: string;
  path: string;
  size: number;
  baseAddress: string;
  loadedAt: Date | null;
  signed: boolean;
}

export interface MemoryScanResult {
  address: string;
  pattern: string;
  context: string;
  confidence: number;
}

export interface DiskPartition {
  index: number;
  type: string;
  offset: number;
  size: number;
  fileSystem: FileSystemType | null;
  label: string;
  isBootable: boolean;
}

export interface FileSystemEntry {
  path: string;
  name: string;
  isDirectory: boolean;
  size: number;
  created: Date | null;
  modified: Date | null;
  accessed: Date | null;
  permissions: string;
  owner: string;
  inode: number;
  deleted: boolean;
}

export interface MftEntry {
  recordNumber: number;
  fileName: string;
  parentPath: string;
  fullPath: string;
  size: number;
  created: Date | null;
  modified: Date | null;
  mftModified: Date | null;
  accessed: Date | null;
  flags: string[];
  isDeleted: boolean;
  isDirectory: boolean;
  resident: boolean;
  attributes: string[];
  dataRuns: DataRun[];
}

export interface DataRun {
  cluster: number;
  length: number;
  offset: number;
}

export interface CarvedFile {
  offset: number;
  size: number;
  signature: string;
  mimeType: string;
  name: string;
  confidence: number;
  data: Uint8Array;
}

export interface PacketSummary {
  frameNumber: number;
  timestamp: Date;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: NetworkProtocol;
  length: number;
  info: string;
}

export interface FlowRecord {
  id: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: NetworkProtocol;
  packets: number;
  bytesTransferred: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  state: string;
  applicationProtocol: string;
}

export interface DnsQuery {
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  query: string;
  queryType: string;
  responseCode: string;
  answers: string[];
  ttl: number;
}

export interface HttpRequest {
  timestamp: Date;
  sourceIp: string;
  method: string;
  uri: string;
  host: string;
  userAgent: string;
  referer: string;
  statusCode: number;
  contentType: string;
  bodySize: number;
}

export interface TlsHandshake {
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  serverName: string;
  version: string;
  cipherSuite: string;
  certificateIssuer: string;
  certificateSubject: string;
  ja3Hash: string;
  ja3sHash: string;
}

export interface TimelineEvent {
  id: TimelineEventId;
  timestamp: Date;
  eventType: string;
  source: string;
  description: string;
  severity: string;
  evidenceId: EvidenceId | null;
  artifactId: ArtifactId | null;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface IndicatorOfCompromise {
  id: IoCId;
  type: IndicatorType;
  value: string;
  description: string;
  source: string;
  confidence: number;
  severity: string;
  firstSeen: Date;
  lastSeen: Date;
  relatedIndicators: IoCId[];
  tags: string[];
  killChainPhase: string;
  mitreTechnique: string;
}

export interface YaraMatch {
  rule: string;
  author: string;
  description: string;
  offset: number;
  context: string;
  tags: string[];
}

export interface FileScanResult {
  path: string;
  size: number;
  hash: string;
  yaraMatches: YaraMatch[];
  entropy: number;
  isPacked: boolean;
  compiler: string | null;
  architecture: string | null;
}

export class CaseManager {
  private cases: Map<CaseId, ForensicCase> = new Map();
  private evidence: Map<EvidenceId, Evidence> = new Map();
  private artifacts: Map<ArtifactId, Artifact> = new Map();

  createCase(name: string, analyst: string, organization: string, description = ''): ForensicCase {
    const now = new Date();
    const c: ForensicCase = {
      id: caseId(),
      name,
      description,
      status: CaseStatus.Open,
      createdAt: now,
      updatedAt: now,
      closedAt: null,
      analyst,
      organization,
      tags: [],
      evidence: [],
    };
    this.cases.set(c.id, c);
    return c;
  }

  getCase(id: CaseId): ForensicCase | undefined {
    return this.cases.get(id);
  }

  listCases(status?: CaseStatus): ForensicCase[] {
    const all = Array.from(this.cases.values());
    return status ? all.filter((c) => c.status === status) : all;
  }

  updateCase(id: CaseId, updates: Partial<Pick<ForensicCase, 'name' | 'description' | 'status' | 'tags'>>): boolean {
    const c = this.cases.get(id);
    if (!c) return false;
    Object.assign(c, updates, { updatedAt: new Date() });
    if (updates.status === CaseStatus.Closed) c.closedAt = new Date();
    return true;
  }

  addEvidence(caseId: CaseId, evidence: Evidence): boolean {
    const c = this.cases.get(caseId);
    if (!c) return false;
    this.evidence.set(evidence.id, evidence);
    c.evidence.push(evidence.id);
    c.updatedAt = new Date();
    return true;
  }

  getEvidence(id: EvidenceId): Evidence | undefined {
    return this.evidence.get(id);
  }

  listEvidence(caseId: CaseId): Evidence[] {
    const c = this.cases.get(caseId);
    if (!c) return [];
    return c.evidence.map((eid) => this.evidence.get(eid)).filter(Boolean) as Evidence[];
  }

  updateEvidence(id: EvidenceId, updates: Partial<Pick<Evidence, 'status' | 'description' | 'tags'>>): boolean {
    const ev = this.evidence.get(id);
    if (!ev) return false;
    Object.assign(ev, updates);
    return true;
  }

  addArtifact(evidenceId: EvidenceId, artifact: Artifact): boolean {
    const ev = this.evidence.get(evidenceId);
    if (!ev) return false;
    this.artifacts.set(artifact.id, artifact);
    ev.artifacts.push(artifact.id);
    return true;
  }

  getArtifact(id: ArtifactId): Artifact | undefined {
    return this.artifacts.get(id);
  }

  listArtifacts(evidenceId: EvidenceId): Artifact[] {
    const ev = this.evidence.get(evidenceId);
    if (!ev) return [];
    return ev.artifacts.map((aid) => this.artifacts.get(aid)).filter(Boolean) as Artifact[];
  }

  listArtifactsByCategory(category: ArtifactCategory): Artifact[] {
    return Array.from(this.artifacts.values()).filter((a) => a.category === category);
  }

  createEvidence(
    type: EvidenceType,
    source: string,
    description: string,
    size = 0,
    hash = '',
    hashAlgorithm = 'sha256',
  ): Evidence {
    const ev: Evidence = {
      id: evidenceId(),
      type,
      status: EvidenceStatus.Pending,
      source,
      description,
      acquiredAt: new Date(),
      size,
      hash,
      hashAlgorithm,
      tags: [],
      artifacts: [],
    };
    this.evidence.set(ev.id, ev);
    return ev;
  }

  createArtifact(
    category: ArtifactCategory,
    type: string,
    name: string,
    description: string,
    evidenceId: EvidenceId,
    raw: Record<string, unknown> = {},
  ): Artifact {
    return {
      id: artifactId(),
      category,
      type,
      name,
      description,
      discoveredAt: new Date(),
      sourceEvidence: evidenceId,
      relevance: 1.0,
      tags: [],
      raw,
    };
  }

  removeCase(id: CaseId): boolean {
    return this.cases.delete(id);
  }

  clear(): void {
    this.cases.clear();
    this.evidence.clear();
    this.artifacts.clear();
  }
}

export class MemoryAnalyzer {
  analyzeProcessList(dump: Uint8Array): ProcessInfo[] {
    if (dump.length === 0) return [];
    const count = Math.min(Math.floor(dump.length / 256), 25);
    const processes: ProcessInfo[] = [];
    const names = [
      'System', 'smss.exe', 'csrss.exe', 'wininit.exe', 'services.exe',
      'lsass.exe', 'svchost.exe', 'explorer.exe', 'spoolsv.exe', 'taskhostw.exe',
      'SearchIndexer.exe', 'RuntimeBroker.exe', 'sihost.exe', 'dwm.exe',
      'SecurityHealthService.exe', 'OneDrive.exe', 'ctfmon.exe', 'msedge.exe',
      'Teams.exe', 'Code.exe', 'powershell.exe', 'cmd.exe', 'notepad.exe',
      'wmiprvse.exe', 'MsMpEng.exe',
    ];
    for (let i = 0; i < count; i++) {
      const nameIdx = (dump[i * 10] ?? 0) % names.length;
      const name = names[nameIdx] ?? 'unknown.exe';
      const pid = 4 + i * 4;
      processes.push({
        pid,
        ppid: pid === 4 ? 0 : 4 + (i - 1) * 4,
        name,
        path: `C:\\Windows\\System32\\${name}`,
        commandLine: `${name} ${i === 0 ? '--system' : `-pid ${pid}`}`,
        startTime: new Date(),
        exitTime: null,
        user: pid <= 100 ? 'SYSTEM' : 'user',
        integrity: pid <= 100 ? 'System' : 'High',
        threads: Math.max(1, 8 - i),
        handles: 100 + i * 10,
        parentProcess: i === 0 ? '' : names[0] ?? 'System',
        children: [],
        memoryRegions: [],
        loadedModules: ['ntdll.dll', 'kernel32.dll', 'kernelbase.dll'],
        networkConnections: [],
      });
    }
    return processes;
  }

  scanForProcess(dump: Uint8Array, pid: number): ProcessInfo | null {
    const processes = this.analyzeProcessList(dump);
    return processes.find((p) => p.pid === pid) ?? null;
  }

  detectHiddenProcesses(dump: Uint8Array, crossReference: number[]): ProcessInfo[] {
    const found = this.analyzeProcessList(dump);
    return found.filter((p) => !crossReference.includes(p.pid));
  }

  scanMemoryRegions(dump: Uint8Array): MemoryRegion[] {
    if (dump.length === 0) return [];
    const count = Math.min(Math.floor(dump.length / 512), 10);
    const regions: MemoryRegion[] = [];
    const protections = Object.values(MemoryRegionProtection);
    for (let i = 0; i < count; i++) {
      const prot = protections[i % protections.length] ?? MemoryRegionProtection.Read;
      regions.push({
        address: `0x${(0x10000000 + i * 0x100000).toString(16)}`,
        size: 0x100000,
        protection: prot,
        mappedFile: i % 3 === 0 ? `C:\\Windows\\System32\\ntdll.dll` : null,
        isShared: i % 4 === 0,
        isExecutable: prot === MemoryRegionProtection.ReadExecute || prot === MemoryRegionProtection.ReadWriteExecute,
        isWritable: prot === MemoryRegionProtection.ReadWrite || prot === MemoryRegionProtection.ReadWriteExecute,
        tags: [prot],
      });
    }
    return regions;
  }

  scanKernelModules(dump: Uint8Array): KernelModule[] {
    if (dump.length === 0) return [];
    const modules: KernelModule[] = [
      {
        name: 'ntoskrnl.exe',
        path: 'C:\\Windows\\System32\\ntoskrnl.exe',
        size: 0x800000,
        baseAddress: '0xfffff80000000000',
        loadedAt: new Date(),
        signed: true,
      },
      {
        name: 'hal.dll',
        path: 'C:\\Windows\\System32\\hal.dll',
        size: 0x200000,
        baseAddress: '0xfffff80000800000',
        loadedAt: new Date(),
        signed: true,
      },
      {
        name: 'ksecpkg.sys',
        path: 'C:\\Windows\\System32\\drivers\\ksecpkg.sys',
        size: 0x100000,
        baseAddress: '0xfffff80000a00000',
        loadedAt: new Date(),
        signed: true,
      },
    ];
    const extraCount = Math.min(Math.floor(dump.length / 1024), 7);
    for (let i = 0; i < extraCount; i++) {
      modules.push({
        name: `driver${i + 1}.sys`,
        path: `C:\\Windows\\System32\\drivers\\driver${i + 1}.sys`,
        size: 0x80000 + i * 0x10000,
        baseAddress: `0xfffff8000${(0xa0 + (i + 1) * 0x20).toString(16)}0000`,
        loadedAt: new Date(),
        signed: i % 3 !== 0,
      });
    }
    return modules;
  }

  scanForMalwareIndicators(dump: Uint8Array, yaraRules: string[]): MemoryScanResult[] {
    const results: MemoryScanResult[] = [];
    if (dump.length === 0 || yaraRules.length === 0) return results;
    for (const rule of yaraRules) {
      const patternBytes = new TextEncoder().encode(rule);
      let idx = 0;
      while (idx < dump.length - patternBytes.length) {
        let match = true;
        for (let j = 0; j < patternBytes.length; j++) {
          if ((dump[idx + j] ?? 0) !== (patternBytes[j] ?? 0)) {
            match = false;
            break;
          }
        }
        if (match) {
          const contextStart = Math.max(0, idx - 16);
          const contextBytes = dump.slice(contextStart, idx + patternBytes.length + 16);
          results.push({
            address: `0x${idx.toString(16)}`,
            pattern: rule.substring(0, 40),
            context: Array.from(contextBytes).map((b) => b.toString(16).padStart(2, '0')).join(' '),
            confidence: 0.7 + Math.random() * 0.3,
          });
        }
        idx++;
      }
    }
    return results;
  }

  analyzeNetworkConnections(dump: Uint8Array): ProcessConnection[] {
    if (dump.length === 0) return [];
    const count = Math.min(Math.floor(dump.length / 128), 8);
    const connections: ProcessConnection[] = [];
    const protocols = [NetworkProtocol.TCP, NetworkProtocol.UDP, NetworkProtocol.TCP, NetworkProtocol.TCP];
    const states = ['ESTABLISHED', 'LISTEN', 'TIME_WAIT', 'CLOSE_WAIT', 'SYN_SENT'];
    for (let i = 0; i < count; i++) {
      const proto = protocols[i % protocols.length] ?? NetworkProtocol.TCP;
      connections.push({
        protocol: proto,
        localAddress: '192.168.1.100',
        localPort: 49152 + i * 100,
        remoteAddress: i % 2 === 0 ? '10.0.0.1' : '203.0.113.50',
        remotePort: proto === NetworkProtocol.UDP ? 53 : [80, 443, 22, 3389, 445][i % 5]!,
        state: states[i % states.length] ?? 'ESTABLISHED',
        pid: 4 + i * 4,
        processName: ['svchost.exe', 'firefox.exe', 'chrome.exe', 'OUTLOOK.EXE', 'msedge.exe', 'Teams.exe', 'Code.exe', 'OneDrive.exe'][i] ?? 'svchost.exe',
      });
    }
    return connections;
  }
}

export class DiskAnalyzer {
  analyzePartitions(image: Uint8Array): DiskPartition[] {
    if (image.length < 512) return [];
    const mbr = image.slice(0, 512);
    const partitions: DiskPartition[] = [];
    const fsTypes: FileSystemType[] = [FileSystemType.NTFS, FileSystemType.FAT32, FileSystemType.EXT4, FileSystemType.EXFAT];
    const typeLabels = ['NTFS', 'FAT32', 'Linux', 'exFAT'];
    for (let i = 0; i < 4; i++) {
      const partitionOffset = 446 + i * 16;
      const status = mbr[partitionOffset] ?? 0;
      const typeCode = mbr[partitionOffset + 4] ?? 0;
      if (typeCode === 0) continue;
      const lba = new DataView(mbr.buffer, mbr.byteOffset + partitionOffset + 8, 4).getUint32(0, true);
      const size = new DataView(mbr.buffer, mbr.byteOffset + partitionOffset + 12, 4).getUint32(0, true);
      const fsIdx = i % fsTypes.length;
      partitions.push({
        index: i + 1,
        type: typeLabels[fsIdx] ?? 'Unknown',
        offset: lba * 512,
        size: size * 512,
        fileSystem: fsTypes[fsIdx] ?? null,
        label: `Partition ${i + 1}`,
        isBootable: (status & 0x80) !== 0,
      });
    }
    return partitions;
  }

  walkFileSystem(image: Uint8Array, rootPath = '/'): FileSystemEntry[] {
    if (image.length === 0) return [];
    const entries: FileSystemEntry[] = [];
    const dirs = ['/', '/Windows/', '/Windows/System32/', '/Users/', '/Users/Public/', '/Program Files/', '/ProgramData/'];
    const files: Array<{ dir: string; name: string; size: number }> = [
      { dir: '/Windows/', name: 'ntoskrnl.exe', size: 8_000_000 },
      { dir: '/Windows/', name: 'system.ini', size: 219 },
      { dir: '/Windows/', name: 'win.ini', size: 92 },
      { dir: '/Windows/System32/', name: 'ntdll.dll', size: 1_800_000 },
      { dir: '/Windows/System32/', name: 'kernel32.dll', size: 1_200_000 },
      { dir: '/Windows/System32/', name: 'hal.dll', size: 500_000 },
      { dir: '/Windows/System32/', name: 'config/SAM', size: 128_000 },
      { dir: '/Windows/System32/', name: 'config/SYSTEM', size: 4_000_000 },
      { dir: '/Windows/System32/', name: 'drivers/etc/hosts', size: 824 },
      { dir: '/Users/', name: 'Public', size: 0 },
      { dir: '/Users/', name: 'Administrator', size: 0 },
      { dir: '/Program Files/', name: 'Common Files', size: 0 },
      { dir: '/ProgramData/', name: 'Microsoft', size: 0 },
    ];
    for (const d of dirs) {
      const name = d.split('/').filter(Boolean).pop() ?? d;
      entries.push({
        path: d,
        name,
        isDirectory: true,
        size: 0,
        created: new Date(),
        modified: new Date(),
        accessed: new Date(),
        permissions: 'drwxr-xr-x',
        owner: 'SYSTEM',
        inode: dirs.indexOf(d) + 1,
        deleted: false,
      });
    }
    for (const f of files) {
      if (!rootPath || f.dir.startsWith(rootPath)) {
        entries.push({
          path: f.dir + f.name,
          name: f.name,
          isDirectory: false,
          size: f.size,
          created: new Date(),
          modified: new Date(),
          accessed: new Date(),
          permissions: '-rwxr-xr-x',
          owner: 'SYSTEM',
          inode: 100 + files.indexOf(f),
          deleted: false,
        });
      }
    }
    return entries;
  }

  parseMft(image: Uint8Array): MftEntry[] {
    if (image.length < 1024) return [];
    const count = Math.min(Math.floor(image.length / 1024), 15);
    const entries: MftEntry[] = [];
    for (let i = 0; i < count; i++) {
      const isDir = i % 5 === 0;
      const isDeleted = i % 7 === 6;
      const names = [
        '$MFT', '$MFTMirr', '$LogFile', '$Volume', '$AttrDef',
        'NTFS', '$Bitmap', '$Boot', '$BadClus', '$Secure',
        '$UpCase', '$Extend', 'users.txt', 'passwords.txt', 'secret.docx',
      ];
      entries.push({
        recordNumber: i,
        fileName: names[i] ?? `file_${i}.dat`,
        parentPath: i < 12 ? '/' : '/Users/Administrator/',
        fullPath: `${i < 12 ? '/' : '/Users/Administrator/'}${names[i] ?? `file_${i}.dat`}`,
        size: 1024 * (i + 1),
        created: new Date(),
        modified: new Date(),
        mftModified: new Date(),
        accessed: new Date(),
        flags: isDir ? ['FILE_NAME', 'INDEX_ROOT', 'DIRECTORY'] : ['FILE_NAME', 'DATA'],
        isDeleted,
        isDirectory: isDir,
        resident: i % 3 !== 0,
        attributes: isDir ? ['$STANDARD_INFORMATION', '$FILE_NAME', '$INDEX_ROOT', '$INDEX_ALLOCATION'] : ['$STANDARD_INFORMATION', '$FILE_NAME', '$DATA'],
        dataRuns: isDir ? [] : [{ cluster: 1024 + i * 64, length: 1, offset: 0 }],
      });
    }
    return entries;
  }

  carveFiles(image: Uint8Array, signatures?: string[]): CarvedFile[] {
    if (image.length < 32) return [];
    const defaultSignatures: Array<{ sig: number[]; ext: string; mime: string; name: string }> = [
      { sig: [0xFF, 0xD8, 0xFF, 0xE0], ext: 'jpg', mime: 'image/jpeg', name: 'carved_image' },
      { sig: [0x89, 0x50, 0x4E, 0x47], ext: 'png', mime: 'image/png', name: 'carved_png' },
      { sig: [0x25, 0x50, 0x44, 0x46], ext: 'pdf', mime: 'application/pdf', name: 'carved_document' },
      { sig: [0x50, 0x4B, 0x03, 0x04], ext: 'zip', mime: 'application/zip', name: 'carved_archive' },
      { sig: [0xD0, 0xCF, 0x11, 0xE0], ext: 'ole', mime: 'application/x-ole-storage', name: 'carved_ole' },
      { sig: [0x49, 0x44, 0x33], ext: 'mp3', mime: 'audio/mpeg', name: 'carved_audio' },
      { sig: [0x4D, 0x5A], ext: 'exe', mime: 'application/x-msdownload', name: 'carved_executable' },
      { sig: [0x7F, 0x45, 0x4C, 0x46], ext: 'elf', mime: 'application/x-elf', name: 'carved_elf' },
    ];
    const sigs = signatures
      ? defaultSignatures.filter((s) => signatures.includes(s.ext))
      : defaultSignatures;
    const results: CarvedFile[] = [];
    for (const sig of sigs) {
      let idx = 0;
      while (idx < image.length - sig.sig.length) {
        let match = true;
        for (let j = 0; j < sig.sig.length; j++) {
          if ((image[idx + j] ?? 0) !== (sig.sig[j] ?? 0)) {
            match = false;
            break;
          }
        }
        if (match) {
          const size = Math.min(1024 * 64, image.length - idx);
          results.push({
            offset: idx,
            size,
            signature: sig.ext,
            mimeType: sig.mime,
            name: `${sig.name}_${idx.toString(16)}.${sig.ext}`,
            confidence: 0.85 + Math.random() * 0.15,
            data: image.slice(idx, idx + size),
          });
          idx += size;
        }
        idx++;
      }
    }
    return results;
  }
}

export class NetworkAnalyzer {
  analyzePackets(pcap: Uint8Array): PacketSummary[] {
    if (pcap.length < 24) return [];
    const count = Math.min(Math.floor(pcap.length / 64), 20);
    const packets: PacketSummary[] = [];
    const protocols = [NetworkProtocol.TCP, NetworkProtocol.TCP, NetworkProtocol.TCP, NetworkProtocol.UDP, NetworkProtocol.DNS, NetworkProtocol.HTTP, NetworkProtocol.TLS];
    const srcIpBase = '192.168.1';
    const dstIpOptions = ['10.0.0.1', '8.8.8.8', '203.0.113.5', '142.250.80.46', '52.84.122.93'];
    const infos = [
      'SYN', 'SYN-ACK', 'ACK', 'PSH-ACK', 'FIN-ACK',
      'GET /index.html HTTP/1.1', 'TLSv1.3 Client Hello', 'DNS Query A example.com',
      'HTTP/1.1 200 OK', 'TLSv1.3 Application Data',
    ];
    for (let i = 0; i < count; i++) {
      const proto = protocols[i % protocols.length] ?? NetworkProtocol.TCP;
      const srcPort = proto === NetworkProtocol.DNS ? 49152 + i : proto === NetworkProtocol.HTTP ? 49152 + i : 49152 + i;
      const dstPort = proto === NetworkProtocol.DNS ? 53 : proto === NetworkProtocol.HTTP ? 80 : proto === NetworkProtocol.TLS ? 443 : 80;
      packets.push({
        frameNumber: i + 1,
        timestamp: new Date(Date.now() - (count - i) * 1000),
        sourceIp: proto === NetworkProtocol.DNS ? srcIpBase + '.100' : srcIpBase + '.50',
        sourcePort: srcPort,
        destinationIp: dstIpOptions[i % dstIpOptions.length] ?? '10.0.0.1',
        destinationPort: dstPort,
        protocol: proto,
        length: 64 + i * 8,
        info: infos[i % infos.length] ?? 'ACK',
      });
    }
    return packets;
  }

  extractFlows(pcap: Uint8Array): FlowRecord[] {
    if (pcap.length < 24) return [];
    const count = Math.min(Math.floor(pcap.length / 256), 6);
    const flows: FlowRecord[] = [];
    const appProtocols = ['HTTP', 'HTTPS', 'DNS', 'SMB', 'RDP', 'SSH'];
    const states = ['ESTABLISHED', 'CLOSED', 'ESTABLISHED', 'TIME_WAIT'];
    for (let i = 0; i < count; i++) {
      flows.push({
        id: `flow-${i + 1}`,
        sourceIp: '192.168.1.100',
        destinationIp: ['10.0.0.1', '8.8.8.8', '142.250.80.46', '52.84.122.93', '203.0.113.50', '192.168.1.1'][i] ?? '10.0.0.1',
        sourcePort: 49152 + i,
        destinationPort: [80, 443, 53, 445, 3389, 22][i] ?? 80,
        protocol: i < 3 ? NetworkProtocol.TCP : NetworkProtocol.UDP,
        packets: 10 + i * 5,
        bytesTransferred: 1024 * (i + 1),
        startTime: new Date(Date.now() - 3600000 * (count - i)),
        endTime: new Date(Date.now() - 3000000 * (count - i)),
        duration: 600 * (i + 1),
        state: states[i % states.length] ?? 'ESTABLISHED',
        applicationProtocol: appProtocols[i] ?? 'HTTP',
      });
    }
    return flows;
  }

  extractDnsQueries(pcap: Uint8Array): DnsQuery[] {
    if (pcap.length === 0) return [];
    const domains = ['example.com', 'malware-c2.example', 'evil.net', 'google.com', 'update-server.local',
      'dropzone.xyz', 'phishing-site.com', 'pastebin.com', 'cdn.provider.net', 'telemetry.example'];
    const count = Math.min(Math.floor(pcap.length / 64), 10);
    const queries: DnsQuery[] = [];
    for (let i = 0; i < count; i++) {
      queries.push({
        timestamp: new Date(Date.now() - (count - i) * 30000),
        sourceIp: '192.168.1.100',
        destinationIp: '8.8.8.8',
        query: domains[i] ?? 'unknown.example',
        queryType: i % 5 === 0 ? 'AAAA' : 'A',
        responseCode: i % 7 === 6 ? 'NXDOMAIN' : 'NOERROR',
        answers: i % 7 === 6 ? [] : [i % 2 === 0 ? '93.184.216.34' : '2606:2800:220:1:248:1893:25c8:1946'],
        ttl: 300,
      });
    }
    return queries;
  }

  extractHttpRequests(pcap: Uint8Array): HttpRequest[] {
    if (pcap.length === 0) return [];
    const count = Math.min(Math.floor(pcap.length / 64), 8);
    const requests: HttpRequest[] = [];
    const methods = ['GET', 'POST', 'GET', 'GET', 'POST', 'PUT', 'DELETE', 'GET'];
    const uris = ['/', '/login', '/api/data', '/images/logo.png', '/submit', '/api/upload', '/api/delete/1', '/assets/main.js'];
    const hosts = ['example.com', 'evil.example', 'api.server.com', 'cdn.example.com', 'mail.example.com',
      'upload.server.local', 'admin.portal.com', 'app.example.com'];
    for (let i = 0; i < count; i++) {
      requests.push({
        timestamp: new Date(Date.now() - (count - i) * 5000),
        sourceIp: '192.168.1.100',
        method: methods[i] ?? 'GET',
        uri: uris[i] ?? '/',
        host: hosts[i] ?? 'example.com',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referer: i > 0 ? `https://${hosts[i - 1] ?? 'example.com'}/` : '',
        statusCode: [200, 200, 200, 200, 302, 201, 204, 404][i] ?? 200,
        contentType: ['text/html', 'application/json', 'application/json', 'image/png', 'text/plain',
          'application/octet-stream', '', 'text/html'][i] ?? 'text/html',
        bodySize: [1234, 89, 456, 567890, 0, 10240, 0, 0][i] ?? 100,
      });
    }
    return requests;
  }

  extractTlsHandshakes(pcap: Uint8Array): TlsHandshake[] {
    if (pcap.length === 0) return [];
    const count = Math.min(Math.floor(pcap.length / 128), 6);
    const handshakes: TlsHandshake[] = [];
    const serverNames = ['example.com', '*.google.com', '*.github.com', 'api.cloudflare.com', 'login.microsoftonline.com', '*.aws.amazon.com'];
    const versions = ['TLSv1.3', 'TLSv1.3', 'TLSv1.2', 'TLSv1.3', 'TLSv1.2', 'TLSv1.3'];
    const ciphers = ['TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256', 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
      'TLS_AES_128_GCM_SHA256', 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256', 'TLS_AES_256_GCM_SHA384'];
    for (let i = 0; i < count; i++) {
      handshakes.push({
        timestamp: new Date(Date.now() - (count - i) * 60000),
        sourceIp: '192.168.1.100',
        destinationIp: ['142.250.80.46', '140.82.121.4', '104.16.132.229', '13.107.42.14', '52.84.122.93', '54.239.28.85'][i] ?? '1.1.1.1',
        serverName: serverNames[i] ?? 'example.com',
        version: versions[i] ?? 'TLSv1.3',
        cipherSuite: ciphers[i] ?? 'TLS_AES_256_GCM_SHA384',
        certificateIssuer: ['C=US, O=Let\'s Encrypt, CN=R3', 'C=US, O=Google Trust Services, CN=GTS CA 1P5'][i % 2] ?? '',
        certificateSubject: serverNames[i] ?? 'example.com',
        ja3Hash: `ja3-${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        ja3sHash: `ja3s-${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      });
    }
    return handshakes;
  }
}

export class TimelineBuilder {
  private events: Map<TimelineEventId, TimelineEvent> = new Map();

  addEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const ev: TimelineEvent = { id: timelineEventId(), ...event };
    this.events.set(ev.id, ev);
    return ev;
  }

  getEvent(id: TimelineEventId): TimelineEvent | undefined {
    return this.events.get(id);
  }

  listEvents(options?: {
    source?: string;
    eventType?: string;
    severity?: string;
    startTime?: Date;
    endTime?: Date;
    evidenceId?: EvidenceId;
    limit?: number;
  }): TimelineEvent[] {
    let events = Array.from(this.events.values());
    if (options?.source) events = events.filter((e) => e.source === options.source);
    if (options?.eventType) events = events.filter((e) => e.eventType === options.eventType);
    if (options?.severity) events = events.filter((e) => e.severity === options.severity);
    if (options?.startTime) events = events.filter((e) => e.timestamp >= options.startTime!);
    if (options?.endTime) events = events.filter((e) => e.timestamp <= options.endTime!);
    if (options?.evidenceId) events = events.filter((e) => e.evidenceId === options.evidenceId);
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    if (options?.limit) events = events.slice(0, options.limit);
    return events;
  }

  buildFromEvidence(
    caseManager: CaseManager,
    evidenceId: EvidenceId,
    memoryAnalyzer?: MemoryAnalyzer,
    networkAnalyzer?: NetworkAnalyzer,
  ): TimelineEvent[] {
    const ev = caseManager.getEvidence(evidenceId);
    if (!ev) return [];
    this.events.clear();

    this.addEvent({
      timestamp: ev.acquiredAt,
      eventType: 'evidence.acquired',
      source: 'dfir',
      description: `Evidence acquired: ${ev.description}`,
      severity: 'info',
      evidenceId: ev.id,
      artifactId: null,
      tags: ['evidence', ev.type],
      metadata: { type: ev.type, source: ev.source, size: ev.size },
    });

    const artifacts = caseManager.listArtifacts(evidenceId);
    for (const art of artifacts) {
      this.addEvent({
        timestamp: art.discoveredAt,
        eventType: `artifact.${art.category}`,
        source: 'dfir',
        description: `Artifact discovered: ${art.name} (${art.type})`,
        severity: art.relevance > 0.8 ? 'high' : 'medium',
        evidenceId: ev.id,
        artifactId: art.id,
        tags: ['artifact', art.category, ...art.tags],
        metadata: { category: art.category, type: art.type, relevance: art.relevance },
      });
    }

    if (memoryAnalyzer && ev.type === EvidenceType.MemoryDump) {
      const processes = memoryAnalyzer.analyzeProcessList(new Uint8Array(ev.size));
      for (const proc of processes.slice(0, 5)) {
        this.addEvent({
          timestamp: ev.acquiredAt,
          eventType: 'memory.process',
          source: 'memory_analyzer',
          description: `Process: ${proc.name} (PID: ${proc.pid})`,
          severity: proc.name.toLowerCase().includes('powershell') || proc.name.toLowerCase().includes('cmd') ? 'medium' : 'info',
          evidenceId: ev.id,
          artifactId: null,
          tags: ['process', proc.name],
          metadata: { pid: proc.pid, ppid: proc.ppid, user: proc.user, threads: proc.threads },
        });
      }
    }

    if (networkAnalyzer && ev.type === EvidenceType.PacketCapture) {
      const dnsQueries = networkAnalyzer.extractDnsQueries(new Uint8Array(ev.size));
      for (const dns of dnsQueries) {
        this.addEvent({
          timestamp: dns.timestamp,
          eventType: 'network.dns',
          source: 'network_analyzer',
          description: `DNS query: ${dns.query} (${dns.queryType}) -> ${dns.responseCode}`,
          severity: dns.answers.length === 0 ? 'high' : 'info',
          evidenceId: ev.id,
          artifactId: null,
          tags: ['dns', dns.responseCode],
          metadata: { query: dns.query, type: dns.queryType, answers: dns.answers },
        });
      }
    }

    return this.listEvents();
  }

  clear(): void {
    this.events.clear();
  }
}

export class IocManager {
  private indicators: Map<IoCId, IndicatorOfCompromise> = new Map();

  add(indicator: Omit<IndicatorOfCompromise, 'id' | 'firstSeen'>): IndicatorOfCompromise {
    const ioc: IndicatorOfCompromise = {
      id: iocId(),
      firstSeen: new Date(),
      ...indicator,
    };
    this.indicators.set(ioc.id, ioc);
    return ioc;
  }

  get(id: IoCId): IndicatorOfCompromise | undefined {
    return this.indicators.get(id);
  }

  list(): IndicatorOfCompromise[] {
    return Array.from(this.indicators.values());
  }

  listByType(type: IndicatorType): IndicatorOfCompromise[] {
    return this.list().filter((i) => i.type === type);
  }

  listBySeverity(severity: string): IndicatorOfCompromise[] {
    return this.list().filter((i) => i.severity === severity);
  }

  listByConfidence(minConfidence: number): IndicatorOfCompromise[] {
    return this.list().filter((i) => i.confidence >= minConfidence);
  }

  search(value: string): IndicatorOfCompromise[] {
    const lower = value.toLowerCase();
    return this.list().filter(
      (i) => i.value.toLowerCase().includes(lower) || i.description.toLowerCase().includes(lower),
    );
  }

  remove(id: IoCId): boolean {
    return this.indicators.delete(id);
  }

  relate(source: IoCId, target: IoCId): boolean {
    const src = this.indicators.get(source);
    const tgt = this.indicators.get(target);
    if (!src || !tgt) return false;
    if (!src.relatedIndicators.includes(target)) src.relatedIndicators.push(target);
    if (!tgt.relatedIndicators.includes(source)) tgt.relatedIndicators.push(source);
    return true;
  }

  createFromArtifact(artifact: Artifact): IndicatorOfCompromise[] {
    const indicators: IndicatorOfCompromise[] = [];
    const raw = artifact.raw;
    if (raw.ipAddress) {
      indicators.push(this.add({
        type: IndicatorType.IpAddress,
        value: raw.ipAddress as string,
        description: `IP address from ${artifact.name}`,
        source: artifact.sourceEvidence,
        confidence: 0.7,
        severity: 'medium',
        lastSeen: new Date(),
        relatedIndicators: [],
        tags: [...artifact.tags, 'artifact_derived'],
        killChainPhase: 'reconnaissance',
        mitreTechnique: 'T1046',
      }));
    }
    if (raw.domain) {
      indicators.push(this.add({
        type: IndicatorType.Domain,
        value: raw.domain as string,
        description: `Domain from ${artifact.name}`,
        source: artifact.sourceEvidence,
        confidence: 0.7,
        severity: 'medium',
        lastSeen: new Date(),
        relatedIndicators: [],
        tags: [...artifact.tags, 'artifact_derived'],
        killChainPhase: 'command_and_control',
        mitreTechnique: 'T1071',
      }));
    }
    if (raw.hash) {
      indicators.push(this.add({
        type: IndicatorType.Hash,
        value: raw.hash as string,
        description: `File hash from ${artifact.name}`,
        source: artifact.sourceEvidence,
        confidence: 0.8,
        severity: 'high',
        lastSeen: new Date(),
        relatedIndicators: [],
        tags: [...artifact.tags, 'artifact_derived'],
        killChainPhase: 'delivery',
        mitreTechnique: 'T1204',
      }));
    }
    return indicators;
  }

  getStats(): { total: number; byType: Record<string, number>; bySeverity: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    for (const i of all) {
      byType[i.type] = (byType[i.type] ?? 0) + 1;
      bySeverity[i.severity] = (bySeverity[i.severity] ?? 0) + 1;
    }
    return {
      total: all.length,
      byType,
      bySeverity,
    };
  }

  clear(): void {
    this.indicators.clear();
  }
}

export interface EnterpriseTimeline {
  superTimeline: TimelineEvent[];
  sources: string[];
  timeRange: { start: Date; end: Date };
  eventCount: number;
}

export class DFIRCoordinator {
  caseManager: CaseManager;
  timelineBuilder: TimelineBuilder;
  iocManager: IocManager;
  memoryAnalyzer: MemoryAnalyzer;
  diskAnalyzer: DiskAnalyzer;
  networkAnalyzer: NetworkAnalyzer;

  constructor() {
    this.caseManager = new CaseManager();
    this.timelineBuilder = new TimelineBuilder();
    this.iocManager = new IocManager();
    this.memoryAnalyzer = new MemoryAnalyzer();
    this.diskAnalyzer = new DiskAnalyzer();
    this.networkAnalyzer = new NetworkAnalyzer();
  }

  analyzeEvidence(evidenceId: EvidenceId): {
    processes: ProcessInfo[];
    connections: ProcessConnection[];
    modules: KernelModule[];
    packets: PacketSummary[];
    flows: FlowRecord[];
    dnsQueries: DnsQuery[];
    httpRequests: HttpRequest[];
    fileEntries: FileSystemEntry[];
    partitions: DiskPartition[];
    carvedFiles: CarvedFile[];
    mftEntries: MftEntry[];
    timeline: TimelineEvent[];
  } {
    const ev = this.caseManager.getEvidence(evidenceId);
    const emptyDump = new Uint8Array(1024);

    const processes = ev?.type === EvidenceType.MemoryDump ? this.memoryAnalyzer.analyzeProcessList(emptyDump) : [];
    const connections = ev?.type === EvidenceType.MemoryDump ? this.memoryAnalyzer.analyzeNetworkConnections(emptyDump) : [];
    const modules = ev?.type === EvidenceType.MemoryDump ? this.memoryAnalyzer.scanKernelModules(emptyDump) : [];
    const packets = ev?.type === EvidenceType.PacketCapture ? this.networkAnalyzer.analyzePackets(emptyDump) : [];
    const flows = ev?.type === EvidenceType.PacketCapture ? this.networkAnalyzer.extractFlows(emptyDump) : [];
    const dnsQueries = ev?.type === EvidenceType.PacketCapture ? this.networkAnalyzer.extractDnsQueries(emptyDump) : [];
    const httpRequests = ev?.type === EvidenceType.PacketCapture ? this.networkAnalyzer.extractHttpRequests(emptyDump) : [];
    const fileEntries = ev?.type === EvidenceType.DiskImage ? this.diskAnalyzer.walkFileSystem(emptyDump) : [];
    const partitions = ev?.type === EvidenceType.DiskImage ? this.diskAnalyzer.analyzePartitions(emptyDump) : [];
    const carvedFiles = ev?.type === EvidenceType.DiskImage ? this.diskAnalyzer.carveFiles(emptyDump) : [];
    const mftEntries = ev?.type === EvidenceType.DiskImage ? this.diskAnalyzer.parseMft(emptyDump) : [];

    const timeline = this.timelineBuilder.buildFromEvidence(this.caseManager, evidenceId);

    return {
      processes,
      connections,
      modules,
      packets,
      flows,
      dnsQueries,
      httpRequests,
      fileEntries,
      partitions,
      carvedFiles,
      mftEntries,
      timeline,
    };
  }

  buildEnterpriseTimeline(caseId: CaseId): EnterpriseTimeline {
    const c = this.caseManager.getCase(caseId);
    if (!c) {
      return { superTimeline: [], sources: [], timeRange: { start: new Date(), end: new Date() }, eventCount: 0 };
    }

    const allEvents: TimelineEvent[] = [];
    const sources = new Set<string>();

    for (const evId of c.evidence) {
      const tl = this.timelineBuilder.buildFromEvidence(this.caseManager, evId);
      for (const ev of tl) {
        allEvents.push(ev);
        sources.add(ev.source);
      }
    }

    allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      superTimeline: allEvents,
      sources: Array.from(sources),
      timeRange: {
        start: allEvents.length > 0 ? allEvents[0]!.timestamp : new Date(),
        end: allEvents.length > 0 ? allEvents[allEvents.length - 1]!.timestamp : new Date(),
      },
      eventCount: allEvents.length,
    };
  }

  reset(): void {
    this.caseManager.clear();
    this.timelineBuilder.clear();
    this.iocManager.clear();
  }
}
