'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/stores/gameStore'

interface Notification {
  id: string
  title: string
  description: string
}

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export function AchievementNotification() {
  const { profile } = useGameStore()
  const [visible, setVisible] = useState<Notification | null>(null)
  const prevCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notifiedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const unlocked = profile.achievements.filter((a: Achievement) => a.unlocked)
    const newUnlocked = unlocked.filter((a: Achievement) => !notifiedIds.current.has(a.id))

    if (newUnlocked.length > 0) {
      const latest = newUnlocked[newUnlocked.length - 1]
      notifiedIds.current.add(latest.id)

      const notification = { id: latest.id, title: latest.title, description: latest.description }
      setVisible(notification)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(null), 4000)
    }

    prevCount.current = unlocked.length
  }, [profile.achievements])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[10000]">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="rounded-lg border border-yellow-800/50 p-3 shadow-2xl font-mono"
            style={{ backgroundColor: '#0f0a00', maxWidth: '300px' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏆</span>
              <div>
                <div className="text-[10px] text-yellow-400 uppercase tracking-wider">Achievement Unlocked</div>
                <div className="text-sm text-zinc-200 font-medium">{visible.title}</div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 ml-8">{visible.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}