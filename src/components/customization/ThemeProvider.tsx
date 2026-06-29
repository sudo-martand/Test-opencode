'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useGameStore } from '@/lib/stores/gameStore'
import { terminalThemes } from '@/lib/data/terminalThemes'

interface ThemeContextValue {
  currentTheme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: 'cyberpunk',
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useGameStore()

  useEffect(() => {
    const theme = terminalThemes.find((t) => t.name === settings.terminalTheme) || terminalThemes[0]
    document.documentElement.style.setProperty('--terminal-bg', theme.background)
    document.documentElement.style.setProperty('--terminal-fg', theme.foreground)
    document.documentElement.style.setProperty('--terminal-cursor', theme.cursor)

    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
  }, [settings.terminalTheme, settings.highContrast, settings.reducedMotion])

  return (
    <ThemeContext.Provider value={{ currentTheme: settings.terminalTheme, setTheme: (t) => updateSettings({ terminalTheme: t }) }}>
      {children}
    </ThemeContext.Provider>
  )
}
