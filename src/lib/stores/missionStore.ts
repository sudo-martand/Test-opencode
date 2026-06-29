import { create } from 'zustand'
import type { Mission, MissionType } from '@/lib/types'

interface MissionStore {
  missions: Mission[]
  activeMissionId: string | null
  generateMission: (type?: MissionType) => void
  startMission: (id: string) => void
  completeObjective: (missionId: string, objectiveId: string) => void
  failMission: (id: string) => void
  completeMission: (id: string) => void
  tickMissions: () => void
}

const missionTemplates = {
  recon: {
    title: 'Network Reconnaissance',
    description: 'Perform a comprehensive reconnaissance scan of the target network to identify live hosts, open ports, and running services.',
  },
  malware: {
    title: 'Malware Investigation',
    description: 'Analyze suspicious binaries and network traffic to identify and contain a malware outbreak.',
  },
  incident: {
    title: 'Incident Response',
    description: 'Respond to an active security breach, contain the threat, and restore system integrity.',
  },
  hunting: {
    title: 'Threat Hunting',
    description: 'Proactively search for advanced persistent threats lurking in the network infrastructure.',
  },
  forensics: {
    title: 'Digital Forensics',
    description: 'Collect and analyze forensic evidence from compromised systems to determine the attack vector.',
  },
  intel: {
    title: 'Intelligence Gathering',
    description: 'Gather threat intelligence from multiple sources to identify emerging attack patterns.',
  },
}

const difficulties = ['easy', 'medium', 'hard', 'expert'] as const

let missionCounter = 0

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: [],
  activeMissionId: null,

  generateMission: (type) => {
    missionCounter++
    const mType = type || (['recon', 'malware', 'incident', 'hunting', 'forensics', 'intel'] as MissionType[])[Math.floor(Math.random() * 6)]
    const template = missionTemplates[mType]
    const difficulty = difficulties[Math.floor(Math.random() * 4)]
    const objectiveCount = Math.floor(Math.random() * 3) + 2

    const mission: Mission = {
      id: `mission-${missionCounter}`,
      title: template.title,
      description: template.description,
      type: mType,
      difficulty,
      status: 'available',
      objectives: Array.from({ length: objectiveCount }, (_, i) => ({
        id: `obj-${missionCounter}-${i}`,
        description: getObjectiveDescription(mType, i),
        completed: false,
      })),
      rewards: {
        xp: (difficulty === 'easy' ? 100 : difficulty === 'medium' ? 250 : difficulty === 'hard' ? 500 : 1000) * objectiveCount,
        achievements: [],
      },
      timeLimit: difficulty === 'easy' ? undefined : difficulty === 'medium' ? 300 : difficulty === 'hard' ? 180 : 90,
      progress: 0,
    }

    set((s) => ({ missions: [...s.missions, mission] }))
  },

  startMission: (id) =>
    set((s) => ({
      activeMissionId: id,
      missions: s.missions.map((m) => (m.id === id ? { ...m, status: 'active' as const } : m)),
    })),

  completeObjective: (missionId, objectiveId) =>
    set((s) => {
      const missions = s.missions.map((m) => {
        if (m.id !== missionId) return m
        const objectives = m.objectives.map((o) =>
          o.id === objectiveId ? { ...o, completed: true } : o
        )
        const completed = objectives.filter((o) => o.completed).length
        const progress = Math.round((completed / objectives.length) * 100)
        const allDone = objectives.every((o) => o.completed)
        return { ...m, objectives, progress, status: allDone ? ('completed' as const) : m.status }
      })
      const mission = missions.find((m) => m.id === missionId)
      return { missions, activeMissionId: mission?.status === 'completed' ? null : s.activeMissionId }
    }),

  failMission: (id) =>
    set((s) => ({
      activeMissionId: null,
      missions: s.missions.map((m) => (m.id === id ? { ...m, status: 'failed' as const } : m)),
    })),

  completeMission: (id) =>
    set((s) => ({
      activeMissionId: null,
      missions: s.missions.map((m) => (m.id === id ? { ...m, status: 'completed' as const, progress: 100 } : m)),
    })),

  tickMissions: () => {
    const state = get()
    state.missions.forEach((m) => {
      if (m.status === 'active' && m.timeLimit) {
        m.timeLimit--
        if (m.timeLimit <= 0) state.failMission(m.id)
      }
    })
  },
}))

function getObjectiveDescription(type: MissionType, index: number): string {
  const objectives: Record<MissionType, string[]> = {
    recon: [
      'Scan target IP range for live hosts',
      'Identify open ports on discovered hosts',
      'Enumerate running services and versions',
      'Map network topology',
      'Identify potential vulnerabilities',
    ],
    malware: [
      'Isolate infected systems from network',
      'Extract malware samples for analysis',
      'Identify command and control servers',
      'Remove malware from affected systems',
      'Deploy updated detection signatures',
    ],
    incident: [
      'Assess the scope of the breach',
      'Contain the active threat',
      'Eradicate attacker presence',
      'Recover affected systems',
      'Implement preventive measures',
    ],
    hunting: [
      'Analyze network traffic for anomalies',
      'Correlate log entries across systems',
      'Identify indicators of compromise',
      'Trace attacker movement',
      'Document threat actor techniques',
    ],
    forensics: [
      'Acquire forensic images of compromised systems',
      'Analyze file system for artifacts',
      'Extract and examine memory dumps',
      'Reconstruct attack timeline',
      'Identify data exfiltration evidence',
    ],
    intel: [
      'Monitor dark web for threat actor chatter',
      'Analyze malware samples for TTPs',
      'Track emerging threat campaigns',
      'Assess risk to infrastructure',
      'Generate threat intelligence report',
    ],
  }
  const list = objectives[type]
  return list[index % list.length]
}
