'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

interface ProjectSticker {
  id: string
  title: string
  href: string
  imageUrl: string | null
  note: string
}

interface StickerFieldProps {
  projects: ProjectSticker[]
  notes: string[]
  isVisible: boolean
  reduceMotion: boolean
}

interface StickerSlot {
  kind: 'project' | 'note'
  top: string
  left: string
  rotate: number
  size: string
  hideOnMobile?: boolean
  depth: number
}

interface ProjectStickerItem extends StickerSlot {
  kind: 'project'
  id: string
  title: string
  href: string
  imageUrl: string | null
  note: string
  index: number
}

interface NoteStickerItem extends StickerSlot {
  kind: 'note'
  id: string
  title: string
  index: number
}

type StickerItem = ProjectStickerItem | NoteStickerItem

const stickerSlots: StickerSlot[] = [
  { kind: 'project', top: '12%', left: '58%', rotate: -6, size: 'w-44', hideOnMobile: true, depth: 0.6 },
  { kind: 'note', top: '20%', left: '12%', rotate: 5, size: 'w-40', hideOnMobile: false, depth: 0.8 },
  { kind: 'project', top: '46%', left: '72%', rotate: 3, size: 'w-52', hideOnMobile: true, depth: 0.7 },
  { kind: 'note', top: '56%', left: '6%', rotate: -4, size: 'w-36', hideOnMobile: false, depth: 1 },
  { kind: 'project', top: '68%', left: '50%', rotate: -2, size: 'w-48', hideOnMobile: true, depth: 0.5 },
  { kind: 'note', top: '72%', left: '20%', rotate: 4, size: 'w-40', hideOnMobile: false, depth: 1.1 },
  { kind: 'note', top: '30%', left: '75%', rotate: 6, size: 'w-36', hideOnMobile: true, depth: 0.9 },
  { kind: 'note', top: '38%', left: '42%', rotate: -3, size: 'w-32', hideOnMobile: true, depth: 0.6 },
]

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function StickerField({ projects, notes, isVisible, reduceMotion }: StickerFieldProps) {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  const buildProjectItem = (
    slot: StickerSlot & { kind: 'project' },
    project: ProjectSticker,
    index: number
  ): ProjectStickerItem => ({
    ...slot,
    id: project.id,
    title: project.title,
    href: project.href,
    imageUrl: project.imageUrl,
    note: project.note,
    index,
  })

  const buildNoteItem = (
    slot: StickerSlot & { kind: 'note' },
    note: string,
    index: number
  ): NoteStickerItem => ({
    ...slot,
    id: `note-${index}`,
    title: note,
    index,
  })

  useEffect(() => {
    if (reduceMotion) {
      setParallaxOffset(0)
      return
    }

    let rafId: number | null = null

    const updateParallax = () => {
      const node = fieldRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const top = rect.top + scrollY
      const height = rect.height || window.innerHeight
      const progress = clamp((scrollY - top) / height, 0, 1)
      const offset = (progress - 0.5) * 24

      setParallaxOffset(offset)
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        updateParallax()
      })
    }

    updateParallax()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateParallax)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateParallax)
    }
  }, [reduceMotion])

  const stickerItems = useMemo<StickerItem[]>(() => {
    let projectIndex = 0
    let noteIndex = 0

    return stickerSlots.map((slot, index) => {
      if (slot.kind === 'project' && projects[projectIndex]) {
        const project = projects[projectIndex]
        const projectSlot = slot as StickerSlot & { kind: 'project' }
        projectIndex += 1
        return buildProjectItem(projectSlot, project, index)
      }

      const note = notes[noteIndex % notes.length]
      noteIndex += 1
      return buildNoteItem(
        { ...slot, kind: 'note' },
        note,
        index
      )
    })
  }, [notes, projects])

  return (
    <div ref={fieldRef} className="pointer-events-none absolute inset-0">
      {stickerItems.map((item) => {
        const shouldAnimate = isVisible && !reduceMotion
        const isHiddenOnMobile = item.hideOnMobile ? 'hidden sm:block' : ''
        const floatDuration = `${5 + (item.index % 3)}s`
        const baseDelay = 420 + item.index * 60
        const translate = parallaxOffset * item.depth
        const transformStyle = `translateY(${translate}px) rotate(${item.rotate}deg)`

        return (
          <div
            key={item.id}
            className={`absolute ${item.size} ${isHiddenOnMobile} ${
              shouldAnimate ? 'animate-sticker-in' : ''
            } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              top: item.top,
              left: item.left,
              animationDelay: shouldAnimate ? `${baseDelay}ms` : undefined,
            }}
          >
            <div
              className={`pointer-events-auto rounded-3xl border border-white/10 bg-black/35 p-3 text-white shadow-lg shadow-black/30 backdrop-blur-lg ${
                shouldAnimate ? 'animate-float' : ''
              }`}
              style={{
                transform: transformStyle,
                animationDelay: shouldAnimate ? `${item.index * 120}ms` : undefined,
                animationDuration: shouldAnimate ? floatDuration : undefined,
              }}
            >
              {item.kind === 'project' ? (
                <div className="space-y-2">
                  <div className="h-20 w-full overflow-hidden rounded-2xl bg-white/10">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-white/60">
                        {item.title.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-white/70">{item.note}</p>
                    <Link
                      href={item.href}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white"
                    >
                      open →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  {item.title}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
