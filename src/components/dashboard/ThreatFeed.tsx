'use client'

import { useEffect, useState, useMemo } from 'react'
import { useNetworkStore } from '@/lib/stores/networkStore'

const severityConfig = {
  critical: { color: 'var(--soc-critical)', bg: 'rgba(255, 0, 64, 0.08)', label: 'CRITICAL', order: 0 },
  high: { color: 'var(--soc-danger)', bg: 'rgba(230, 57, 70, 0.08)', label: 'HIGH', order: 1 },
  medium: { color: 'var(--soc-warning)', bg: 'rgba(255, 159, 28, 0.08)', label: 'MEDIUM', order: 2 },
  low: { color: 'var(--soc-success)', bg: 'rgba(45, 198, 83, 0.08)', label: 'LOW', order: 3 },
}

const typeIcons: Record<string, string> = {
  scan: 'SCN',
  breach: 'BRC',
  malware: 'MAL',
  ddos: 'DDS',
  phishing: 'PHI',
  anomaly: 'ANM',
}

export function ThreatFeed() {
  const { threatEvents, initialize, tick } = useNetworkStore()
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    initialize()
    const interval = setInterval(tick, 1500)
    return () => clearInterval(interval)
  }, [initialize, tick])

  const stats = useMemo(() => {
    const critical = threatEvents.filter((e) => e.severity === 'critical').length
    const high = threatEvents.filter((e) => e.severity === 'high').length
    const unmitigated = threatEvents.filter((e) => !e.mitigated).length
    return { critical, high, unmitigated, total: threatEvents.length }
  }, [threatEvents])

  const filtered = useMemo(() => {
    let result = [...threatEvents].reverse()
    if (severityFilter !== 'all') {
      result = result.filter((e) => e.severity === severityFilter)
    }
    if (statusFilter === 'mitigated') {
      result = result.filter((e) => e.mitigated)
    } else if (statusFilter === 'active') {
      result = result.filter((e) => !e.mitigated)
    }
    return result
  }, [threatEvents, severityFilter, statusFilter])

  return (
    <div className="h-full flex flex-col font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      {/* Stats */}
      <div className="flex items-center gap-4 px-4 py-2 border-b text-[10px] shrink-0" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
        {stats.critical > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-severity-pulse" style={{ backgroundColor: 'var(--soc-critical)' }} />
            <span style={{ color: 'var(--soc-critical)' }}>{stats.critical} CRITICAL</span>
          </span>
        )}
        {stats.high > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--soc-danger)' }} />
            <span style={{ color: 'var(--soc-danger)' }}>{stats.high} HIGH</span>
          </span>
        )}
        <span style={{ color: 'var(--soc-text-muted)' }}>
          {stats.unmitigated} ACTIVE / {stats.total} TOTAL
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b shrink-0" style={{ borderColor: 'var(--soc-border)' }}>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-2 py-1 rounded text-[10px] border outline-none"
          style={{ backgroundColor: 'var(--soc-bg)', borderColor: 'var(--soc-border)', color: 'var(--soc-text)' }}
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-1 rounded text-[10px] border outline-none"
          style={{ backgroundColor: 'var(--soc-bg)', borderColor: 'var(--soc-border)', color: 'var(--soc-text)' }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="mitigated">Mitigated</option>
        </select>
        <div className="flex-1" />
        <span className="text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>
          {filtered.length} events
        </span>
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto soc-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[11px]" style={{ color: 'var(--soc-text-muted)' }}>
            No threat events detected
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filtered.map((event) => {
              const sev = severityConfig[event.severity]
              const isExpanded = expandedId === event.id
              return (
                <div
                  key={event.id}
                  className="rounded border transition-colors cursor-pointer"
                  style={{
                    borderColor: event.mitigated ? 'var(--soc-border)' : sev.color,
                    backgroundColor: sev.bg,
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                >
                  <div className="flex items-start gap-3 p-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: `${sev.color}20`, color: sev.color }}
                    >
                      {typeIcons[event.type] || '???'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ backgroundColor: `${sev.color}20`, color: sev.color }}
                        >
                          {sev.label}
                        </span>
                        <span className="text-[10px] uppercase" style={{ color: 'var(--soc-text-muted)' }}>{event.type}</span>
                        {event.mitigated && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(45, 198, 83, 0.15)', color: 'var(--soc-success)' }}>
                            MITIGATED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--soc-text)' }}>{event.description}</div>
                      <div className="flex items-center gap-3 mt-1 text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>
                        <span>SRC: {event.source}</span>
                        <span>→</span>
                        <span>DST: {event.target}</span>
                        <span className="ml-auto">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t text-[10px]" style={{ borderColor: 'var(--soc-border)' }}>
                      <div className="mt-2 space-y-1" style={{ color: 'var(--soc-text-muted)' }}>
                        <div>Event ID: {event.id}</div>
                        <div>Timestamp: {new Date(event.timestamp).toISOString()}</div>
                        <div>Source IP: {event.source}</div>
                        <div>Target IP: {event.target}</div>
                        <div>Status: {event.mitigated ? 'Mitigated' : 'Active'}</div>
                        <div>Classification: {event.type.toUpperCase()}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
