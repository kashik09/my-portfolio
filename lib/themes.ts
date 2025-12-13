/**
 * VS Code-Inspired Theme System
 *
 * Professional color schemes inspired by popular VS Code themes
 */

export type ThemeName = 'onedark' | 'tokyonight' | 'monokai' | 'githublight'

export interface ThemeColors {
  // Main colors
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  accent: string
  'accent-secondary': string
  'accent-foreground': string

  // Background colors
  background: string
  'background-secondary': string

  // Text colors
  foreground: string
  'foreground-muted': string

  // UI colors
  border: string
  'border-light': string
  card: string
  'card-hover': string
  muted: string

  // Status colors
  destructive: string
  success: string
  warning: string
  info: string
}

export interface Theme {
  name: ThemeName
  displayName: string
  description: string
  colors: ThemeColors
  radius: {
    sm: string
    md: string
    lg: string
  }
}

// ============================================
// ONE DARK PRO THEME (Default)
// ============================================
export const oneDarkTheme: Theme = {
  name: 'onedark',
  displayName: 'One Dark Pro',
  description: 'VS Code\'s iconic dark theme',
  colors: {
    primary: '97 175 239',
    'primary-foreground': '255 255 255',
    secondary: '198 120 221',
    'secondary-foreground': '255 255 255',
    accent: '152 195 121',
    'accent-secondary': '229 192 123',
    'accent-foreground': '40 44 52',
    background: '40 44 52',
    'background-secondary': '33 37 43',
    foreground: '171 178 191',
    'foreground-muted': '92 99 112',
    border: '59 64 74',
    'border-light': '76 82 99',
    card: '33 37 43',
    'card-hover': '44 48 56',
    muted: '59 64 74',
    destructive: '224 108 117',
    success: '152 195 121',
    warning: '229 192 123',
    info: '86 182 194',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// TOKYO NIGHT THEME
// ============================================
export const tokyoNightTheme: Theme = {
  name: 'tokyonight',
  displayName: 'Tokyo Night',
  description: 'Deep blue night sky theme',
  colors: {
    primary: '122 162 247',
    'primary-foreground': '255 255 255',
    secondary: '187 154 247',
    'secondary-foreground': '255 255 255',
    accent: '158 206 106',
    'accent-secondary': '255 158 100',
    'accent-foreground': '26 27 38',
    background: '26 27 38',
    'background-secondary': '22 22 30',
    foreground: '169 177 214',
    'foreground-muted': '86 95 137',
    border: '41 46 73',
    'border-light': '52 59 88',
    card: '22 22 30',
    'card-hover': '32 34 49',
    muted: '41 46 73',
    destructive: '247 118 142',
    success: '158 206 106',
    warning: '224 175 104',
    info: '125 207 255',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// MONOKAI PRO THEME
// ============================================
export const monokaiTheme: Theme = {
  name: 'monokai',
  displayName: 'Monokai Pro',
  description: 'Vibrant retro-futuristic theme',
  colors: {
    primary: '255 97 136',
    'primary-foreground': '252 252 250',
    secondary: '252 152 103',
    'secondary-foreground': '252 252 250',
    accent: '169 220 118',
    'accent-secondary': '255 216 102',
    'accent-foreground': '45 42 46',
    background: '45 42 46',
    'background-secondary': '35 33 37',
    foreground: '252 252 250',
    'foreground-muted': '147 147 143',
    border: '66 62 67',
    'border-light': '96 92 97',
    card: '35 33 37',
    'card-hover': '45 42 46',
    muted: '66 62 67',
    destructive: '255 97 136',
    success: '169 220 118',
    warning: '255 216 102',
    info: '120 220 232',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// GITHUB LIGHT THEME
// ============================================
export const githubLightTheme: Theme = {
  name: 'githublight',
  displayName: 'GitHub Light',
  description: 'Clean light theme from GitHub',
  colors: {
    primary: '9 105 218',
    'primary-foreground': '255 255 255',
    secondary: '130 80 223',
    'secondary-foreground': '255 255 255',
    accent: '26 127 55',
    'accent-secondary': '191 63 3',
    'accent-foreground': '255 255 255',
    background: '255 255 255',
    'background-secondary': '246 248 250',
    foreground: '36 41 47',
    'foreground-muted': '87 96 106',
    border: '208 215 222',
    'border-light': '234 238 242',
    card: '255 255 255',
    'card-hover': '246 248 250',
    muted: '234 238 242',
    destructive: '207 34 46',
    success: '26 127 55',
    warning: '149 117 8',
    info: '0 149 255',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// THEME REGISTRY
// ============================================
export const themes: Record<ThemeName, Theme> = {
  'onedark': oneDarkTheme,
  'tokyonight': tokyoNightTheme,
  'monokai': monokaiTheme,
  'githublight': githubLightTheme,
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): Theme {
  return themes[name]
}

/**
 * Get all theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[]
}

/**
 * Get theme colors
 */
export function getThemeColors(themeName: ThemeName): ThemeColors {
  return themes[themeName].colors
}

/**
 * Convert theme colors to CSS variables
 */
export function themeToCSSVariables(themeName: ThemeName): Record<string, string> {
  const colors = getThemeColors(themeName)
  const theme = getTheme(themeName)

  const cssVars: Record<string, string> = {}

  // Add color variables
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value
  })

  // Add radius variables
  cssVars['--radius-sm'] = theme.radius.sm
  cssVars['--radius-md'] = theme.radius.md
  cssVars['--radius-lg'] = theme.radius.lg

  return cssVars
}

/**
 * Apply theme to document root
 */
export function applyTheme(themeName: ThemeName): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Set data-theme attribute
  root.setAttribute('data-theme', themeName)
}
