import { create } from 'zustand'
import type { NetworkNode, NetworkPacket, ThreatEvent, PacketCapture } from '@/lib/types'
import { generateNetworkNodes, generatePacket, generateThreatEvent, generatePacketCapture } from '@/lib/utils/networkSimulation'

interface NetworkStore {
  nodes: NetworkNode[]
  packets: NetworkPacket[]
  captures: PacketCapture[]
  threatEvents: ThreatEvent[]
  isScanning: boolean
  interface: string
  initialize: () => void
  tick: () => void
  startCapture: () => void
  stopCapture: () => void
  clearPackets: () => void
  exportPCAP: () => string
  setInterface: (iface: string) => void
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  nodes: [],
  packets: [],
  captures: [],
  threatEvents: [],
  isScanning: false,
  interface: 'eth0',

  initialize: () => {
    if (get().nodes.length === 0) {
      set({ nodes: generateNetworkNodes() })
    }
  },

  tick: () => {
    const { nodes, packets, threatEvents, isScanning } = get()
    if (isScanning || Math.random() > 0.65) {
      const newPacket = generatePacket(nodes)
      const result: { packets: NetworkPacket[]; threatEvents?: ThreatEvent[]; captures?: PacketCapture[] } = {
        packets: [...packets.slice(-99), newPacket],
      }

      if (isScanning) {
        const capture = generatePacketCapture(newPacket)
        result.captures = [...get().captures.slice(-199), capture]
      }

      if (Math.random() > 0.8) {
        const event = generateThreatEvent()
        result.threatEvents = [...threatEvents.slice(-49), event]
      }

      set(result)
    }
  },

  startCapture: () => set({ isScanning: true }),
  stopCapture: () => set({ isScanning: false }),

  clearPackets: () => set({ packets: [], captures: [] }),

  exportPCAP: () => {
    const state = get()
    const header = '50434e470a0d000d0a0000000000000000000a0000000100000000'
    const packets = state.captures.map((c) => {
      const ts = Math.floor(c.timestamp / 1000)
      const data = c.raw || ''
      return `${ts.toString(16).padStart(16, '0')}${data.length.toString(16).padStart(8, '0')}${data}`
    })
    return header + packets.join('')
  },

  setInterface: (iface) => set({ interface: iface }),
}))
