'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ThemeName } from './themes'

interface ThemeContextType {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('onedark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('kashikweyu-theme') as ThemeName
    if (savedTheme && ['onedark', 'tokyonight', 'monokai', 'githublight'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // Set data-theme attribute
    root.setAttribute('data-theme', theme)
    
    // Save to localStorage
    localStorage.setItem('kashikweyu-theme', theme)
    
    // Debug logs
    console.log('🎨 Theme set to:', theme)
    console.log('📍 data-theme attr:', root.getAttribute('data-theme'))
  }, [theme, mounted])

  const setTheme = (newTheme: ThemeName) => {
    console.log('🔄 Changing theme to:', newTheme)
    setThemeState(newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
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