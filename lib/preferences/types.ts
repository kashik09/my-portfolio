export type Appearance = 'system' | 'light' | 'dark'
export type ResolvedAppearance = Exclude<Appearance, 'system'>
export type ThemeKey = 'forest' | 'night' | 'charcoal' | 'lemonade'

export interface Preferences {
  appearance: Appearance
  theme: ThemeKey
}

export const DEFAULT_PREFERENCES: Preferences = {
  appearance: 'system',
  theme: 'forest',
}
