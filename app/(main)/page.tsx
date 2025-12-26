export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { ProjectCardData } from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { ProofSnapshot } from '@/components/home/ProofSnapshot'
import { FeaturedWorkStory } from '@/components/home/FeaturedWorkStory'
import { HowIThink } from '@/components/home/HowIThink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { truncate } from '@/lib/utils'

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

  const featuredWorkStories = featuredProjects.map((project) => {
    const focusLine =
      project.category ||
      (project.technologies?.length ? project.technologies.slice(0, 2).join(' + ') : undefined)
    const provesLine =
      project.technologies?.length ? project.technologies.slice(0, 3).join(' / ') : project.category

    return {
      id: project.id,
      title: project.title,
      href: `/projects/${project.slug}`,
      what: project.description ? truncate(project.description, 140) : 'featured build',
      focus: focusLine,
      proves: provesLine || undefined,
      thumbnailUrl: project.image
    }
  })

  // Fetch landing content from CMS
  const landingContent = await getLandingContent()

  // Fallback to hardcoded if CMS content not available
  const primaryLabel =
    landingContent?.hero?.primaryCtaHref === '/projects'
      ? landingContent?.hero?.primaryCtaLabel
      : undefined
  const secondaryLabel =
    landingContent?.hero?.secondaryCtaHref === '/products'
      ? landingContent?.hero?.secondaryCtaLabel
      : undefined

  const hero = {
    title: landingContent?.hero?.title || 'hey, i\'m',
    highlight: landingContent?.hero?.highlight || 'kashi',
    subtitle: landingContent?.hero?.subtitle || 'i notice friction, then i build fixes',
    primaryCtaLabel: primaryLabel || 'view projects',
    primaryCtaHref: '/projects',
    secondaryCtaLabel: secondaryLabel || 'products',
    secondaryCtaHref: '/products'
  }

  const ctaHref = landingContent?.cta?.href
  const cta = {
    text: landingContent?.cta?.text || 'view all projects',
    href: ctaHref === '/projects' || ctaHref === '/products' ? ctaHref : '/projects'
  }

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      {/* 1. HERO */}
      <Section className="pt-16 md:pt-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-app bg-gradient-to-br from-primary/10 via-transparent to-primary/30 px-6 py-12 sm:px-10">
            <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-app">
                scroll as story
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-app sm:text-4xl md:text-5xl">
                {hero.title} <span className="accent">{hero.highlight}</span>
              </h1>
              <p className="max-w-prose text-base leading-relaxed text-muted-app sm:text-lg">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
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
            </div>
          </div>

          <div className="mt-6">
            <AdSlot placement="homepage_hero" />
          </div>
        </Container>
      </Section>

      {/* 2. PROOF SNAPSHOT */}
      <ProofSnapshot />

      {/* 3. FEATURED PROJECTS */}
      {featuredWorkStories.length > 0 && (
        <FeaturedWorkStory projects={featuredWorkStories} />
      )}

      {/* 4. HOW I THINK */}
      <HowIThink />

      {/* 5. CTA */}
      <Section className="pt-0">
        <Container>
          <div className="border-t border-border/50 pt-6 text-center sm:pt-8">
            <Link href={cta.href} className="no-underline">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs uppercase tracking-[0.2em] text-foreground/80"
              >
                {cta.text}
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}
