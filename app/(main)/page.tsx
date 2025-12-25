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

  return (
    <div className="space-y-20 py-12">
      {/* Member Dashboard Strip (only shows for logged-in users) */}
      <MemberHomeTop />

      {/* 1. HERO (VIBEY ONLY) */}
      <HeroSwitch
        title="hey, i'm"
        highlight="kashi"
        subtitle="i notice things that could work better, then i build them"
        primaryCtaLabel="see what i've built"
        primaryCtaHref="/projects"
        secondaryCtaLabel="get in touch"
        secondaryCtaHref="/contact"
      />

      {/* Optional personalized ad below hero */}
      <section className="max-w-6xl mx-auto px-4">
        <AdSlot placement="homepage_hero" />
      </section>

      {/* 2. PROOF SNAPSHOT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="relative border-l-2 border-primary/30 pl-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-primary/50 text-xs font-mono mt-0.5">→</span>
            <p className="text-sm text-muted-foreground italic">
              this site is fully custom-built (no templates)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary/50 text-xs font-mono mt-0.5">→</span>
            <p className="text-sm text-muted-foreground italic">
              mode-based theming system with 5+ variants
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary/50 text-xs font-mono mt-0.5">→</span>
            <p className="text-sm text-muted-foreground italic">
              cms-driven content + full e-commerce
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary/50 text-xs font-mono mt-0.5">→</span>
            <p className="text-sm text-muted-foreground italic">
              designed + built end-to-end
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS (FLOW, NOT GRID) */}
      {featuredProjects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">work that proves capability</h2>
              <p className="text-muted-foreground">each project answers: what it is, why it exists, what it proves</p>
            </div>
            <FeaturedProjectsList projects={featuredProjects} />
          </div>
        </section>
      )}

      {/* 4. HOW I THINK / BUILD */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">how i work</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">notice</h3>
              <p className="text-muted-foreground">i pay attention to friction. when something feels harder than it should, that's a signal.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">build</h3>
              <p className="text-muted-foreground">ideas don't count until they're real. i ship working code, not concepts.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">iterate</h3>
              <p className="text-muted-foreground">first version ships. then i learn what actually matters and improve it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUIET CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="border-t border-border pt-12 text-center">
          <Link href="/projects" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition group">
            <span>view all projects</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
