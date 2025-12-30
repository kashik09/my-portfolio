import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { CookieNotice } from '@/components/shared/CookieNotice'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Providers } from './Providers'

const inter = Inter({ subsets: ['latin'] })
const THEME_BOOTSTRAP = `(() => {
  try {
    const root = document.documentElement
    const storedTheme = localStorage.getItem('theme')
    const storedAppearance = localStorage.getItem('appearance')
    const theme =
      storedTheme === 'forest' || storedTheme === 'night' || storedTheme === 'charcoal'
        ? storedTheme
        : 'forest'
    const appearance =
      storedAppearance === 'light' || storedAppearance === 'dark' || storedAppearance === 'system'
        ? storedAppearance
        : 'system'
    const resolvedAppearance =
      appearance === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : appearance
    const themePairs = {
      forest: { dark: 'forest', light: 'moss' },
      night: { dark: 'night', light: 'skyline' },
      charcoal: { dark: 'obsidian', light: 'pearl' },
    }
    const resolvedTheme =
      resolvedAppearance === 'dark'
        ? themePairs[theme].dark
        : themePairs[theme].light
    root.setAttribute('data-appearance', resolvedAppearance)
    root.setAttribute('data-theme', resolvedTheme)
  } catch (error) {
    // Ignore storage and matchMedia failures.
  }
})()`

export const metadata: Metadata = {
  title: 'Kashi Kweyu | digital builder',
  description: 'Portfolio of Kashi Kweyu — building calm, useful products.',
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
      suppressHydrationWarning
    >
      <Script
        id="theme-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
      />
      <body className={`${inter.className} bg-base-100 text-base-content`}>
        <Providers>{children}</Providers>
        <Analytics />
        <CookieNotice />
      </body>
    </html>
  )
}
