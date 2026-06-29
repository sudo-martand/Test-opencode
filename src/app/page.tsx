'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ThemeProvider } from '@/components/customization/ThemeProvider'
import { Desktop } from '@/components/os/Desktop'

function LoginScreen({ onLogin }: { onLogin: (callsign: string) => void }) {
  const [callsign, setCallsign] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'callsign' | 'password' | 'authenticating'>('callsign')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const handleCallsignSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!callsign.trim()) {
      setError('CALLSIGN_REQUIRED')
      return
    }
    setError('')
    setStep('password')
  }, [callsign])

  const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('AUTH_FAILED')
      return
    }
    setStep('authenticating')
    setTimeout(() => {
      onLogin(callsign.toUpperCase())
    }, 800)
  }, [password, callsign, onLogin])

  if (step === 'authenticating') {
    return (
      <div className="h-full w-full flex items-center justify-center font-mono" style={{ backgroundColor: 'var(--soc-bg)' }}>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--soc-accent)' }}>AUTHENTICATING...</div>
          <div className="flex gap-1 justify-center mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--soc-accent)', animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex items-center justify-center font-mono" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div
        className="w-full max-w-md p-8 rounded border"
        style={{ borderColor: 'var(--soc-border)', backgroundColor: 'var(--soc-surface)' }}
      >
        <div className="text-xs mb-6 tracking-widest uppercase text-center" style={{ color: 'var(--soc-accent)' }}>
          Cyber Operations Center v0.1.0
        </div>

        {step === 'callsign' ? (
          <form onSubmit={handleCallsignSubmit} className="space-y-4">
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--soc-text-muted)' }}>OPERATOR CALLSIGN</label>
              <input
                ref={inputRef}
                type="text"
                value={callsign}
                onChange={(e) => { setCallsign(e.target.value.toUpperCase()); setError('') }}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{
                  backgroundColor: 'var(--soc-bg)',
                  borderColor: error ? 'var(--soc-danger)' : 'var(--soc-border)',
                  color: 'var(--soc-text)',
                }}
                spellCheck={false}
                autoComplete="off"
                placeholder="Enter callsign..."
              />
            </div>
            {error && <div className="text-xs" style={{ color: 'var(--soc-danger)' }}>[!] {error}</div>}
            <button
              type="submit"
              className="w-full py-2 text-sm rounded transition-colors"
              style={{ backgroundColor: 'var(--soc-accent)', color: '#000' }}
            >
              AUTHENTICATE
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-xs mb-2" style={{ color: 'var(--soc-text-muted)' }}>
              OPERATOR: <span style={{ color: 'var(--soc-accent)' }}>{callsign}</span>
            </div>
            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--soc-text-muted)' }}>PASSWORD</label>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                className="w-full px-3 py-2 text-sm rounded border outline-none"
                style={{
                  backgroundColor: 'var(--soc-bg)',
                  borderColor: error ? 'var(--soc-danger)' : 'var(--soc-border)',
                  color: 'var(--soc-text)',
                }}
                autoComplete="off"
                placeholder="Enter password..."
              />
            </div>
            {error && <div className="text-xs" style={{ color: 'var(--soc-danger)' }}>[!] {error}</div>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setStep('callsign'); setPassword(''); setError('') }}
                className="flex-1 py-2 text-sm rounded border transition-colors"
                style={{ borderColor: 'var(--soc-border)', color: 'var(--soc-text-muted)' }}
              >
                BACK
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-sm rounded transition-colors"
                style={{ backgroundColor: 'var(--soc-accent)', color: '#000' }}
              >
                LOGIN
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-[10px] text-center" style={{ color: 'var(--soc-text-muted)' }}>
          Authorized personnel only. All access is monitored.
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [operator, setOperator] = useState<string | null>(null)

  return (
    <ThemeProvider>
      {!operator ? (
        <LoginScreen onLogin={(callsign) => setOperator(callsign)} />
      ) : (
        <Desktop operator={operator} />
      )}
    </ThemeProvider>
  )
}
