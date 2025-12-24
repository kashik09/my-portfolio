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

export function HeroVibey({
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
      <div className="relative overflow-hidden rounded-3xl border border-app bg-gradient-to-br from-primary/10 via-transparent to-primary/30 px-6 py-14 md:px-12">
        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em] text-muted-app">
            <span className="rounded-full border border-app bg-app px-3 py-1">Fresh ideas</span>
            <span className="rounded-full border border-app bg-app px-3 py-1">Bold builds</span>
          </div>

          <h1 className="hero-title text-4xl md:text-6xl font-bold text-app leading-tight">
            {title} <span className="accent">{highlight}</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-app max-w-2xl">
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

          <div className="flex flex-wrap gap-3 text-sm text-muted-app">
            <span className="rounded-full border border-app bg-app px-3 py-1">Next.js</span>
            <span className="rounded-full border border-app bg-app px-3 py-1">Tailwind</span>
            <span className="rounded-full border border-app bg-app px-3 py-1">Product Design</span>
            <span className="rounded-full border border-app bg-app px-3 py-1">Performance</span>
          </div>
        </div>
      </div>
    </section>
  )
}
