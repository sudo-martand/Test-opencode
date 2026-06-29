import { create } from 'zustand'
import type { TerminalLine, TerminalSession } from '@/lib/types'

interface TerminalStore {
  sessions: Map<string, TerminalSession>
  activeSessionId: string | null
  createSession: () => string
  appendLine: (sessionId: string, line: TerminalLine) => void
  clearSession: (sessionId: string) => void
  setActiveSession: (sessionId: string) => void
  setCwd: (sessionId: string, cwd: string) => void
  addToHistory: (sessionId: string, command: string) => void
  setHistoryIndex: (sessionId: string, index: number) => void
}

let lineCounter = 0
let sessionCounter = 0

function createLine(type: TerminalLine['type'], content: string): TerminalLine {
  lineCounter++
  return { id: `line-${lineCounter}`, type, content, timestamp: Date.now() }
}

function createSession(): TerminalSession {
  sessionCounter++
  return {
    id: `session-${sessionCounter}`,
    lines: [createLine('system', `CyberOS Terminal v${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 99)}`),
      createLine('system', 'Type `help` for available commands'),
      createLine('system', '')],
    cwd: '/home/user',
    commandHistory: [],
    historyIndex: -1,
  }
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  sessions: new Map(),
  activeSessionId: null,

  createSession: () => {
    const session = createSession()
    const sessions = new Map(get().sessions)
    sessions.set(session.id, session)
    set({ sessions, activeSessionId: session.id })
    return session.id
  },

  appendLine: (sessionId, line) => {
    const sessions = new Map(get().sessions)
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, lines: [...session.lines, line] })
      set({ sessions })
    }
  },

  clearSession: (sessionId) => {
    const sessions = new Map(get().sessions)
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, lines: [] })
      set({ sessions })
    }
  },

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  setCwd: (sessionId, cwd) => {
    const sessions = new Map(get().sessions)
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, cwd })
      set({ sessions })
    }
  },

  addToHistory: (sessionId, command) => {
    const sessions = new Map(get().sessions)
    const session = sessions.get(sessionId)
    if (session && command.trim()) {
      const history = [command, ...session.commandHistory.slice(0, 99)]
      sessions.set(sessionId, { ...session, commandHistory: history, historyIndex: -1 })
      set({ sessions })
    }
  },

  setHistoryIndex: (sessionId, index) => {
    const sessions = new Map(get().sessions)
    const session = sessions.get(sessionId)
    if (session) {
      sessions.set(sessionId, { ...session, historyIndex: index })
      set({ sessions })
    }
  },
}))
