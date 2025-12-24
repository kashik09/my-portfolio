import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HeroProps {
  title: string
  highlight: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export function HeroFormal({
  title,
  highlight,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="grid items-center gap-10 rounded-3xl border border-app surface-app px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-12">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-app">
            Available for new projects
          </p>
          <h1 className="hero-title text-4xl md:text-6xl font-bold text-app leading-tight">
            {title} <span className="accent">{highlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-app max-w-xl">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={primaryCtaHref} className="no-underline">
              <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                {primaryCtaLabel}
              </Button>
            </Link>
            <Link href={secondaryCtaHref} className="no-underline">
              <Button variant="outline" size="lg">
                {secondaryCtaLabel}
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-app bg-app px-5 py-4">
            <p className="text-sm font-semibold text-app">Focus areas</p>
            <p className="text-sm text-muted-app mt-2">
              Web apps, product UI, and dependable engineering handoffs.
            </p>
          </div>
          <div className="rounded-2xl border border-app bg-app px-5 py-4">
            <p className="text-sm font-semibold text-app">Working style</p>
            <p className="text-sm text-muted-app mt-2">
              Clear milestones, calm communication, and polished delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
