'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

interface GeoPoint {
  x: number
  y: number
  label: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  connections: number
  incidents: number
  type: 'origin' | 'target' | 'c2'
}

const locations: GeoPoint[] = [
  { x: 0.22, y: 0.32, label: 'North America', severity: 'medium', connections: 847, incidents: 12, type: 'target' },
  { x: 0.50, y: 0.28, label: 'Europe', severity: 'low', connections: 1203, incidents: 8, type: 'target' },
  { x: 0.55, y: 0.45, label: 'Middle East', severity: 'critical', connections: 456, incidents: 34, type: 'origin' },
  { x: 0.62, y: 0.38, label: 'Russia', severity: 'high', connections: 689, incidents: 21, type: 'origin' },
  { x: 0.72, y: 0.27, label: 'East Asia', severity: 'medium', connections: 934, incidents: 15, type: 'target' },
  { x: 0.84, y: 0.42, label: 'Southeast Asia', severity: 'low', connections: 512, incidents: 6, type: 'origin' },
  { x: 0.30, y: 0.55, label: 'South America', severity: 'low', connections: 345, incidents: 4, type: 'target' },
  { x: 0.52, y: 0.60, label: 'Africa', severity: 'medium', connections: 278, incidents: 9, type: 'target' },
  { x: 0.40, y: 0.33, label: 'UK', severity: 'high', connections: 567, incidents: 18, type: 'target' },
  { x: 0.68, y: 0.48, label: 'India', severity: 'low', connections: 423, incidents: 5, type: 'target' },
]

const severityColors: Record<string, string> = {
  low: '#2dc653',
  medium: '#ff9f1c',
  high: '#e63946',
  critical: '#ff0040',
}

