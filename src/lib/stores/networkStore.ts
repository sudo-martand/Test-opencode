import { create } from 'zustand'
import type { NetworkNode, NetworkPacket, ThreatEvent } from '@/lib/types'
import { generateNetworkNodes, generatePacket, generateThreatEvent } from '@/lib/utils/networkSimulation'

interface NetworkStore {
  nodes: NetworkNode[]
  packets: NetworkPacket[]
  threatEvents: ThreatEvent[]
  isScanning: boolean
  initialize: () => void
  tick: () => void
  startScan: () => void
  stopScan: () => void
  clearPackets: () => void
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  nodes: [],
  packets: [],
  threatEvents: [],
  isScanning: false,

  initialize: () => {
    if (get().nodes.length === 0) {
      set({ nodes: generateNetworkNodes() })
    }
  },

  tick: () => {
    const { nodes, packets, threatEvents, isScanning } = get()
    if (isScanning || Math.random() > 0.7) {
      const newPacket = generatePacket(nodes)
      const result: { packets: NetworkPacket[]; threatEvents?: ThreatEvent[] } = { packets: [...packets.slice(-49), newPacket] }

      if (Math.random() > 0.85) {
        const event = generateThreatEvent()
        result.threatEvents = [...threatEvents.slice(-19), event]
      }

      set(result)
    }
  },

  startScan: () => set({ isScanning: true }),
  stopScan: () => set({ isScanning: false }),
  clearPackets: () => set({ packets: [] }),
}))
