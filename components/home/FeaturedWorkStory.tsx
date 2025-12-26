'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export interface FeaturedWorkStoryItem {
  id: string
  title: string
  href: string
  summary: string
  thumbnailUrl?: string | null
}

interface FeaturedWorkStoryProps {
  projects: FeaturedWorkStoryItem[]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function FeaturedWorkStory({ projects }: FeaturedWorkStoryProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [localT, setLocalT] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduceMotion(media.matches)

    updatePreference()

    if (media.addEventListener) {
      media.addEventListener('change', updatePreference)
      return () => media.removeEventListener('change', updatePreference)
    }

    media.addListener(updatePreference)
    return () => media.removeListener(updatePreference)
  }, [])

  useEffect(() => {
    if (projects.length === 0) return

    let rafId: number | null = null

    const updateProgress = () => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const trackTop = rect.top + scrollY
      const trackHeight = track.offsetHeight
      const viewportHeight = window.innerHeight
      const scrollDistance = Math.max(trackHeight - viewportHeight, 1)

      const progress = clamp((scrollY - trackTop) / scrollDistance, 0, 0.999)
      const indexFloat = progress * projects.length
      const nextIndex = Math.floor(indexFloat)
      const nextLocalT = reduceMotion ? 0 : indexFloat - nextIndex

      setActiveIndex(nextIndex)
      setLocalT(nextLocalT)
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
    window.addEventListener('resize', updateProgress)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [projects.length, reduceMotion])

  const scenes = useMemo(() => projects, [projects])

  if (scenes.length === 0) return null

  const nextIndex = Math.min(activeIndex + 1, scenes.length - 1)

  return (
    <section id="work" className="py-0">
      <h2 className="sr-only">Featured work</h2>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div
          ref={trackRef}
          className="relative"
          style={{ height: `${scenes.length * 100}dvh` }}
        >
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
            {[activeIndex, nextIndex]
              .filter((value, index, array) => array.indexOf(value) === index)
              .map((index) => {
                const project = scenes[index]
                const isActive = index === activeIndex
                const isNext = index === nextIndex
                const opacity = reduceMotion
                  ? isActive
                    ? 1
                    : 0
                  : isActive
                    ? 1 - localT
                    : localT
                const scale = reduceMotion
                  ? 1
                  : isActive
                    ? 1 - localT * 0.02
                    : 1.02 - localT * 0.02
                const blur = reduceMotion ? 0 : isActive ? localT * 2 : (1 - localT) * 2

                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      filter: `blur(${blur}px)`,
                      zIndex: isNext ? 2 : 1
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center ${
                        project.thumbnailUrl
                          ? ''
                          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800'
                      }`}
                      style={
                        project.thumbnailUrl
                          ? { backgroundImage: `url(${project.thumbnailUrl})` }
                          : undefined
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] opacity-30 [background-size:3px_3px]" />

                    <div className="absolute inset-x-4 bottom-10 z-10 sm:left-10 sm:right-auto sm:bottom-14">
                      <div className="w-full max-w-[26rem] space-y-3 rounded-2xl border border-white/10 bg-black/45 p-4 text-white backdrop-blur-lg sm:p-5">
                        <h3 className="text-2xl font-semibold sm:text-3xl">
                          {project.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                          {project.summary}
                        </p>
                        <Link
                          href={project.href}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
                        >
                          open →
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
