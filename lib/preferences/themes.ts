import type { ResolvedAppearance, ThemeKey } from './types'

export const THEME_KEYS: ThemeKey[] = [
  'forest',
  'obsidian',
  'synthwave',
  'night',
  'cyberpunk',
  'black'
]

const DARK_LABELS: Record<ThemeKey, string> = {
  forest: 'Forest',
  obsidian: 'Obsidian',
  synthwave: 'Synthwave',
  night: 'Night',
  cyberpunk: 'Cyberpunk',
  black: 'Black'
}

const LIGHT_LABELS: Record<ThemeKey, string> = {
  forest: 'Moss',
  obsidian: 'Pearl',
  synthwave: 'Aurora',
  night: 'Skyline',
  cyberpunk: 'Prism',
  black: 'White'
}

export function getThemeLabel(appearance: ResolvedAppearance, key: ThemeKey) {
  return appearance === 'dark' ? DARK_LABELS[key] : LIGHT_LABELS[key]
}
