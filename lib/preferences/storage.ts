import { Appearance, DEFAULT_PREFERENCES, Preferences, ThemeKey } from './types'

const APPEARANCE_KEY = 'appearance'
const THEME_KEY = 'theme'
const APPEARANCES: Appearance[] = ['system', 'light', 'dark']
const THEMES: ThemeKey[] = ['forest', 'night', 'charcoal']
const LEGACY_THEME_MAP: Record<string, ThemeKey> = {
  obsidian: 'charcoal',
  pearl: 'charcoal',
}

const isBrowser = () => typeof window !== 'undefined'

const isAppearance = (value: unknown): value is Appearance =>
  APPEARANCES.includes(value as Appearance)
const isThemeKey = (value: unknown): value is ThemeKey =>
  THEMES.includes(value as ThemeKey)
const normalizeThemeKey = (value: unknown): ThemeKey => {
  if (typeof value !== 'string') return DEFAULT_PREFERENCES.theme

  const normalized = value.toLowerCase()
  const legacy = LEGACY_THEME_MAP[normalized]

  if (legacy) return legacy
  return isThemeKey(normalized) ? normalized : DEFAULT_PREFERENCES.theme
}

export function loadPreferences(): Preferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES

  try {
    const storedAppearance = window.localStorage.getItem(APPEARANCE_KEY)
    const storedTheme = window.localStorage.getItem(THEME_KEY)

    return {
      appearance: isAppearance(storedAppearance)
        ? storedAppearance
        : DEFAULT_PREFERENCES.appearance,
      theme: normalizeThemeKey(storedTheme),
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(prefs: Preferences): void {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(APPEARANCE_KEY, prefs.appearance)
    window.localStorage.setItem(THEME_KEY, prefs.theme)
  } catch {
    // Ignore storage errors (private browsing, quota, etc).
  }
}
