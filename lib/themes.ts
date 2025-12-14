import { Moon, CloudMoon, Palette, Sun, LucideIcon } from 'lucide-react'

export type ThemeName = 'onedark' | 'tokyonight' | 'monokai' | 'githublight'

export interface Theme {
  name: string
  value: ThemeName
  icon: LucideIcon
}

export const themes: Record<ThemeName, Theme> = {
  onedark: {
    name: 'One Dark Pro',
    value: 'onedark',
    icon: Moon,
  },
  tokyonight: {
    name: 'Tokyo Night',
    value: 'tokyonight',
    icon: CloudMoon,
  },
  monokai: {
    name: 'Monokai Pro',
    value: 'monokai',
    icon: Palette,
  },
  githublight: {
    name: 'GitHub Light',
    value: 'githublight',
    icon: Sun,
  },
}

export const defaultTheme: ThemeName = 'onedark'