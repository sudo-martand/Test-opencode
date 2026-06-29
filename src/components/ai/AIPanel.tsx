'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
}

const aiResponses: Record<string, string[]> = {
  scan: [
    'Initiating passive reconnaissance. I recommend starting with a SYN stealth scan to avoid detection. Key ports to check: 22, 80, 443, 3306, 8080.',
    'Network scan analysis: I detect 24 live hosts in the target range. 6 hosts show misconfigured services that could be entry points.',
    'Scan results indicate a Linux-based infrastructure. OS detection suggests Ubuntu 24.04 and CentOS 9 primary targets.',
  ],
  breach: [
    'Analyzing attack vectors... I recommend exploiting the unpatched Apache vulnerability on port 80. CVE-2025-2847 provides a reliable entry point.',
    'Breach strategy: Use the SQL injection vulnerability in the login form, then escalate via misconfigured sudo permissions.',
    'I\'ve identified a path: phishing credentials → VPN access → lateral movement → domain admin. Estimated success rate: 87%.',
  ],
  help: [
    'I am your AI operations assistant. I can help with:\n- Network reconnaissance planning\n- Vulnerability analysis\n- Exploit strategy recommendations\n- Threat intelligence briefings\n- Mission optimization\n\nTry asking me about specific targets or attack vectors.',
    'Available intelligence capabilities:\n- Real-time threat analysis\n- Attack surface mapping\n- Vulnerability correlation\n- Exploit suggestion engine\n- Mission probability modeling',
  ],
  threat: [
    'Current threat landscape: 3 high-severity alerts require immediate attention. A targeted attack campaign is in progress against your infrastructure.',
    'Threat intelligence update: Advanced Persistent Threat group APT-47 has been observed targeting similar infrastructure. Recommend immediate defensive measures.',
    'Analysis of recent intrusion attempts shows a pattern. The attacker is using living-off-the-land techniques to avoid detection.',
  ],
  default: [
    'Processing your request through neural analysis engine. Based on available data, I recommend a multi-vector approach combining passive reconnaissance with targeted social engineering.',
    'I\'ve correlated intelligence from 24 sources. The optimal approach involves exploiting the service misconfiguration on the perimeter firewall.',
    'Analysis complete. Key findings:\n1. Target runs outdated software\n2. Weak authentication mechanisms detected\n3. Multiple unpatched vulnerabilities identified\n\nRecommend proceeding with caution.',
    'Running predictive threat model... The target infrastructure shows 8 exploitable pathways. Path 3 (web application → database → internal network) has the highest success probability at 92%.',
    'I\'ve generated a comprehensive operations plan. The mission success probability is 78% with current resources. Consider additional reconnaissance for optimal outcome.',
  ],
}

export function AIPanel() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 'intro', role: 'ai', content: 'Hello Operator. I am your AI operations assistant. How can I help with your mission today?', timestamp: Date.now() },
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
    else if (lower.includes('help') || lower.includes('what') || lower.includes('can you')) responses = aiResponses.help
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
    }, 1000 + Math.random() * 1500)
  }, [input, isTyping, getResponse])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend()
  }, [handleSend])

  return (
    <div className="h-full flex flex-col font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-5 h-5 rounded-full bg-cyan-900/50 flex items-center justify-center text-[10px] text-cyan-400 shrink-0 mt-0.5">AI</div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-2.5 text-[11px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-800/30'
                    : 'bg-zinc-900/50 text-zinc-300 border border-zinc-800/30'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[8px] text-zinc-700 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-[10px] text-purple-400 shrink-0 mt-0.5">OP</div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-900/50 flex items-center justify-center text-[10px] text-cyan-400 shrink-0">AI</div>
              <div className="rounded-lg p-2.5 bg-zinc-900/50 border border-zinc-800/30">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 p-3 border-t border-zinc-800/50">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the AI assistant..."
          className="flex-1 px-3 py-1.5 rounded bg-black/30 border border-zinc-800 text-zinc-300 text-[11px] outline-none focus:border-cyan-800"
          aria-label="AI chat input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="px-3 py-1.5 rounded bg-cyan-800/50 hover:bg-cyan-700 text-cyan-300 text-[11px] disabled:opacity-30 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
