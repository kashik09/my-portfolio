import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CookieNotice } from '@/components/CookieNotice'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Providers } from './Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kashi Kweyu | Junior Developer',
  description: 'Portfolio of Kashi Kweyu - Junior Developer',
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
      data-theme="light"
      data-mode="formal"
    >
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <CookieNotice />
      </body>
    </html>
  )
}
