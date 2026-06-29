'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '@/lib/stores/windowStore'
import type { WindowState } from '@/lib/types'

interface WindowProps {
  window: WindowState
  children: ReactNode
}

export function Window({ window: win, children }: WindowProps) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, moveWindow, resizeWindow } = useWindowStore()
  const dragRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, winX: 0, winY: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-window-handle]')) return
    focusWindow(win.id)
  }, [focusWindow, win.id])

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, winX: win.x, winY: win.y }
  }, [win.maximized, win.x, win.y])

  const handleTitleBarMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    moveWindow(win.id, dragStart.current.winX + dx, dragStart.current.winY + dy)
  }, [isDragging, moveWindow, win.id])

  const handleTitleBarMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeStart.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height }
  }, [win.width, win.height])

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!isResizing) return
    const dw = e.clientX - resizeStart.current.x
    const dh = e.clientY - resizeStart.current.y
    resizeWindow(win.id, Math.max(400, resizeStart.current.w + dw), Math.max(300, resizeStart.current.h + dh))
  }, [isResizing, resizeWindow, win.id])

  const handleResizeUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const iconMap: Record<string, string> = {
    terminal: '>_',
    network: '◎',
    threat: '⚠',
    diagnostics: '📊',
    files: '📁',
    processes: '⚙',
    map: '🗺',
    mission: '🎯',
    ai: '🤖',
    settings: '⚡',
  }

  return (
    <motion.div
      ref={dragRef}
      className="absolute overflow-hidden rounded-lg border border-zinc-700/50 shadow-2xl"
      style={{
        left: win.maximized ? 0 : win.x,
        top: win.maximized ? 0 : win.y,
        width: win.maximized ? '100%' : win.width,
        height: win.maximized ? '100%' : win.height,
        zIndex: win.zIndex,
        display: win.minimized ? 'none' : 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0f',
      }}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none"
        style={{ backgroundColor: '#14141f', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        onMouseDown={handleTitleBarMouseDown}
        onMouseMove={handleTitleBarMouseMove}
        onMouseUp={handleTitleBarMouseUp}
        onMouseLeave={handleTitleBarMouseUp}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400 font-mono">{iconMap[win.type] || '□'}</span>
          <span className="text-xs text-zinc-300 font-medium">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            data-window-handle
            onClick={() => minimizeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors flex items-center justify-center"
            aria-label="Minimize"
          >
            <span className="text-[8px] text-black font-bold leading-none">─</span>
          </button>
          <button
            data-window-handle
            onClick={() => maximizeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors flex items-center justify-center"
            aria-label="Maximize"
          >
            <span className="text-[8px] text-black font-bold leading-none">□</span>
          </button>
          <button
            data-window-handle
            onClick={() => closeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <span className="text-[8px] text-black font-bold leading-none">×</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
          style={{ cursor: 'se-resize' }}
          onMouseDown={handleResizeStart}
          onMouseMove={handleResizeMove}
          onMouseUp={handleResizeUp}
          onMouseLeave={handleResizeUp}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" className="absolute bottom-1 right-1">
            <path d="M0 8L8 0M0 4L4 8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}
