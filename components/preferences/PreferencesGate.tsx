'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from '@/lib/preferences/PreferencesContext'

type ResolvedAppearance = 'light' | 'dark'

const getSystemAppearance = (media: MediaQueryList): ResolvedAppearance =>
  media.matches ? 'dark' : 'light'

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
    const resolvedAppearance =
      preferences.appearance === 'system' ? systemAppearance : preferences.appearance

    root.setAttribute('data-appearance', resolvedAppearance)
    root.setAttribute('data-theme', preferences.theme)
  }, [preferences.appearance, preferences.theme, systemAppearance])

  return null
}
