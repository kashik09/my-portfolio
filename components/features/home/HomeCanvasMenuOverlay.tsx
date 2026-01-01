'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Palette, X } from 'lucide-react'

const PreferencesModal = dynamic(
  () =>
    import('@/components/features/preferences/PreferencesModal').then(
      (mod) => mod.PreferencesModal
    ),
  { ssr: false }
)

const overlayLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
]

interface HomeCanvasMenuOverlayProps {
  contactHref: string
  onClose: () => void
  menuButtonRef: MutableRefObject<HTMLButtonElement | null>
}

export function HomeCanvasMenuOverlay({
  contactHref,
  onClose,
  menuButtonRef,
}: HomeCanvasMenuOverlayProps) {
  const [showPreferences, setShowPreferences] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = 'hidden'

    const focusFirst = () => {
      const overlay = overlayRef.current
      if (!overlay) return
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      focusable[0]?.focus()
    }

    focusFirst()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const overlay = overlayRef.current
      if (!overlay) return

      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const isShift = event.shiftKey

      if (!isShift && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }

      if (isShift && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      menuButton?.focus()
    }
  }, [menuButtonRef, onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-base-200/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      id="cinema-menu"
      onClick={onClose}
    >
      <div
        ref={overlayRef}
        className="relative w-full max-w-xl rounded-2xl border border-base-300/60 bg-base-100 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 px-6 py-8 text-base-content shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="group absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-base-300/60 bg-base-200/60 text-base-content/50 transition-all duration-150 hover:border-primary/30 hover:bg-primary/10"
          aria-label="Close menu"
        >
          <X size={16} className="text-base-content/50 transition-colors duration-150 group-hover:text-primary" />
        </button>

        <nav className="space-y-2 text-left">
          {overlayLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-4 py-2 text-2xl font-semibold tracking-tight text-base-content/90 transition-all duration-150 hover:translate-x-1 hover:bg-primary/10 hover:text-primary"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
          {contactHref.startsWith('http') ? (
            <a
              href={contactHref}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-4 py-2 text-2xl font-semibold tracking-tight text-base-content/90 transition-all duration-150 hover:translate-x-1 hover:bg-primary/10 hover:text-primary"
            >
              Contact
            </a>
          ) : (
            <Link
              href={contactHref}
              className="block rounded-md px-4 py-2 text-2xl font-semibold tracking-tight text-base-content/90 transition-all duration-150 hover:translate-x-1 hover:bg-primary/10 hover:text-primary"
              onClick={onClose}
            >
              Contact
            </Link>
          )}
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-start gap-2 rounded-md border-t border-base-300/60 bg-primary/5 px-4 py-2 pt-4 text-xl font-semibold tracking-tight text-base-content/80 transition-all duration-150 hover:translate-x-1 hover:bg-primary/15 hover:text-primary"
            onClick={() => setShowPreferences(true)}
          >
            <Palette size={18} className="text-base-content/60" />
            Preferences
          </button>
        </nav>
      </div>

      {showPreferences && (
        <PreferencesModal onClose={() => setShowPreferences(false)} />
      )}
    </div>
  )
}
