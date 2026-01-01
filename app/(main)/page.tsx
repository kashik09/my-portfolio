// Use ISR with 1-hour revalidation instead of force-dynamic for better performance
// This reduces server load and improves TTFB while keeping content relatively fresh
export const revalidate = 3600 // Revalidate every 1 hour

import { HomeCanvas } from '@/components/features/home'
import { prisma } from '@/lib/prisma'
import type { ProjectCardData } from '@/components/shared/ProjectCard'
import type { CanvasCard } from '@/components/features/home/homeCanvasTypes'
import type { Metadata } from 'next'

// Add static metadata for better SEO
export const metadata: Metadata = {
  title: 'Kashi - Full-Stack Developer & Product Builder',
  description:
    'I notice friction, then I build fixes. Creating calm, premium experiences that keep momentum without the noise. Full-stack developer building products with Next.js, React, and TypeScript.',
  openGraph: {
    title: 'Kashi - Full-Stack Developer & Product Builder',
    description: 'I notice friction, then I build fixes. Creating calm, premium experiences.',
    type: 'website',
  },
}

// Empty products array - we're only showing featured projects
const products: CanvasCard[] = []

export default async function HomePage() {
  const avatarUrl = '/uploads/avatars/avatar-1766558399327.jpg'

  // Fetch real featured projects from database
  const dbProjects = await prisma.project.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      thumbnail: true,
      techStack: true,
      category: true,
    },
  })

  // Convert to ProjectCardData format
  const featuredProjects: ProjectCardData[] = dbProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description || '',
    image: project.thumbnail || '/products/placeholder.png',
    technologies: project.techStack || [],
    featured: true,
    category: project.category,
  }))

  return <HomeCanvas projects={featuredProjects} products={products} avatarUrl={avatarUrl} />
}
