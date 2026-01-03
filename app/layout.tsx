import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { CookieNotice } from '@/components/shared/CookieNotice'
import './globals.css'
import { Providers } from './Providers'

// System font stack - offline-safe, no network required
const systemFontStack = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
const THEME_BOOTSTRAP = `(() => {
  const root = document.documentElement
  const themePairs = {
    forest: { dark: 'forest', light: 'moss' },
    night: { dark: 'night', light: 'skyline' },
    copper: { dark: 'copper', light: 'amber' },
  }
  const themeKeys = Object.keys(themePairs)
  const appearanceKeys = ['light', 'dark', 'system']
  const legacyThemeMap = {
    obsidian: 'copper',
    pearl: 'copper',
    charcoal: 'copper',
  }

  const getSystemAppearance = () => {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch (error) {
      return 'light'
    }
  }

  const normalizeThemeKey = (value) => {
    if (typeof value !== 'string') return 'forest'
    const normalized = value.toLowerCase()
    const legacy = legacyThemeMap[normalized]
    if (legacy) return legacy
    return themeKeys.includes(normalized) ? normalized : 'forest'
  }
  const safeAppearance = (value) => (appearanceKeys.includes(value) ? value : 'system')
  const applyTheme = (appearance, themeName) => {
    root.setAttribute('data-appearance', appearance)
    root.setAttribute('data-theme', themeName)
  }

  try {
    const storedTheme = localStorage.getItem('theme')
    const storedAppearance = localStorage.getItem('appearance')
    const themeKey = normalizeThemeKey(storedTheme)
    const appearance = safeAppearance(storedAppearance)
    const resolvedAppearance =
      appearance === 'system' ? getSystemAppearance() : appearance
    const resolvedTheme =
      (themePairs[themeKey] && themePairs[themeKey][resolvedAppearance]) ||
      themePairs.forest[resolvedAppearance]

    applyTheme(resolvedAppearance, resolvedTheme)
  } catch (error) {
    const resolvedAppearance = getSystemAppearance()
    const resolvedTheme = themePairs.forest[resolvedAppearance]
    applyTheme(resolvedAppearance, resolvedTheme)
  }
})()`

export const metadata: Metadata = {
  title: 'Kashi Kweyu | digital builder',
  description: 'Portfolio of Kashi Kweyu — building calm, useful products.',
  icons: {
    icon: [
      { url: '/icon-light.svg', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg', media: '(prefers-color-scheme: dark)' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-appearance="dark"
      data-theme="forest"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
        />
      </head>
      <body className="bg-base-100 text-base-content" style={{ fontFamily: systemFontStack }}>
        <Providers>{children}</Providers>
        <Analytics />
        <CookieNotice />
      </body>
    </html>
  )
}
