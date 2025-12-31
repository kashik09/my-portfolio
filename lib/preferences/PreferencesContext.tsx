'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Appearance, Preferences, ThemeKey } from './types'
import { loadPreferences, savePreferences } from './storage'

interface PreferencesContextValue {
  preferences: Preferences
  setPreferences: Dispatch<SetStateAction<Preferences>>
  setAppearance: (appearance: Appearance) => void
  setTheme: (theme: ThemeKey) => void
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)

  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      setPreferences,
      setAppearance: (appearance) => setPreferences((prev) => ({ ...prev, appearance })),
      setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
    }),
    [preferences]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return context
}
