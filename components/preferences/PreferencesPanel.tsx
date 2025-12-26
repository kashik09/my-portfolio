'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import { getThemeLabel, THEME_KEYS } from '@/lib/preferences/themes'
import { useResolvedAppearance } from '@/lib/preferences/useResolvedAppearance'

const appearanceOptions = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

type AnimationPhase = 'idle' | 'exiting' | 'entering'

export function PreferencesPanel() {
  const { preferences, setAppearance, setTheme } = usePreferences()
  const resolvedAppearance = useResolvedAppearance()
  const [displayAppearance, setDisplayAppearance] =
    useState(resolvedAppearance)
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [reduceMotion, setReduceMotion] = useState(false)
  const exitTimer = useRef<number | null>(null)
  const enterTimer = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)

    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setDisplayAppearance(resolvedAppearance)
      setPhase('idle')
      return
    }

    if (resolvedAppearance === displayAppearance) return

    setPhase('exiting')
    if (exitTimer.current) window.clearTimeout(exitTimer.current)
    if (enterTimer.current) window.clearTimeout(enterTimer.current)

    exitTimer.current = window.setTimeout(() => {
      setDisplayAppearance(resolvedAppearance)
      setPhase('entering')
      enterTimer.current = window.setTimeout(() => {
        setPhase('idle')
      }, 300)
    }, 300)

    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
      if (enterTimer.current) window.clearTimeout(enterTimer.current)
    }
  }, [displayAppearance, reduceMotion, resolvedAppearance])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Appearance
        </p>
        <div className="flex items-center gap-1 rounded-full border border-app surface-app p-1">
          {appearanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAppearance(option.value)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-app ${
                preferences.appearance === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-app hover:bg-app'
              }`}
              aria-pressed={preferences.appearance === option.value}
              aria-label={`${option.label} appearance`}
            >
              <option.icon size={16} aria-hidden="true" />
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Theme
        </p>
        <div className="flex flex-wrap items-center gap-1 rounded-3xl border border-app surface-app p-1">
          {THEME_KEYS.map((key, index) => {
            const shouldAnimate = !reduceMotion && phase !== 'idle'
            const animationStyle = shouldAnimate
              ? {
                  animationDelay: `${index * 40}ms`,
                  animationDirection: phase === 'exiting' ? 'reverse' : 'normal',
                  animationFillMode: 'both'
                }
              : undefined

            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 ring-primary ring-offset-2 ring-offset-app ${
                  preferences.theme === key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:text-app hover:bg-app'
                } ${shouldAnimate ? 'animate-slide-fade' : ''}`}
                style={animationStyle}
                aria-selected={preferences.theme === key}
              >
                {getThemeLabel(displayAppearance, key)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
