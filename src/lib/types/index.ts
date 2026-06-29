export interface WindowState {
  id: string
  title: string
  type: WindowType
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
  component: string
}

export type WindowType = 'terminal' | 'network' | 'threat' | 'diagnostics' | 'files' | 'processes' | 'map' | 'scenario' | 'ai' | 'settings' | 'payloads' | 'certs' | 'logs' | 'vulns' | 'siem' | 'compliance'

export interface TerminalTheme {
  name: string
  background: string
  foreground: string
  cursor: string
  selection: string
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}

export interface TerminalSession {
  id: string
  lines: TerminalLine[]
  cwd: string
  commandHistory: string[]
  historyIndex: number
}

export interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'system' | 'error' | 'success'
  content: string
  timestamp: number
}

export interface NetworkNode {
  id: string
  label: string
  type: 'server' | 'client' | 'router' | 'firewall' | 'database' | 'workstation' | 'ids' | 'honeypot'
  x: number
  y: number
  status: 'active' | 'idle' | 'warning' | 'critical'
  connections: string[]
  ip: string
  os: string
  hostname: string
  services: string[]
  vulnerabilities: string[]
}

export interface NetworkPacket {
  id: string
  source: string
  target: string
  protocol: string
  size: number
  timestamp: number
  srcPort: number
  dstPort: number
  flags: string
  ttl: number
  seq: number
  ack: number
  data?: string
}

export interface ThreatEvent {
  id: string
  type: 'scan' | 'breach' | 'malware' | 'ddos' | 'phishing' | 'anomaly' | 'lateral_movement' | 'exfiltration' | 'ransomware' | 'recon'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  target: string
  description: string
  timestamp: number
  mitigated: boolean
  mitreId: string
  confidence: number
  ioc: string
}

export interface FileEntry {
  name: string
  type: 'file' | 'directory'
  size?: number
  modified: number
  permissions: string
  owner: string
  group: string
  children?: FileEntry[]
  content?: string
  checksum?: string
}

export interface AppSettings {
  theme: string
  terminalTheme: string
  soundEnabled: boolean
  soundVolume: number
  effectsIntensity: number
  reducedMotion: boolean
  highContrast: boolean
  fontSize: number
  fontFamily: string
}

export interface OperatorProfile {
  operatorId: string
  callSign: string
  role: 'analyst' | 'senior_analyst' | 'hunter' | 'incident_responder' | 'forensic_examiner' | 'malware_analyst' | 'threat_intel' | 'soc_manager'
  clearance: 'unclassified' | 'confidential' | 'secret' | 'top_secret' | 'ts_sci'
  certifications: string[]
  specialization: string[]
  shift: string
  assignedTo: string
  lastLogin: number
}

export interface Scenario {
  id: string
  title: string
  description: string
  type: 'recon' | 'exploitation' | 'persistence' | 'exfiltration' | 'incident_response' | 'threat_hunt' | 'forensic_analysis' | 'malware_analysis'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'active' | 'paused' | 'completed' | 'failed'
  phase: string
  tasks: ScenarioTask[]
  timeline: ScenarioEvent[]
  mitreMapping: MitreTechnique[]
  environment: string
  createdAt: number
  updatedAt: number
}

export interface ScenarioTask {
  id: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  type: 'scan' | 'analyze' | 'exploit' | 'contain' | 'eradicate' | 'recover' | 'report'
  mitreTechnique?: string
  completedAt?: number
}

export interface ScenarioEvent {
  id: string
  timestamp: number
  type: 'info' | 'warning' | 'critical' | 'success'
  source: string
  message: string
  data?: Record<string, unknown>
}

export interface MitreTechnique {
  id: string
  name: string
  tactic: string
  platform: string[]
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'new' | 'investigating' | 'contained' | 'resolved' | 'false_positive'
  source: string
  mitreTechnique?: string
  indicator?: string
  timestamp: number
  assignedTo?: string
  notes: string[]
}

export interface PacketCapture {
  id: string
  interface: string
  protocol: string
  srcIp: string
  dstIp: string
  srcPort: number
  dstPort: number
  length: number
  flags: string
  timestamp: number
  raw?: string
}

export interface LogEntry {
  id: string
  timestamp: number
  source: string
  facility: string
  severity: 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug'
  message: string
  raw: string
}

export interface SystemMetrics {
  cpu: { percent: number; loadAvg: number[]; cores: number }
  memory: { total: number; used: number; percent: number; swapPercent: number }
  disk: { total: number; used: number; percent: number; iops: number }
  network: { rxBytes: number; txBytes: number; rxPps: number; txPps: number; connections: number }
  processes: number
  uptime: number
}

export interface Vulnerability {
  id: string
  cveId: string
  cvss: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  affected: string
  status: 'unpatched' | 'patched' | 'mitigated' | 'false_positive'
  exploitAvailable: boolean
  firstDetected: number
  epss: number
}

export interface SIEMRule {
  id: string
  name: string
  description: string
  mitreTechnique?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'enabled' | 'disabled' | 'tuning'
  frequency: number
  lastTriggered?: number
  hitCount: number
}
