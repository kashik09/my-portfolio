'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'
import type { Appearance, ThemeKey } from '@/lib/preferences/types'

type ResolvedAppearance = 'light' | 'dark'

const getSystemAppearance = (media: MediaQueryList): ResolvedAppearance =>
  media.matches ? 'dark' : 'light'

const DEFAULT_THEME: ThemeKey = 'forest'
const APPEARANCES: Appearance[] = ['system', 'light', 'dark']

// Theme pairs map app theme keys to actual DaisyUI theme names
export const THEME_PAIRS = {
  forest: { dark: 'forest', light: 'moss' },
  night: { dark: 'night', light: 'skyline' },
  charcoal: { dark: 'charcoal', light: 'linen' },
} as const

const DARK_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.dark,
  night: THEME_PAIRS.night.dark,
  charcoal: THEME_PAIRS.charcoal.dark,
}

const LIGHT_THEME_MAP: Record<ThemeKey, string> = {
  forest: THEME_PAIRS.forest.light,
  night: THEME_PAIRS.night.light,
  charcoal: THEME_PAIRS.charcoal.light,
}

const isThemeKey = (value: string): value is ThemeKey =>
  Object.prototype.hasOwnProperty.call(THEME_PAIRS, value)

const isAppearance = (value: string): value is Appearance =>
  APPEARANCES.includes(value as Appearance)

export function PreferencesGate() {
  const { preferences } = usePreferences()
  const [systemAppearance, setSystemAppearance] = useState<ResolvedAppearance>('light')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemAppearance(getSystemAppearance(media))

    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const safeTheme = isThemeKey(preferences.theme) ? preferences.theme : DEFAULT_THEME
    const safeAppearance = isAppearance(preferences.appearance)
      ? preferences.appearance
      : 'system'
    const resolvedAppearance =
      safeAppearance === 'system' ? systemAppearance : safeAppearance
    const resolvedTheme =
      resolvedAppearance === 'dark'
        ? DARK_THEME_MAP[safeTheme]
        : LIGHT_THEME_MAP[safeTheme]
    const fallbackTheme =
      resolvedAppearance === 'dark'
        ? THEME_PAIRS[DEFAULT_THEME].dark
        : THEME_PAIRS[DEFAULT_THEME].light
    const themeToApply = resolvedTheme || fallbackTheme

    root.setAttribute('data-appearance', resolvedAppearance)
    root.setAttribute('data-theme', themeToApply)
  }, [preferences.appearance, preferences.theme, systemAppearance])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const existingTheme = root.getAttribute('data-theme')

    if (!existingTheme || existingTheme === 'null' || existingTheme === 'undefined') {
      const fallbackTheme =
        systemAppearance === 'dark'
          ? THEME_PAIRS[DEFAULT_THEME].dark
          : THEME_PAIRS[DEFAULT_THEME].light
      root.setAttribute('data-appearance', systemAppearance)
      root.setAttribute('data-theme', fallbackTheme)
    }
  }, [systemAppearance])

  return null
}
