export type HoneypotId = string & { readonly __brand: unique symbol };
export type HoneytokenId = string & { readonly __brand: unique symbol };
export type DecoyId = string & { readonly __brand: unique symbol };
export type BreadcrumbId = string & { readonly __brand: unique symbol };
export type DeceptionNetworkId = string & { readonly __brand: unique symbol };

export enum HoneypotType {
  SSH = 'ssh',
  HTTP = 'http',
  HTTPS = 'https',
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  RDP = 'rdp',
  VNC = 'vnc',
  SMB = 'smb',
  FTP = 'ftp',
  SMTP = 'smtp',
  DNS = 'dns',
  Modbus = 'modbus',
  S7 = 's7',
  DNP3 = 'dnp3',
}

export enum HoneytokenType {
  Credential = 'credential',
  File = 'file',
  ApiKey = 'api_key',
  DatabaseRecord = 'database_record',
  HoneyAccount = 'honey_account',
}

export enum HoneypotStatus {
  Deployed = 'deployed',
  Running = 'running',
  Stopped = 'stopped',
  Compromised = 'compromised',
  Paused = 'paused',
}

export enum IntrusionSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export interface HoneypotConfig {
  type: HoneypotType;
  port: number;
  bindAddress?: string;
  banner?: string;
  version?: string;
  maxConnections?: number;
  logAllTraffic?: boolean;
  interactive?: boolean;
  customResponses?: Record<string, string>;
}

export interface IntrusionRecord {
  id: string;
  timestamp: Date;
  sourceIp: string;
  sourcePort: number;
  protocol: string;
  commands: string[];
  duration: number;
  filesAccessed: string[];
  credentialsAttempted: string[];
  severity: IntrusionSeverity;
  notes: string;
}

export interface HoneypotInstance {
  id: HoneypotId;
  type: HoneypotType;
  status: HoneypotStatus;
  config: HoneypotConfig;
  deployedAt: Date;
  firstContact: Date | null;
  lastContact: Date | null;
  intrusions: IntrusionRecord[];
  uptime: number;
}

export interface Honeytoken {
  id: HoneytokenId;
  type: HoneytokenType;
  value: string;
  location: string;
  deployedAt: Date;
  triggeredAt: Date | null;
  triggeredBy: string | null;
  description: string;
  tags: string[];
}

export interface CredentialHoneytoken extends Honeytoken {
  type: HoneytokenType.Credential;
  username: string;
  password: string;
  service: string;
  host: string;
}

export interface FileHoneytoken extends Honeytoken {
  type: HoneytokenType.File;
  path: string;
  content: string;
  mimeType: string;
}

export interface ApiKeyHoneytoken extends Honeytoken {
  type: HoneytokenType.ApiKey;
  service: string;
  permissions: string[];
}

export type AnyHoneytoken = Honeytoken | CredentialHoneytoken | FileHoneytoken | ApiKeyHoneytoken;

export interface Breadcrumb {
  id: BreadcrumbId;
  type: string;
  location: string;
  content: string;
  deployedAt: Date;
  triggeredAt: Date | null;
  triggeredBy: string | null;
  plausibleDeniability: boolean;
}

export interface DecoyService {
  name: string;
  type: HoneypotType;
  port: number;
  version: string;
}

export interface DecoyHost {
  id: DecoyId;
  hostname: string;
  ipAddress: string;
  os: string;
  services: DecoyService[];
  tags: string[];
}

export interface DeceptionNetwork {
  id: DeceptionNetworkId;
  name: string;
  description: string;
  subnets: string[];
  hosts: DecoyHost[];
  tags: string[];
}

export interface DeceptionStats {
  totalHoneypots: number;
  activeHoneypots: number;
  compromisedHoneypots: number;
  totalHoneytokens: number;
  triggeredHoneytokens: number;
  totalIntrusions: number;
  uniqueAttackers: number;
  totalBreadcrumbs: number;
  triggeredBreadcrumbs: number;
  uptime: number;
}

export function honeypotId(): HoneypotId {
  return `hp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as HoneypotId;
}

export function honeytokenId(): HoneytokenId {
  return `ht-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as HoneytokenId;
}

export function decoyId(): DecoyId {
  return `dec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as DecoyId;
}

export function breadcrumbId(): BreadcrumbId {
  return `bc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as BreadcrumbId;
}

export function deceptionNetworkId(): DeceptionNetworkId {
  return `dn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}` as DeceptionNetworkId;
}

