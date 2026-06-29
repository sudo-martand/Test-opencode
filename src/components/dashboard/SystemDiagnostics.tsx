'use client'

import { useEffect, useState } from 'react'

interface Metric {
  label: string
  value: number
  unit: string
  color: string
  max: number
}

export function SystemDiagnostics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'CPU', value: 23, unit: '%', color: '#22d3ee', max: 100 },
    { label: 'RAM', value: 45, unit: '%', color: '#34d399', max: 100 },
    { label: 'NET', value: 340, unit: 'Mbps', color: '#f59e0b', max: 1000 },
    { label: 'DISK', value: 62, unit: '%', color: '#8b5cf6', max: 100 },
  ])
  const [uptime, setUptime] = useState(0)
  const [temp, setTemp] = useState(42)
  const [processes, setProcesses] = useState(156)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(0, Math.min(m.max, m.value + (Math.random() - 0.5) * (m.max * 0.1))),
        }))
      )
      setUptime((u) => u + 1)
      setTemp((t) => Math.max(35, Math.min(85, t + (Math.random() - 0.5) * 3)))
      setProcesses((p) => Math.max(100, Math.min(300, p + Math.floor((Math.random() - 0.5) * 10))))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  return (
    <div className="h-full overflow-auto p-4 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg p-3 border border-zinc-800/50" style={{ backgroundColor: '#0a0a15' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-[10px] uppercase tracking-wider">{m.label}</span>
              <span className="text-lg font-bold" style={{ color: m.color }}>{Math.round(m.value)}{m.unit}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(m.value / m.max) * 100}%`, backgroundColor: m.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg p-3 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Uptime</div>
          <div className="text-sm text-cyan-400">{formatUptime(uptime)}</div>
        </div>
        <div className="rounded-lg p-3 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Temp</div>
          <div className={`text-sm ${temp > 70 ? 'text-red-400' : temp > 55 ? 'text-yellow-400' : 'text-green-400'}`}>{Math.round(temp)}°C</div>
        </div>
        <div className="rounded-lg p-3 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Processes</div>
          <div className="text-sm text-purple-400">{processes}</div>
        </div>
      </div>

      <div className="rounded-lg p-3 border border-zinc-800/50" style={{ backgroundColor: '#0a0a15' }}>
        <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-2">System Info</div>
        <div className="space-y-1 text-zinc-500">
          <div className="flex justify-between"><span>OS</span><span className="text-zinc-300">CyberOS 3.7.2</span></div>
          <div className="flex justify-between"><span>Kernel</span><span className="text-zinc-300">6.8.0-cyber-server</span></div>
          <div className="flex justify-between"><span>Host</span><span className="text-zinc-300">QUANTUM-X9</span></div>
          <div className="flex justify-between"><span>Uptime</span><span className="text-zinc-300">{formatUptime(uptime)}</span></div>
          <div className="flex justify-between"><span>Load</span><span className="text-zinc-300">0.42 0.38 0.25</span></div>
        </div>
      </div>
    </div>
  )
}
