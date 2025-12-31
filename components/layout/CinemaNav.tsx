'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

interface CinemaNavProps {
  enabled: boolean
  active: boolean
}

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: 'https://wa.me/256760637783', label: 'Contact' },
]

export function CinemaNav({ enabled, active }: CinemaNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const hideTimer = useRef<number | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)

    update()

    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [])

  useEffect(() => {
    if (enabled && active) return

    const resetId = window.setTimeout(() => {
      setIsOpen(false)
      setIsVisible(false)
    }, 0)

    return () => window.clearTimeout(resetId)
  }, [active, enabled])

  useEffect(() => {
    if (!enabled || !active) {
      return
    }

    const reveal = () => {
      setIsVisible(true)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      if (!isOpen) {
        hideTimer.current = window.setTimeout(() => {
          setIsVisible(false)
        }, 4000)
      }
    }

    const onScroll = () => reveal()
    const onMouseMove = () => reveal()
    const onTouch = () => reveal()
    const onKey = () => reveal()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('keydown', onKey)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [active, enabled, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const buttonNode = buttonRef.current

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
        setIsOpen(false)
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
      buttonNode?.focus()
    }
  }, [isOpen])

  if (!enabled || !active) return null

  const shouldShow = isVisible || isOpen
  const buttonClass = shouldShow ? 'opacity-90' : 'opacity-0 pointer-events-none'

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(true)
          setIsVisible(true)
        }}
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-base-100/20 bg-base-content/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-base-100 backdrop-blur-md ${
          reduceMotion ? '' : 'transition-opacity duration-200'
        } ${buttonClass}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="cinema-nav"
      >
        <Menu size={14} />
        menu
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-base-content/70 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          id="cinema-nav"
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={overlayRef}
            className="relative w-full max-w-xl rounded-3xl border border-base-100/10 bg-base-content/70 px-8 py-10 text-base-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full border border-base-100/20 p-2 text-base-100 hover:bg-base-100/10"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>

            <nav className="space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-2xl font-semibold tracking-tight text-base-100/90 hover:text-base-100"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
