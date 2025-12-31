'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StickerField } from './StickerField'
import { PreferencesPanel } from '@/components/features/preferences/PreferencesPanel'
import { normalizePublicPath, truncate } from '@/lib/utils'
import type { ProjectCardData } from '@/components/shared/ProjectCard'

interface IntroCollageProps {
  projects: ProjectCardData[]
  avatarUrl?: string | null
}

const proofItems = [
  'custom-built',
  'component-driven',
  'cms-backed',
  'mobile-first',
  'calm delivery',
]

const noteStickers = [
  'ship in beats',
  'keep it calm',
  'clean handoff',
  'design with rhythm',
  'quiet but sharp',
  'tiny details, big impact',
]

const overlayLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Archive' },
  { href: '/login', label: 'Login' },
]

export function IntroCollage({ projects, avatarUrl }: IntroCollageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hasAvatar, setHasAvatar] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const contactHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : '/contact'

  const navPills = [
    { href: '/projects', label: 'Projects', external: false },
    { href: '/products', label: 'Products', external: false },
    { href: contactHref, label: 'Contact', external: contactHref.startsWith('http') },
  ]

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
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

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
        setMenuOpen(false)
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
  }, [menuOpen])

  const projectStickers = useMemo(
    () =>
      projects.slice(0, 3).map((project) => ({
        id: project.id,
        title: project.title,
        href: `/projects/${project.slug}`,
        imageUrl: normalizePublicPath(project.image),
        note: project.description ? truncate(project.description, 60) : 'featured work',
      })),
    [projects]
  )

  const avatarSrc = normalizePublicPath(avatarUrl) || '/avatar.png'
  const shouldAnimate = isVisible && !reduceMotion
  const profileDelay = !reduceMotion ? { animationDelay: '0ms' } : undefined
  const headlineDelay = !reduceMotion ? { animationDelay: '140ms' } : undefined
  const ctaDelay = !reduceMotion ? { animationDelay: '220ms' } : undefined
  const chipBaseDelay = 300

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh]" data-cinema-intro>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative min-h-[100dvh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-base-content/30 via-transparent to-base-content/55" />
          <div className="absolute -left-16 top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] h-64 w-64 rounded-full bg-primary/15 blur-[120px]" />

          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[64rem] flex-col justify-center px-6 pb-10 pt-16 sm:px-8">
            <div
              className={`flex items-center gap-4 text-base-100/90 ${
                shouldAnimate ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={profileDelay}
            >
              <div className="relative flex size-12 sm:size-14 lg:size-16 items-center justify-center rounded-full border border-base-100/20 bg-base-100/10 text-lg font-semibold">
                {hasAvatar ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarSrc}
                      alt="Kashi avatar"
                      className="h-full w-full rounded-full object-cover"
                      onError={() => setHasAvatar(false)}
                    />
                  </>
                ) : (
                  <span className="text-base-100">K</span>
                )}
                <div className="absolute inset-0 rounded-full ring-2 ring-base-300/60 ring-offset-2 ring-offset-base-content/30" />
              </div>
              <p className="text-xs uppercase tracking-[0.4em]">hey, i&apos;m kashi</p>
            </div>

            <div
              className={`mt-5 space-y-4 text-base-100 ${
                shouldAnimate ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={headlineDelay}
            >
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                i notice friction,
                <span className="block text-base-100/70">then i build fixes.</span>
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-base-100/80 sm:text-lg">
                calm, premium experiences that keep momentum without the noise.
              </p>
            </div>

            <div
              className={`mt-6 flex flex-wrap gap-3 ${
                shouldAnimate ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={ctaDelay}
            >
              <Link href="/projects" className="no-underline">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  see what i&apos;ve built
                </Button>
              </Link>
              <Link href="/products" className="no-underline">
                <Button variant="outline" size="md">
                  products
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-base-100/80">
              {navPills.map((pill) =>
                pill.external ? (
                  <a
                    key={pill.label}
                    href={pill.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-base-100/15 bg-base-100/5 px-3 py-1 transition hover:bg-base-100/10"
                  >
                    {pill.label}
                  </a>
                ) : (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="rounded-full border border-base-100/15 bg-base-100/5 px-3 py-1 transition hover:bg-base-100/10"
                  >
                    {pill.label}
                  </Link>
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {proofItems.map((item, index) => (
                <span
                  key={item}
                  className={`inline-flex items-center rounded-full border border-base-100/10 bg-base-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-base-100/70 ${
                    shouldAnimate ? 'animate-sticker-in' : ''
                  } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={!reduceMotion ? { animationDelay: `${chipBaseDelay + index * 80}ms` } : undefined}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <StickerField
            projects={projectStickers}
            notes={noteStickers}
            isVisible={isVisible}
            reduceMotion={reduceMotion}
          />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setMenuOpen(true)
              setShowPreferences(false)
            }}
            className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-base-100/20 bg-base-content/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-base-100 backdrop-blur-md ${
              reduceMotion ? '' : 'transition-opacity duration-200'
            }`}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="cinema-menu"
          >
            <Menu size={14} />
            menu
          </button>

          {menuOpen && (
            <div
                className={`fixed inset-0 z-[70] flex items-center justify-center bg-base-content/70 backdrop-blur-lg ${
                  reduceMotion ? '' : 'transition-opacity duration-200'
                }`}
              role="dialog"
              aria-modal="true"
              id="cinema-menu"
              onClick={() => setMenuOpen(false)}
            >
              <div
                ref={overlayRef}
                className="relative w-full max-w-xl rounded-3xl border border-base-100/10 bg-base-content/70 px-8 py-10 text-base-100 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="absolute right-5 top-5 rounded-full border border-base-100/20 p-2 text-base-100 hover:bg-base-100/10"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>

                <nav className="space-y-6 text-center">
                  {overlayLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-2xl font-semibold tracking-tight text-base-100/90 hover:text-base-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="block w-full text-2xl font-semibold tracking-tight text-base-100/90 hover:text-base-100"
                    onClick={() => setShowPreferences((prev) => !prev)}
                  >
                    Preferences
                  </button>
                </nav>

                {showPreferences && (
                  <div className="mt-8 rounded-2xl border border-base-100/10 bg-base-100/5 p-5 text-left">
                    <p className="text-xs uppercase tracking-[0.3em] text-base-100/60">Preferences</p>
                    <div className="mt-4">
                      <PreferencesPanel />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
