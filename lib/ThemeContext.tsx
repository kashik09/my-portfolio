'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { themes, ThemeName, defaultTheme } from './themes'  // ← ADD themes import!

type ThemeContextType = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeName
    if (savedTheme && Object.keys(themes).includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}