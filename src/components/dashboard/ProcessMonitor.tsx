'use client'

import { useState, useEffect, useCallback } from 'react'

interface Process {
  pid: number
  name: string
  cpu: number
  mem: number
  user: string
  status: 'running' | 'sleeping' | 'stopped'
  started: Date
}

const processNames = ['init', 'sshd', 'nginx', 'snifferd', 'payload_server', 'crypto_miner', 'intrusion_detect', 'packet_capture', 'terminal_server', 'ai_assistant', 'firewall_d', 'monitor_d', 'proxy_d', 'dnsmasq', 'cron', 'syslog_d', 'db_server', 'web_server', 'vpn_d', 'scan_d']

export function ProcessMonitor() {
  const [processes, setProcesses] = useState<Process[]>(() => {
    const now = Date.now()
    const statuses: Array<'running' | 'sleeping' | 'stopped'> = ['running', 'sleeping', 'stopped']
    const users = ['root', 'operator', 'daemon', 'www-data']
    return Array.from({ length: 20 }, (_, i) => ({
      pid: i === 0 ? 1 : Math.floor((i * 997 + 13) % 30000) + 100,
      name: processNames[i] || `process_${i}`,
      cpu: ((i * 37) % 5000) / 100,
      mem: ((i * 53) % 3000) / 100,
      user: users[i % users.length],
      status: i < 3 ? 'running' as const : statuses[i % statuses.length],
      started: new Date(now - ((i * 997) % 86400000)),
    }))
  })
  const [sortBy, setSortBy] = useState<'cpu' | 'mem' | 'pid' | 'name'>('cpu')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 5),
          mem: Math.max(0, p.mem + (Math.random() - 0.5) * 2),
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const killProcess = useCallback((pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid))
  }, [])

  const sorted = [...processes]
    .filter((p) => !filter || p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'cpu') return b.cpu - a.cpu
      if (sortBy === 'mem') return b.mem - a.mem
      if (sortBy === 'pid') return a.pid - b.pid
      return a.name.localeCompare(b.name)
    })

  const statusColors: Record<string, string> = { running: 'text-green-400', sleeping: 'text-yellow-400', stopped: 'text-red-400' }
  const totalCpu = processes.reduce((s, p) => s + p.cpu, 0)
  const totalMem = processes.reduce((s, p) => s + p.mem, 0)

  return (
    <div className="h-full overflow-auto p-3 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="rounded p-2 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-600 text-[10px]">Processes</div>
          <div className="text-sm text-cyan-400">{processes.length}</div>
        </div>
        <div className="rounded p-2 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-600 text-[10px]">CPU Total</div>
          <div className="text-sm text-green-400">{totalCpu.toFixed(1)}%</div>
        </div>
        <div className="rounded p-2 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-600 text-[10px]">MEM Total</div>
          <div className="text-sm text-purple-400">{totalMem.toFixed(1)}%</div>
        </div>
        <div className="rounded p-2 border border-zinc-800/50 text-center" style={{ backgroundColor: '#0a0a15' }}>
          <div className="text-zinc-600 text-[10px]">Running</div>
          <div className="text-sm text-green-400">{processes.filter((p) => p.status === 'running').length}</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Filter processes..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-2 px-2 py-1 rounded bg-black/30 border border-zinc-800 text-zinc-300 text-[11px] outline-none focus:border-cyan-800"
      />

      <div className="rounded-lg border border-zinc-800/50 overflow-hidden" style={{ backgroundColor: '#0a0a15' }}>
        <div className="flex items-center text-zinc-500 text-[10px] uppercase border-b border-zinc-800/50">
          <button onClick={() => setSortBy('pid')} className={`px-2 py-1.5 w-16 text-left ${sortBy === 'pid' ? 'text-cyan-400' : ''}`}>PID</button>
          <button onClick={() => setSortBy('name')} className={`px-2 py-1.5 flex-1 text-left ${sortBy === 'name' ? 'text-cyan-400' : ''}`}>Name</button>
          <button onClick={() => setSortBy('cpu')} className={`px-2 py-1.5 w-16 text-right ${sortBy === 'cpu' ? 'text-cyan-400' : ''}`}>CPU%</button>
          <button onClick={() => setSortBy('mem')} className={`px-2 py-1.5 w-16 text-right ${sortBy === 'mem' ? 'text-cyan-400' : ''}`}>MEM%</button>
          <div className="px-2 py-1.5 w-20 text-center">Status</div>
          <div className="w-10" />
        </div>
        {sorted.map((p) => (
          <div key={p.pid} className="flex items-center text-[11px] border-b border-zinc-800/20 hover:bg-white/5">
            <div className="px-2 py-1 w-16 text-zinc-400">{p.pid}</div>
            <div className="px-2 py-1 flex-1 text-zinc-300">{p.name}</div>
            <div className="px-2 py-1 w-16 text-right text-green-400">{p.cpu.toFixed(1)}</div>
            <div className="px-2 py-1 w-16 text-right text-purple-400">{p.mem.toFixed(1)}</div>
            <div className={`px-2 py-1 w-20 text-center ${statusColors[p.status]}`}>{p.status}</div>
            <button
              onClick={() => killProcess(p.pid)}
              className="px-2 py-1 text-zinc-600 hover:text-red-400 transition-colors"
              title="Kill process"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
