'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PreferencesPanel } from '@/components/preferences/PreferencesPanel'
import { normalizePublicPath, truncate } from '@/lib/utils'
import type { ProjectCardData } from '@/components/ProjectCard'

type LayoutPreset = 'mobile' | 'tablet' | 'desktop'
type CanvasMode = 'default' | 'projects' | 'products' | 'contact'
type Lane = 'anchor' | 'ambient' | 'context'

interface CanvasCard {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  href: string
  meta?: string
}

interface SceneObject {
  id: string
  kind: 'card' | 'chip'
  top: string
  left: string
  rotate: number
  scale: number
  lane: Lane
  size: 'sm' | 'md' | 'lg'
  variant: 'primary' | 'secondary'
  label?: string
  cardIndex?: number
  group?: string
  zIndex?: number
}

const desktopObjects: SceneObject[] = [
  {
    id: 'card-primary',
    kind: 'card',
    top: '18%',
    left: '56%',
    rotate: 2,
    scale: 1,
    lane: 'context',
    size: 'lg',
    variant: 'primary',
    cardIndex: 0,
    group: 'right',
    zIndex: 30,
  },
  {
    id: 'card-secondary',
    kind: 'card',
    top: '54%',
    left: '63%',
    rotate: -3,
    scale: 0.98,
    lane: 'context',
    size: 'md',
    variant: 'secondary',
    cardIndex: 1,
    group: 'right',
    zIndex: 28,
  },
  {
    id: 'card-tertiary',
    kind: 'card',
    top: '32%',
    left: '74%',
    rotate: 5,
    scale: 0.94,
    lane: 'context',
    size: 'sm',
    variant: 'secondary',
    cardIndex: 2,
    group: 'right',
    zIndex: 24,
  },
  {
    id: 'chip-1',
    kind: 'chip',
    top: '14%',
    left: '10%',
    rotate: -6,
    scale: 1,
    lane: 'ambient',
    size: 'md',
    variant: 'primary',
    label: 'ship in beats',
    group: 'left',
    zIndex: 18,
  },
  {
    id: 'chip-2',
    kind: 'chip',
    top: '32%',
    left: '18%',
    rotate: 4,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'secondary',
    label: 'keep it calm',
    group: 'left',
    zIndex: 17,
  },
  {
    id: 'chip-3',
    kind: 'chip',
    top: '58%',
    left: '12%',
    rotate: -2,
    scale: 1,
    lane: 'ambient',
    size: 'md',
    variant: 'primary',
    label: 'clean handoff',
    group: 'left',
    zIndex: 16,
  },
  {
    id: 'chip-4',
    kind: 'chip',
    top: '22%',
    left: '68%',
    rotate: 5,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'secondary',
    label: 'design with rhythm',
    group: 'right',
    zIndex: 16,
  },
  {
    id: 'chip-5',
    kind: 'chip',
    top: '70%',
    left: '46%',
    rotate: -4,
    scale: 1,
    lane: 'ambient',
    size: 'md',
    variant: 'primary',
    label: 'tiny details',
    group: 'center',
    zIndex: 15,
  },
  {
    id: 'chip-6',
    kind: 'chip',
    top: '40%',
    left: '36%',
    rotate: 3,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'secondary',
    label: 'quiet but sharp',
    group: 'center',
    zIndex: 14,
  },
]

const tabletObjects: SceneObject[] = [
  {
    id: 'card-primary',
    kind: 'card',
    top: '22%',
    left: '50%',
    rotate: 2,
    scale: 1,
    lane: 'context',
    size: 'lg',
    variant: 'primary',
    cardIndex: 0,
    group: 'right',
    zIndex: 28,
  },
  {
    id: 'card-secondary',
    kind: 'card',
    top: '58%',
    left: '56%',
    rotate: -2,
    scale: 0.96,
    lane: 'context',
    size: 'md',
    variant: 'secondary',
    cardIndex: 1,
    group: 'right',
    zIndex: 26,
  },
  {
    id: 'chip-1',
    kind: 'chip',
    top: '18%',
    left: '8%',
    rotate: -6,
    scale: 1,
    lane: 'ambient',
    size: 'md',
    variant: 'primary',
    label: 'ship in beats',
    group: 'left',
    zIndex: 16,
  },
  {
    id: 'chip-2',
    kind: 'chip',
    top: '46%',
    left: '12%',
    rotate: 3,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'secondary',
    label: 'component-driven',
    group: 'left',
    zIndex: 15,
  },
  {
    id: 'chip-3',
    kind: 'chip',
    top: '72%',
    left: '18%',
    rotate: -3,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'primary',
    label: 'clean handoff',
    group: 'left',
    zIndex: 14,
  },
]

