'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from './PreferencesContext'
import type { ResolvedAppearance } from './types'

export function useResolvedAppearance(): ResolvedAppearance {
  const { preferences } = usePreferences()
  const [systemAppearance, setSystemAppearance] = useState<ResolvedAppearance>('light')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemAppearance(media.matches ? 'dark' : 'light')

    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  if (preferences.appearance === 'system') return systemAppearance
  return preferences.appearance
}
