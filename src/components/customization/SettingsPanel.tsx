'use client'

import { useProfileStore } from '@/lib/stores/profileStore'
import { terminalThemes } from '@/lib/data/terminalThemes'

export function SettingsPanel() {
  const { settings, updateSettings, operator } = useProfileStore()

  return (
    <div className="h-full overflow-auto p-4 font-mono text-xs" style={{ backgroundColor: '#050510' }}>
      <div className="text-zinc-400 text-[10px] uppercase tracking-wider mb-4">Settings</div>

      <div className="space-y-4">
        <section>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Terminal</div>
          <div className="rounded-lg border border-zinc-800/50 p-3 space-y-3" style={{ backgroundColor: '#0a0a15' }}>
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Theme</label>
              <select
                value={settings.terminalTheme}
                onChange={(e) => updateSettings({ terminalTheme: e.target.value })}
                className="w-full px-2 py-1.5 rounded bg-black/30 border border-zinc-800 text-zinc-300 text-[11px] outline-none focus:border-cyan-800"
              >
                {terminalThemes.map((t) => (
                  <option key={t.name} value={t.name}>{t.name.charAt(0).toUpperCase() + t.name.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Font Size: {settings.fontSize}px</label>
              <input
                type="range"
                min="10"
                max="24"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 rounded bg-black/30 border border-zinc-800 text-zinc-300 text-[11px] outline-none focus:border-cyan-800"
              >
                <option value="monospace">Monospace</option>
                <option value="courier">Courier</option>
                <option value="Menlo">Menlo</option>
                <option value="Fira Code">Fira Code</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Audio</div>
          <div className="rounded-lg border border-zinc-800/50 p-3 space-y-3" style={{ backgroundColor: '#0a0a15' }}>
            <label className="flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">Sound Enabled</span>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-cyan-700' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
            {settings.soundEnabled && (
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Volume: {Math.round(settings.soundVolume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Visual</div>
          <div className="rounded-lg border border-zinc-800/50 p-3 space-y-3" style={{ backgroundColor: '#0a0a15' }}>
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Effects Intensity: {Math.round(settings.effectsIntensity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.effectsIntensity}
                onChange={(e) => updateSettings({ effectsIntensity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">Reduced Motion</span>
              <button
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.reducedMotion ? 'bg-cyan-700' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">High Contrast</span>
              <button
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.highContrast ? 'bg-cyan-700' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${settings.highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        </section>

        <section>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Operator Profile</div>
          <div className="rounded-lg border border-zinc-800/50 p-3" style={{ backgroundColor: '#0a0a15' }}>
            <div className="space-y-1.5 text-zinc-500">
              <div className="flex justify-between"><span>Call Sign</span><span className="text-cyan-400">{operator.callSign}</span></div>
              <div className="flex justify-between"><span>Role</span><span className="text-zinc-300">{operator.role.replace('_', ' ')}</span></div>
              <div className="flex justify-between"><span>Clearance</span><span className="text-green-400">{operator.clearance.toUpperCase()}</span></div>
              <div className="flex justify-between"><span>Team</span><span className="text-zinc-300">{operator.assignedTo}</span></div>
              <div className="flex justify-between"><span>Shift</span><span className="text-zinc-300">{operator.shift}</span></div>
              <div className="flex justify-between"><span>Certifications</span><span className="text-zinc-300">{operator.certifications.length > 0 ? operator.certifications.join(', ') : 'None'}</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
