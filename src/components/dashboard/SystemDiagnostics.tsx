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
    { label: 'CPU', value: 23.4, unit: '%', color: 'var(--soc-accent)', max: 100 },
    { label: 'MEM', value: 45.7, unit: '%', color: 'var(--soc-info)', max: 100 },
    { label: 'DISK', value: 62.1, unit: '%', color: 'var(--soc-warning)', max: 100 },
    { label: 'NET', value: 340, unit: 'Mbps', color: 'var(--soc-success)', max: 10000 },
  ])

  const [uptime, setUptime] = useState(0)
  const [processCount, setProcessCount] = useState(156)
  const [loadAvg, setLoadAvg] = useState([0.42, 0.38, 0.25])
  const [netRx, setNetRx] = useState(1.2)
  const [netTx, setNetTx] = useState(0.34)
  const [diskIO, setDiskIO] = useState(45)
  const [temp, setTemp] = useState(42)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.max(0, Math.min(m.max, m.value + (Math.random() - 0.5) * m.max * 0.05)),
        }))
      )
      setUptime((u) => u + 1)
      setProcessCount((p) => Math.max(100, Math.min(300, p + Math.floor((Math.random() - 0.5) * 8))))
      setLoadAvg((prev) => prev.map((v) => Math.max(0, Math.min(8, v + (Math.random() - 0.5) * 0.2))))
      setNetRx((v) => Math.max(0, v + (Math.random() - 0.5) * 0.3))
      setNetTx((v) => Math.max(0, v + (Math.random() - 0.5) * 0.1))
      setDiskIO((v) => Math.max(0, Math.min(500, v + (Math.random() - 0.5) * 20)))
      setTemp((t) => Math.max(35, Math.min(85, t + (Math.random() - 0.5) * 2)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${d}d ${h}h ${m}m`
  }

  return (
    <div className="h-full overflow-y-auto font-mono text-xs soc-scrollbar" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div className="p-4 space-y-4">
        {/* System Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => {
            const pct = (m.value / m.max) * 100
            const isWarning = pct > 80
            const isCritical = pct > 95
            return (
              <div
                key={m.label}
                className="rounded border p-3"
                style={{
                  borderColor: isCritical ? 'var(--soc-danger)' : isWarning ? 'var(--soc-warning)' : 'var(--soc-border)',
                  backgroundColor: 'var(--soc-surface)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--soc-text-muted)' }}>{m.label}</span>
                  <span className="text-sm font-bold" style={{ color: m.color }}>{m.value.toFixed(1)}{m.unit}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--soc-bg)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: isCritical ? 'var(--soc-critical)' : isWarning ? 'var(--soc-warning)' : m.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* System Details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded border p-3" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--soc-text-muted)' }}>System</div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Uptime</span><span style={{ color: 'var(--soc-text)' }}>{formatUptime(uptime)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Processes</span><span style={{ color: 'var(--soc-text)' }}>{processCount}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Temp</span><span style={{ color: temp > 70 ? 'var(--soc-danger)' : temp > 55 ? 'var(--soc-warning)' : 'var(--soc-success)' }}>{Math.round(temp)}°C</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Load</span><span style={{ color: 'var(--soc-text)' }}>{loadAvg.map((v) => v.toFixed(2)).join(', ')}</span></div>
            </div>
          </div>

          <div className="rounded border p-3" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--soc-text-muted)' }}>Network</div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>RX</span><span style={{ color: 'var(--soc-success)' }}>{netRx.toFixed(1)} Gbps</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>TX</span><span style={{ color: 'var(--soc-accent)' }}>{netTx.toFixed(1)} Gbps</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Disk I/O</span><span style={{ color: 'var(--soc-warning)' }}>{diskIO} MB/s</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Sessions</span><span style={{ color: 'var(--soc-text)' }}>{Math.floor(Math.random() * 500 + 100)}</span></div>
            </div>
          </div>

          <div className="rounded border p-3" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--soc-text-muted)' }}>Platform</div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>OS</span><span style={{ color: 'var(--soc-text)' }}>CyberOS 3.7.2</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Kernel</span><span style={{ color: 'var(--soc-text)' }}>6.8.0-cyber-server</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Host</span><span style={{ color: 'var(--soc-text)' }}>QUANTUM-X9</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--soc-text-muted)' }}>Arch</span><span style={{ color: 'var(--soc-text)' }}>x86_64</span></div>
            </div>
          </div>
        </div>

        {/* Memory Detail */}
        <div className="rounded border p-3" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
          <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--soc-text-muted)' }}>Memory Map</div>
          <div className="space-y-2">
            {[
              { label: 'System', used: 8.2, total: 16, color: 'var(--soc-accent)' },
              { label: 'Processes', used: 4.5, total: 16, color: 'var(--soc-info)' },
              { label: 'Cache', used: 2.8, total: 16, color: 'var(--soc-success)' },
              { label: 'Free', used: 0.5, total: 16, color: 'var(--soc-warning)' },
            ].map((seg) => (
              <div key={seg.label} className="flex items-center gap-3">
                <div className="w-16 text-[10px]" style={{ color: 'var(--soc-text-muted)' }}>{seg.label}</div>
                <div className="flex-1 h-4 rounded overflow-hidden" style={{ backgroundColor: 'var(--soc-bg)' }}>
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${(seg.used / seg.total) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
                <div className="w-20 text-right text-[10px]" style={{ color: 'var(--soc-text)' }}>
                  {seg.used.toFixed(1)} GB
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
