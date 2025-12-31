'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

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
      className="fixed inset-0 z-[70] flex items-center justify-center bg-base-200/70 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      id="cinema-menu"
      onClick={onClose}
    >
      <div
        ref={overlayRef}
        className="relative w-full max-w-xl rounded-3xl border border-base-300 bg-base-200/70 px-8 py-10 text-base-content shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-base-300 p-2 text-base-content hover:bg-base-100/10"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>

        <nav className="space-y-6 text-center">
          {overlayLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-2xl font-semibold tracking-tight text-base-content/90 hover:text-base-content"
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
              className="block text-2xl font-semibold tracking-tight text-base-content/90 hover:text-base-content"
            >
              Contact
            </a>
          ) : (
            <Link
              href={contactHref}
              className="block text-2xl font-semibold tracking-tight text-base-content/90 hover:text-base-content"
              onClick={onClose}
            >
              Contact
            </Link>
          )}
          <button
            type="button"
            className="block w-full text-2xl font-semibold tracking-tight text-base-content/90 hover:text-base-content"
            onClick={() => setShowPreferences(true)}
          >
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
