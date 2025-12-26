import type { Config } from 'tailwindcss'

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
        background: 'rgb(var(--bg) / <alpha-value>)',
        'background-secondary': 'rgb(var(--surface) / <alpha-value>)',
        foreground: 'rgb(var(--text) / <alpha-value>)',
        'foreground-muted': 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(255 255 255 / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--primary2) / <alpha-value>)',
          foreground: 'rgb(255 255 255 / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--primary2) / <alpha-value>)',
          foreground: 'rgb(255 255 255 / <alpha-value>)',
          secondary: 'rgb(var(--primary) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          light: 'rgb(var(--border) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          hover: 'rgb(var(--surface) / <alpha-value>)',
        },
        muted: 'rgb(var(--surface) / <alpha-value>)',
        destructive: 'rgb(239 68 68 / <alpha-value>)',
        success: 'rgb(34 197 94 / <alpha-value>)',
        warning: 'rgb(234 179 8 / <alpha-value>)',
        info: 'rgb(59 130 246 / <alpha-value>)',
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
  plugins: [],
}

export default config
