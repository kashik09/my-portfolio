import { Moon, Sunset, Palette, Sun } from 'lucide-react'

export const themes = {
  onedark: {
    name: 'One Dark Pro',
    value: 'onedark',
    icon: Moon,
  },
  tokyonight: {
    name: 'Tokyo Night',
    value: 'tokyonight',
    icon: Sunset,
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
} as const

export type ThemeName = keyof typeof themes
export const defaultTheme: ThemeName = 'onedark'
