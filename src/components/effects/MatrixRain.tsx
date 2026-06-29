'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/lib/stores/gameStore'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { settings } = useGameStore()

  useEffect(() => {
    if (settings.reducedMotion || settings.effectsIntensity === 0) return

    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvasEl.width = w
    canvasEl.height = h

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'
    const fontSize = 12
    const columns = Math.floor(w / fontSize)
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * h)
    const speed = settings.effectsIntensity * 0.8 + 0.2

    let animationId: number

    function draw() {
      if (!ctx) return
      ctx.fillStyle = 'rgba(5, 5, 16, 0.05)'
      ctx.fillRect(0, 0, w, h)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const alpha = Math.random() * 0.5 + 0.3
        const isHead = drops[i] * fontSize < fontSize * 2

        if (isHead) {
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha + 0.3})`
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.5})`
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += speed
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvasEl.width = w
      canvasEl.height = h
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [settings.reducedMotion, settings.effectsIntensity])

  if (settings.reducedMotion || settings.effectsIntensity === 0) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: Math.min(1, settings.effectsIntensity * 0.4) }}
    />
  )
}
