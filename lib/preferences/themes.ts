import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS: ThemeKey[] = [
  'forest',
  'night',
  'charcoal'
]

const THEME_LABELS: Record<ThemeKey, string> = {
  forest: 'Forest',
  night: 'Night',
  charcoal: 'Charcoal'
}

export function getThemeLabel(_appearance: ResolvedAppearance, key: ThemeKey) {
  return THEME_LABELS[key]
}
