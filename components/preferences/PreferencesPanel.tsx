'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'

const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const

const modeOptions = [
  { value: 'formal', label: 'Formal' },
  { value: 'vibey', label: 'Vibey' },
] as const

const vibeyOptions = [
  { value: 'grape', label: 'Grape Soda' },
  { value: 'ocean', label: 'Ocean Pop' },
  { value: 'peach', label: 'Peach Ice' },
  { value: 'neon', label: 'Neon Mint' },
] as const

export function PreferencesPanel() {
  const { preferences, setMode, setTheme, setVibeyTheme } = usePreferences()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!panelRef.current && !buttonRef.current) return
      if (panelRef.current?.contains(event.target as Node)) return
      if (buttonRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={isOpen}
        aria-controls="preferences-panel"
      >
        Preferences
      </button>

      {isOpen && (
        <div
          id="preferences-panel"
          ref={panelRef}
          role="dialog"
          aria-label="Site preferences"
          tabIndex={-1}
          className="absolute right-0 mt-3 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl focus:outline-none"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-2">
                Theme
              </p>
              <div className="flex rounded-full border border-border bg-muted p-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                      preferences.theme === option.value
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-card'
                    }`}
                    aria-pressed={preferences.theme === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-2">
                Mode
              </p>
              <div className="flex rounded-full border border-border bg-muted p-1">
                {modeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                      preferences.mode === option.value
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-card'
                    }`}
                    aria-pressed={preferences.mode === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {preferences.mode === 'vibey' && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-2">
                  Vibey theme
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {vibeyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setVibeyTheme(option.value)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                        preferences.vibeyTheme === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground hover:border-primary/50 hover:bg-muted'
                      }`}
                      aria-pressed={preferences.vibeyTheme === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
