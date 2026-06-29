'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useTerminalStore } from '@/lib/stores/terminalStore'
import { useProfileStore } from '@/lib/stores/profileStore'
import { useSound } from '@/components/sound/SoundProvider'
import { executeCommand } from '@/lib/utils/terminalCommands'
import { terminalThemes } from '@/lib/data/terminalThemes'

export function TerminalPanel() {
  const { sessions, activeSessionId, sessionTabs, createSession, appendLine, clearSession, setActiveSession, addToHistory, closeSession } = useTerminalStore()
  const { settings } = useProfileStore()
  const { playKeystroke, playSuccess, playError } = useSound()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)

  useEffect(() => {
    if (!activeSessionId) {
      const id = createSession()
      setActiveSession(id)
    }
  }, [activeSessionId, createSession, setActiveSession])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sessions])

  const session = activeSessionId ? sessions.get(activeSessionId) : null

  const theme = terminalThemes.find((t) => t.name === settings.terminalTheme) || terminalThemes[0]

  const handleCommand = useCallback((cmd: string) => {
    if (!activeSessionId || !session) return
    const trimmed = cmd.trim()
    if (!trimmed) return

    addToHistory(activeSessionId, trimmed)
    setCurrentHistoryIndex(-1)

    appendLine(activeSessionId, {
      id: `cmd-${Date.now()}`,
      type: 'input',
      content: `${session.cwd} $ ${trimmed}`,
      timestamp: Date.now(),
    })

    if (trimmed === 'clear') {
      clearSession(activeSessionId)
      return
    }

    const results = executeCommand(trimmed, session.cwd)

    if (results.length === 0 && trimmed === 'clear') {
      clearSession(activeSessionId)
      return
    }

    results.forEach((line) => {
      appendLine(activeSessionId, line)
    })

    const hasSuccess = results.some((r) => r.type === 'success')
    const hasError = results.some((r) => r.type === 'error')
    if (hasSuccess) playSuccess()
    else if (hasError) playError()
  }, [activeSessionId, session, addToHistory, appendLine, clearSession, playSuccess, playError])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!session) return

    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const history = session.commandHistory
      if (history.length === 0) return
      const newIndex = currentHistoryIndex === -1 ? 0 : Math.min(currentHistoryIndex + 1, history.length - 1)
      setCurrentHistoryIndex(newIndex)
      setInput(history[newIndex])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const history = session.commandHistory
      if (currentHistoryIndex <= 0) {
        setCurrentHistoryIndex(-1)
        setInput('')
        return
      }
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setInput(history[newIndex])
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const suggestions = ['help', 'clear', 'scan', 'trace', 'whoami', 'ls', 'cd ', 'pwd', 'cat ', 'neofetch', 'ping ', 'ifconfig', 'ps', 'date', 'echo ', 'ai ', 'analyze ', 'monitor ', 'nmap ', 'nslookup ', 'tcpdump ', 'wireshark ', 'grep ', 'tail ', 'head ', 'ss ', 'iptables ']
      const match = suggestions.find((s) => s.startsWith(input))
      if (match) setInput(match)
    }
  }, [session, input, currentHistoryIndex, handleCommand])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    playKeystroke()
  }, [playKeystroke])

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  if (!session) return null

  return (
    <div
      className="h-full overflow-hidden flex flex-col cursor-text font-mono"
      style={{ backgroundColor: theme.background, color: theme.foreground, fontSize: `${settings.fontSize}px` }}
      onClick={handleTerminalClick}
    >
      {sessionTabs.length > 1 && (
        <div className="flex items-center gap-0.5 px-2 pt-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {sessionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSession(tab.id)}
              className={`px-3 py-1 text-[11px] rounded-t transition-colors ${
                tab.id === activeSessionId
                  ? 'bg-white/5 text-cyan-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              <span
                onClick={(e) => { e.stopPropagation(); closeSession(tab.id) }}
                className="ml-2 opacity-50 hover:opacity-100"
              >
                ×
              </span>
            </button>
          ))}
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5 scroll-smooth">
        {session.lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-all ${
              line.type === 'input' ? 'opacity-90' :
              line.type === 'error' ? 'text-red-400' :
              line.type === 'success' ? 'text-green-400' :
              line.type === 'system' ? 'text-zinc-500' :
              'opacity-80'
            }`}
          >
            {line.content}
          </div>
        ))}
      </div>
      <div className="flex items-center px-3 py-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <span className="mr-2 shrink-0 text-xs opacity-70">{session.cwd} $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-inherit"
          style={{ caretColor: theme.cursor }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  )
}
