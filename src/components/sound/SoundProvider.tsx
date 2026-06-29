'use client'

import { createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { useGameStore } from '@/lib/stores/gameStore'

interface SoundContextValue {
  playKeystroke: () => void
  playAlert: () => void
  playSuccess: () => void
  playError: () => void
  playMissionStart: () => void
  playMissionComplete: () => void
  playAchievement: () => void
  setVolume: (v: number) => void
}

const SoundContext = createContext<SoundContextValue>({
  playKeystroke: () => {},
  playAlert: () => {},
  playSuccess: () => {},
  playError: () => {},
  playMissionStart: () => {},
  playMissionComplete: () => {},
  playAchievement: () => {},
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
  const { settings } = useGameStore()
  const ctxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const setVolume = useCallback((v: number) => {
    useGameStore.getState().updateSettings({ soundVolume: v })
  }, [])

  const playKeystroke = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 800 + Math.random() * 400, 0.05, 'square', settings.soundVolume)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playAlert = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 440, 0.3, 'sawtooth', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 880, 0.3, 'sawtooth', settings.soundVolume), 200)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playSuccess = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 523, 0.15, 'sine', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 659, 0.15, 'sine', settings.soundVolume), 100)
    setTimeout(() => createOscillator(ctx, 784, 0.2, 'sine', settings.soundVolume), 200)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playError = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 200, 0.3, 'sawtooth', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 150, 0.4, 'sawtooth', settings.soundVolume), 150)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playMissionStart = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    createOscillator(ctx, 440, 0.2, 'triangle', settings.soundVolume)
    setTimeout(() => createOscillator(ctx, 554, 0.2, 'triangle', settings.soundVolume), 200)
    setTimeout(() => createOscillator(ctx, 659, 0.3, 'triangle', settings.soundVolume), 400)
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playMissionComplete = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, 0.2, 'sine', settings.soundVolume), i * 150)
    })
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  const playAchievement = useCallback(() => {
    if (!settings.soundEnabled) return
    const ctx = getContext()
    ;[1047, 1319, 1568, 2093].forEach((freq, i) => {
      setTimeout(() => createOscillator(ctx, freq, 0.15, 'sine', settings.soundVolume), i * 100)
    })
  }, [settings.soundEnabled, settings.soundVolume, getContext])

  useEffect(() => {
    return () => {
      ctxRef.current?.close()
    }
  }, [])

  return (
    <SoundContext.Provider value={{ playKeystroke, playAlert, playSuccess, playError, playMissionStart, playMissionComplete, playAchievement, setVolume }}>
      {children}
    </SoundContext.Provider>
  )
}
