import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ui/Toast'
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
    default: 'Kashi Kweyu - Portfolio & Services',
    template: '%s | Kashi Kweyu',
  },
  description:
    'Portfolio and web development services by Ashanti Kweyu (Kashi) - Junior Developer from Kampala, Uganda. Built with Next.js 14, TypeScript, and Tailwind CSS.',
  keywords: [
    'web development',
    'portfolio',
    'Kashi Kweyu',
    'Ashanti Kweyu',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Uganda developer',
    'Kampala',
  ],
  authors: [{ name: 'Ashanti Kweyu (Kashi)' }],
  creator: 'Kashi Kweyu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kashikweyu.com',
    title: 'Kashi Kweyu - Portfolio & Services',
    description:
      'Portfolio and web development services by Ashanti Kweyu (Kashi) - Junior Developer from Kampala, Uganda.',
    siteName: 'Kashi Kweyu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kashi Kweyu - Portfolio & Services',
    description:
      'Portfolio and web development services by Ashanti Kweyu (Kashi) - Junior Developer from Kampala, Uganda.',
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
          defaultTheme="monokai"
          storageKey="kashicoding-theme"
          enableTransitions={true}
        >
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
