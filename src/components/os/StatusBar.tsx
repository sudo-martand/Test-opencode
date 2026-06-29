'use client'

import { useState, useEffect } from 'react'
import type { PanelId } from './Desktop'

interface StatusBarProps {
  operator: string
  activePanel: PanelId
}

export function StatusBar({ operator, activePanel }: StatusBarProps) {
  const [time, setTime] = useState(new Date())
  const [alertCount, setAlertCount] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<'online' | 'degraded' | 'offline'>('online')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount((prev) => Math.max(0, prev + Math.floor(Math.random() * 3 - 1)))
      setNetworkStatus(['online', 'online', 'online', 'degraded'][Math.floor(Math.random() * 4)] as typeof networkStatus)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const networkColors: Record<string, string> = {
    online: 'var(--soc-success)',
    degraded: 'var(--soc-warning)',
    offline: 'var(--soc-danger)',
  }

  return (
    <div
      className="h-7 flex items-center px-3 gap-3 text-[10px] font-mono border-t shrink-0 z-10 select-none"
      style={{
        backgroundColor: 'var(--soc-surface)',
        borderColor: 'var(--soc-border)',
        color: 'var(--soc-text-muted)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-soc-accent font-bold">SOC</span>
        <span className="text-soc-border">|</span>
        <span>{operator}</span>
        <span className="text-soc-border">|</span>
        <span className="text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>
          PANEL: {activePanel.toUpperCase()}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {alertCount > 0 && (
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]"
            style={{
              backgroundColor: 'rgba(230, 57, 70, 0.15)',
              color: 'var(--soc-danger)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-severity-pulse" style={{ backgroundColor: 'var(--soc-danger)' }} />
            {alertCount} ALERTS
          </span>
        )}
        <span className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: networkColors[networkStatus] }}
          />
          {networkStatus.toUpperCase()}
        </span>
        <span>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
