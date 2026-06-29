'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMissionStore } from '@/lib/stores/missionStore'
import { useGameStore } from '@/lib/stores/gameStore'
import { useSound } from '@/components/sound/SoundProvider'

export function MissionPanel() {
  const { missions, activeMissionId, generateMission, startMission, completeObjective, completeMission, tickMissions } = useMissionStore()
  const { addXp, incrementMissionsCompleted } = useGameStore()
  const { playMissionStart, playMissionComplete } = useSound()

  useEffect(() => {
    if (missions.length === 0) {
      generateMission()
      generateMission()
      generateMission()
    }
    const ticker = setInterval(tickMissions, 1000)
    return () => clearInterval(ticker)
  }, [missions.length, generateMission, tickMissions])

  const handleStartMission = useCallback((id: string) => {
    startMission(id)
    playMissionStart()
  }, [startMission, playMissionStart])

  const handleCompleteObjective = useCallback((missionId: string, objectiveId: string) => {
    completeObjective(missionId, objectiveId)
  }, [completeObjective])

  const handleCompleteMission = useCallback((id: string) => {
    const mission = missions.find((m) => m.id === id)
    if (!mission) return
    completeMission(id)
    addXp(mission.rewards.xp)
    incrementMissionsCompleted()
    playMissionComplete()
  }, [missions, completeMission, addXp, incrementMissionsCompleted, playMissionComplete])

  const difficultyColors: Record<string, string> = { easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-orange-400', expert: 'text-red-400' }
  const typeLabels: Record<string, string> = { recon: '🔍 Recon', malware: '🦠 Malware', incident: '🚨 Incident', hunting: '🎯 Hunting', forensics: '🔬 Forensics', intel: '📡 Intel' }

  const activeMission = missions.find((m) => m.id === activeMissionId)

  return (
    <div className="h-full overflow-auto p-3 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      {activeMission && (
        <div className="mb-4 rounded-lg border border-yellow-800/50 p-3" style={{ backgroundColor: 'rgba(234,179,8,0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-400 text-[10px] uppercase tracking-wider">Active Mission</span>
            {activeMission.timeLimit && (
              <span className={`text-[11px] ${activeMission.timeLimit < 30 ? 'text-red-400 animate-pulse' : 'text-zinc-400'}`}>
                {Math.floor(activeMission.timeLimit / 60)}:{(activeMission.timeLimit % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="text-sm text-zinc-200 font-medium mb-1">{activeMission.title}</div>
          <div className="text-zinc-400 text-[11px] mb-2">{activeMission.description}</div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800 mb-2 overflow-hidden">
            <div className="h-full rounded-full bg-yellow-500 transition-all duration-500" style={{ width: `${activeMission.progress}%` }} />
          </div>
          <div className="space-y-1 mb-2">
            {activeMission.objectives.map((obj) => (
              <div key={obj.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleCompleteObjective(activeMission.id, obj.id)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                    obj.completed ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {obj.completed && <span className="text-[8px] text-white">✓</span>}
                </button>
                <span className={obj.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'}>{obj.description}</span>
              </div>
            ))}
          </div>
          {activeMission.progress === 100 && (
            <button
              onClick={() => handleCompleteMission(activeMission.id)}
              className="w-full mt-2 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white text-[11px] font-medium transition-colors"
            >
              Complete Mission (+{activeMission.rewards.xp} XP)
            </button>
          )}
        </div>
      )}

      <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">Available Missions</div>
      <div className="space-y-2">
        <AnimatePresence>
          {missions.filter((m) => m.status === 'available' || m.status === 'active').map((mission) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-zinc-800/50 p-3"
              style={{ backgroundColor: '#0a0a15' }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-[10px] text-zinc-500">{typeLabels[mission.type]}</span>
                  <div className="text-sm text-zinc-200 font-medium">{mission.title}</div>
                </div>
                <span className={`text-[10px] font-medium ${difficultyColors[mission.difficulty]}`}>{mission.difficulty.toUpperCase()}</span>
              </div>
              <p className="text-zinc-500 text-[11px] mb-2">{mission.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">{mission.objectives.length} objectives · {mission.rewards.xp} XP</span>
                {mission.status === 'available' && (
                  <button
                    onClick={() => handleStartMission(mission.id)}
                    className="px-2.5 py-1 rounded bg-cyan-700/50 hover:bg-cyan-700 text-cyan-300 text-[10px] font-medium transition-colors"
                  >
                    Accept
                  </button>
                )}
                {mission.status === 'active' && (
                  <span className="text-[10px] text-yellow-500 animate-pulse">IN PROGRESS</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => generateMission()}
        className="w-full mt-3 py-1.5 rounded border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 text-[10px] transition-colors"
      >
        + Generate New Mission
      </button>
    </div>
  )
}
