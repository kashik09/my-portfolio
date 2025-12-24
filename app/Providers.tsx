'use client'

import type { ReactNode } from 'react'
import { PreferencesProvider } from '@/lib/preferences/PreferencesContext'
import { PreferencesGate } from '@/components/preferences/PreferencesGate'
import { ToastProvider } from '@/components/ui/Toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <PreferencesGate />
        {children}
      </ToastProvider>
    </PreferencesProvider>
  )
}
