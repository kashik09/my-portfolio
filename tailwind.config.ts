import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
        pixel: ['var(--font-ibm-plex)', 'IBM Plex Mono', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--b1) / <alpha-value>)',
        'background-secondary': 'oklch(var(--b2) / <alpha-value>)',
        foreground: 'oklch(var(--bc) / <alpha-value>)',
        'foreground-muted': 'oklch(var(--bc) / 0.7)',
        'muted-foreground': 'oklch(var(--bc) / 0.65)',
        primary: {
          DEFAULT: 'oklch(var(--p) / <alpha-value>)',
          foreground: 'oklch(var(--pc) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--s) / <alpha-value>)',
          foreground: 'oklch(var(--sc) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--a) / <alpha-value>)',
          foreground: 'oklch(var(--ac) / <alpha-value>)',
          secondary: 'oklch(var(--p) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'oklch(var(--b3) / <alpha-value>)',
          light: 'oklch(var(--b3) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--b2) / <alpha-value>)',
          hover: 'oklch(var(--b1) / <alpha-value>)',
        },
        muted: 'oklch(var(--b2) / <alpha-value>)',
        destructive: 'oklch(var(--er) / <alpha-value>)',
        success: 'oklch(var(--su) / <alpha-value>)',
        warning: 'oklch(var(--wa) / <alpha-value>)',
        info: 'oklch(var(--in) / <alpha-value>)',
      },
      keyframes: {
        'slide-fade': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'sticker-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(24px) translateX(-18px) rotate(-4deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) translateX(0) rotate(0deg)',
          },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-fade':
          'slide-fade 300ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        'sticker-in': 'sticker-in 500ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [daisyui],
  // @ts-ignore
  daisyui: {
    // Only include themes actually used by the app (reduced from 13 to 6 for better performance)
    // forest → Forest (dark) / Moss (light)
    // night → Night (dark) / Skyline (light)
    // charcoal → Charcoal (dark) / Linen (light)
    themes: ['forest', 'moss', 'night', 'skyline', 'charcoal', 'linen'],
    darkTheme: 'forest',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false, // Disable logs for production
  },
}

export default config
