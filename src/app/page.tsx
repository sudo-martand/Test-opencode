'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/customization/ThemeProvider'
import { SoundProvider } from '@/components/sound/SoundProvider'
import { Desktop } from '@/components/os/Desktop'
import { MatrixRain } from '@/components/effects/MatrixRain'
import { AchievementNotification } from '@/components/gamification/AchievementNotification'
import { useWindowStore } from '@/lib/stores/windowStore'
import { useMissionStore } from '@/lib/stores/missionStore'
import { useNetworkStore } from '@/lib/stores/networkStore'

function AppInitializer() {
  const { openWindow } = useWindowStore()
  const { generateMission } = useMissionStore()
  const { initialize } = useNetworkStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      openWindow('terminal', 'Terminal')
      openWindow('network', 'Network Monitor')
      setTimeout(() => {
        generateMission()
        generateMission()
        generateMission('recon')
        initialize()
      }, 500)
    }, 300)
    return () => clearTimeout(timer)
  }, [openWindow, generateMission, initialize])

  return null
}

export default function Home() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AppInitializer />
        <div className="h-full w-full relative">
          <MatrixRain />
          <Desktop />
          <AchievementNotification />
        </div>
      </SoundProvider>
    </ThemeProvider>
  )
}
