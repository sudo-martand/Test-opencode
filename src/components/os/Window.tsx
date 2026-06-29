'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import type { WindowState } from '@/lib/types'

interface WindowProps {
  window: WindowState
  children: ReactNode
}

export function Window({ window: win, children }: WindowProps) {
  const [minimized, setMinimized] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    const event = new CustomEvent('close-panel', { detail: { id: win.id } })
    window.dispatchEvent(event)
  }, [win.id])

  if (minimized) return null

  return (
    <div
      ref={panelRef}
      className="flex flex-col rounded border overflow-hidden"
      style={{
        backgroundColor: 'var(--soc-surface)',
        borderColor: 'var(--soc-border)',
        height: '100%',
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b text-[11px] font-mono shrink-0 select-none"
        style={{
          backgroundColor: 'var(--soc-surface)',
          borderColor: 'var(--soc-border)',
          color: 'var(--soc-text-muted)',
        }}
      >
        <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--soc-accent)' }}>
          {win.title.toUpperCase()}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="w-5 h-5 rounded flex items-center justify-center text-[9px] transition-colors hover:bg-white/10"
            style={{ color: 'var(--soc-text-muted)' }}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            onClick={handleClose}
            className="w-5 h-5 rounded flex items-center justify-center text-[9px] transition-colors hover:bg-red-900/30"
            style={{ color: 'var(--soc-text-muted)' }}
            aria-label="Close"
          >
            x
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
