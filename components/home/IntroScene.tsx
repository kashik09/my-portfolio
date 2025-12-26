'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StickerField } from '@/components/home/StickerField'
import { normalizePublicPath, truncate } from '@/lib/utils'
import type { ProjectCardData } from '@/components/ProjectCard'

interface IntroSceneProps {
  hero: {
    title: string
    highlight: string
    subtitle: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
  }
  projects: ProjectCardData[]
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
  'make it frictionless',
  'design in rhythm',
  'clean handoff',
  'tiny details, big impact',
]

export function IntroScene({ hero, projects }: IntroSceneProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hasAvatar, setHasAvatar] = useState(true)
  const sectionRef = useRef<HTMLElement | null>(null)

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

  const projectStickers = projects.slice(0, 3).map((project) => ({
    id: project.id,
    title: project.title,
    href: `/projects/${project.slug}`,
    imageUrl: normalizePublicPath(project.image),
    note: project.description ? truncate(project.description, 60) : 'featured work'
  }))

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh]" data-cinema-intro>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative min-h-[100dvh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/40" />
          <div className="absolute -left-16 top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] h-64 w-64 rounded-full bg-primary/15 blur-[120px]" />

          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[64rem] flex-col justify-center px-6 pb-10 pt-16 sm:px-8">
            <div
              className={`flex items-center gap-4 text-white/90 ${
                !reduceMotion && isVisible ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={!reduceMotion ? { animationDelay: '0ms' } : undefined}
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-semibold">
                {hasAvatar ? (
                  <img
                    src="/avatar.png"
                    alt="Kashi avatar"
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setHasAvatar(false)}
                  />
                ) : (
                  <span className="text-white">K</span>
                )}
                <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-black/30" />
              </div>
              <p className="text-xs uppercase tracking-[0.4em]">hey, i&apos;m kashi</p>
            </div>

            <div
              className={`mt-4 space-y-4 text-white ${
                !reduceMotion && isVisible ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={!reduceMotion ? { animationDelay: '120ms' } : undefined}
            >
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                i notice friction,
                <span className="block text-white/70">then i build fixes.</span>
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-white/80 sm:text-lg">
                {hero.subtitle}
              </p>
            </div>

            <div
              className={`mt-6 flex flex-wrap gap-3 ${
                !reduceMotion && isVisible ? 'animate-sticker-in' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={!reduceMotion ? { animationDelay: '200ms' } : undefined}
            >
              <Link href={hero.primaryCtaHref} className="no-underline">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  {hero.primaryCtaLabel}
                </Button>
              </Link>
              <Link href={hero.secondaryCtaHref} className="no-underline">
                <Button variant="outline" size="md">
                  {hero.secondaryCtaLabel}
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {proofItems.map((item, index) => (
                <span
                  key={item}
                  className={`inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70 ${
                    !reduceMotion && isVisible ? 'animate-sticker-in' : ''
                  } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={!reduceMotion ? { animationDelay: `${260 + index * 80}ms` } : undefined}
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
        </div>
      </div>
    </section>
  )
}
