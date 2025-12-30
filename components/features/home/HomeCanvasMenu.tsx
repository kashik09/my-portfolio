'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import type { RefObject } from 'react'

const PreferencesPanel = dynamic(
  () =>
    import('@/components/features/preferences/PreferencesPanel').then(
      (mod) => mod.PreferencesPanel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs uppercase tracking-[0.3em] text-base-content/60">
        loading...
      </div>
    ),
  }
)

interface OverlayLink {
  href: string
  label: string
}

export function HomeCanvasMenu({
  menuOpen,
  showPreferences,
  overlayLinks,
  contactHref,
  menuButtonRef,
  overlayRef,
  onOpen,
  onClose,
  onTogglePreferences,
}: {
  menuOpen: boolean
  showPreferences: boolean
  overlayLinks: OverlayLink[]
  contactHref: string
  menuButtonRef: RefObject<HTMLButtonElement>
  overlayRef: RefObject<HTMLDivElement>
  onOpen: () => void
  onClose: () => void
  onTogglePreferences: () => void
}) {
  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-base-content backdrop-blur-md transition"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        aria-controls="cinema-menu"
      >
        <Menu size={14} />
        menu
      </button>

      {menuOpen && (
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
                onClick={onTogglePreferences}
              >
                Preferences
              </button>
            </nav>

            {showPreferences && (
              <div className="mt-8 rounded-2xl border border-base-300 bg-base-100/5 p-5 text-left">
                <p className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                  Preferences
                </p>
                <div className="mt-4">
                  <PreferencesPanel />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
