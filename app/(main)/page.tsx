// Use ISR with 1-hour revalidation instead of force-dynamic for better performance
// This reduces server load and improves TTFB while keeping content relatively fresh
export const revalidate = 3600 // Revalidate every 1 hour

import { HomeCanvas } from '@/components/features/home'
import { normalizePublicPath } from '@/lib/utils'
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

const featuredProjects: ProjectCardData[] = [
  {
    id: 'project-calm-stack',
    slug: 'calm-stack',
    title: 'Calm Stack',
    description: 'Premium client portal with editorial polish and clear momentum.',
    image: normalizePublicPath('/products/dashboard-1.png'),
    technologies: ['Next.js', 'TypeScript', 'Tailwind'],
    featured: true,
    category: 'platform',
  },
  {
    id: 'project-orbit-studio',
    slug: 'orbit-studio',
    title: 'Orbit Studio',
    description: 'Launch ops hub for studios that want fewer pings and more signal.',
    image: normalizePublicPath('/products/saas-landing-1.png'),
    technologies: ['React', 'Postgres', 'Stripe'],
    featured: true,
    category: 'operations',
  },
  {
    id: 'project-signal-kit',
    slug: 'signal-kit',
    title: 'Signal Kit',
    description: 'Insight dashboards that surface the next move, not just charts.',
    image: normalizePublicPath('/products/api-docs-1.png'),
    technologies: ['Next.js', 'Prisma', 'DaisyUI'],
    featured: true,
    category: 'insights',
  },
]

const products: CanvasCard[] = [
  {
    id: 'product-saas-landing',
    title: 'SaaS Landing Kit',
    description: 'Hero, pricing, and CTA blocks tuned for fast, calm launches.',
    imageUrl: normalizePublicPath('/products/saas-landing-thumb.png'),
    href: '/products',
    meta: 'templates',
  },
  {
    id: 'product-ui-library',
    title: 'UI Library',
    description: 'A composed set of tokens and components for premium UI builds.',
    imageUrl: normalizePublicPath('/products/ui-library-thumb.png'),
    href: '/products',
    meta: 'components',
  },
  {
    id: 'product-dashboard',
    title: 'Dashboard Kit',
    description: 'Analytics and admin patterns for signal-first workflows.',
    imageUrl: normalizePublicPath('/products/dashboard-thumb.png'),
    href: '/products',
    meta: 'dashboards',
  },
]

export default function HomePage() {
  const avatarUrl = '/uploads/avatars/avatar-1766558399327.jpg'
  return <HomeCanvas projects={featuredProjects} products={products} avatarUrl={avatarUrl} />
}
