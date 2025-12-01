/**
 * Multi-Theme System
 *
 * Each theme has light and dark variants with RGB color values
 * for Tailwind CSS alpha channel support
 */

export type ThemeMode = 'light' | 'dark'
export type ThemeName = 'pastel' | 'neon' | 'minimal' | 'retro' | 'nature'

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
  light: ThemeColors
  dark: ThemeColors
  radius: {
    sm: string
    md: string
    lg: string
  }
}

// ============================================
// PASTEL THEME - Soft, dreamy colors
// ============================================
export const pastelTheme: Theme = {
  name: 'pastel',
  displayName: 'Pastel Dreams',
  description: 'Soft, calming colors with a dreamy aesthetic',
  light: {
    primary: '203 166 247',           // Soft purple
    'primary-foreground': '255 255 255',
    secondary: '162 210 255',         // Light blue
    'secondary-foreground': '30 41 59',
    accent: '255 183 197',            // Pink
    'accent-secondary': '255 218 185', // Peach
    'accent-foreground': '255 255 255',
    background: '255 250 250',        // Off-white
    'background-secondary': '249 245 247',
    foreground: '51 51 51',
    'foreground-muted': '115 115 115',
    border: '229 212 232',
    'border-light': '243 232 245',
    card: '255 255 255',
    'card-hover': '252 247 252',
    muted: '241 237 242',
    destructive: '239 68 68',
    success: '134 239 172',
    warning: '251 191 36',
    info: '96 165 250',
  },
  dark: {
    primary: '167 139 250',           // Bright purple
    'primary-foreground': '17 24 39',
    secondary: '96 165 250',          // Blue
    'secondary-foreground': '17 24 39',
    accent: '251 113 133',            // Rose
    'accent-secondary': '253 164 175', // Light pink
    'accent-foreground': '17 24 39',
    background: '24 24 27',
    'background-secondary': '39 39 42',
    foreground: '250 250 250',
    'foreground-muted': '161 161 170',
    border: '63 63 70',
    'border-light': '82 82 91',
    card: '39 39 42',
    'card-hover': '52 52 58',
    muted: '63 63 70',
    destructive: '239 68 68',
    success: '74 222 128',
    warning: '250 204 21',
    info: '147 197 253',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
}

// ============================================
// NEON THEME - Vibrant, electric colors
// ============================================
export const neonTheme: Theme = {
  name: 'neon',
  displayName: 'Neon Nights',
  description: 'Electric, high-contrast colors with a cyberpunk vibe',
  light: {
    primary: '236 72 153',            // Hot pink
    'primary-foreground': '255 255 255',
    secondary: '168 85 247',          // Purple
    'secondary-foreground': '255 255 255',
    accent: '34 211 238',             // Cyan
    'accent-secondary': '132 204 22',  // Lime
    'accent-foreground': '17 24 39',
    background: '255 255 255',
    'background-secondary': '249 250 251',
    foreground: '17 24 39',
    'foreground-muted': '100 116 139',
    border: '226 232 240',
    'border-light': '241 245 249',
    card: '255 255 255',
    'card-hover': '252 252 253',
    muted: '241 245 249',
    destructive: '239 68 68',
    success: '34 197 94',
    warning: '234 179 8',
    info: '59 130 246',
  },
  dark: {
    primary: '236 72 153',            // Hot pink
    'primary-foreground': '255 255 255',
    secondary: '168 85 247',          // Purple
    'secondary-foreground': '255 255 255',
    accent: '6 182 212',              // Bright cyan
    'accent-secondary': '163 230 53',  // Bright lime
    'accent-foreground': '17 24 39',
    background: '10 10 10',
    'background-secondary': '23 23 23',
    foreground: '250 250 250',
    'foreground-muted': '161 161 170',
    border: '39 39 42',
    'border-light': '63 63 70',
    card: '23 23 23',
    'card-hover': '39 39 42',
    muted: '39 39 42',
    destructive: '239 68 68',
    success: '34 197 94',
    warning: '234 179 8',
    info: '59 130 246',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// ============================================
// MINIMAL THEME - Clean, professional
// ============================================
export const minimalTheme: Theme = {
  name: 'minimal',
  displayName: 'Minimal',
  description: 'Clean, minimalist design with neutral tones',
  light: {
    primary: '15 23 42',              // Slate
    'primary-foreground': '255 255 255',
    secondary: '71 85 105',           // Gray
    'secondary-foreground': '255 255 255',
    accent: '100 116 139',            // Light gray
    'accent-secondary': '148 163 184', // Lighter gray
    'accent-foreground': '255 255 255',
    background: '255 255 255',
    'background-secondary': '248 250 252',
    foreground: '15 23 42',
    'foreground-muted': '100 116 139',
    border: '226 232 240',
    'border-light': '241 245 249',
    card: '255 255 255',
    'card-hover': '248 250 252',
    muted: '241 245 249',
    destructive: '220 38 38',
    success: '22 163 74',
    warning: '202 138 4',
    info: '37 99 235',
  },
  dark: {
    primary: '248 250 252',           // Light slate
    'primary-foreground': '15 23 42',
    secondary: '203 213 225',         // Light gray
    'secondary-foreground': '15 23 42',
    accent: '148 163 184',            // Gray
    'accent-secondary': '203 213 225', // Light gray
    'accent-foreground': '15 23 42',
    background: '15 23 42',
    'background-secondary': '30 41 59',
    foreground: '248 250 252',
    'foreground-muted': '148 163 184',
    border: '51 65 85',
    'border-light': '71 85 105',
    card: '30 41 59',
    'card-hover': '51 65 85',
    muted: '51 65 85',
    destructive: '239 68 68',
    success: '34 197 94',
    warning: '234 179 8',
    info: '59 130 246',
  },
  radius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
  },
}

// ============================================
// RETRO THEME - Vintage, warm colors
// ============================================
export const retroTheme: Theme = {
  name: 'retro',
  displayName: 'Retro Wave',
  description: 'Nostalgic colors inspired by the 80s and 90s',
  light: {
    primary: '234 88 12',             // Orange
    'primary-foreground': '255 255 255',
    secondary: '220 38 38',           // Red
    'secondary-foreground': '255 255 255',
    accent: '234 179 8',              // Yellow
    'accent-secondary': '168 85 247',  // Purple
    'accent-foreground': '255 255 255',
    background: '254 252 232',        // Cream
    'background-secondary': '254 249 195',
    foreground: '71 40 4',
    'foreground-muted': '120 53 15',
    border: '253 224 71',
    'border-light': '254 240 138',
    card: '255 255 255',
    'card-hover': '254 252 232',
    muted: '254 243 199',
    destructive: '220 38 38',
    success: '22 163 74',
    warning: '234 179 8',
    info: '59 130 246',
  },
  dark: {
    primary: '251 146 60',            // Orange
    'primary-foreground': '17 24 39',
    secondary: '239 68 68',           // Red
    'secondary-foreground': '255 255 255',
    accent: '250 204 21',             // Yellow
    'accent-secondary': '192 132 252', // Purple
    'accent-foreground': '17 24 39',
    background: '23 23 23',
    'background-secondary': '38 38 38',
    foreground: '254 243 199',
    'foreground-muted': '212 212 216',
    border: '63 63 70',
    'border-light': '82 82 91',
    card: '38 38 38',
    'card-hover': '52 52 58',
    muted: '63 63 70',
    destructive: '239 68 68',
    success: '34 197 94',
    warning: '250 204 21',
    info: '96 165 250',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
}

// ============================================
// NATURE THEME - Earthy, organic colors
// ============================================
export const natureTheme: Theme = {
  name: 'nature',
  displayName: 'Nature',
  description: 'Earthy, organic colors inspired by nature',
  light: {
    primary: '22 163 74',             // Green
    'primary-foreground': '255 255 255',
    secondary: '101 163 13',          // Olive
    'secondary-foreground': '255 255 255',
    accent: '132 204 22',             // Lime
    'accent-secondary': '234 179 8',   // Gold
    'accent-foreground': '255 255 255',
    background: '250 250 249',        // Stone
    'background-secondary': '245 245 244',
    foreground: '28 25 23',
    'foreground-muted': '87 83 78',
    border: '214 211 209',
    'border-light': '231 229 228',
    card: '255 255 255',
    'card-hover': '250 250 249',
    muted: '245 245 244',
    destructive: '220 38 38',
    success: '22 163 74',
    warning: '234 179 8',
    info: '14 165 233',
  },
  dark: {
    primary: '74 222 128',            // Light green
    'primary-foreground': '20 83 45',
    secondary: '163 230 53',          // Lime
    'secondary-foreground': '20 83 45',
    accent: '132 204 22',             // Green
    'accent-secondary': '250 204 21',  // Yellow
    'accent-foreground': '20 83 45',
    background: '28 25 23',           // Dark stone
    'background-secondary': '41 37 36',
    foreground: '250 250 249',
    'foreground-muted': '168 162 158',
    border: '68 64 60',
    'border-light': '87 83 78',
    card: '41 37 36',
    'card-hover': '57 54 52',
    muted: '68 64 60',
    destructive: '239 68 68',
    success: '74 222 128',
    warning: '250 204 21',
    info: '56 189 248',
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
  pastel: pastelTheme,
  neon: neonTheme,
  minimal: minimalTheme,
  retro: retroTheme,
  nature: natureTheme,
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
 * Get theme colors for a specific mode
 */
export function getThemeColors(
  themeName: ThemeName,
  mode: ThemeMode
): ThemeColors {
  return themes[themeName][mode]
}

/**
 * Convert theme colors to CSS variables
 */
export function themeToCSSVariables(
  themeName: ThemeName,
  mode: ThemeMode
): Record<string, string> {
  const colors = getThemeColors(themeName, mode)
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
export function applyTheme(themeName: ThemeName, mode: ThemeMode): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const cssVars = themeToCSSVariables(themeName, mode)

  // Apply CSS variables
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Apply dark class
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
