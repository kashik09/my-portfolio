/**
 * VS Code-Inspired Theme System
 *
 * Professional color schemes inspired by popular VS Code themes
 * Each theme is self-contained (no separate light/dark modes)
 */

export type ThemeName = 'monokai' | 'one-dark-pro' | 'dracula' | 'github-light'

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
// MONOKAI THEME - Classic dark theme
// ============================================
export const monokaiTheme: Theme = {
  name: 'monokai',
  displayName: 'Monokai',
  description: 'Classic dark theme with vibrant colors',
  colors: {
    primary: '230 219 116',           // #E6DB74 - Yellow
    'primary-foreground': '39 40 34',
    secondary: '249 38 114',          // #F92672 - Pink/Magenta
    'secondary-foreground': '248 248 242',
    accent: '166 226 46',             // #A6E22E - Green
    'accent-secondary': '102 217 239', // #66D9EF - Blue
    'accent-foreground': '39 40 34',
    background: '39 40 34',           // #272822
    'background-secondary': '32 33 27',
    foreground: '248 248 242',        // #F8F8F2
    'foreground-muted': '190 190 190',
    border: '60 60 55',
    'border-light': '75 76 70',
    card: '46 47 41',
    'card-hover': '52 53 47',
    muted: '60 60 55',
    destructive: '249 38 114',        // Pink for errors
    success: '166 226 46',            // Green
    warning: '253 151 31',            // #FD971F - Orange
    info: '102 217 239',              // Blue
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// ONE DARK PRO THEME - Modern dark theme
// ============================================
export const oneDarkProTheme: Theme = {
  name: 'one-dark-pro',
  displayName: 'One Dark Pro',
  description: 'Popular dark theme from Atom editor',
  colors: {
    primary: '97 175 239',            // #61AFEF - Blue
    'primary-foreground': '255 255 255',
    secondary: '198 120 221',         // #C678DD - Purple
    'secondary-foreground': '255 255 255',
    accent: '152 195 121',            // #98C379 - Green
    'accent-secondary': '224 108 117', // #E06C75 - Red
    'accent-foreground': '255 255 255',
    background: '40 44 52',           // #282C34
    'background-secondary': '33 37 43',
    foreground: '171 178 191',        // #ABB2BF
    'foreground-muted': '130 137 150',
    border: '60 65 75',
    'border-light': '75 80 90',
    card: '46 50 58',
    'card-hover': '52 56 64',
    muted: '60 65 75',
    destructive: '224 108 117',       // Red
    success: '152 195 121',           // Green
    warning: '209 154 102',           // #D19A66 - Orange
    info: '86 182 194',               // #56B6C2 - Cyan
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// DRACULA THEME - Elegant dark theme
// ============================================
export const draculaTheme: Theme = {
  name: 'dracula',
  displayName: 'Dracula',
  description: 'Elegant dark theme with purple accents',
  colors: {
    primary: '189 147 249',           // #BD93F9 - Purple
    'primary-foreground': '255 255 255',
    secondary: '255 121 198',         // #FF79C6 - Pink
    'secondary-foreground': '255 255 255',
    accent: '80 250 123',             // #50FA7B - Green
    'accent-secondary': '139 233 253', // #8BE9FD - Cyan
    'accent-foreground': '40 42 54',
    background: '40 42 54',           // #282A36
    'background-secondary': '33 34 44',
    foreground: '248 248 242',        // #F8F8F2
    'foreground-muted': '190 190 190',
    border: '68 71 90',
    'border-light': '85 88 107',
    card: '46 48 60',
    'card-hover': '52 54 66',
    muted: '68 71 90',
    destructive: '255 85 85',         // #FF5555 - Red
    success: '80 250 123',            // Green
    warning: '241 250 140',           // #F1FA8C - Yellow
    info: '139 233 253',              // Cyan
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// GITHUB LIGHT THEME - Clean light theme
// ============================================
export const githubLightTheme: Theme = {
  name: 'github-light',
  displayName: 'GitHub Light',
  description: 'Clean light theme inspired by GitHub',
  colors: {
    primary: '9 105 218',             // #0969DA - Blue
    'primary-foreground': '255 255 255',
    secondary: '130 80 223',          // #8250DF - Purple
    'secondary-foreground': '255 255 255',
    accent: '26 127 55',              // #1A7F37 - Green
    'accent-secondary': '191 135 0',   // #BF8700 - Orange
    'accent-foreground': '255 255 255',
    background: '255 255 255',        // #FFFFFF
    'background-secondary': '246 248 250',
    foreground: '36 41 47',           // #24292F
    'foreground-muted': '87 96 106',
    border: '208 215 222',            // #D0D7DE
    'border-light': '234 238 242',
    card: '255 255 255',
    'card-hover': '246 248 250',
    muted: '246 248 250',
    destructive: '207 34 46',         // #CF222E - Red
    success: '26 127 55',             // Green
    warning: '191 135 0',             // Orange
    info: '9 105 218',                // Blue
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
}

// ============================================
// THEME REGISTRY
// ============================================
export const themes: Record<ThemeName, Theme> = {
  'monokai': monokaiTheme,
  'one-dark-pro': oneDarkProTheme,
  'dracula': draculaTheme,
  'github-light': githubLightTheme,
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
