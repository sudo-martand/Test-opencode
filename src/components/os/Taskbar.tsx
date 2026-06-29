'use client'

import { useState, useCallback } from 'react'
import { useWindowStore } from '@/lib/stores/windowStore'
import { useGameStore } from '@/lib/stores/gameStore'
import { useMissionStore } from '@/lib/stores/missionStore'
import type { WindowType } from '@/lib/types'

const appShortcuts: { type: WindowType; title: string; icon: string }[] = [
  { type: 'terminal', title: 'Terminal', icon: '>_' },
  { type: 'network', title: 'Network', icon: '◎' },
  { type: 'threat', title: 'Threats', icon: '⚠' },
  { type: 'diagnostics', title: 'Diagnostics', icon: '📊' },
  { type: 'files', title: 'Files', icon: '📁' },
  { type: 'processes', title: 'Processes', icon: '⚙' },
  { type: 'map', title: 'Map', icon: '🗺' },
  { type: 'mission', title: 'Missions', icon: '🎯' },
  { type: 'ai', title: 'AI', icon: '🤖' },
  { type: 'settings', title: 'Settings', icon: '⚡' },
]

export function Taskbar() {
  const { windows, openWindow, focusedWindowId, focusWindow, restoreWindow } = useWindowStore()
  const { profile } = useGameStore()
  const { missions } = useMissionStore()
  const [showApps, setShowApps] = useState(false)

  const activeMissions = missions.filter((m) => m.status === 'active')

  const handleAppClick = useCallback((app: typeof appShortcuts[0]) => {
    openWindow(app.type, app.title)
    setShowApps(false)
  }, [openWindow])

  const handleTaskClick = useCallback((windowId: string) => {
    const win = windows.find((w) => w.id === windowId)
    if (win?.minimized) {
      restoreWindow(windowId)
    } else {
      focusWindow(windowId)
    }
  }, [windows, restoreWindow, focusWindow])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center px-2 gap-1 z-[9999] select-none" style={{ backgroundColor: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setShowApps(!showApps)}
        className="flex items-center justify-center w-10 h-9 rounded hover:bg-white/10 transition-colors text-cyan-400 font-mono text-lg"
        title="Applications"
        aria-label="Applications"
      >
        ≡
      </button>

      {showApps && (
        <div
          className="fixed bottom-12 left-0 p-2 rounded-t-lg border border-zinc-700/50 grid grid-cols-5 gap-1"
          style={{ backgroundColor: '#0f0f1a' }}
        >
          {appShortcuts.map((app) => (
            <button
              key={app.type}
              onClick={() => handleAppClick(app)}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 transition-colors w-16"
            >
              <span className="text-lg text-cyan-400 font-mono">{app.icon}</span>
              <span className="text-[10px] text-zinc-400 truncate w-full text-center">{app.title}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => handleTaskClick(win.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors max-w-[150px] ${
              focusedWindowId === win.id ? 'bg-cyan-900/40 text-cyan-300' : 'text-zinc-400 hover:bg-white/5'
            }`}
          >
            <span className="text-xs opacity-70">
              {win.type === 'terminal' ? '>_' : win.type === 'network' ? '◎' : win.type === 'threat' ? '⚠' : '□'}
            </span>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        {activeMissions.length > 0 && (
          <span className="flex items-center gap-1 text-yellow-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            {activeMissions.length}
          </span>
        )}
        <span className="text-cyan-400/60 font-mono">LVL {profile.level}</span>
        <span className="font-mono text-zinc-600">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  )
}
