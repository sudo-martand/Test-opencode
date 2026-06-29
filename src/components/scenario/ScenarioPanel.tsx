'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScenarioStore } from '@/lib/stores/scenarioStore'
import { useProfileStore } from '@/lib/stores/profileStore'
import { useSound } from '@/components/sound/SoundProvider'

export function ScenarioPanel() {
  const { scenarios, activeScenarioId, generateScenario, activateScenario, completeTask, completeScenario, failScenario } = useScenarioStore()
  const { recordTask } = useProfileStore()
  const { playAlert, playSuccess } = useSound()

  useEffect(() => {
    if (scenarios.length === 0) {
      generateScenario('recon')
      generateScenario('incident_response')
      generateScenario('threat_hunt')
    }
  }, [scenarios.length, generateScenario])

  const handleActivate = useCallback((id: string) => {
    activateScenario(id)
    playAlert()
  }, [activateScenario, playAlert])

  const handleCompleteTask = useCallback((scenarioId: string, taskId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId)
    const task = scenario?.tasks.find((t) => t.id === taskId)
    if (task) {
      completeTask(scenarioId, taskId)
      recordTask({
        taskId,
        type: 'investigation',
        description: task.description,
        timestamp: Date.now(),
        scenarioId,
      })
    }
  }, [scenarios, completeTask, recordTask])

  const handleCompleteScenario = useCallback((id: string) => {
    completeScenario(id)
    playSuccess()
  }, [completeScenario, playSuccess])

  const handleFailScenario = useCallback((id: string) => {
    failScenario(id)
  }, [failScenario])

  const severityColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  }

  const typeLabels: Record<string, string> = {
    recon: 'Reconnaissance',
    exploitation: 'Exploitation',
    persistence: 'Persistence',
    exfiltration: 'Exfiltration',
    incident_response: 'Incident Response',
    threat_hunt: 'Threat Hunt',
    forensic_analysis: 'Forensic Analysis',
    malware_analysis: 'Malware Analysis',
  }

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId)

  return (
    <div className="h-full overflow-auto p-3 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      {activeScenario && (
        <div className="mb-4 rounded-lg border border-cyan-800/50 p-3" style={{ backgroundColor: 'rgba(6,182,212,0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-400 text-[10px] uppercase tracking-wider">Active Operation</span>
            <span className={`text-[10px] font-medium ${severityColors[activeScenario.severity]}`}>
              {activeScenario.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-zinc-200 font-medium mb-1">{activeScenario.title}</div>
          <div className="text-zinc-500 text-[11px] mb-2">{activeScenario.environment} · Phase: {activeScenario.phase}</div>
          <div className="text-zinc-400 text-[11px] mb-2">{activeScenario.description}</div>

          {activeScenario.mitreMapping.length > 0 && (
            <div className="mb-2">
              <span className="text-zinc-600 text-[10px] uppercase tracking-wider">MITRE ATT&CK Techniques:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeScenario.mitreMapping.map((mt) => (
                  <span key={mt.id} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]">
                    {mt.id} ({mt.tactic})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1 mb-2 mt-3">
            {activeScenario.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleCompleteTask(activeScenario.id, task.id)}
                  disabled={task.status === 'completed'}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-cyan-500 border-cyan-500'
                      : task.status === 'in_progress'
                        ? 'border-cyan-600 animate-pulse'
                        : 'border-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {task.status === 'completed' && <span className="text-[8px] text-white">✓</span>}
                </button>
                <span className={`text-[11px] ${task.status === 'completed' ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                  {task.description}
                  {task.mitreTechnique && (
                    <span className="text-zinc-700 ml-1">[{task.mitreTechnique}]</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            {activeScenario.tasks.every((t) => t.status === 'completed') && (
              <button
                onClick={() => handleCompleteScenario(activeScenario.id)}
                className="px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-white text-[10px] font-medium transition-colors"
              >
                Complete Operation
              </button>
            )}
            <button
              onClick={() => handleFailScenario(activeScenario.id)}
              className="px-3 py-1 rounded bg-red-900/50 hover:bg-red-800/50 text-red-400 text-[10px] transition-colors"
            >
              Fail Operation
            </button>
          </div>
        </div>
      )}

      <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">Available Scenarios</div>
      <div className="space-y-2">
        <AnimatePresence>
          {scenarios.filter((s) => s.status === 'pending' || s.status === 'active').map((scenario) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-zinc-800/50 p-3"
              style={{ backgroundColor: '#0a0a15' }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-[10px] text-zinc-500">{typeLabels[scenario.type] || scenario.type}</span>
                  <div className="text-sm text-zinc-200 font-medium">{scenario.title}</div>
                </div>
                <span className={`text-[10px] font-medium ${severityColors[scenario.severity]}`}>{scenario.severity.toUpperCase()}</span>
              </div>
              <p className="text-zinc-500 text-[11px] mb-1">{scenario.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600 mb-2">
                <span>{scenario.environment}</span>
                <span>·</span>
                <span>{scenario.tasks.length} tasks</span>
                <span>·</span>
                <span>MITRE: {scenario.mitreMapping.map((m) => m.id).join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                {scenario.status === 'pending' && (
                  <button
                    onClick={() => handleActivate(scenario.id)}
                    className="px-2.5 py-1 rounded bg-cyan-700/50 hover:bg-cyan-700 text-cyan-300 text-[10px] font-medium transition-colors"
                  >
                    Activate
                  </button>
                )}
                {scenario.status === 'active' && (
                  <span className="text-[10px] text-cyan-500 animate-pulse">IN PROGRESS</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => generateScenario()}
        className="w-full mt-3 py-1.5 rounded border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 text-[10px] transition-colors"
      >
        + Generate New Scenario
      </button>
    </div>
  )
}
