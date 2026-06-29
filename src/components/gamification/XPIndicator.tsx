'use client'

import { useGameStore } from '@/lib/stores/gameStore'

export function XPIndicator() {
  const { profile } = useGameStore()
  const progress = profile.xpToNextLevel > 0 ? (profile.xp / profile.xpToNextLevel) * 100 : 0

  return (
    <div className="font-mono text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-zinc-500 text-[10px]">LVL {profile.level}</span>
        <span className="text-zinc-600 text-[10px]">{profile.xp} / {profile.xpToNextLevel} XP</span>
      </div>
      <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
