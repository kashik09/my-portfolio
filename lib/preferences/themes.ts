import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS: ThemeKey[] = [
  'forest',
  'night',
  'charcoal'
]

const THEME_LABELS_DARK: Record<ThemeKey, string> = {
  forest: 'Forest',
  night: 'Night',
  charcoal: 'Charcoal'
}

const THEME_LABELS_LIGHT: Record<ThemeKey, string> = {
  forest: 'Moss',
  night: 'Skyline',
  charcoal: 'Amber'
}

export function getThemeLabel(appearance: ResolvedAppearance, key: ThemeKey) {
  return appearance === 'light' ? THEME_LABELS_LIGHT[key] : THEME_LABELS_DARK[key]
}
