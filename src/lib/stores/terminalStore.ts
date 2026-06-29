import { create } from 'zustand'
import type { TerminalLine, TerminalSession } from '@/lib/types'

interface TerminalStore {
  sessions: Map<string, TerminalSession>
  activeSessionId: string | null
  sessionTabs: { id: string; label: string }[]
  createSession: (label?: string) => string
  appendLine: (sessionId: string, line: TerminalLine) => void
  clearSession: (sessionId: string) => void
  setActiveSession: (sessionId: string) => void
  setCwd: (sessionId: string, cwd: string) => void
  addToHistory: (sessionId: string, command: string) => void
  setHistoryIndex: (sessionId: string, index: number) => void
  closeSession: (sessionId: string) => void
  renameSession: (sessionId: string, label: string) => void
}

let lineCounter = 0
let sessionCounter = 0

function createLine(type: TerminalLine['type'], content: string): TerminalLine {
  lineCounter++
  return { id: `line-${lineCounter}`, type, content, timestamp: Date.now() }
}

function createSession(cwd?: string): TerminalSession {
  sessionCounter++
  return {
    id: `session-${sessionCounter}`,
    lines: [
      createLine('system', `SOC Terminal v${sessionCounter}.0 — ${new Date().toISOString()}`),
      createLine('system', 'Type `help` for available commands'),
      createLine('system', ''),
    ],
    cwd: cwd || '/home/analyst',
    commandHistory: [],
    historyIndex: -1,
  }
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  sessions: new Map(),
  activeSessionId: null,
  sessionTabs: [],

  createSession: (label) => {
    const session = createSession()
    const sessions = new Map(get().sessions)
    sessions.set(session.id, session)
    const tabLabel = label || `Session ${sessionCounter}`
    set({
      sessions,
      activeSessionId: session.id,
      sessionTabs: [...get().sessionTabs, { id: session.id, label: tabLabel }],
    })
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
      const history = [command, ...session.commandHistory.slice(0, 499)]
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

  closeSession: (sessionId) => {
    const sessions = new Map(get().sessions)
    sessions.delete(sessionId)
    const tabs = get().sessionTabs.filter((t) => t.id !== sessionId)
    const activeId = get().activeSessionId === sessionId
      ? (tabs.length > 0 ? tabs[tabs.length - 1].id : null)
      : get().activeSessionId
    set({ sessions, sessionTabs: tabs, activeSessionId: activeId })
  },

  renameSession: (sessionId, label) => {
    set({
      sessionTabs: get().sessionTabs.map((t) =>
        t.id === sessionId ? { ...t, label } : t
      ),
    })
  },
}))
