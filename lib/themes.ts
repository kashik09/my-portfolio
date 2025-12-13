import { Moon, CloudMoon, Palette, Sun, LucideIcon } from 'lucide-react'

export interface Theme {
  name: string
  value: ThemeName
  icon: LucideIcon
}

export const themes = {
  onedark: {
    name: 'One Dark Pro',
    value: 'onedark' as const,
    icon: Moon,
  },
  monokai: {
    name: 'Monokai Pro',
    value: 'monokai' as const,
    icon: Palette,
  },
  tokyonight: {
    name: 'Tokyo Night',
    value: 'tokyonight' as const,
    icon: CloudMoon,
  },
  githublight: {
    name: 'GitHub Light',
    value: 'githublight' as const,
    icon: Sun,
  },
} as const

export type ThemeName = keyof typeof themes
export const defaultTheme: ThemeName = 'onedark'

// Helper function to get themes as an array
export function getThemesArray() {
  return Object.entries(themes).map(([key, value]) => ({
    key: key as ThemeName,
    ...value
  }))
}