const DEFAULT_SSH_BANNER = 'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6';
const DEFAULT_HTTP_BANNER = 'Apache/2.4.57 (Ubuntu)';
const DEFAULT_FTP_BANNER = '220 ProFTPD 1.3.5 Server ready';

export function createHoneypotConfig(type: HoneypotType, overrides?: Partial<HoneypotConfig>): HoneypotConfig {
  const defaults: Record<HoneypotType, Partial<HoneypotConfig>> = {
    [HoneypotType.SSH]: { port: 22, banner: DEFAULT_SSH_BANNER, version: '8.9p1', interactive: true },
    [HoneypotType.HTTP]: { port: 80, banner: DEFAULT_HTTP_BANNER, version: '2.4.57', interactive: true },
    [HoneypotType.HTTPS]: { port: 443, banner: DEFAULT_HTTP_BANNER, version: '2.4.57', interactive: true },
    [HoneypotType.MySQL]: { port: 3306, banner: 'MySQL 8.0.35', version: '8.0.35', interactive: false },
    [HoneypotType.PostgreSQL]: { port: 5432, banner: 'PostgreSQL 16.1', version: '16.1', interactive: false },
    [HoneypotType.RDP]: { port: 3389, banner: '', version: '10.0', interactive: true },
    [HoneypotType.VNC]: { port: 5900, banner: '', version: '', interactive: true },
    [HoneypotType.SMB]: { port: 445, banner: 'Samba 4.18.5', version: '4.18.5', interactive: false },
    [HoneypotType.FTP]: { port: 21, banner: DEFAULT_FTP_BANNER, version: '1.3.5', interactive: true },
    [HoneypotType.SMTP]: { port: 25, banner: 'Postfix 3.8.1', version: '3.8.1', interactive: false },
    [HoneypotType.DNS]: { port: 53, banner: 'BIND 9.18.22', version: '9.18.22', interactive: false },
    [HoneypotType.Modbus]: { port: 502, banner: '', version: '', interactive: false },
    [HoneypotType.S7]: { port: 102, banner: 'Siemens S7-1200', version: '4.5', interactive: false },
    [HoneypotType.DNP3]: { port: 20000, banner: '', version: '', interactive: false },
  };
  const def = defaults[type];
  return {
    type,
    port: def.port ?? 0,
    banner: def.banner,
    version: def.version,
    interactive: def.interactive ?? false,
    logAllTraffic: true,
    maxConnections: 100,
    bindAddress: '0.0.0.0',
    customResponses: {},
    ...overrides,
  } as HoneypotConfig;
}

export function createSshHoneypot(config?: Partial<HoneypotConfig>): HoneypotInstance {
  return {
    id: honeypotId(),
    type: HoneypotType.SSH,
    status: HoneypotStatus.Running,
    config: createHoneypotConfig(HoneypotType.SSH, config),
    deployedAt: new Date(),
    firstContact: null,
    lastContact: null,
    intrusions: [],
    uptime: 0,
  };
}

export function createHttpHoneypot(config?: Partial<HoneypotConfig>): HoneypotInstance {
  return {
    id: honeypotId(),
    type: HoneypotType.HTTP,
    status: HoneypotStatus.Running,
    config: createHoneypotConfig(HoneypotType.HTTP, config),
    deployedAt: new Date(),
    firstContact: null,
    lastContact: null,
    intrusions: [],
    uptime: 0,
  };
}

export function createHoneypot(type: HoneypotType, config?: Partial<HoneypotConfig>): HoneypotInstance {
  return {
    id: honeypotId(),
    type,
    status: HoneypotStatus.Running,
    config: createHoneypotConfig(type, config),
    deployedAt: new Date(),
    firstContact: null,
    lastContact: null,
    intrusions: [],
    uptime: 0,
  };
}

export function createCredentialHoneytoken(
  username: string,
  password: string,
  service: string,
  host: string,
  location: string,
  overrides?: Partial<Omit<CredentialHoneytoken, 'type' | 'username' | 'password' | 'service' | 'host' | 'location'>>,
): CredentialHoneytoken {
  return {
    id: honeytokenId(),
    type: HoneytokenType.Credential,
    value: `${username}:${password}`,
    username,
    password,
    service,
    host,
    location,
    deployedAt: new Date(),
    triggeredAt: null,
    triggeredBy: null,
    description: `Credential for ${service}@${host}`,
    tags: ['credential', service],
    ...overrides,
  };
}

