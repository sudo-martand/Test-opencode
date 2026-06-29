'use client'

import { createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { useProfileStore } from '@/lib/stores/profileStore'

interface SoundContextValue {
  playKeystroke: () => void
  playAlert: () => void
  playSuccess: () => void
  playError: () => void
  setVolume: (v: number) => void
}

const SoundContext = createContext<SoundContextValue>({
  playKeystroke: () => {},
  playAlert: () => {},
  playSuccess: () => {},
  playError: () => {},
  setVolume: () => {},
})

export function useSound() {
  return useContext(SoundContext)
}

function createOscillator(context: AudioContext, frequency: number, duration: number, type: OscillatorType, volume: number) {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, context.currentTime)
  gain.gain.setValueAtTime(volume * 0.3, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
  osc.connect(gain)
  gain.connect(context.destination)
  osc.start()
  osc.stop(context.currentTime + duration)
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const { settings } = useProfileStore()
  const ctxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const setVolume = useCallback((v: number) => {
    useProfileStore.getState().updateSettings({ soundVolume: v })
  }, [])

  const playKeystroke = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 800 + Math.random() * 400, 0.03, 'square', settings.soundVolume)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playAlert = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 880, 0.15, 'sawtooth', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 660, 0.15, 'sawtooth', settings.soundVolume), 150)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playSuccess = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 784, 0.1, 'sine', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 1047, 0.15, 'sine', settings.soundVolume), 80)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playError = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 200, 0.2, 'sawtooth', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 150, 0.3, 'sawtooth', settings.soundVolume), 100)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  useEffect(() => {
    return () => {
      ctxRef.current?.close()
    }
  }, [])

  return (
    <SoundContext.Provider value={{ playKeystroke, playAlert, playSuccess, playError, setVolume }}>
      {children}
    </SoundContext.Provider>
  )
}
