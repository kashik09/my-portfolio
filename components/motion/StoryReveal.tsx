'use client'

import { ElementType, ReactNode, Ref, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StoryRevealProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  delayMs?: number
}

export function StoryReveal({
  children,
  className,
  as = 'div',
  delayMs = 0
}: StoryRevealProps) {
  const getPrefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const Component = as as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [reduceMotion, setReduceMotion] = useState(getPrefersReducedMotion)
  const [isVisible, setIsVisible] = useState(getPrefersReducedMotion)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches)
      if (event.matches) {
        setIsVisible(true)
      }
    }

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [reduceMotion])

  const revealClasses = reduceMotion
    ? 'opacity-100 translate-y-0'
    : isVisible
      ? 'opacity-100 translate-y-0 transition-all duration-200 ease-out'
      : 'opacity-0 translate-y-3 transition-all duration-200 ease-out'

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('transform-gpu', revealClasses, className)}
      style={
        reduceMotion
          ? undefined
          : {
              transitionDelay: `${delayMs}ms`
            }
      }
    >
      {children}
    </Component>
  )
}
