'use client'

import { useWindowStore } from '@/lib/stores/windowStore'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { TerminalPanel } from '@/components/terminal/TerminalPanel'
import { NetworkMonitor } from '@/components/dashboard/NetworkMonitor'
import { ThreatFeed } from '@/components/dashboard/ThreatFeed'
import { SystemDiagnostics } from '@/components/dashboard/SystemDiagnostics'
import { FileExplorer } from '@/components/dashboard/FileExplorer'
import { ProcessMonitor } from '@/components/dashboard/ProcessMonitor'
import { MissionPanel } from '@/components/mission/MissionPanel'
import { WorldMap } from '@/components/map/WorldMap'
import { AIPanel } from '@/components/ai/AIPanel'
import { SettingsPanel } from '@/components/customization/SettingsPanel'

const componentMap: Record<string, React.ComponentType<object>> = {
  terminal: TerminalPanel,
  network: NetworkMonitor,
  threat: ThreatFeed,
  diagnostics: SystemDiagnostics,
  files: FileExplorer,
  processes: ProcessMonitor,
  mission: MissionPanel,
  map: WorldMap,
  ai: AIPanel,
  settings: SettingsPanel,
}

export function Desktop() {
  const { windows } = useWindowStore()

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: '#050508' }}>
      <div className="flex-1 relative overflow-hidden">
        {windows.map((win) => {
          const Component = componentMap[win.component]
          if (!Component) return null
          return (
            <Window key={win.id} window={win}>
              <Component />
            </Window>
          )
        })}
      </div>
      <Taskbar />
    </div>
  )
}
