'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'
import { VibeyBackdrop } from '@/components/VibeyBackdrop'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <VibeyBackdrop className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 md:px-8 lg:px-12 py-8">
          {children}
        </main>
        <Footer />
      </VibeyBackdrop>
    </SessionProvider>
  )
}
