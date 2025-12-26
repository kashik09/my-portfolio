export const dynamic = 'force-dynamic'

import { ProjectCardData } from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { IntroScene } from '@/components/home/IntroScene'
import { FeaturedWorkStory } from '@/components/home/FeaturedWorkStory'
import { normalizePublicPath, truncate } from '@/lib/utils'

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
    const detail =
      project.technologies?.length ? project.technologies.slice(0, 2).join(' / ') : project.category
    const description = project.description ? truncate(project.description, 120) : 'featured build'
    const summary = detail ? `${description} · ${detail}` : description

    return {
      id: project.id,
      title: project.title,
      href: `/projects/${project.slug}`,
      summary,
      thumbnailUrl: normalizePublicPath(project.image)
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

  return (
    <div>
      <IntroScene hero={hero} projects={featuredProjects} />
      {featuredWorkStories.length > 0 && (
        <FeaturedWorkStory projects={featuredWorkStories} />
      )}
    </div>
  )
}
