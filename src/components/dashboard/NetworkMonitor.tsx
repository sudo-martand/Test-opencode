'use client'

import { useEffect, useState, useMemo } from 'react'
import { useNetworkStore } from '@/lib/stores/networkStore'

const protocolColors: Record<string, string> = {
  TCP: '#4895ef',
  UDP: '#ff9f1c',
  ICMP: '#e63946',
  HTTP: '#2dc653',
  HTTPS: '#00b4d8',
  DNS: '#b537f2',
  SSH: '#f72585',
  FTP: '#ff6b6b',
}

export function NetworkMonitor() {
  const { nodes, packets, isScanning, initialize, tick, startCapture, stopCapture, clearPackets } = useNetworkStore()
  const [filter, setFilter] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    initialize()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [initialize, tick])

  const stats = useMemo(() => {
    const totalBytes = packets.reduce((sum, p) => sum + p.size, 0)
    const protocolCounts: Record<string, number> = {}
    packets.forEach((p) => {
      protocolCounts[p.protocol] = (protocolCounts[p.protocol] || 0) + 1
    })
    const topProtocol = Object.entries(protocolCounts).sort(([, a], [, b]) => b - a)[0]
    return {
      totalBytes,
      totalPackets: packets.length,
      topProtocol: topProtocol ? `${topProtocol[0]} (${Math.round((topProtocol[1] / packets.length) * 100)}%)` : 'N/A',
      activeNodes: nodes.filter((n) => n.status === 'active').length,
      totalNodes: nodes.length,
    }
  }, [packets, nodes])

  const filteredPackets = useMemo(() => {
    if (!filter) return packets.slice(-100).reverse()
    const lower = filter.toLowerCase()
    return packets
      .slice(-100)
      .reverse()
      .filter((p) => {
        const src = nodes.find((n) => n.id === p.source)
        const dst = nodes.find((n) => n.id === p.target)
        const srcIp = src?.ip ?? ''
        const dstIp = dst?.ip ?? ''
        return (
          srcIp.includes(lower) ||
          dstIp.includes(lower) ||
          p.protocol.toLowerCase().includes(lower) ||
          p.size.toString().includes(lower)
        )
      })
  }, [packets, filter, nodes])

  return (
    <div className="h-full flex flex-col font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div className="flex items-center gap-4 px-4 py-2 border-b text-[10px] shrink-0" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          PACKETS: <span style={{ color: 'var(--soc-accent)' }}>{stats.totalPackets}</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          TRAFFIC: <span style={{ color: 'var(--soc-success)' }}>{(stats.totalBytes / 1024).toFixed(1)} KB</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          PROTO: <span style={{ color: 'var(--soc-warning)' }}>{stats.topProtocol}</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          NODES: <span style={{ color: 'var(--soc-info)' }}>{stats.activeNodes}/{stats.totalNodes}</span>
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" style={{ borderColor: 'var(--soc-border)' }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter packets..."
            className="w-56 px-2 py-1 rounded text-[10px] border outline-none"
            style={{
              backgroundColor: 'var(--soc-bg)',
              borderColor: 'var(--soc-border)',
              color: 'var(--soc-text)',
            }}
          />
          <label className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--soc-text-muted)' }}>
            <input type="checkbox" checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} />
            Auto-scroll
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isScanning ? stopCapture : startCapture}
            className="px-3 py-1 rounded text-[10px] font-medium transition-colors"
            style={{
              backgroundColor: isScanning ? 'rgba(230, 57, 70, 0.15)' : 'rgba(45, 198, 83, 0.15)',
              color: isScanning ? 'var(--soc-danger)' : 'var(--soc-success)',
              border: `1px solid ${isScanning ? 'var(--soc-danger)' : 'var(--soc-success)'}`,
            }}
          >
            {isScanning ? 'STOP' : 'CAPTURE'}
          </button>
          <button
            onClick={clearPackets}
            className="px-3 py-1 rounded text-[10px] transition-colors border"
            style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-text-muted)' }}
          >
            CLEAR
          </button>
        </div>
      </div>

      <div className="flex items-center text-[9px] font-bold tracking-wider px-4 py-1.5 border-b uppercase shrink-0" style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-text-muted)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="w-20">Time</div>
        <div className="w-32">Source</div>
        <div className="w-32">Destination</div>
        <div className="w-16">Protocol</div>
        <div className="w-16">Length</div>
        <div className="flex-1">Info</div>
      </div>

      <div className="flex-1 overflow-y-auto soc-scrollbar">
        {filteredPackets.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[11px]" style={{ color: 'var(--soc-text-muted)' }}>
            {isScanning ? 'Waiting for packets...' : 'Capture disabled. Click CAPTURE to start.'}
          </div>
        ) : (
          filteredPackets.map((pkt, i) => {
            const src = nodes.find((n) => n.id === pkt.source)
            const dst = nodes.find((n) => n.id === pkt.target)
            return (
              <div
                key={pkt.id}
                className="flex items-center text-[10px] px-4 py-0.5 border-b transition-colors"
                style={{ borderColor: 'rgba(30, 42, 54, 0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="w-20" style={{ color: 'var(--soc-text-muted)' }}>
                  {new Date(pkt.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="w-32" style={{ color: 'var(--soc-text)' }}>{src?.ip ?? pkt.source}</div>
                <div className="w-32" style={{ color: 'var(--soc-text)' }}>{dst?.ip ?? pkt.target}</div>
                <div className="w-16 font-semibold" style={{ color: protocolColors[pkt.protocol] || 'var(--soc-text)' }}>
                  {pkt.protocol}
                </div>
                <div className="w-16" style={{ color: 'var(--soc-text-muted)' }}>{pkt.size}</div>
                <div className="flex-1 truncate" style={{ color: 'var(--soc-text-muted)' }}>
                  {src?.label ?? '?'} → {dst?.label ?? '?'}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
