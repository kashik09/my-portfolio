'use client'

import { SessionProvider } from 'next-auth/react'
import { VibeyBackdrop } from '@/components/VibeyBackdrop'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <VibeyBackdrop className="min-h-screen">
        {children}
      </VibeyBackdrop>
    </SessionProvider>
  )
}
