'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
}

const aiResponses: Record<string, string[]> = {
  scan: [
    'Initiating passive reconnaissance. Recommended approach: SYN stealth scan on target range. Key ports: 22, 80, 443, 3306, 8080.',
    'Network analysis: 24 live hosts detected. 6 hosts show misconfigured services suitable for entry.',
    'OS detection suggests Ubuntu 24.04 and CentOS 9 as primary targets.',
  ],
  breach: [
    'Analyzing attack vectors. Recommended: exploit unpatched Apache CVE-2025-2847 on port 80.',
    'Breach strategy: SQL injection on login form, escalate via misconfigured sudo permissions.',
    'Path identified: phishing credentials → VPN → lateral movement → domain admin. Success rate: 87%.',
  ],
  help: [
    'Capabilities:\n- Network reconnaissance planning\n- Vulnerability analysis\n- Exploit strategy recommendations\n- Threat intelligence briefings\n- Operation optimization',
    'Available modules:\n- Real-time threat analysis\n- Attack surface mapping\n- Vulnerability correlation\n- Exploit suggestion engine\n- Probability modeling',
  ],
  threat: [
    'ALERT: 3 high-severity threats require immediate attention. Targeted attack campaign in progress.',
    'Threat update: APT-47 observed targeting similar infrastructure. Recommend defensive measures.',
    'Intrusion pattern analysis shows living-off-the-land techniques. Correlate with EDR telemetry.',
  ],
  default: [
    'Processing request through neural analysis engine. Multi-vector approach recommended combining passive recon with targeted exploitation.',
    'Correlated intelligence from 24 sources. Optimal approach: service misconfiguration on perimeter firewall.',
    'Analysis: 8 exploitable pathways found. Path 3 (webapp → database → internal) has 92% success probability.',
  ],
}

export function AIPanel() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 'intro', role: 'ai', content: 'AI Assistant online. How can I support your operations?', timestamp: Date.now() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getResponse = useCallback((query: string): string => {
    const lower = query.toLowerCase()
    let responses: string[]
    if (lower.includes('scan') || lower.includes('recon')) responses = aiResponses.scan
    else if (lower.includes('breach') || lower.includes('exploit') || lower.includes('attack')) responses = aiResponses.breach
    else if (lower.includes('threat') || lower.includes('alert') || lower.includes('danger')) responses = aiResponses.threat
    else if (lower.includes('help') || lower.includes('what') || lower.includes('can')) responses = aiResponses.help
    else responses = aiResponses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = { id: `msg-${Date.now()}-ai`, role: 'ai', content: getResponse(trimmed), timestamp: Date.now() }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }, [input, isTyping, getResponse])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }, [handleSend])

  return (
    <div className="h-full flex flex-col font-mono text-xs" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 soc-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(0, 180, 216, 0.15)', color: 'var(--soc-accent)' }}
              >
                AI
              </div>
            )}
            <div
              className="max-w-[80%] rounded p-2.5 text-[11px] leading-relaxed border"
              style={{
                backgroundColor: msg.role === 'user' ? 'rgba(0, 180, 216, 0.08)' : 'var(--soc-surface)',
                borderColor: msg.role === 'user' ? 'rgba(0, 180, 216, 0.2)' : 'var(--soc-border)',
                color: 'var(--soc-text)',
              }}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-[8px] mt-1" style={{ color: 'var(--soc-text-muted)' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
            {msg.role === 'user' && (
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(72, 149, 239, 0.15)', color: 'var(--soc-info)' }}
              >
                OP
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
              style={{ backgroundColor: 'rgba(0, 180, 216, 0.15)', color: 'var(--soc-accent)' }}
            >
              AI
            </div>
            <div
              className="rounded p-2.5 border"
              style={{ backgroundColor: 'var(--soc-surface)', borderColor: 'var(--soc-border)' }}
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--soc-accent)', animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--soc-accent)', animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--soc-accent)', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-2 p-3 border-t"
        style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Query AI assistant..."
          className="flex-1 px-3 py-1.5 rounded text-[11px] border outline-none"
          style={{
            backgroundColor: 'var(--soc-bg)',
            borderColor: 'var(--soc-border)',
            color: 'var(--soc-text)',
          }}
          aria-label="AI query input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="px-3 py-1.5 rounded text-[10px] font-medium transition-colors disabled:opacity-30"
          style={{
            backgroundColor: 'rgba(0, 180, 216, 0.2)',
            color: 'var(--soc-accent)',
          }}
        >
          SEND
        </button>
      </div>
    </div>
  )
}
