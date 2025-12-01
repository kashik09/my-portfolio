'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  type ThemeName,
  type ThemeMode,
  applyTheme,
  getTheme,
} from '@/lib/themes'

interface ThemeContextType {
  theme: ThemeName
  mode: ThemeMode
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeName
  defaultMode?: ThemeMode
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'minimal',
  defaultMode = 'light',
  storageKey = 'kashicoding-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const { theme: storedTheme, mode: storedMode } = JSON.parse(stored)
        setThemeState(storedTheme)
        setModeState(storedMode)
        applyTheme(storedTheme, storedMode)
      } else {
        applyTheme(defaultTheme, defaultMode)
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
      applyTheme(defaultTheme, defaultMode)
    }
  }, [defaultTheme, defaultMode, storageKey])

  // Apply theme whenever it changes
  useEffect(() => {
    if (!mounted) return

    applyTheme(theme, mode)

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify({ theme, mode }))
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
  }, [theme, mode, mounted, storageKey])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
  }

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
  }

  const toggleMode = () => {
    setModeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setTheme,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
