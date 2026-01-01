'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { isLocalImageUrl, normalizePublicPath, truncate } from '@/lib/utils'
import type { ProjectCardData } from '@/components/shared/ProjectCard'
import { HomeCanvasObjects } from './HomeCanvasObjects'
import { layoutObjects } from './homeCanvasData'
import type { CanvasCard, LayoutPreset } from './homeCanvasTypes'

const HomeCanvasMenuOverlay = dynamic(
  () =>
    import('./HomeCanvasMenuOverlay').then(
      (mod) => mod.HomeCanvasMenuOverlay
    ),
  { ssr: false }
)

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

type CanvasMode = 'default' | 'projects' | 'products' | 'contact'

const avatarSizes =
  '(min-width: 1024px) 96px, (min-width: 640px) 80px, 72px'
const remoteImageLoader = ({ src }: { src: string }) => src

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
  const [mode] = useState<CanvasMode>('default')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hasAvatar, setHasAvatar] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

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
  const avatarSrc = normalizePublicPath(avatarUrl)

  return (
    <div ref={trackRef} className="relative min-h-[360vh] hide-scrollbar">
      <div
        ref={canvasRef}
        className="canvas-root sticky top-0 h-[100dvh] w-full overflow-hidden"
        data-mode={mode}
        data-layout={layout}
        data-reduced={reduceMotion ? 'true' : 'false'}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-base-200/30 via-base-200/50 to-base-200/70" />
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute bottom-[-25%] right-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute right-[18%] top-[18%] h-40 w-40 rounded-full bg-base-100/5 blur-[90px]" />
        </div>

        <HomeCanvasObjects
          objects={objects}
          cards={cardsForMode}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />

        <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl items-center px-6 sm:px-10">
          <div className="canvas-anchor max-w-xl space-y-6 text-base-content">
            <div className="flex items-center gap-4">
              <div className="relative flex size-18 sm:size-20 lg:size-24 items-center justify-center rounded-full border border-base-300 bg-base-100/10 text-lg font-semibold">
                {avatarSrc && hasAvatar ? (
                  <Image
                    src={avatarSrc}
                    alt="Kashi avatar"
                    width={96}
                    height={96}
                    sizes={avatarSizes}
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setHasAvatar(false)}
                    unoptimized={!isLocalImageUrl(avatarSrc)}
                    loader={isLocalImageUrl(avatarSrc) ? undefined : remoteImageLoader}
                  />
                ) : (
                  <span className="text-base-content">K</span>
                )}
              </div>
              <p className="text-sm sm:text-base uppercase tracking-[0.4em] text-base-content/90">
                hey 👋🏾
                <br />
                i&apos;m kashi ✨
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                i notice friction,
                <span className="block text-base-content/85">
                  then i build fixes.
                </span>
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-base-content/85 sm:text-lg">
                calm, premium experiences that keep momentum without the noise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/projects" className="no-underline text-base-content">
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

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-base-300 bg-base-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
                component-driven
              </span>
              <span className="inline-flex items-center rounded-full border border-base-300 bg-base-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
                calm delivery
              </span>
            </div>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-[62%] z-30 w-[min(28rem,calc(100vw-3rem))] -translate-x-1/2 transition ${
            showContactPanel ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="rounded-3xl border border-base-300 bg-base-200/60 p-6 text-base-content shadow-2xl shadow-base-300/40 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-base-content/75">
              contact
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              let&apos;s build the calm version.
            </h2>
            <p className="mt-2 text-sm text-base-content/85">
              share the scope, timeline, and what feels broken. i&apos;ll reply
              with the cleanest next step.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {contactHref.startsWith('http') ? (
                <a
                  href={contactHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-content"
                >
                  whatsapp
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  href={contactHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-content"
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
          onClick={() => setMenuOpen(true)}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-base-content backdrop-blur-md transition"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="cinema-menu"
        >
          <Menu size={14} />
          menu
        </button>

        {menuOpen && (
          <HomeCanvasMenuOverlay
            contactHref={contactHref}
            onClose={() => setMenuOpen(false)}
            menuButtonRef={menuButtonRef}
          />
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
