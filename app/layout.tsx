import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// ============================================
// FONTS
// ============================================
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

// ============================================
// METADATA
// ============================================
export const metadata: Metadata = {
  title: {
    default: 'KashiCoding - Portfolio & Services',
    template: '%s | KashiCoding',
  },
  description:
    'Professional web development services and portfolio. Built with Next.js 14, TypeScript, and Tailwind CSS.',
  keywords: [
    'web development',
    'portfolio',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'full-stack development',
  ],
  authors: [{ name: 'KashiCoding' }],
  creator: 'KashiCoding',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kashicoding.com',
    title: 'KashiCoding - Portfolio & Services',
    description:
      'Professional web development services and portfolio. Built with Next.js 14, TypeScript, and Tailwind CSS.',
    siteName: 'KashiCoding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KashiCoding - Portfolio & Services',
    description:
      'Professional web development services and portfolio. Built with Next.js 14, TypeScript, and Tailwind CSS.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

// ============================================
// ROOT LAYOUT
// ============================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          defaultTheme="minimal"
          defaultMode="light"
          storageKey="kashicoding-theme"
          enableTransitions={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
