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

  // Theme management
  setTheme: (theme: ThemeName) => void

  // Utility functions
  currentTheme: ReturnType<typeof getTheme>
  availableThemes: ThemeName[]
  isTheme: (name: ThemeName) => boolean
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeName
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
  defaultTheme = 'monokai',
  storageKey = 'kashicoding-theme',
  enableTransitions = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme)
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
        const storedTheme = JSON.parse(stored)
        setThemeState(storedTheme)
        applyThemeToDocument(storedTheme, false)
      } else {
        applyThemeToDocument(defaultTheme, false)
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
      applyThemeToDocument(defaultTheme, false)
    }
  }, [defaultTheme, storageKey])

  // ============================================
  // APPLY THEME TO DOCUMENT
  // ============================================
  const applyThemeToDocument = useCallback(
    (themeName: ThemeName, withTransition = true) => {
      if (typeof document === 'undefined') return

      const root = document.documentElement

      // Disable transitions temporarily if needed
      if (!withTransition || !enableTransitions) {
        root.classList.add('no-transition')
      }

      // Apply theme
      applyTheme(themeName)

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
    (themeName: ThemeName) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(themeName))
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

    applyThemeToDocument(theme, true)
    saveThemeToStorage(theme)
  }, [theme, mounted, applyThemeToDocument, saveThemeToStorage])

  // ============================================
  // THEME MANAGEMENT FUNCTIONS
  // ============================================
  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme)
  }, [])

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const currentTheme = getTheme(theme)
  const availableThemes = getThemeNames()
  const isTheme = useCallback((name: ThemeName) => theme === name, [theme])

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: ThemeContextType = {
    theme,
    setTheme,
    currentTheme,
    availableThemes,
    isTheme,
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
 *   const { theme, setTheme } = useTheme()
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme('dracula')}>Dracula Theme</button>
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
 * Hook to get theme colors for current theme
 */
export function useThemeColors() {
  const { currentTheme } = useTheme()
  return currentTheme.colors
}
