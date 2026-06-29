import { create } from 'zustand'
import type { WindowState, WindowType } from '@/lib/types'

interface WindowStore {
  windows: WindowState[]
  nextZIndex: number
  focusedWindowId: string | null
  openWindow: (type: WindowType, title: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, width: number, height: number) => void
  restoreWindow: (id: string) => void
}

let windowCounter = 0

function createWindowState(type: WindowType, title: string, zIndex: number): WindowState {
  windowCounter++
  const baseWidth = 800
  const baseHeight = 500
  const offset = (windowCounter % 10) * 30
  return {
    id: `window-${windowCounter}`,
    title,
    type,
    x: 100 + offset,
    y: 60 + offset,
    width: baseWidth,
    height: baseHeight,
    minimized: false,
    maximized: false,
    zIndex,
    component: type,
  }
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  nextZIndex: 1,
  focusedWindowId: null,

  openWindow: (type, title) =>
    set((state) => {
      const existing = state.windows.find((w) => w.type === type && !w.minimized)
      if (existing) {
        return {
          focusedWindowId: existing.id,
          nextZIndex: state.nextZIndex + 1,
          windows: state.windows.map((w) =>
            w.id === existing.id ? { ...w, zIndex: state.nextZIndex, minimized: false } : w
          ),
        }
      }
      const newWindow = createWindowState(type, title, state.nextZIndex)
      return {
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
        focusedWindowId: newWindow.id,
      }
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, x: 0, y: 0, width: window.innerWidth, height: window.innerHeight - 48 } : w
      ),
    })),

  focusWindow: (id) =>
    set((state) => ({
      focusedWindowId: id,
      nextZIndex: state.nextZIndex + 1,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex } : w
      ),
    })),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: false } : w)),
      focusedWindowId: id,
    })),
}))
