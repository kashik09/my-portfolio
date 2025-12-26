'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'
import { VibeyBackdrop } from '@/components/VibeyBackdrop'
import { usePathname } from 'next/navigation'
import { CinemaNav } from '@/components/nav/CinemaNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const cinemaActive = isHome
  const mainClassName = isHome
    ? 'flex-1'
    : 'flex-1 container mx-auto px-6 md:px-8 lg:px-12 py-8'

  return (
    <SessionProvider>
      <VibeyBackdrop className="min-h-screen flex flex-col">
        {!cinemaActive && <Header />}
        <main className={mainClassName}>
          {children}
        </main>
        {!cinemaActive && <Footer />}
        <CinemaNav enabled={isHome} active={cinemaActive} />
      </VibeyBackdrop>
    </SessionProvider>
  )
}
