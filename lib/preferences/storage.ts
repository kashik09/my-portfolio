import { Appearance, DEFAULT_PREFERENCES, Preferences, ThemeKey } from './types'

const APPEARANCE_KEY = 'appearance'
const THEME_KEY = 'theme'
const APPEARANCES: Appearance[] = ['system', 'light', 'dark']
const THEMES: ThemeKey[] = ['forest', 'obsidian', 'synthwave', 'night', 'cyberpunk', 'black']

const isBrowser = () => typeof window !== 'undefined'

const isAppearance = (value: unknown): value is Appearance =>
  APPEARANCES.includes(value as Appearance)
const isThemeKey = (value: unknown): value is ThemeKey =>
  THEMES.includes(value as ThemeKey)

export function loadPreferences(): Preferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES

  try {
    const storedAppearance = window.localStorage.getItem(APPEARANCE_KEY)
    const storedTheme = window.localStorage.getItem(THEME_KEY)

    return {
      appearance: isAppearance(storedAppearance)
        ? storedAppearance
        : DEFAULT_PREFERENCES.appearance,
      theme: isThemeKey(storedTheme) ? storedTheme : DEFAULT_PREFERENCES.theme,
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
