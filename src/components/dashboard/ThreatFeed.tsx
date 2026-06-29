'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNetworkStore } from '@/lib/stores/networkStore'

export function ThreatFeed() {
  const { threatEvents, initialize, tick } = useNetworkStore()

  useEffect(() => {
    initialize()
    const interval = setInterval(tick, 1500)
    return () => clearInterval(interval)
  }, [initialize, tick])

  const severityIcon: Record<string, string> = { low: '●', medium: '◆', high: '▲', critical: '‼' }
  const severityColor: Record<string, string> = { low: 'text-green-500', medium: 'text-yellow-500', high: 'text-orange-500', critical: 'text-red-500' }
  const typeIcon: Record<string, string> = { scan: '⇄', breach: '⚡', malware: '☠', ddos: '↯', phishing: '✉', anomaly: '?' }

  return (
    <div className="h-full overflow-auto p-3 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-zinc-400 text-[10px] uppercase tracking-wider">Threat Intelligence Feed</h2>
        <span className="text-zinc-600 text-[10px]">{threatEvents.length} events</span>
      </div>
      <div className="space-y-1.5">
        <AnimatePresence>
          {threatEvents.slice().reverse().map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-zinc-800/50 p-2.5"
              style={{ backgroundColor: event.mitigated ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)' }}
            >
              <div className="flex items-start gap-2">
                <span className={`text-base ${severityColor[event.severity]}`}>{severityIcon[event.severity]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium ${severityColor[event.severity]}`}>{event.severity.toUpperCase()}</span>
                    <span className="text-zinc-600 text-[10px]">{typeIcon[event.type]} {event.type}</span>
                    {event.mitigated && <span className="text-green-600 text-[10px] ml-auto">MITIGATED</span>}
                  </div>
                  <div className="text-zinc-300 mt-0.5 text-[11px]">{event.description}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600">
                    <span>From: {event.source}</span>
                    <span>→</span>
                    <span>To: {event.target}</span>
                    <span className="ml-auto">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
