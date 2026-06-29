'use client'

import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

interface XtermComponentProps {
  onCommand: (command: string) => void
  onData?: (data: string) => void
  prompt?: string
}

export function XtermComponent({ onCommand, prompt = 'operator@soc:~$ ' }: XtermComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const currentLine = useRef('')
  const cursorPos = useRef(0)
  const commandHistory = useRef<string[]>([])
  const historyIndex = useRef(-1)

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      fontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace",
      theme: {
        background: '#0a0e14',
        foreground: '#b3c4d4',
        cursor: '#00b4d8',
        selectionBackground: '#00b4d840',
        black: '#1e2a36',
        red: '#e63946',
        green: '#2dc653',
        yellow: '#ff9f1c',
        blue: '#4895ef',
        magenta: '#b537f2',
        cyan: '#00b4d8',
        white: '#b3c4d4',
        brightBlack: '#6a7d8e',
        brightRed: '#ff0040',
        brightGreen: '#40ff80',
        brightYellow: '#ffc040',
        brightBlue: '#40a0ff',
        brightMagenta: '#c060ff',
        brightCyan: '#40d0ff',
        brightWhite: '#ffffff',
      },
      allowTransparency: false,
      convertEol: true,
      disableStdin: false,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    fitAddonRef.current = fitAddon

    term.open(terminalRef.current)
    terminalInstance.current = term

    const writePrompt = () => {
      term.write(`\r\n${prompt}`)
      currentLine.current = ''
      cursorPos.current = 0
    }

    term.write(`\x1b[36mCyber Operations Center Terminal v0.1.0\x1b[0m`)
    term.write(`\r\n\x1b[2mType 'help' for available commands\x1b[0m`)
    term.write(`\r\n${prompt}`)

    let isEsc = false

    term.onData((data: string) => {
      if (data === '\x1b') {
        isEsc = true
        return
      }

      if (isEsc) {
        isEsc = false
        if (data === '[') return
        if (data === '[A') {
          if (commandHistory.current.length > 0) {
            const newIdx = historyIndex.current === -1
              ? commandHistory.current.length - 1
              : Math.max(0, historyIndex.current - 1)
            historyIndex.current = newIdx
            const cmd = commandHistory.current[newIdx]
            while (cursorPos.current > 0) {
              term.write('\b \b')
              cursorPos.current--
            }
            for (let i = 0; i < currentLine.current.length; i++) {
              term.write('\b \b')
            }
            term.write(cmd)
            currentLine.current = cmd
            cursorPos.current = cmd.length
          }
          return
        }
        if (data === '[B') {
          if (historyIndex.current !== -1) {
            historyIndex.current++
            if (historyIndex.current >= commandHistory.current.length) {
              historyIndex.current = -1
              while (cursorPos.current > 0) {
                term.write('\b \b')
                cursorPos.current--
              }
              for (let i = 0; i < currentLine.current.length; i++) {
                term.write('\b \b')
              }
              currentLine.current = ''
              cursorPos.current = 0
            } else {
              const cmd = commandHistory.current[historyIndex.current]
              while (cursorPos.current > 0) {
                term.write('\b \b')
                cursorPos.current--
              }
              for (let i = 0; i < currentLine.current.length; i++) {
                term.write('\b \b')
              }
              term.write(cmd)
              currentLine.current = cmd
              cursorPos.current = cmd.length
            }
          }
          return
        }
        return
      }

      if (data === '\r') {
        const cmd = currentLine.current.trim()
        if (cmd) {
          commandHistory.current.push(cmd)
          historyIndex.current = -1
        }
        onCommand(cmd)
        currentLine.current = ''
        cursorPos.current = 0
        return
      }

      if (data === '\x7f') {
        if (cursorPos.current > 0) {
          const before = currentLine.current.slice(0, cursorPos.current - 1)
          const after = currentLine.current.slice(cursorPos.current)
          currentLine.current = before + after
          cursorPos.current--
          term.write('\b')
          term.write(after + ' ')
          term.write('\b'.repeat(after.length + 1))
        }
        return
      }

      if (data === '\t') {
        return
      }

      if (data.length === 1 && data.charCodeAt(0) >= 32) {
        const before = currentLine.current.slice(0, cursorPos.current)
        const after = currentLine.current.slice(cursorPos.current)
        currentLine.current = before + data + after
        cursorPos.current++
        term.write(data + after)
        if (after.length > 0) {
          term.write('\b'.repeat(after.length))
        }
      }
    })

    const handleResize = () => {
      setTimeout(() => fitAddon.fit(), 0)
    }
    window.addEventListener('resize', handleResize)
    setTimeout(() => fitAddon.fit(), 50)

    return () => {
      term.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [onCommand, prompt])

  return (
    <div ref={terminalRef} className="h-full w-full" />
  )
}
