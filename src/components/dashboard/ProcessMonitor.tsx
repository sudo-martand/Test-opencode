'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface Process {
  pid: number
  name: string
  cpu: number
  mem: number
  user: string
  status: 'running' | 'sleeping' | 'stopped' | 'zombie'
  started: number
  threads: number
  priority: number
}

const processNames = [
  'systemd', 'sshd', 'nginx', 'snifferd', 'payload_server',
  'crypto_miner', 'intrusion_detect', 'packet_capture', 'terminal_server',
  'ai_assistant', 'firewalld', 'monitord', 'proxyd', 'dnsmasq',
  'cron', 'syslogd', 'mysqld', 'apache2', 'vpn_d', 'scand',
  'logrotate', 'dbus_d', 'networkd', 'resolved', 'timesyncd',
]

const users = ['root', 'operator', 'daemon', 'www-data', 'nobody', 'messagebus']

export function ProcessMonitor() {
  const [processes, setProcesses] = useState<Process[]>(() =>
    Array.from({ length: 25 }, (_, i) => ({
      pid: i === 0 ? 1 : Math.floor((i * 991 + 17) % 32768) + 100,
      name: processNames[i % processNames.length],
      cpu: ((i * 37) % 5000) / 100,
      mem: ((i * 53) % 3000) / 100,
      user: users[i % users.length],
      status: (['running', 'sleeping', 'stopped', 'zombie'] as const)[i < 4 ? 0 : i % 4],
      started: Date.now() - ((i * 997) % 86400000) - Math.floor(Math.random() * 3600000),
      threads: Math.floor(Math.random() * 32) + 1,
      priority: Math.floor(Math.random() * 20) - 5,
    }))
  )

  const [sortBy, setSortBy] = useState<'cpu' | 'mem' | 'pid' | 'name' | 'user'>('cpu')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 6)),
          mem: Math.max(0, Math.min(100, p.mem + (Math.random() - 0.5) * 0.5)),
          threads: Math.max(1, p.threads + Math.floor((Math.random() - 0.5) * 2)),
          status: Math.random() > 0.98
            ? (['running', 'sleeping', 'stopped'] as const)[Math.floor(Math.random() * 3)]
            : p.status,
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const killProcess = useCallback((pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid))
  }, [])

  const handleSort = useCallback((col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
  }, [sortBy])

  const sorted = useMemo(() => {
    let result = [...processes]
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (filter) {
      const lower = filter.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(lower) || p.user.toLowerCase().includes(lower) || p.pid.toString().includes(lower))
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'cpu') cmp = a.cpu - b.cpu
      else if (sortBy === 'mem') cmp = a.mem - b.mem
      else if (sortBy === 'pid') cmp = a.pid - b.pid
      else if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortBy === 'user') cmp = a.user.localeCompare(b.user)
      return sortDir === 'desc' ? -cmp : cmp
    })
    return result
  }, [processes, sortBy, sortDir, filter, statusFilter])

  const statusColors: Record<string, string> = {
    running: 'var(--soc-success)',
    sleeping: 'var(--soc-warning)',
    stopped: 'var(--soc-danger)',
    zombie: 'var(--soc-critical)',
  }

  const totals = useMemo(() => ({
    count: processes.length,
    cpu: processes.reduce((s, p) => s + p.cpu, 0),
    mem: processes.reduce((s, p) => s + p.mem, 0),
    running: processes.filter((p) => p.status === 'running').length,
  }), [processes])

  const SortIcon = ({ col }: { col: typeof sortBy }) => {
    if (sortBy !== col) return <span className="ml-0.5 opacity-30">↕</span>
    return <span className="ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      {/* Stats */}
      <div className="flex items-center gap-4 px-4 py-2 border-b text-[10px] shrink-0" style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          PROCESSES: <span style={{ color: 'var(--soc-accent)' }}>{totals.count}</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          CPU: <span style={{ color: 'var(--soc-success)' }}>{totals.cpu.toFixed(1)}%</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          MEM: <span style={{ color: 'var(--soc-info)' }}>{totals.mem.toFixed(1)}%</span>
        </span>
        <span style={{ color: 'var(--soc-text-muted)' }}>
          RUNNING: <span style={{ color: 'var(--soc-success)' }}>{totals.running}</span>
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b shrink-0" style={{ borderColor: 'var(--soc-border)' }}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, PID, or user..."
          className="flex-1 max-w-xs px-2 py-1 rounded text-[10px] border outline-none"
          style={{
            backgroundColor: 'var(--soc-bg)',
            borderColor: 'var(--soc-border)',
            color: 'var(--soc-text)',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-1 rounded text-[10px] border outline-none"
          style={{
            backgroundColor: 'var(--soc-bg)',
            borderColor: 'var(--soc-border)',
            color: 'var(--soc-text)',
          }}
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="sleeping">Sleeping</option>
          <option value="stopped">Stopped</option>
          <option value="zombie">Zombie</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="flex items-center text-[9px] font-bold tracking-wider px-4 py-1.5 border-b uppercase cursor-pointer shrink-0 select-none"
        style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-text-muted)', backgroundColor: 'rgba(0,0,0,0.2)' }}
      >
        <div className="w-16" onClick={() => handleSort('pid')}>PID<SortIcon col="pid" /></div>
        <div className="flex-1" onClick={() => handleSort('name')}>Name<SortIcon col="name" /></div>
        <div className="w-16 text-right" onClick={() => handleSort('cpu')}>CPU%<SortIcon col="cpu" /></div>
        <div className="w-16 text-right" onClick={() => handleSort('mem')}>MEM%<SortIcon col="mem" /></div>
        <div className="w-20 text-center">Status</div>
        <div className="w-16" onClick={() => handleSort('user')}>User<SortIcon col="user" /></div>
        <div className="w-12 text-center">Thr</div>
        <div className="w-12" />
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto soc-scrollbar">
        {sorted.map((p) => (
          <div
            key={p.pid}
            className="flex items-center text-[10px] px-4 py-0.5 border-b transition-colors"
            style={{ borderColor: 'rgba(30, 42, 54, 0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div className="w-16" style={{ color: 'var(--soc-text-muted)' }}>{p.pid}</div>
            <div className="flex-1" style={{ color: 'var(--soc-text)' }}>{p.name}</div>
            <div className="w-16 text-right font-mono" style={{ color: p.cpu > 50 ? 'var(--soc-danger)' : p.cpu > 20 ? 'var(--soc-warning)' : 'var(--soc-success)' }}>
              {p.cpu.toFixed(1)}
            </div>
            <div className="w-16 text-right font-mono" style={{ color: p.mem > 50 ? 'var(--soc-danger)' : p.mem > 20 ? 'var(--soc-warning)' : 'var(--soc-info)' }}>
              {p.mem.toFixed(1)}
            </div>
            <div className="w-20 text-center">
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase"
                style={{ backgroundColor: `${statusColors[p.status]}15`, color: statusColors[p.status] }}
              >
                {p.status}
              </span>
            </div>
            <div className="w-16" style={{ color: 'var(--soc-text-muted)' }}>{p.user}</div>
            <div className="w-12 text-center" style={{ color: 'var(--soc-text-muted)' }}>{p.threads}</div>
            <div className="w-12 text-center">
              <button
                onClick={() => killProcess(p.pid)}
                className="text-[9px] px-1 py-0.5 rounded transition-colors hover:bg-red-900/30"
                style={{ color: 'var(--soc-danger)' }}
              >
                KILL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
