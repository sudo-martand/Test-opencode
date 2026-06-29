import { create } from 'zustand'
import type { UserProfile, Achievement, AppSettings } from '@/lib/types'

interface GameStore {
  profile: UserProfile
  settings: AppSettings
  addXp: (amount: number) => void
  unlockAchievement: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  incrementMissionsCompleted: () => void
  getLevelProgress: () => number
}

const defaultProfile: UserProfile = {
  username: 'operator',
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  achievements: [],
  missionsCompleted: 0,
  totalPlayTime: 0,
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  terminalTheme: 'matrix',
  soundEnabled: true,
  soundVolume: 0.5,
  effectsIntensity: 1,
  reducedMotion: false,
  highContrast: false,
  fontSize: 14,
  fontFamily: 'monospace',
}

export const useGameStore = create<GameStore>((set, get) => ({
  profile: defaultProfile,
  settings: defaultSettings,

  addXp: (amount) =>
    set((state) => {
      let { xp, level, xpToNextLevel } = state.profile
      xp += amount
      while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel
        level++
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5)
      }
      return { profile: { ...state.profile, xp, level, xpToNextLevel } }
    }),

  unlockAchievement: (id) =>
    set((state) => {
      const existing = state.profile.achievements.find((a) => a.id === id)
      if (existing?.unlocked) return state
      const achievement: Achievement = {
        id,
        title: getAchievementTitle(id),
        description: getAchievementDescription(id),
        icon: '🏆',
        unlocked: true,
        unlockedAt: Date.now(),
      }
      return { profile: { ...state.profile, achievements: [...state.profile.achievements.filter((a) => a.id !== id), achievement] } }
    }),

  updateSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),

  incrementMissionsCompleted: () =>
    set((state) => ({ profile: { ...state.profile, missionsCompleted: state.profile.missionsCompleted + 1 } })),

  getLevelProgress: () => {
    const { xp, xpToNextLevel } = get().profile
    return xpToNextLevel > 0 ? xp / xpToNextLevel : 1
  },
}))

function getAchievementTitle(id: string): string {
  const titles: Record<string, string> = {
    first_scan: 'First Scan',
    first_breach: 'First Breach',
    mission_complete: 'Mission Complete',
    speed_demon: 'Speed Demon',
    elite_hacker: 'Elite Hacker',
    net_runner: 'Net Runner',
    ghost: 'Ghost',
    completionist: 'Completionist',
    veteran: 'Veteran Operator',
  }
  return titles[id] || 'Unknown Achievement'
}

function getAchievementDescription(id: string): string {
  const descriptions: Record<string, string> = {
    first_scan: 'Perform your first network scan',
    first_breach: 'Successfully breach a target system',
    mission_complete: 'Complete your first mission',
    speed_demon: 'Complete a mission with less than 30 seconds remaining',
    elite_hacker: 'Reach level 10',
    net_runner: 'Complete 25 missions',
    ghost: 'Complete a mission without any failed objectives',
    completionist: 'Unlock all achievements',
    veteran: 'Accumulate 24 hours of play time',
  }
  return descriptions[id] || ''
}
