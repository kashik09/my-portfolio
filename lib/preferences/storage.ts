import {
  Appearance,
  DASHBOARD_ICON_KEYS,
  DEFAULT_PREFERENCES,
  Preferences,
  ThemeKey,
  type DashboardIcon,
} from './types'

const APPEARANCE_KEY = 'appearance'
const THEME_KEY = 'theme'
const DASHBOARD_ICON_KEY = 'dashboardIcon'
const DASHBOARD_SPARKLE_KEY = 'dashboardSparkle'
const APPEARANCES: Appearance[] = ['system', 'light', 'dark']
const THEMES: ThemeKey[] = ['forest', 'night', 'copper']
const DASHBOARD_ICONS: DashboardIcon[] = [...DASHBOARD_ICON_KEYS]
const LEGACY_THEME_MAP: Record<string, ThemeKey> = {
  obsidian: 'copper',
  pearl: 'copper',
  charcoal: 'copper',
}

const isBrowser = () => typeof window !== 'undefined'

const isAppearance = (value: unknown): value is Appearance =>
  APPEARANCES.includes(value as Appearance)
const isThemeKey = (value: unknown): value is ThemeKey =>
  THEMES.includes(value as ThemeKey)
const isDashboardIcon = (value: unknown): value is DashboardIcon =>
  DASHBOARD_ICONS.includes(value as DashboardIcon)
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
    const storedDashboardIcon = window.localStorage.getItem(DASHBOARD_ICON_KEY)
    const storedDashboardSparkle = window.localStorage.getItem(DASHBOARD_SPARKLE_KEY)
    const dashboardSparkle =
      storedDashboardSparkle === null
        ? DEFAULT_PREFERENCES.dashboardSparkle
        : storedDashboardSparkle === 'true'

    return {
      appearance: isAppearance(storedAppearance)
        ? storedAppearance
        : DEFAULT_PREFERENCES.appearance,
      theme: normalizeThemeKey(storedTheme),
      dashboardIcon: isDashboardIcon(storedDashboardIcon)
        ? storedDashboardIcon
        : DEFAULT_PREFERENCES.dashboardIcon,
      dashboardSparkle,
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
    window.localStorage.setItem(DASHBOARD_ICON_KEY, prefs.dashboardIcon)
    window.localStorage.setItem(DASHBOARD_SPARKLE_KEY, String(prefs.dashboardSparkle))
  } catch {
    // Ignore storage errors (private browsing, quota, etc).
  }
}