const mobileObjects: SceneObject[] = [
  {
    id: 'card-primary',
    kind: 'card',
    top: '52%',
    left: '8%',
    rotate: 1,
    scale: 1,
    lane: 'context',
    size: 'lg',
    variant: 'primary',
    cardIndex: 0,
    group: 'center',
    zIndex: 22,
  },
  {
    id: 'chip-1',
    kind: 'chip',
    top: '18%',
    left: '10%',
    rotate: -4,
    scale: 1,
    lane: 'ambient',
    size: 'md',
    variant: 'primary',
    label: 'ship in beats',
    group: 'left',
    zIndex: 14,
  },
  {
    id: 'chip-2',
    kind: 'chip',
    top: '78%',
    left: '14%',
    rotate: 2,
    scale: 1,
    lane: 'ambient',
    size: 'sm',
    variant: 'secondary',
    label: 'quiet but sharp',
    group: 'left',
    zIndex: 13,
  },
]

const layoutObjects: Record<LayoutPreset, SceneObject[]> = {
  desktop: desktopObjects,
  tablet: tabletObjects,
  mobile: mobileObjects,
}

const overlayLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Archive' },
  { href: '/login', label: 'Login' },
]

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function HomeCanvas({
  projects,
  products,
  avatarUrl,
}: {
  projects: ProjectCardData[]
  products: CanvasCard[]
  avatarUrl?: string | null
}) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [layout, setLayout] = useState<LayoutPreset>('desktop')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [mode, setMode] = useState<CanvasMode>('default')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hasAvatar, setHasAvatar] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const contactHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : '/contact'

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
    if (typeof window === 'undefined') return

    const queryMobile = window.matchMedia('(max-width: 639px)')
    const queryTablet = window.matchMedia('(min-width: 640px) and (max-width: 1023px)')

    const update = () => {
      if (queryMobile.matches) {
        setLayout('mobile')
      } else if (queryTablet.matches) {
        setLayout('tablet')
      } else {
        setLayout('desktop')
      }
    }

    update()

    if (queryMobile.addEventListener) {
      queryMobile.addEventListener('change', update)
      queryTablet.addEventListener('change', update)
      return () => {
        queryMobile.removeEventListener('change', update)
        queryTablet.removeEventListener('change', update)
      }
    }

    queryMobile.addListener(update)
    queryTablet.addListener(update)
    return () => {
      queryMobile.removeListener(update)
      queryTablet.removeListener(update)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const track = trackRef.current
    if (!canvas || !track) return

    let rafId: number | null = null

    const updateProgress = () => {
      if (reduceMotion) {
        canvas.style.setProperty('--progress', '0')
        canvas.style.setProperty('--loop', '0')
        canvas.style.setProperty('--energy', '1')
        canvas.style.setProperty('--calm', '0')
        return
      }

      const rect = track.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const total = Math.max(rect.height - viewport, 1)
      const scrolled = clamp(-rect.top, 0, total)
      const progress = clamp(scrolled / total, 0, 1)
      const loop = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2)
      const calm = progress > 0.76 ? (progress - 0.76) / 0.24 : 0
      const energy = 1 - calm * 0.6

      canvas.style.setProperty('--progress', progress.toFixed(4))
      canvas.style.setProperty('--loop', loop.toFixed(4))
      canvas.style.setProperty('--energy', energy.toFixed(4))
      canvas.style.setProperty('--calm', calm.toFixed(4))
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        updateProgress()
      })
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
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
      menuButtonRef.current?.focus()
    }
  }, [menuOpen])

  const projectCards = useMemo<CanvasCard[]>(
    () =>
      projects.slice(0, 3).map((project) => ({
        id: project.id,
        title: project.title,
        description: truncate(project.description || 'Featured build', 110),
        imageUrl: normalizePublicPath(project.image),
        href: `/projects/${project.slug}`,
        meta: project.category || 'featured',
      })),
    [projects]
  )

  const productCards = useMemo<CanvasCard[]>(() => {
    if (products.length > 0) return products

    return [
      {
        id: 'product-placeholder-1',
        title: 'Signature packs',
        description: 'Curated assets and patterns, shipping soon.',
        href: '/products',
        meta: 'coming soon',
      },
      {
        id: 'product-placeholder-2',
        title: 'Design systems',
        description: 'Reusable component libraries for calm delivery.',
        href: '/products',
        meta: 'coming soon',
      },
      {
        id: 'product-placeholder-3',
        title: 'Private drops',
        description: 'Limited releases when the timing is right.',
        href: '/products',
        meta: 'coming soon',
      },
    ]
  }, [products])

  const cardsForMode = mode === 'products' ? productCards : projectCards
  const showContactPanel = mode === 'contact'

  const objects = layoutObjects[layout]
  const avatarSrc = normalizePublicPath(avatarUrl) || null

  const handleModeLink = (event: React.MouseEvent<HTMLAnchorElement>, nextMode: CanvasMode) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()
    setMode(nextMode)
  }

  return (
    <div ref={trackRef} className="relative min-h-[360vh]">
      <div
        ref={canvasRef}
        className="canvas-root sticky top-0 h-[100dvh] w-full overflow-hidden"
        data-mode={mode}
        data-layout={layout}
        data-reduced={reduceMotion ? 'true' : 'false'}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70" />
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute bottom-[-25%] right-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute right-[18%] top-[18%] h-40 w-40 rounded-full bg-white/5 blur-[90px]" />
        </div>

        <div className="absolute inset-0">
          {objects.map((object, index) => {
            const laneBase = object.lane === 'anchor' ? 4 : object.lane === 'ambient' ? 10 : 16
            const driftX = (index % 2 === 0 ? 1 : -1) * (laneBase + index * 2)
            const driftY = (index % 3 - 1) * (laneBase + 4)
            const parallax = object.lane === 'anchor' ? 4 : object.lane === 'ambient' ? 7 : 12
            const sizeClass =
              object.kind === 'card'
                ? {
                    sm: 'w-[240px] sm:w-[260px]',
                    md: 'w-[280px] sm:w-[300px]',
                    lg: 'w-[min(22rem,calc(100vw-3rem))] sm:w-[320px]',
                  }[object.size]
                : {
                    sm: 'px-3 py-2 text-[0.6rem] tracking-[0.25em]',
                    md: 'px-4 py-2 text-[0.65rem] tracking-[0.28em]',
                    lg: 'px-5 py-3 text-[0.75rem] tracking-[0.3em]',
                  }[object.size]

            const isCard = object.kind === 'card'
            const cardData = isCard
              ? cardsForMode[object.cardIndex ?? 0] ?? cardsForMode[0]
              : null
            const isHovered = isCard && hoveredCard === cardData?.id
            const dimmedByHover = hoveredCard && !isHovered && object.kind !== 'card'
            const dimmedCard =
              hoveredCard && isCard && hoveredCard !== cardData?.id
            const style = {
              top: object.top,
              left: object.left,
              zIndex: object.zIndex ?? 10,
              ['--rotate' as string]: `${object.rotate}deg`,
              ['--scale' as string]: object.scale.toString(),
              ['--hover-scale' as string]: isHovered ? '1.02' : '1',
              ['--drift-x' as string]: driftX.toString(),
              ['--drift-y' as string]: driftY.toString(),
              ['--parallax' as string]: parallax.toString(),
              ['--opacity' as string]: object.kind === 'card' ? '0.96' : '0.9',
            } as React.CSSProperties

            return (
              <div
                key={object.id}
                className={`canvas-item ${sizeClass} ${dimmedByHover || dimmedCard ? 'is-dimmed' : ''} ${
                  isHovered ? 'is-hovered' : ''
                }`}
                data-kind={object.kind}
                data-variant={object.variant}
                style={style}
              >
                {object.kind === 'card' && cardData ? (
                  <Link
                    href={cardData.href}
                    className="pointer-events-auto block rounded-3xl border border-white/10 bg-black/50 p-4 shadow-xl shadow-black/30 backdrop-blur-xl transition focus:outline-none focus:ring-2 focus:ring-primary/60"
                    onMouseEnter={() => setHoveredCard(cardData.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onFocus={() => setHoveredCard(cardData.id)}
                    onBlur={() => setHoveredCard(null)}
                  >
                    <div
                      className="h-36 w-full rounded-2xl bg-white/5 bg-cover bg-center"
                      style={
                        cardData.imageUrl
                          ? { backgroundImage: `url('${cardData.imageUrl}')` }
                          : undefined
                      }
                    >
                      {!cardData.imageUrl && (
                        <div className="flex h-full items-center justify-center text-sm font-semibold text-white/70">
                          {cardData.title.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-2 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide">
                          {cardData.title}
                        </h3>
                        {cardData.meta && (
                          <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/60">
                            {cardData.meta}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70">
                        {truncate(cardData.description, 90)}
                      </p>
                      <div className="text-[0.6rem] uppercase tracking-[0.3em] text-white/70">
                        open →
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="pointer-events-auto rounded-full border border-white/15 bg-black/50 text-white/80 shadow-lg shadow-black/20 backdrop-blur-md">
                    <span className="block uppercase">{object.label}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl items-center px-6 sm:px-10">
          <div className="canvas-anchor max-w-xl space-y-6 text-white">
            <div className="flex items-center gap-4">
              <div className="relative flex size-12 sm:size-14 lg:size-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg font-semibold">
                {avatarSrc && hasAvatar ? (
                  <img
                    src={avatarSrc}
                    alt="Kashi avatar"
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setHasAvatar(false)}
                  />
                ) : (
                  <span className="text-white">K</span>
                )}
                <div className="absolute inset-0 rounded-full ring-2 ring-base-300/60 ring-offset-2 ring-offset-black/40" />
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                hey, i&apos;m kashi
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                i notice friction,
                <span className="block text-white/70">
                  then i build fixes.
                </span>
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-white/70 sm:text-lg">
                calm, premium experiences that keep momentum without the noise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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

            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em] text-white/70">
              <Link
                href="/projects"
                onClick={(event) => handleModeLink(event, 'projects')}
                className={`rounded-full border border-white/15 bg-white/5 px-3 py-1 transition ${
                  mode === 'projects' ? 'border-primary/60 text-white' : 'hover:bg-white/10'
                }`}
              >
                projects
              </Link>
              <Link
                href="/products"
                onClick={(event) => handleModeLink(event, 'products')}
                className={`rounded-full border border-white/15 bg-white/5 px-3 py-1 transition ${
                  mode === 'products' ? 'border-primary/60 text-white' : 'hover:bg-white/10'
                }`}
              >
                products
              </Link>
              <a
                href={contactHref}
                onClick={(event) => handleModeLink(event, 'contact')}
                className={`rounded-full border border-white/15 bg-white/5 px-3 py-1 transition ${
                  mode === 'contact' ? 'border-primary/60 text-white' : 'hover:bg-white/10'
                }`}
              >
                contact
              </a>
            </div>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-[62%] z-30 w-[min(28rem,calc(100vw-3rem))] -translate-x-1/2 transition ${
            showContactPanel ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="rounded-3xl border border-white/15 bg-black/60 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              contact
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              let&apos;s build the calm version.
            </h2>
            <p className="mt-2 text-sm text-white/70">
              share the scope, timeline, and what feels broken. i&apos;ll reply
              with the cleanest next step.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactHref.startsWith('http') ? (
                <a
                  href={contactHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black"
                >
                  whatsapp
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  href={contactHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black"
                >
                  contact
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => {
            setMenuOpen(true)
            setShowPreferences(false)
          }}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="cinema-menu"
        >
          <Menu size={14} />
          menu
        </button>

        {menuOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-lg"
            role="dialog"
            aria-modal="true"
            id="cinema-menu"
            onClick={() => setMenuOpen(false)}
          >
            <div
              ref={overlayRef}
              className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 px-8 py-10 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>

              <nav className="space-y-6 text-center">
                {overlayLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-2xl font-semibold tracking-tight text-white/90 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="block w-full text-2xl font-semibold tracking-tight text-white/90 hover:text-white"
                  onClick={() => setShowPreferences((prev) => !prev)}
                >
                  Preferences
                </button>
              </nav>

              {showPreferences && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
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

        <style jsx>{`
          .canvas-root {
            --progress: 0;
            --loop: 0;
            --energy: 1;
            --calm: 0;
          }

          .canvas-item {
            position: absolute;
            transform: translate3d(
                calc(var(--drift-x) * var(--loop) * var(--energy) * 1px),
                calc(var(--drift-y) * var(--loop) * var(--energy) * 1px),
                0
              )
              rotate(var(--rotate))
              scale(calc(var(--scale) * var(--hover-scale)));
            opacity: calc(var(--opacity) * var(--variant-opacity, 1) * var(--dim, 1));
            transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease, filter 400ms ease;
            will-change: transform, opacity, filter;
          }

          .canvas-item[data-variant='primary'] {
            --variant-opacity: calc(0.7 + (1 - var(--loop)) * 0.3);
          }

          .canvas-item[data-variant='secondary'] {
            --variant-opacity: calc(0.4 + var(--loop) * 0.6);
          }

          .canvas-item.is-dimmed {
            --dim: 0.85;
            filter: blur(1.5px);
          }

          .canvas-item.is-hovered {
            --dim: 1;
            filter: saturate(1.08) contrast(1.05);
          }

          .canvas-root[data-mode='projects'] .canvas-item[data-kind='chip'],
          .canvas-root[data-mode='products'] .canvas-item[data-kind='chip'] {
            --dim: 0.7;
          }

          .canvas-root[data-mode='contact'] .canvas-item[data-kind='card'],
          .canvas-root[data-mode='contact'] .canvas-item[data-kind='chip'] {
            --dim: 0.5;
          }

          .canvas-anchor {
            transform: translate3d(0, 0, 0);
            transition: transform 800ms ease;
          }

          .canvas-root[data-reduced='true'] .canvas-item,
          .canvas-root[data-reduced='true'] .canvas-anchor {
            transition: none;
          }
        `}</style>
      </div>
    </div>
  )
}
