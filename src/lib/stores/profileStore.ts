import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OperatorProfile, AppSettings } from '@/lib/types'

interface TaskRecord {
  taskId: string
  type: 'analysis' | 'detection' | 'report' | 'investigation'
  description: string
  timestamp: number
  scenarioId?: string
}

interface ProfileStore {
  operator: OperatorProfile
  settings: AppSettings
  isAuthenticated: boolean
  taskHistory: TaskRecord[]
  login: (callSign: string) => void
  logout: () => void
  updateSettings: (settings: Partial<AppSettings>) => void
  updateRole: (role: OperatorProfile['role']) => void
  recordTask: (record: TaskRecord) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      operator: {
        operatorId: crypto.randomUUID(),
        callSign: 'OPERATOR',
        role: 'analyst',
        clearance: 'secret',
        certifications: [],
        specialization: [],
        shift: 'day',
        assignedTo: 'ALPHA',
        lastLogin: Date.now(),
      },
      settings: {
        theme: 'dark',
        terminalTheme: 'matrix',
        soundEnabled: true,
        soundVolume: 0.5,
        effectsIntensity: 1,
        reducedMotion: false,
        highContrast: false,
        fontSize: 14,
        fontFamily: 'monospace',
      },
      isAuthenticated: false,
      taskHistory: [],

      login: (callSign) =>
        set({
          isAuthenticated: true,
          operator: { ...get().operator, callSign, lastLogin: Date.now() },
        }),

      logout: () => set({ isAuthenticated: false }),

      updateSettings: (partial) =>
        set({ settings: { ...get().settings, ...partial } }),

      updateRole: (role) =>
        set({ operator: { ...get().operator, role } }),

      recordTask: (record) =>
        set({ taskHistory: [record, ...get().taskHistory].slice(0, 100) }),
    }),
    { name: 'profile-storage' }
  )
)
