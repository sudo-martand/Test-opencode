'use client'

import { useState, useCallback, useMemo } from 'react'
import type { FileEntry } from '@/lib/types'
import { mockFilesystem } from '@/lib/data/mockFiles'

function FileTree({ entry, depth = 0, onSelect, selectedPath }: { entry: FileEntry; depth?: number; onSelect: (e: FileEntry) => void; selectedPath: string }) {
  const [expanded, setExpanded] = useState(depth < 2)

  const handleClick = useCallback(() => {
    if (entry.type === 'directory') {
      setExpanded(!expanded)
    }
    onSelect(entry)
  }, [entry, expanded, onSelect])

  const isSelected = selectedPath === entry.name

  const formatSize = (size?: number) => {
    if (!size) return ''
    if (size < 1024) return `${size}B`
    if (size < 1048576) return `${(size / 1024).toFixed(1)}K`
    return `${(size / 1048576).toFixed(1)}M`
  }

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-0.5 pr-2 rounded cursor-pointer text-[11px] transition-colors"
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          backgroundColor: isSelected ? 'rgba(0, 180, 216, 0.08)' : 'transparent',
        }}
        onClick={handleClick}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)' }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <span className="w-3 text-center shrink-0" style={{ color: 'var(--soc-text-muted)' }}>
          {entry.type === 'directory' ? (expanded ? '▾' : '▸') : ' '}
        </span>
        <span
          className={`text-[11px] ${entry.type === 'directory' ? 'font-semibold' : ''}`}
          style={{ color: entry.type === 'directory' ? 'var(--soc-accent)' : 'var(--soc-text)' }}
        >
          {entry.name}
          {entry.type === 'directory' && '/'}
        </span>
        <span className="ml-auto text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>
          {formatSize(entry.size)}
        </span>
      </div>
      {entry.type === 'directory' && expanded && entry.children && (
        <div>
          {entry.children.map((child, i) => (
            <FileTree
              key={`${child.name}-${i}`}
              entry={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatPermissions(perms: string): string {
  if (!perms) return '----------'
  return perms
}

function hexView(content: string): string {
  if (!content) return ''
  const bytes = new TextEncoder().encode(content)
  let result = ''
  for (let i = 0; i < bytes.length; i += 16) {
    const addr = i.toString(16).padStart(8, '0')
    const hex = Array.from(bytes.slice(i, i + 16))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
    const ascii = Array.from(bytes.slice(i, i + 16))
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('')
    result += `${addr}  ${hex.padEnd(47)}  ${ascii}\n`
  }
  return result
}

export function FileExplorer() {
  const [selected, setSelected] = useState<FileEntry | null>(null)
  const [showHex, setShowHex] = useState(false)
  const [selectedPath, setSelectedPath] = useState('')

  const handleSelect = useCallback((entry: FileEntry) => {
    setSelected(entry)
    setSelectedPath(entry.name)
  }, [])

  return (
    <div className="h-full flex font-mono" style={{ backgroundColor: 'var(--soc-bg)' }}>
      {/* Tree View */}
      <div
        className="w-72 overflow-y-auto border-r shrink-0 soc-scrollbar"
        style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 border-b text-[10px] uppercase tracking-wider shrink-0"
          style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-text-muted)' }}
        >
          FILE SYSTEM
          <span className="text-[9px]" style={{ color: 'var(--soc-text-muted)' }}>/</span>
        </div>
        <div className="p-1">
          <FileTree entry={mockFilesystem} onSelect={handleSelect} selectedPath={selectedPath} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Path Bar */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 border-b text-[10px] shrink-0"
          style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
        >
          <span style={{ color: 'var(--soc-text-muted)' }}>PATH:</span>
          <span style={{ color: 'var(--soc-accent)' }}>
            /{selected ? selected.name : ''}
          </span>
          <div className="flex-1" />
          {selected?.type === 'file' && (
            <button
              onClick={() => setShowHex(!showHex)}
              className="px-2 py-0.5 rounded text-[9px] transition-colors"
              style={{
                backgroundColor: showHex ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255,255,255,0.05)',
                color: showHex ? 'var(--soc-accent)' : 'var(--soc-text-muted)',
              }}
            >
              {showHex ? 'TEXT' : 'HEX'}
            </button>
          )}
        </div>

        {/* File Details */}
        <div className="flex-1 overflow-y-auto p-4 soc-scrollbar">
          {selected ? (
            <div className="space-y-4">
              <div className="text-sm font-bold" style={{ color: 'var(--soc-accent)' }}>
                {selected.name}
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--soc-text-muted)' }}>Type</span>
                  <span style={{ color: 'var(--soc-text)' }}>{selected.type.toUpperCase()}</span>
                </div>
                {selected.size !== undefined && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--soc-text-muted)' }}>Size</span>
                    <span style={{ color: 'var(--soc-text)' }}>{selected.size.toLocaleString()} bytes</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: 'var(--soc-text-muted)' }}>Modified</span>
                  <span style={{ color: 'var(--soc-text)' }}>{new Date(selected.modified).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--soc-text-muted)' }}>Permissions</span>
                  <span style={{ color: 'var(--soc-text)' }}>{formatPermissions(selected.permissions)}</span>
                </div>
              </div>
              {selected.type === 'directory' && selected.children && (
                <div className="text-[10px]" style={{ color: 'var(--soc-text-muted)' }}>
                  {selected.children.length} items
                </div>
              )}
              {selected.content && (
                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--soc-text-muted)' }}>
                    {showHex ? 'HEX DUMP' : 'CONTENT'}
                  </div>
                  <pre
                    className="rounded p-3 text-[11px] overflow-x-auto leading-relaxed"
                    style={{
                      backgroundColor: 'var(--soc-bg)',
                      color: showHex ? 'var(--soc-text-muted)' : 'var(--soc-text)',
                      border: `1px solid var(--soc-border)`,
                    }}
                  >
                    {showHex ? hexView(selected.content) : selected.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[11px]" style={{ color: 'var(--soc-text-muted)' }}>
              Select a file to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
