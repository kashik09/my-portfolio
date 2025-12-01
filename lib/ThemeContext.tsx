'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  type ThemeName,
  type ThemeMode,
  applyTheme,
  getTheme,
  getThemeNames,
} from './themes'

// ============================================
// TYPES
// ============================================

interface ThemeContextType {
  // Current theme state
  theme: ThemeName
  mode: ThemeMode

  // Theme management
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void

  // Utility functions
  currentTheme: ReturnType<typeof getTheme>
  availableThemes: ThemeName[]
  isTheme: (name: ThemeName) => boolean
  isDarkMode: boolean
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeName
  defaultMode?: ThemeMode
  storageKey?: string
  enableTransitions?: boolean
}

// ============================================
// CONTEXT
// ============================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ============================================
// PROVIDER COMPONENT
// ============================================

export function ThemeProvider({
  children,
  defaultTheme = 'minimal',
  defaultMode = 'light',
  storageKey = 'kashicoding-theme',
  enableTransitions = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [mounted, setMounted] = useState(false)

  // ============================================
  // LOAD THEME FROM STORAGE
  // ============================================
  useEffect(() => {
    setMounted(true)

    try {
      // Check localStorage first
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const { theme: storedTheme, mode: storedMode } = JSON.parse(stored)
        setThemeState(storedTheme)
        setModeState(storedMode)
        applyThemeToDocument(storedTheme, storedMode, false)
      } else {
        // Check system preference for dark mode
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        const initialMode = prefersDark ? 'dark' : 'light'
        setModeState(initialMode)
        applyThemeToDocument(defaultTheme, initialMode, false)
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
      applyThemeToDocument(defaultTheme, defaultMode, false)
    }
  }, [defaultTheme, defaultMode, storageKey])

  // ============================================
  // APPLY THEME TO DOCUMENT
  // ============================================
  const applyThemeToDocument = useCallback(
    (themeName: ThemeName, themeMode: ThemeMode, withTransition = true) => {
      if (typeof document === 'undefined') return

      const root = document.documentElement

      // Disable transitions temporarily if needed
      if (!withTransition || !enableTransitions) {
        root.classList.add('no-transition')
      }

      // Apply theme
      applyTheme(themeName, themeMode)

      // Re-enable transitions after a brief delay
      if (!withTransition || !enableTransitions) {
        setTimeout(() => {
          root.classList.remove('no-transition')
        }, 50)
      }
    },
    [enableTransitions]
  )

  // ============================================
  // SAVE THEME TO STORAGE
  // ============================================
  const saveThemeToStorage = useCallback(
    (themeName: ThemeName, themeMode: ThemeMode) => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ theme: themeName, mode: themeMode })
        )
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error)
      }
    },
    [storageKey]
  )

  // ============================================
  // APPLY THEME CHANGES
  // ============================================
  useEffect(() => {
    if (!mounted) return

    applyThemeToDocument(theme, mode, true)
    saveThemeToStorage(theme, mode)
  }, [theme, mode, mounted, applyThemeToDocument, saveThemeToStorage])

  // ============================================
  // LISTEN TO SYSTEM THEME CHANGES
  // ============================================
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference
      const stored = localStorage.getItem(storageKey)
      if (!stored) {
        setModeState(e.matches ? 'dark' : 'light')
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [mounted, storageKey])

  // ============================================
  // THEME MANAGEMENT FUNCTIONS
  // ============================================
  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme)
  }, [])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const currentTheme = getTheme(theme)
  const availableThemes = getThemeNames()
  const isTheme = useCallback((name: ThemeName) => theme === name, [theme])
  const isDarkMode = mode === 'dark'

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: ThemeContextType = {
    theme,
    mode,
    setTheme,
    setMode,
    toggleMode,
    currentTheme,
    availableThemes,
    isTheme,
    isDarkMode,
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// ============================================
// HOOK
// ============================================

/**
 * Hook to access and update theme state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, mode, setTheme, toggleMode } = useTheme()
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme('neon')}>Neon Theme</button>
 *       <button onClick={toggleMode}>Toggle Dark Mode</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook to check if a specific theme is active
 */
export function useIsTheme(themeName: ThemeName): boolean {
  const { theme } = useTheme()
  return theme === themeName
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { mode } = useTheme()
  return mode === 'dark'
}

/**
 * Hook to get theme colors for current theme and mode
 */
export function useThemeColors() {
  const { currentTheme, mode } = useTheme()
  return currentTheme[mode]
}
