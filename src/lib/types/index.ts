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

export type WindowType = 'terminal' | 'network' | 'threat' | 'diagnostics' | 'files' | 'processes' | 'map' | 'mission' | 'ai' | 'settings'

export interface Mission {
  id: string
  title: string
  description: string
  type: MissionType
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  status: 'available' | 'active' | 'completed' | 'failed'
  objectives: MissionObjective[]
  rewards: MissionRewards
  timeLimit?: number
  progress: number
}

export type MissionType = 'recon' | 'malware' | 'incident' | 'hunting' | 'forensics' | 'intel'

export interface MissionObjective {
  id: string
  description: string
  completed: boolean
}

export interface MissionRewards {
  xp: number
  achievements?: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

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
  type: 'server' | 'client' | 'router' | 'firewall' | 'database'
  x: number
  y: number
  status: 'active' | 'idle' | 'warning' | 'critical'
  connections: string[]
  ip: string
}

export interface NetworkPacket {
  id: string
  source: string
  target: string
  protocol: string
  size: number
  timestamp: number
  data?: string
}

export interface ThreatEvent {
  id: string
  type: 'scan' | 'breach' | 'malware' | 'ddos' | 'phishing' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  target: string
  description: string
  timestamp: number
  mitigated: boolean
}

export interface FileEntry {
  name: string
  type: 'file' | 'directory'
  size?: number
  modified: number
  permissions: string
  children?: FileEntry[]
  content?: string
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

export interface UserProfile {
  username: string
  level: number
  xp: number
  xpToNextLevel: number
  achievements: Achievement[]
  missionsCompleted: number
  totalPlayTime: number
}
