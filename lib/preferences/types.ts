export type Appearance = 'system' | 'light' | 'dark'
export type ResolvedAppearance = Exclude<Appearance, 'system'>
export type ThemeKey = 'forest' | 'night' | 'copper'
export const DASHBOARD_ICON_KEYS = [
  'layout-dashboard',
  'home',
  'star',
  'sparkles',
  'heart',
  'shopping-bag',
  'zap',
  'crown',
] as const
export type DashboardIcon = (typeof DASHBOARD_ICON_KEYS)[number]

export interface Preferences {
  appearance: Appearance
  theme: ThemeKey
  dashboardIcon: DashboardIcon
  dashboardSparkle: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  appearance: 'system',
  theme: 'forest',
  dashboardIcon: 'layout-dashboard',
  dashboardSparkle: false,
}
