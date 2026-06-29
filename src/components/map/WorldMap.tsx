'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface GeoPoint {
  x: number
  y: number
  label: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  connections: number
}

interface Connection {
  from: number
  to: number
  active: boolean
}

const locations: GeoPoint[] = [
  { x: 0.22, y: 0.35, label: 'North America', severity: 'medium', connections: 0 },
  { x: 0.50, y: 0.30, label: 'Europe', severity: 'low', connections: 0 },
  { x: 0.55, y: 0.45, label: 'Middle East', severity: 'critical', connections: 0 },
  { x: 0.62, y: 0.38, label: 'Russia', severity: 'high', connections: 0 },
  { x: 0.70, y: 0.25, label: 'East Asia', severity: 'medium', connections: 0 },
  { x: 0.85, y: 0.40, label: 'Southeast Asia', severity: 'low', connections: 0 },
  { x: 0.30, y: 0.55, label: 'South America', severity: 'low', connections: 0 },
  { x: 0.52, y: 0.60, label: 'Africa', severity: 'medium', connections: 0 },
  { x: 0.42, y: 0.35, label: 'UK', severity: 'high', connections: 0 },
  { x: 0.68, y: 0.48, label: 'India', severity: 'low', connections: 0 },
]

const severityColors: Record<string, string> = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' }

export function WorldMap() {
  const [points, setPoints] = useState<GeoPoint[]>(locations)
  const [connections, setConnections] = useState<Connection[]>(() => {
    const conns: Connection[] = []
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        if ((i * 7 + j * 13) % 10 > 6) {
          conns.push({ from: i, to: j, active: (i * 3 + j * 5) % 2 === 0 })
        }
      }
    }
    return conns
  })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const panStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setConnections((prev) =>
        prev.map((c) => ({ ...c, active: Math.random() > 0.4 }))
      )
      setPoints((prev) =>
        prev.map((p) => ({
          ...p,
          connections: Math.floor(Math.random() * 1000 + 100),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001)))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true)
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y })
    }
  }, [isPanning])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const w = 800
  const h = 500

  return (
    <div
      className="h-full overflow-hidden font-mono text-xs"
      style={{ backgroundColor: '#050510', cursor: isPanning ? 'grabbing' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Threat Map</div>
        <span className="text-[10px] text-zinc-700">Zoom: {Math.round(zoom * 100)}%</span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full"
        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
      >
        <rect x="0" y="0" width={w} height={h} fill="#050510" />

        <ellipse cx={w * 0.35} cy={h * 0.35} rx={w * 0.25} ry={h * 0.15} fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
        <ellipse cx={w * 0.65} cy={h * 0.35} rx={w * 0.2} ry={h * 0.12} fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
        <ellipse cx={w * 0.50} cy={h * 0.55} rx={w * 0.15} ry={h * 0.2} fill="none" stroke="rgba(34,211,238,0.03)" strokeWidth="0.5" />

        <g opacity="0.1">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`grid-${i}`} x1={0} y1={(h / 20) * i} x2={w} y2={(h / 20) * i} stroke="#22d3ee" strokeWidth="0.3" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`gridv-${i}`} x1={(w / 32) * i} y1={0} x2={(w / 32) * i} y2={h} stroke="#22d3ee" strokeWidth="0.3" />
          ))}
        </g>

        {connections.map((conn, idx) => {
          const from = points[conn.from]
          const to = points[conn.to]
          const fx = conn.from < 5 ? from.x * w : from.x * w
          const fy = from.y * h
          const tx = to.x * w
          const ty = to.y * h
          return (
            <g key={idx}>
              <line
                x1={fx} y1={fy} x2={tx} y2={ty}
                stroke={conn.active ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)'}
                strokeWidth={conn.active ? 1 : 0.5}
              />
              {conn.active && (
                <circle r="2" fill="#22d3ee" opacity="0.6">
                  <animateMotion dur={`${2 + (idx % 3)}s`} repeatCount="indefinite" path={`M${fx},${fy} L${tx},${ty}`} />
                </circle>
              )}
            </g>
          )
        })}

        {points.map((point, idx) => (
          <g key={idx}>
            <circle
              cx={point.x * w}
              cy={point.y * h}
              r={6 + (idx % 3)}
              fill={severityColors[point.severity]}
              opacity="0.8"
            >
              <animate attributeName="r" values={`${6};${8};${6}`} dur={`${2 + (idx % 4)}s`} repeatCount="indefinite" />
            </circle>
            <circle
              cx={point.x * w}
              cy={point.y * h}
              r="12"
              fill="none"
              stroke={severityColors[point.severity]}
              opacity="0.2"
            >
              <animate attributeName="r" values="12;24;12" dur={`${3 + (idx % 5)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur={`${3 + (idx % 4)}s`} repeatCount="indefinite" />
            </circle>
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
              {point.connections.toLocaleString()} conns
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