export function createFileHoneytoken(
  path: string,
  content: string,
  location: string,
  mimeType = 'text/plain',
  overrides?: Partial<Omit<FileHoneytoken, 'type' | 'path' | 'content' | 'mimeType' | 'location'>>,
): FileHoneytoken {
  return {
    id: honeytokenId(),
    type: HoneytokenType.File,
    value: `file:${path}`,
    path,
    content,
    mimeType,
    location,
    deployedAt: new Date(),
    triggeredAt: null,
    triggeredBy: null,
    description: `Honeytoken file at ${path}`,
    tags: ['file', mimeType],
    ...overrides,
  };
}

export function createApiKeyHoneytoken(
  service: string,
  permissions: string[],
  location: string,
  overrides?: Partial<Omit<ApiKeyHoneytoken, 'type' | 'service' | 'permissions' | 'location'>>,
): ApiKeyHoneytoken {
  const key = `${service}_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`;
  return {
    id: honeytokenId(),
    type: HoneytokenType.ApiKey,
    value: key,
    service,
    permissions,
    location,
    deployedAt: new Date(),
    triggeredAt: null,
    triggeredBy: null,
    description: `API key for ${service} with ${permissions.join(', ')} permissions`,
    tags: ['api_key', service, ...permissions],
    ...overrides,
  };
}

export function createBreadcrumb(
  type: string,
  location: string,
  content: string,
  plausibleDeniability = true,
): Breadcrumb {
  return {
    id: breadcrumbId(),
    type,
    location,
    content,
    deployedAt: new Date(),
    triggeredAt: null,
    triggeredBy: null,
    plausibleDeniability,
  };
}

export class HoneypotManager {
  private honeypots: Map<HoneypotId, HoneypotInstance> = new Map();

  deploy(type: HoneypotType, config?: Partial<HoneypotConfig>): HoneypotInstance {
    const hp = createHoneypot(type, config);
    this.honeypots.set(hp.id, hp);
    return hp;
  }

  get(id: HoneypotId): HoneypotInstance | undefined {
    return this.honeypots.get(id);
  }

  list(): HoneypotInstance[] {
    return Array.from(this.honeypots.values());
  }

  listByType(type: HoneypotType): HoneypotInstance[] {
    return this.list().filter((hp) => hp.type === type);
  }

  listByStatus(status: HoneypotStatus): HoneypotInstance[] {
    return this.list().filter((hp) => hp.status === status);
  }

  remove(id: HoneypotId): boolean {
    return this.honeypots.delete(id);
  }

  start(id: HoneypotId): boolean {
    const hp = this.honeypots.get(id);
    if (!hp || hp.status === HoneypotStatus.Running) return false;
    hp.status = HoneypotStatus.Running;
    return true;
  }

  stop(id: HoneypotId): boolean {
    const hp = this.honeypots.get(id);
    if (!hp || hp.status === HoneypotStatus.Stopped) return false;
    hp.status = HoneypotStatus.Stopped;
    return true;
  }

  pause(id: HoneypotId): boolean {
    const hp = this.honeypots.get(id);
    if (!hp || hp.status !== HoneypotStatus.Running) return false;
    hp.status = HoneypotStatus.Paused;
    return true;
  }

