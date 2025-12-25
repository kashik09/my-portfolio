export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { FeaturedProjectsList } from '@/components/FeaturedProjects'
import { ProjectCardData } from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { MemberHomeTop } from '@/components/home/MemberHomeTop'
import { HeroSwitch } from '@/components/home/HeroSwitch'

async function getLandingContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/content/landing`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching landing content:', error)
    return null
  }
}

export default async function HomePage() {
  // Fetch featured projects
  const featuredProjectsData = await prisma.project.findMany({
    where: {
      featured: true,
      published: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      thumbnail: true,
      techStack: true,
      tags: true,
      category: true,
      githubUrl: true,
      liveUrl: true,
      featured: true
    }
  })

  const featuredProjects: ProjectCardData[] = featuredProjectsData.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    image: project.thumbnail,
    technologies: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    category: project.category
  }))

  // Fetch landing content from CMS
  const landingContent = await getLandingContent()

  // Fallback to hardcoded if CMS content not available
  const hero = landingContent?.hero || {
    title: 'hey, i\'m',
    highlight: 'kashi',
    subtitle: 'i notice things that could work better, then i build them',
    primaryCtaLabel: 'see what i\'ve built',
    primaryCtaHref: '/projects',
    secondaryCtaLabel: 'get in touch',
    secondaryCtaHref: '/contact'
  }

  const proofSnapshot = landingContent?.proofSnapshot || [
    { id: '1', text: 'this site is fully custom-built (no templates)' },
    { id: '2', text: 'mode-based theming system with 5+ variants' },
    { id: '3', text: 'cms-driven content + full e-commerce' },
    { id: '4', text: 'designed + built end-to-end' }
  ]

  const philosophy = landingContent?.philosophy || [
    { id: '1', title: 'notice', description: 'i pay attention to friction. when something feels harder than it should, that\'s a signal.' },
    { id: '2', title: 'build', description: 'ideas don\'t count until they\'re real. i ship working code, not concepts.' },
    { id: '3', title: 'iterate', description: 'first version ships. then i learn what actually matters and improve it.' }
  ]

  const cta = landingContent?.cta || {
    text: 'view all projects',
    href: '/projects'
  }

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section)' }}>
        {/* Member Dashboard Strip */}
        <MemberHomeTop />

        {/* 1. HERO */}
        <div className="container-lg">
          <HeroSwitch
            title={hero.title}
            highlight={hero.highlight}
            subtitle={hero.subtitle}
            primaryCtaLabel={hero.primaryCtaLabel}
            primaryCtaHref={hero.primaryCtaHref}
            secondaryCtaLabel={hero.secondaryCtaLabel}
            secondaryCtaHref={hero.secondaryCtaHref}
          />
        </div>

        {/* Ad slot */}
        <div className="container-lg">
          <AdSlot placement="homepage_hero" />
        </div>

        {/* 2. PROOF SNAPSHOT */}
        <section className="container-md">
          <div className="relative border-l-2 border-primary/20 pl-4 sm:pl-6 space-y-2">
            {proofSnapshot.map((item: any) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="text-primary/40 text-xs font-mono mt-0.5 select-none">→</span>
                <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FEATURED PROJECTS */}
        {featuredProjects.length > 0 && (
          <section className="container-lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-block)' }}>
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-2">selected work</h2>
                <p className="text-body text-muted-foreground">
                  what it is • why it exists • what it proves
                </p>
              </div>
              <FeaturedProjectsList projects={featuredProjects} />
            </div>
          </section>
        )}

        {/* 4. HOW I WORK */}
        <section className="container-md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-item)' }}>
            <h2 className="text-h2 font-bold text-foreground">how i work</h2>
            <div className="grid gap-4 sm:gap-6">
              {philosophy.map((item: any) => (
                <div key={item.id} className="group">
                  <h3 className="text-h3 font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-body text-muted-foreground/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA */}
        <section className="container-lg">
          <div className="border-t border-border/50 pt-8 sm:pt-12 text-center">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-all group text-sm sm:text-base"
            >
              <span>{cta.text}</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
