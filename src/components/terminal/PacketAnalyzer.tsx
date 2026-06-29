'use client'

import { useEffect, useState, useMemo } from 'react'
import { useNetworkStore } from '@/lib/stores/networkStore'

interface PacketDetail {
  time: string
  source: string
  dest: string
  protocol: string
  length: number
  info: string
  raw: string
}

const protocolColors: Record<string, string> = {
  TCP: '#4895ef',
  UDP: '#ff9f1c',
  ICMP: '#e63946',
  HTTP: '#2dc653',
  HTTPS: '#00b4d8',
  DNS: '#b537f2',
  SSH: '#f72585',
  FTP: '#ff6b6b',
  ARP: '#95d5b2',
  TLS: '#00b4d8',
}

export function PacketAnalyzer() {
  const { nodes, packets, isScanning, initialize, tick, startCapture, stopCapture, clearPackets } = useNetworkStore()
  const [filter, setFilter] = useState('')
  const [selectedPacket, setSelectedPacket] = useState<PacketDetail | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    initialize()
    const interval = setInterval(tick, 800)
    return () => clearInterval(interval)
  }, [initialize, tick])

  const packetDetails: PacketDetail[] = useMemo(() => {
    return packets.map((pkt) => {
      const src = nodes.find((n) => n.id === pkt.source)
      const dst = nodes.find((n) => n.id === pkt.target)
      return {
        time: new Date(pkt.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
        source: src?.ip ?? pkt.source,
        dest: dst?.ip ?? pkt.target,
        protocol: pkt.protocol,
        length: pkt.size,
        info: `${src?.label ?? '?'} → ${dst?.label ?? '?'} | ${pkt.protocol} | ${pkt.size} bytes`,
        raw: Array.from({ length: Math.floor(Math.random() * 32) + 16 }, () =>
          Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join(' '),
      }
    })
  }, [packets, nodes])

  const filtered = useMemo(() => {
    if (!filter) return packetDetails
    const lower = filter.toLowerCase()
    return packetDetails.filter(
      (p) =>
        p.source.includes(lower) ||
        p.dest.includes(lower) ||
        p.protocol.toLowerCase().includes(lower) ||
        p.info.toLowerCase().includes(lower)
    )
  }, [packetDetails, filter])

  return (
    <div className="h-full flex font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      {/* Packet List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="flex items-center justify-between px-3 py-1.5 border-b text-[10px] shrink-0"
          style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
        >
          <span style={{ color: 'var(--soc-text-muted)' }}>
            {packets.length} packets captured
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter packets..."
              className="w-48 px-2 py-0.5 rounded text-[10px] border outline-none"
              style={{
                backgroundColor: 'var(--soc-bg)',
                borderColor: 'var(--soc-border)',
                color: 'var(--soc-text)',
              }}
            />
            <button
              onClick={isScanning ? stopCapture : startCapture}
              className="px-2 py-0.5 rounded text-[10px] transition-colors"
              style={{
                backgroundColor: isScanning ? 'rgba(230, 57, 70, 0.2)' : 'rgba(45, 198, 83, 0.2)',
                color: isScanning ? 'var(--soc-danger)' : 'var(--soc-success)',
              }}
            >
              {isScanning ? 'STOP' : 'CAPTURE'}
            </button>
            <button
              onClick={clearPackets}
              className="px-2 py-0.5 rounded text-[10px] transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--soc-text-muted)' }}
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div
          className="flex items-center text-[9px] font-bold tracking-wider px-3 py-1 border-b shrink-0 uppercase"
          style={{
            borderColor: 'var(--soc-border)',
            color: 'var(--soc-text-muted)',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <div className="w-24">Time</div>
          <div className="w-32">Source</div>
          <div className="w-32">Destination</div>
          <div className="w-16">Protocol</div>
          <div className="w-16">Length</div>
          <div className="flex-1">Info</div>
        </div>

        {/* Packet Rows */}
        <div className="flex-1 overflow-y-auto soc-scrollbar">
          {(autoScroll ? filtered : filtered).slice(-500).map((pkt, i) => (
            <div
              key={i}
              onClick={() => setSelectedPacket(pkt)}
              className="flex items-center text-[10px] px-3 py-0.5 border-b cursor-pointer transition-colors"
              style={{
                borderColor: 'rgba(30, 42, 54, 0.3)',
                backgroundColor: selectedPacket === pkt ? 'rgba(0, 180, 216, 0.05)' : 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  selectedPacket === pkt ? 'rgba(0, 180, 216, 0.05)' : 'transparent'
              }}
            >
              <div className="w-24" style={{ color: 'var(--soc-text-muted)' }}>{pkt.time}</div>
              <div className="w-32" style={{ color: 'var(--soc-text)' }}>{pkt.source}</div>
              <div className="w-32" style={{ color: 'var(--soc-text)' }}>{pkt.dest}</div>
              <div className="w-16 font-bold" style={{ color: protocolColors[pkt.protocol] || 'var(--soc-text)' }}>
                {pkt.protocol}
              </div>
              <div className="w-16" style={{ color: 'var(--soc-text-muted)' }}>{pkt.length}</div>
              <div className="flex-1 truncate" style={{ color: 'var(--soc-text-muted)' }}>{pkt.info}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Packet Details Panel */}
      {selectedPacket && (
        <div
          className="w-96 flex flex-col border-l overflow-hidden shrink-0"
          style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
        >
          <div
            className="flex items-center justify-between px-3 py-1.5 border-b text-[10px] font-bold tracking-wider shrink-0"
            style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-accent)' }}
          >
            PACKET DETAILS
            <button
              onClick={() => setSelectedPacket(null)}
              className="text-[10px] px-1"
              style={{ color: 'var(--soc-text-muted)' }}
            >
              x
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[10px] soc-scrollbar">
            <div>
              <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--soc-text-muted)' }}>Frame</div>
              <div className="space-y-0.5" style={{ color: 'var(--soc-text)' }}>
                <div>Time: {selectedPacket.time}</div>
                <div>Length: {selectedPacket.length} bytes</div>
                <div>Protocol: {selectedPacket.protocol}</div>
              </div>
            </div>
            <div>
              <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--soc-text-muted)' }}>Ethernet</div>
              <div className="space-y-0.5" style={{ color: 'var(--soc-text)' }}>
                <div>Source: 00:1a:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}</div>
                <div>Dest: 00:1b:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}:{(Math.random() * 256 | 0).toString(16).padStart(2, '0')}</div>
                <div>Type: IPv4 (0x0800)</div>
              </div>
            </div>
            <div>
              <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--soc-text-muted)' }}>Internet Protocol</div>
              <div className="space-y-0.5" style={{ color: 'var(--soc-text)' }}>
                <div>Source: {selectedPacket.source}</div>
                <div>Destination: {selectedPacket.dest}</div>
                <div>TTL: {Math.floor(Math.random() * 128) + 64}</div>
              </div>
            </div>
            <div>
              <div className="uppercase tracking-wider mb-1" style={{ color: 'var(--soc-text-muted)' }}>Raw</div>
              <pre
                className="p-2 rounded text-[9px] overflow-x-auto leading-relaxed"
                style={{ backgroundColor: 'var(--soc-bg)', color: 'var(--soc-text-muted)' }}
              >
                {selectedPacket.raw.match(/.{1,48}/g)?.join('\n') ?? selectedPacket.raw}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