export function WorldMap() {
  const [points, setPoints] = useState<GeoPoint[]>(locations)
  const [selectedPoint, setSelectedPoint] = useState<GeoPoint | null>(null)
  const [time, setTime] = useState(Date.now())
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
      setPoints((prev) =>
        prev.map((p) => ({
          ...p,
          connections: Math.max(0, p.connections + Math.floor((Math.random() - 0.5) * 50)),
          incidents: Math.max(0, p.incidents + (Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0)),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const w = 800
  const h = 500

  const connections = useMemo(() => {
    const conns: { from: GeoPoint; to: GeoPoint; active: boolean }[] = []
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if ((i * 7 + j * 13) % 10 > 5) {
          conns.push({
            from: points[i],
            to: points[j],
            active: Math.sin(time / 3000 + i * j) > 0.2,
          })
        }
      }
    }
    return conns
  }, [points, time])

  return (
    <div className="h-full flex font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div className="flex-1 relative overflow-hidden">
        {/* Header */}
        <div
          className="absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 rounded text-[9px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <span className="uppercase tracking-wider" style={{ color: 'var(--soc-text-muted)' }}>Geo-Threat Intelligence</span>
          <span style={{ color: 'var(--soc-text-muted)' }}>|</span>
          <span style={{ color: 'var(--soc-accent)' }}>{points.reduce((s, p) => s + p.incidents, 0)} INCIDENTS</span>
          <span style={{ color: 'var(--soc-text-muted)' }}>|</span>
          <span style={{ color: 'var(--soc-info)' }}>{points.reduce((s, p) => s + p.connections, 0).toLocaleString()} CONNECTIONS</span>
        </div>

        {/* Legend */}
        <div
          className="absolute top-2 right-2 z-10 px-2 py-1.5 rounded text-[9px] space-y-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          {(['critical', 'high', 'medium', 'low'] as const).map((sev) => (
            <div key={sev} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: severityColors[sev] }} />
              <span style={{ color: 'var(--soc-text-muted)', textTransform: 'uppercase' }}>{sev}</span>
            </div>
          ))}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full"
        >
          <rect x="0" y="0" width={w} height={h} fill="transparent" />

          {/* Grid lines */}
          <g opacity="0.05">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`hg-${i}`} x1={0} y1={(h / 10) * i} x2={w} y2={(h / 10) * i} stroke="#00b4d8" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`vg-${i}`} x1={(w / 16) * i} y1={0} x2={(w / 16) * i} y2={h} stroke="#00b4d8" strokeWidth="0.5" />
            ))}
          </g>

          {/* Connections */}
          {connections.map((conn, idx) => (
            <g key={idx}>
              <line
                x1={conn.from.x * w}
                y1={conn.from.y * h}
                x2={conn.to.x * w}
                y2={conn.to.y * h}
                stroke={conn.active ? 'rgba(0, 180, 216, 0.12)' : 'rgba(255,255,255,0.03)'}
                strokeWidth={conn.active ? 1 : 0.5}
                strokeDasharray={conn.active ? 'none' : '4,4'}
              />
            </g>
          ))}

          {/* Points */}
          {points.map((point, idx) => {
            const isSelected = selectedPoint === point
            return (
              <g
                key={idx}
                onClick={() => setSelectedPoint(isSelected ? null : point)}
                style={{ cursor: 'pointer' }}
              >
                {/* Severity ring */}
                <circle
                  cx={point.x * w}
                  cy={point.y * h}
                  r={8 + Math.min(point.incidents, 8)}
                  fill={severityColors[point.severity]}
                  opacity={isSelected ? 0.9 : 0.6}
                />
                {point.severity === 'critical' && (
                  <circle
                    cx={point.x * w}
                    cy={point.y * h}
                    r="14"
                    fill="none"
                    stroke="var(--soc-critical)"
                    opacity="0.3"
                    strokeWidth="1"
                  />
                )}
                {/* Label */}
                <text
                  x={point.x * w}
                  y={point.y * h - 12}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {point.label}
                </text>
                <text
                  x={point.x * w}
                  y={point.y * h + 18}
                  textAnchor="middle"
                  fill="#525252"
                  fontSize="7"
                  fontFamily="monospace"
                >
                  {point.incidents} incidents
                </text>
              </g>
            )
          })}
        </svg>

        {/* Selected Point Details */}
        {selectedPoint && (
          <div
            className="absolute bottom-2 left-2 z-10 rounded border p-2 text-[10px]"
            style={{
              backgroundColor: 'rgba(10, 14, 20, 0.95)',
              borderColor: severityColors[selectedPoint.severity],
            }}
          >
            <div className="font-bold mb-1" style={{ color: severityColors[selectedPoint.severity] }}>
              {selectedPoint.label.toUpperCase()}
            </div>
            <div className="space-y-0.5" style={{ color: 'var(--soc-text-muted)' }}>
              <div>Severity: {selectedPoint.severity.toUpperCase()}</div>
              <div>Connections: {selectedPoint.connections.toLocaleString()}</div>
              <div>Active Incidents: {selectedPoint.incidents}</div>
              <div>Classification: {selectedPoint.type === 'origin' ? 'Threat Origin' : selectedPoint.type === 'c2' ? 'C2 Infrastructure' : 'Target Region'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Panel */}
      <div
        className="w-64 border-l p-3 overflow-y-auto shrink-0 hidden lg:block"
        style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
      >
        <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'var(--soc-text-muted)' }}>
          REGION SUMMARY
        </div>
        <div className="space-y-2">
          {points
            .sort((a, b) => b.incidents - a.incidents)
            .map((point, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[10px] py-1 border-b"
                style={{ borderColor: 'rgba(30, 42, 54, 0.5)' }}
                onClick={() => setSelectedPoint(point)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: severityColors[point.severity] }}
                  />
                  <span style={{ color: 'var(--soc-text)' }}>{point.label}</span>
                </div>
                <div className="flex gap-3 text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>
                  <span>{point.incidents}</span>
                  <span>{point.connections.toLocaleString()}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
