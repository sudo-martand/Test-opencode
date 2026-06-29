'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNetworkStore } from '@/lib/stores/networkStore'

export function NetworkMonitor() {
  const { nodes, packets, threatEvents, isScanning, initialize, tick, startScan, stopScan, clearPackets } = useNetworkStore()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    initialize()
    const interval = setInterval(() => { setNow(Date.now()); tick() }, 1000)
    return () => clearInterval(interval)
  }, [initialize, tick])

  const activeNodes = nodes.filter((n) => n.status === 'active').length
  const totalTraffic = packets.reduce((sum, p) => sum + p.size, 0)
  const threatsLastMinute = threatEvents.filter((e) => now - e.timestamp < 60000).length

  return (
    <div className="h-full overflow-auto p-4 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg p-3 border border-zinc-800/50" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Nodes</div>
          <div className="text-lg text-cyan-400">{activeNodes}<span className="text-xs text-zinc-600"> / {nodes.length}</span></div>
        </div>
        <div className="rounded-lg p-3 border border-zinc-800/50" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Traffic</div>
          <div className="text-lg text-green-400">{(totalTraffic / 1024).toFixed(1)}<span className="text-xs text-zinc-600"> KB/s</span></div>
        </div>
        <div className="rounded-lg p-3 border border-zinc-800/50" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Threats</div>
          <div className="text-lg text-red-400">{threatsLastMinute}<span className="text-xs text-zinc-600"> / min</span></div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800/50 overflow-hidden mb-3" style={{ backgroundColor: '#0a0a15' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/50">
          <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Packets</span>
          <div className="flex gap-2">
            <button
              onClick={isScanning ? stopScan : startScan}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${isScanning ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}
            >
              {isScanning ? 'Stop' : 'Capture'}
            </button>
            <button onClick={clearPackets} className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 hover:text-zinc-300">Clear</button>
          </div>
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          <AnimatePresence>
            {packets.slice(-30).reverse().map((pkt) => {
              const src = nodes.find((n) => n.id === pkt.source)
              const dst = nodes.find((n) => n.id === pkt.target)
              const colors: Record<string, string> = { TCP: 'text-blue-400', UDP: 'text-yellow-400', ICMP: 'text-red-400', HTTP: 'text-green-400', HTTPS: 'text-cyan-400', DNS: 'text-purple-400', SSH: 'text-orange-400', FTP: 'text-pink-400' }
              return (
                <motion.div
                  key={pkt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-1 border-b border-zinc-800/20 text-[11px]"
                >
                  <span className={colors[pkt.protocol] || 'text-zinc-400'}>{pkt.protocol}</span>
                  <span className="text-zinc-500">{src?.label || '?'}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-zinc-400">{dst?.label || '?'}</span>
                  <span className="text-zinc-600 ml-auto">{pkt.size}B</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800/50 overflow-hidden" style={{ backgroundColor: '#0a0a15' }}>
        <div className="px-3 py-2 border-b border-zinc-800/50">
          <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Network Topology</span>
        </div>
        <div className="p-3">
          <svg viewBox="0 0 600 400" className="w-full h-auto" style={{ maxHeight: '250px' }}>
            {nodes.slice(0, 10).map((node) =>
              node.connections.map((connId) => {
                const target = nodes.find((n) => n.id === connId)
                if (!target) return null
                const statusColors: Record<string, string> = { active: '#22d3ee44', idle: '#52525244', warning: '#fbbf2444', critical: '#f8717144' }
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={node.x} y1={node.y}
                    x2={target.x} y2={target.y}
                    stroke={statusColors[node.status]}
                    strokeWidth="1"
                  />
                )
              })
            )}
            {nodes.slice(0, 10).map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x} cy={node.y} r="8"
                  fill={node.status === 'active' ? '#22d3ee' : node.status === 'idle' ? '#525252' : node.status === 'warning' ? '#fbbf24' : '#f87171'}
                  opacity="0.8"
                />
                <text x={node.x} y={node.y + 20} textAnchor="middle" fill="#71717a" fontSize="8">{node.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}
