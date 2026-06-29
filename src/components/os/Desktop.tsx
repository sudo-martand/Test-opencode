'use client'

import { useState, useCallback } from 'react'
import { TerminalPanel } from '@/components/terminal/TerminalPanel'
import { NetworkMonitor } from '@/components/dashboard/NetworkMonitor'
import { ThreatFeed } from '@/components/dashboard/ThreatFeed'
import { SystemDiagnostics } from '@/components/dashboard/SystemDiagnostics'
import { FileExplorer } from '@/components/dashboard/FileExplorer'
import { ProcessMonitor } from '@/components/dashboard/ProcessMonitor'
import { PacketAnalyzer } from '@/components/terminal/PacketAnalyzer'
import { WorldMap } from '@/components/map/WorldMap'
import { AIPanel } from '@/components/ai/AIPanel'
import { SettingsPanel } from '@/components/customization/SettingsPanel'
import { StatusBar } from './StatusBar'

export type PanelId =
  | 'terminal'
  | 'network'
  | 'threats'
  | 'diagnostics'
  | 'files'
  | 'processes'
  | 'packets'
  | 'map'
  | 'ai'
  | 'settings'

interface SidebarItem {
  id: PanelId
  label: string
  shortcut: string
}

const sidebarItems: SidebarItem[] = [
  { id: 'terminal', label: 'TERMINAL', shortcut: 'T' },
  { id: 'network', label: 'NETWORK', shortcut: 'N' },
  { id: 'threats', label: 'THREATS', shortcut: 'H' },
  { id: 'diagnostics', label: 'DIAGNOSTICS', shortcut: 'D' },
  { id: 'files', label: 'FILES', shortcut: 'F' },
  { id: 'processes', label: 'PROCESSES', shortcut: 'P' },
  { id: 'packets', label: 'PACKETS', shortcut: 'C' },
  { id: 'map', label: 'MAP', shortcut: 'M' },
  { id: 'ai', label: 'AI', shortcut: 'A' },
  { id: 'settings', label: 'SETTINGS', shortcut: 'S' },
]

const panelComponents: Record<PanelId, React.ComponentType> = {
  terminal: TerminalPanel,
  network: NetworkMonitor,
  threats: ThreatFeed,
  diagnostics: SystemDiagnostics,
  files: FileExplorer,
  processes: ProcessMonitor,
  packets: PacketAnalyzer,
  map: WorldMap,
  ai: AIPanel,
  settings: SettingsPanel,
}

const panelTitles: Record<PanelId, string> = {
  terminal: 'TERMINAL',
  network: 'NETWORK MONITOR',
  threats: 'THREAT INTELLIGENCE',
  diagnostics: 'SYSTEM DIAGNOSTICS',
  files: 'FILE BROWSER',
  processes: 'PROCESS MONITOR',
  packets: 'PACKET ANALYZER',
  map: 'GEO-THREAT MAP',
  ai: 'AI ASSISTANT',
  settings: 'SETTINGS',
}

export function Desktop({ operator }: { operator: string }) {
  const [activePanel, setActivePanel] = useState<PanelId>('terminal')

  const ActiveComponent = panelComponents[activePanel]

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: 'var(--soc-bg)' }}>
      <div className="flex-1 flex overflow-hidden">
        <div
          className="w-12 flex flex-col items-center py-2 gap-1 border-r shrink-0 z-10"
          style={{ backgroundColor: 'var(--soc-surface)', borderColor: 'var(--soc-border)' }}
        >
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className="w-9 h-9 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all relative"
              style={{
                backgroundColor: activePanel === item.id ? 'rgba(0, 180, 216, 0.1)' : 'transparent',
                color: activePanel === item.id ? 'var(--soc-accent)' : 'var(--soc-text-muted)',
              }}
              onMouseEnter={(e) => {
                if (activePanel !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (activePanel !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
              title={item.label}
            >
              {item.shortcut}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-1.5 border-b text-[11px] font-mono shrink-0"
            style={{
              backgroundColor: 'var(--soc-surface)',
              borderColor: 'var(--soc-border)',
              color: 'var(--soc-text-muted)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold tracking-wider" style={{ color: 'var(--soc-accent)' }}>{panelTitles[activePanel]}</span>
              <span style={{ color: 'var(--soc-border)' }}>|</span>
              <span className="text-[10px]">{operator}@SOC</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--soc-success)' }} />
                SYSTEM OK
              </span>
              <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden animate-fade-in">
            <ActiveComponent />
          </div>
        </div>
      </div>
      <StatusBar operator={operator} activePanel={activePanel} />
    </div>
  )
}
