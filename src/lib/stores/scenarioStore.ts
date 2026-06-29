import { create } from 'zustand'
import type { Scenario, ScenarioTask, ScenarioEvent, MitreTechnique } from '@/lib/types'

interface ScenarioStore {
  scenarios: Scenario[]
  activeScenarioId: string | null
  generateScenario: (type?: Scenario['type']) => void
  activateScenario: (id: string) => void
  pauseScenario: (id: string) => void
  completeTask: (scenarioId: string, taskId: string) => void
  addEvent: (scenarioId: string, event: ScenarioEvent) => void
  failScenario: (id: string) => void
  completeScenario: (id: string) => void
}

const SCENARIO_TEMPLATES: {
  id: string
  title: string
  description: string
  type: Scenario['type']
  severity: Scenario['severity']
  environment: string
  mitreTechniques: MitreTechnique[]
  tasks: { description: string; type: ScenarioTask['type']; mitreTechnique?: string }[]
}[] = [
  {
    id: 'scenario-recon-1',
    title: 'Network Reconnaissance - TARGET CORP',
    description: 'Perform passive and active reconnaissance on TARGET CORP infrastructure. Identify live hosts, open ports, services, and potential vulnerabilities without triggering IDS alerts.',
    type: 'recon',
    severity: 'medium',
    environment: 'Enterprise IT',
    mitreTechniques: [
      { id: 'T1595', name: 'Active Scanning', tactic: 'Reconnaissance', platform: ['Windows', 'Linux', 'macOS'] },
      { id: 'T1592', name: 'Gather Victim Host Information', tactic: 'Reconnaissance', platform: ['Windows', 'Linux'] },
      { id: 'T1590', name: 'Gather Victim Network Information', tactic: 'Reconnaissance', platform: ['Network'] },
    ],
    tasks: [
      { description: 'Perform DNS enumeration (subdomains, MX, TXT records)', type: 'scan', mitreTechnique: 'T1590' },
      { description: 'Conduct passive OSINT gathering (Shodan, Censys)', type: 'scan', mitreTechnique: 'T1592' },
      { description: 'Execute SYN stealth scan on target range 10.0.0.0/24', type: 'scan', mitreTechnique: 'T1595' },
      { description: 'Perform service fingerprinting on discovered hosts', type: 'analyze', mitreTechnique: 'T1595' },
      { description: 'Identify potential vulnerabilities per service', type: 'analyze' },
      { description: 'Generate reconnaissance report with findings', type: 'report' },
    ],
  },
  {
    id: 'scenario-ir-1',
    title: 'Incident Response - RANSOMWARE OUTBREAK',
    description: 'Respond to an active ransomware attack. Identify patient zero, contain the spread, eradicate the threat, and recover affected systems. Indicators suggest LockBit 4.0 variant.',
    type: 'incident_response',
    severity: 'critical',
    environment: 'Enterprise IT',
    mitreTechniques: [
      { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', platform: ['Windows', 'Linux'] },
      { id: 'T1485', name: 'Data Destruction', tactic: 'Impact', platform: ['Windows', 'Linux'] },
      { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command And Control', platform: ['Windows', 'Linux'] },
      { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration', platform: ['Windows', 'Linux'] },
    ],
    tasks: [
      { description: 'Triage initial alerts from SIEM', type: 'analyze' },
      { description: 'Identify compromised hosts through IOC correlation', type: 'analyze', mitreTechnique: 'T1486' },
      { description: 'Contain affected systems via network isolation', type: 'contain' },
      { description: 'Extract ransomware sample for analysis', type: 'analyze' },
      { description: 'Identify command and control infrastructure', type: 'analyze', mitreTechnique: 'T1071' },
      { description: 'Eradicate threat from all affected systems', type: 'eradicate' },
      { description: 'Recover encrypted data from backups', type: 'recover' },
      { description: 'Generate incident report with timeline and IoCs', type: 'report' },
    ],
  },
  {
    id: 'scenario-threat-1',
    title: 'Threat Hunt - ADVANCED PERSISTENT THREAT',
    description: 'Proactively hunt for signs of APT activity within the corporate network. Recent intelligence suggests a sophisticated threat actor has established a foothold. Search for indicators of lateral movement, persistence mechanisms, and C2 beaconing.',
    type: 'threat_hunt',
    severity: 'high',
    environment: 'Enterprise IT',
    mitreTechniques: [
      { id: 'TA0003', name: 'Persistence', tactic: 'Persistence', platform: ['Windows', 'Linux'] },
      { id: 'TA0008', name: 'Lateral Movement', tactic: 'Lateral Movement', platform: ['Windows'] },
      { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command And Control', platform: ['Windows', 'Linux'] },
    ],
    tasks: [
      { description: 'Analyze network flows for anomalous beaconing patterns', type: 'analyze', mitreTechnique: 'T1071' },
      { description: 'Review authentication logs for lateral movement', type: 'analyze', mitreTechnique: 'TA0008' },
      { description: 'Scan endpoints for persistence mechanisms (services, scheduled tasks, WMI)', type: 'scan', mitreTechnique: 'TA0003' },
      { description: 'Correlate observed TTPs with known threat actor profiles', type: 'analyze' },
      { description: 'Document findings and propose detection rules', type: 'report' },
    ],
  },
  {
    id: 'scenario-forensics-1',
    title: 'Digital Forensics - DATA EXFILTRATION INCIDENT',
    description: 'Perform forensic analysis on a compromised server. Determine the entry vector, scope of data exfiltration, and provide actionable intelligence for remediation.',
    type: 'forensic_analysis',
    severity: 'high',
    environment: 'Enterprise IT',
    mitreTechniques: [
      { id: 'T1041', name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration', platform: ['Windows', 'Linux'] },
      { id: 'T1003', name: 'OS Credential Dumping', tactic: 'Credential Access', platform: ['Windows'] },
      { id: 'T1560', name: 'Archive Collected Data', tactic: 'Collection', platform: ['Windows', 'Linux'] },
    ],
    tasks: [
      { description: 'Acquire forensic memory dump of compromised host', type: 'analyze' },
      { description: 'Analyze file system for exfiltration artifacts', type: 'analyze', mitreTechnique: 'T1560' },
      { description: 'Examine registry and prefetch for execution artifacts', type: 'analyze' },
      { description: 'Identify data exfiltration indicators in network logs', type: 'analyze', mitreTechnique: 'T1041' },
      { description: 'Reconstruct attack timeline from forensic artifacts', type: 'report' },
    ],
  },
  {
    id: 'scenario-malware-1',
    title: 'Malware Analysis - UNKNOWN SAMPLE',
    description: 'Perform static and dynamic analysis on a suspicious binary recovered from an incident. Determine capabilities, C2 infrastructure, and extraction of IOCs for threat intelligence.',
    type: 'malware_analysis',
    severity: 'medium',
    environment: 'Sandbox',
    mitreTechniques: [
      { id: 'T1204', name: 'User Execution', tactic: 'Execution', platform: ['Windows', 'Linux', 'macOS'] },
      { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command And Control', platform: ['Windows', 'Linux'] },
    ],
    tasks: [
      { description: 'Calculate file hashes (MD5, SHA1, SHA256)', type: 'analyze' },
      { description: 'Perform static analysis: PE structure, imports, sections', type: 'analyze' },
      { description: 'Check against VirusTotal and other threat intel sources', type: 'analyze' },
      { description: 'Execute sample in sandbox and capture behavioral artifacts', type: 'analyze', mitreTechnique: 'T1204' },
      { description: 'Identify C2 infrastructure from network traffic', type: 'analyze', mitreTechnique: 'T1071' },
      { description: 'Generate YARA rules and IOCs for detection', type: 'report' },
    ],
  },
  {
    id: 'scenario-exploit-1',
    title: 'Exploitation - WEB APPLICATION PENETRATION TEST',
    description: 'Conduct a controlled penetration test against a web application. Identify and demonstrate exploitation of OWASP Top 10 vulnerabilities. Provide remediation recommendations.',
    type: 'exploitation',
    severity: 'medium',
    environment: 'Web Application',
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', platform: ['Windows', 'Linux'] },
      { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'Privilege Escalation', platform: ['Windows', 'Linux'] },
    ],
    tasks: [
      { description: 'Reconnaissance: enumerate endpoints, parameters, technologies', type: 'scan', mitreTechnique: 'T1190' },
      { description: 'Test for SQL injection vulnerabilities', type: 'exploit', mitreTechnique: 'T1190' },
      { description: 'Test for cross-site scripting (XSS) vulnerabilities', type: 'exploit' },
      { description: 'Attempt privilege escalation via authentication bypass', type: 'exploit', mitreTechnique: 'T1068' },
      { description: 'Document findings with proof-of-concept and remediation', type: 'report' },
    ],
  },
]

let scenarioCounter = 0

function createScenario(template: typeof SCENARIO_TEMPLATES[number]): Scenario {
  scenarioCounter++
  const now = Date.now()
  return {
    id: `scenario-${scenarioCounter}-${template.id}`,
    title: template.title,
    description: template.description,
    type: template.type,
    severity: template.severity,
    status: 'pending',
    phase: 'preparation',
    tasks: template.tasks.map((t, i) => ({
      id: `task-${scenarioCounter}-${i}`,
      description: t.description,
      status: 'pending' as const,
      type: t.type,
      mitreTechnique: t.mitreTechnique,
    })),
    timeline: [{
      id: `event-${scenarioCounter}-0`,
      timestamp: now,
      type: 'info' as const,
      source: 'system',
      message: `Scenario created: ${template.title}`,
      data: { template: template.id },
    }],
    mitreMapping: template.mitreTechniques,
    environment: template.environment,
    createdAt: now,
    updatedAt: now,
  }
}

export const useScenarioStore = create<ScenarioStore>((set, get) => ({
  scenarios: [],
  activeScenarioId: null,

  generateScenario: (type) => {
    const available = SCENARIO_TEMPLATES
    const filtered = type
      ? available.filter((t) => t.type === type)
      : available
    const template = filtered[Math.floor(Math.random() * filtered.length)]
    const scenario = createScenario(template)
    set((s) => ({ scenarios: [...s.scenarios, scenario] }))
  },

  activateScenario: (id) =>
    set((s) => ({
      activeScenarioId: id,
      scenarios: s.scenarios.map((sc) =>
        sc.id === id
          ? { ...sc, status: 'active' as const, phase: 'execution', updatedAt: Date.now() }
          : sc
      ),
    })),

  pauseScenario: (id) =>
    set((s) => ({
      activeScenarioId: null,
      scenarios: s.scenarios.map((sc) =>
        sc.id === id
          ? { ...sc, status: 'paused' as const, updatedAt: Date.now() }
          : sc
      ),
    })),

  completeTask: (scenarioId, taskId) =>
    set((s) => {
      const scenarios = s.scenarios.map((sc) => {
        if (sc.id !== scenarioId) return sc
        const tasks = sc.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: 'completed' as const, completedAt: Date.now() }
            : t
        )
        const allDone = tasks.every((t) => t.status === 'completed')
        return {
          ...sc,
          tasks,
          status: allDone ? ('completed' as const) : sc.status,
          phase: allDone ? 'debrief' : sc.phase,
          updatedAt: Date.now(),
        }
      })
      return {
        scenarios,
        activeScenarioId: scenarios.find((sc) => sc.id === scenarioId)?.status === 'completed'
          ? null
          : s.activeScenarioId,
      }
    }),

  addEvent: (scenarioId, event) =>
    set((s) => ({
      scenarios: s.scenarios.map((sc) =>
        sc.id === scenarioId
          ? { ...sc, timeline: [...sc.timeline, event], updatedAt: Date.now() }
          : sc
      ),
    })),

  failScenario: (id) =>
    set((s) => ({
      activeScenarioId: null,
      scenarios: s.scenarios.map((sc) =>
        sc.id === id
          ? { ...sc, status: 'failed' as const, updatedAt: Date.now() }
          : sc
      ),
    })),

  completeScenario: (id) =>
    set((s) => ({
      activeScenarioId: null,
      scenarios: s.scenarios.map((sc) =>
        sc.id === id
          ? { ...sc, status: 'completed' as const, phase: 'debrief', updatedAt: Date.now() }
          : sc
      ),
    })),
}))
