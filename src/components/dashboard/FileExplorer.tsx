'use client'

import { useState, useCallback } from 'react'
import type { FileEntry } from '@/lib/types'
import { mockFilesystem } from '@/lib/data/mockFiles'

function FileTree({ entry, depth = 0, onSelect }: { entry: FileEntry; depth?: number; onSelect: (e: FileEntry) => void }) {
  const [expanded, setExpanded] = useState(depth < 1)

  const handleClick = useCallback(() => {
    if (entry.type === 'directory') {
      setExpanded(!expanded)
    }
    onSelect(entry)
  }, [entry, expanded, onSelect])

  const formatSize = (size?: number) => {
    if (!size) return ''
    if (size < 1024) return `${size}B`
    if (size < 1048576) return `${(size / 1024).toFixed(1)}K`
    return `${(size / 1048576).toFixed(1)}M`
  }

  return (
    <div>
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer text-xs"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        <span className="text-zinc-600 w-4 text-center">
          {entry.type === 'directory' ? (expanded ? '▼' : '▶') : '○'}
        </span>
        <span className={entry.type === 'directory' ? 'text-cyan-400' : 'text-zinc-300'}>{entry.name}</span>
        <span className="ml-auto text-zinc-600 text-[10px]">{formatSize(entry.size)}</span>
      </div>
      {entry.type === 'directory' && expanded && entry.children && (
        <div>
          {entry.children.map((child, i) => (
            <FileTree key={`${child.name}-${i}`} entry={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  const [selected, setSelected] = useState<FileEntry | null>(null)

  const handleSelect = useCallback((entry: FileEntry) => {
    setSelected(entry)
  }, [])

  return (
    <div className="h-full flex font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="w-1/2 overflow-auto border-r border-zinc-800/50 p-2">
        <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2 px-2">File System</div>
        <FileTree entry={mockFilesystem} onSelect={handleSelect} />
      </div>
      <div className="w-1/2 overflow-auto p-3">
        {selected ? (
          <div>
            <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-3">{selected.name}</div>
            <div className="space-y-1.5 text-zinc-500">
              <div className="flex justify-between"><span>Type</span><span className="text-zinc-300">{selected.type}</span></div>
              {selected.size && <div className="flex justify-between"><span>Size</span><span className="text-zinc-300">{selected.size} bytes</span></div>}
              <div className="flex justify-between"><span>Modified</span><span className="text-zinc-300">{new Date(selected.modified).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Permissions</span><span className="text-zinc-300">{selected.permissions}</span></div>
              {selected.content && (
                <div className="mt-3">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Preview</div>
                  <pre className="text-zinc-400 bg-black/30 rounded p-2 text-[11px] overflow-x-auto whitespace-pre-wrap">{selected.content}</pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-[11px]">Select a file to view details</div>
        )}
      </div>
    </div>
  )
}
