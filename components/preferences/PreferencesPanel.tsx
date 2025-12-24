'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'

const themeOptions = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

const modeOptions = [
  { value: 'formal', label: 'Formal' },
  { value: 'vibey', label: 'Vibey' },
] as const

const vibeyOptions = [
  { value: 'grape', label: 'Grape' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'peach', label: 'Peach' },
  { value: 'neon', label: 'Neon' },
] as const

export function PreferencesPanel() {
  const { preferences, setMode, setTheme, setVibeyTheme } = usePreferences()

  return (
    <div className="flex items-start gap-2">
      {/* Theme Icons */}
      <div className="flex items-center gap-1 rounded-full border border-app surface-app p-1">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-app ${
              preferences.theme === option.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:text-app hover:bg-app'
            }`}
            aria-pressed={preferences.theme === option.value}
            aria-label={`${option.label} theme`}
          >
            <option.icon size={16} aria-hidden="true" />
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Mode Selector + Vibey Themes (stacked) */}
      <div className="space-y-2">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-full border border-app surface-app p-1">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-app ${
                preferences.mode === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-app hover:bg-app'
              }`}
              aria-pressed={preferences.mode === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Vibey Theme Selector - Only shown when vibey mode is active */}
        {preferences.mode === 'vibey' && (
          <div className="flex items-center gap-1 rounded-full border border-app surface-app p-1">
            {vibeyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setVibeyTheme(option.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-app ${
                  preferences.vibeyTheme === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:text-app hover:bg-app'
                }`}
                aria-pressed={preferences.vibeyTheme === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