  recordIntrusion(
    id: HoneypotId,
    sourceIp: string,
    sourcePort: number,
    commands: string[] = [],
    options?: Partial<Omit<IntrusionRecord, 'id' | 'timestamp' | 'sourceIp' | 'sourcePort' | 'commands'>>,
  ): IntrusionRecord | null {
    const hp = this.honeypots.get(id);
    if (!hp) return null;

    const record: IntrusionRecord = {
      id: `int-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
      sourceIp,
      sourcePort,
      protocol: hp.type,
      commands,
      duration: 0,
      filesAccessed: [],
      credentialsAttempted: [],
      severity: IntrusionSeverity.Medium,
      notes: '',
      ...options,
    };

    hp.intrusions.push(record);
    hp.lastContact = record.timestamp;
    if (!hp.firstContact) hp.firstContact = record.timestamp;
    hp.status = HoneypotStatus.Compromised;

    return record;
  }

  getIntrusions(id: HoneypotId): IntrusionRecord[] {
    return this.honeypots.get(id)?.intrusions ?? [];
  }

  getAllIntrusions(): IntrusionRecord[] {
    return this.list().flatMap((hp) => hp.intrusions);
  }

  getStats(): { total: number; running: number; compromised: number; totalIntrusions: number; uniqueAttackers: number } {
    const all = this.list();
    const attackers = new Set<string>();
    for (const hp of all) {
      for (const i of hp.intrusions) {
        attackers.add(i.sourceIp);
      }
    }
    return {
      total: all.length,
      running: all.filter((hp) => hp.status === HoneypotStatus.Running).length,
      compromised: all.filter((hp) => hp.status === HoneypotStatus.Compromised).length,
      totalIntrusions: this.getAllIntrusions().length,
      uniqueAttackers: attackers.size,
    };
  }

  clear(): void {
    this.honeypots.clear();
  }
}

export class HoneytokenManager {
  private tokens: Map<HoneytokenId, AnyHoneytoken> = new Map();

  deploy(token: AnyHoneytoken): HoneytokenId {
    this.tokens.set(token.id, token);
    return token.id;
  }

  get(id: HoneytokenId): AnyHoneytoken | undefined {
    return this.tokens.get(id);
  }

  list(): AnyHoneytoken[] {
    return Array.from(this.tokens.values());
  }

  listByType(type: HoneytokenType): AnyHoneytoken[] {
    return this.list().filter((t) => t.type === type);
  }

  listByLocation(location: string): AnyHoneytoken[] {
    return this.list().filter((t) => t.location === location || t.location.startsWith(location));
  }

  listTriggered(): AnyHoneytoken[] {
    return this.list().filter((t) => t.triggeredAt !== null);
  }

  listUntriggered(): AnyHoneytoken[] {
    return this.list().filter((t) => t.triggeredAt === null);
  }

  remove(id: HoneytokenId): boolean {
    return this.tokens.delete(id);
  }

  trigger(id: HoneytokenId, triggeredBy: string): boolean {
    const token = this.tokens.get(id);
    if (!token || token.triggeredAt !== null) return false;
    token.triggeredAt = new Date();
    token.triggeredBy = triggeredBy;
    return true;
  }

  getStats(): { total: number; triggered: number; byType: Record<string, number> } {
    const all = this.list();
    const byType: Record<string, number> = {};
    for (const t of all) {
      byType[t.type] = (byType[t.type] ?? 0) + 1;
    }
    return {
      total: all.length,
      triggered: all.filter((t) => t.triggeredAt !== null).length,
      byType,
    };
  }

  clear(): void {
    this.tokens.clear();
  }
}

export class DeceptionEngine {
  honeypots: HoneypotManager;
  honeytokens: HoneytokenManager;
  private networks: Map<DeceptionNetworkId, DeceptionNetwork> = new Map();
  private breadcrumbs: Map<BreadcrumbId, Breadcrumb> = new Map();
  private startedAt: Date;

  constructor() {
    this.honeypots = new HoneypotManager();
    this.honeytokens = new HoneytokenManager();
    this.startedAt = new Date();
  }

  createNetwork(name: string, subnets: string[], description = ''): DeceptionNetwork {
    const net: DeceptionNetwork = {
      id: deceptionNetworkId(),
      name,
      description,
      subnets,
      hosts: [],
      tags: [],
    };
    this.networks.set(net.id, net);
    return net;
  }

  getNetwork(id: DeceptionNetworkId): DeceptionNetwork | undefined {
    return this.networks.get(id);
  }

  listNetworks(): DeceptionNetwork[] {
    return Array.from(this.networks.values());
  }

  removeNetwork(id: DeceptionNetworkId): boolean {
    return this.networks.delete(id);
  }

  addHostToNetwork(networkId: DeceptionNetworkId, host: DecoyHost): boolean {
    const net = this.networks.get(networkId);
    if (!net) return false;
    net.hosts.push(host);
    return true;
  }

  addBreadcrumb(breadcrumb: Breadcrumb): BreadcrumbId {
    this.breadcrumbs.set(breadcrumb.id, breadcrumb);
    return breadcrumb.id;
  }

  getBreadcrumb(id: BreadcrumbId): Breadcrumb | undefined {
    return this.breadcrumbs.get(id);
  }

  listBreadcrumbs(): Breadcrumb[] {
    return Array.from(this.breadcrumbs.values());
  }

  triggerBreadcrumb(id: BreadcrumbId, triggeredBy: string): boolean {
    const bc = this.breadcrumbs.get(id);
    if (!bc || bc.triggeredAt !== null) return false;
    bc.triggeredAt = new Date();
    bc.triggeredBy = triggeredBy;
    return true;
  }

  removeBreadcrumb(id: BreadcrumbId): boolean {
    return this.breadcrumbs.delete(id);
  }

  getStats(): DeceptionStats {
    const hpStats = this.honeypots.getStats();
    const tokenStats = this.honeytokens.getStats();
    const allBreadcrumbs = this.listBreadcrumbs();
    const bcTriggered = allBreadcrumbs.filter((bc) => bc.triggeredAt !== null);

    return {
      totalHoneypots: hpStats.total,
      activeHoneypots: hpStats.running,
      compromisedHoneypots: hpStats.compromised,
      totalHoneytokens: tokenStats.total,
      triggeredHoneytokens: tokenStats.triggered,
      totalIntrusions: hpStats.totalIntrusions,
      uniqueAttackers: hpStats.uniqueAttackers,
      totalBreadcrumbs: allBreadcrumbs.length,
      triggeredBreadcrumbs: bcTriggered.length,
      uptime: Date.now() - this.startedAt.getTime(),
    };
  }

  reset(): void {
    this.honeypots.clear();
    this.honeytokens.clear();
    this.networks.clear();
    this.breadcrumbs.clear();
    this.startedAt = new Date();
  }
}

export function createDefaultDeceptionEngine(): DeceptionEngine {
  const engine = new DeceptionEngine();

  const net = engine.createNetwork(
    'Deception DMZ',
    ['10.0.100.0/24'],
    'Decoy network mimicking internal infrastructure',
  );

  const sshHost: DecoyHost = {
    id: decoyId(),
    hostname: 'bastion.deception.local',
    ipAddress: '10.0.100.10',
    os: 'Ubuntu 22.04',
    services: [{ name: 'SSH', type: HoneypotType.SSH, port: 22, version: 'OpenSSH 8.9p1' }],
    tags: ['bastion', 'critical'],
  };
  engine.addHostToNetwork(net.id, sshHost);

  const webHost: DecoyHost = {
    id: decoyId(),
    hostname: 'web.deception.local',
    ipAddress: '10.0.100.20',
    os: 'Ubuntu 22.04',
    services: [{ name: 'HTTP', type: HoneypotType.HTTP, port: 80, version: 'Apache 2.4.57' }],
    tags: ['web', 'public'],
  };
  engine.addHostToNetwork(net.id, webHost);

  const dbHost: DecoyHost = {
    id: decoyId(),
    hostname: 'db.deception.local',
    ipAddress: '10.0.100.30',
    os: 'Ubuntu 22.04',
    services: [{ name: 'MySQL', type: HoneypotType.MySQL, port: 3306, version: 'MySQL 8.0.35' }],
    tags: ['database', 'internal'],
  };
  engine.addHostToNetwork(net.id, dbHost);

  engine.honeypots.deploy(HoneypotType.SSH, { bindAddress: '10.0.100.10' });
  engine.honeypots.deploy(HoneypotType.HTTP, { bindAddress: '10.0.100.20' });
  engine.honeypots.deploy(HoneypotType.MySQL, { bindAddress: '10.0.100.30' });

  const cred = createCredentialHoneytoken(
    'admin',
    'P@ssw0rd123!',
    'SSH',
    '10.0.100.10',
    '/root/.ssh/config',
    { description: 'Decoy root SSH credential', tags: ['credential', 'ssh', 'privileged'] },
  );
  engine.honeytokens.deploy(cred);

  const apiKey = createApiKeyHoneytoken(
    'aws',
    ['ec2:*,s3:GetObject'],
    '/home/devuser/.aws/credentials',
    { description: 'Decoy AWS access key for deception', tags: ['api_key', 'aws', 'cloud'] },
  );
  engine.honeytokens.deploy(apiKey);

  const dbCred = createCredentialHoneytoken(
    'app_user',
    'db_p@ss_2024',
    'MySQL',
    '10.0.100.30',
    '/var/www/html/config.php',
    { description: 'Decoy database application credential', tags: ['credential', 'mysql', 'webapp'] },
  );
  engine.honeytokens.deploy(dbCred);

  const fileToken = createFileHoneytoken(
    '/home/devuser/secrets/backup_keys.txt',
    'Backup encryption key: AES-256-7F3E9A2B1C8D4F6E\nCloud backup passphrase: cloud_bak_2024_secure!',
    '/home/devuser/secrets/',
    'text/plain',
    { description: 'Decoy backup key file', tags: ['file', 'backup', 'crypto'] },
  );
  engine.honeytokens.deploy(fileToken);

  const bc1 = createBreadcrumb(
    'config_backup',
    '/var/backups/nginx/',
    'Configuration backup contains credentials for database connection',
    true,
  );
  engine.addBreadcrumb(bc1);

  const bc2 = createBreadcrumb(
    'note_file',
    '/home/devuser/notes.txt',
    'TODO: Rotate the API keys in /home/devuser/.aws/credentials before next quarter audit',
    true,
  );
  engine.addBreadcrumb(bc2);

  return engine;
}
