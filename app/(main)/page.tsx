import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Code2, Palette, Zap, ArrowRight } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { FeaturedProjects } from '@/components/FeaturedProjects'
import { ProjectCardData } from '@/components/ProjectCard'
import { prisma } from '@/lib/prisma'
import { MemberHomeTop } from '@/components/home/MemberHomeTop'

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
    take: 6,
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            Hi, I'm <span className="text-primary">Kashi</span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto px-4">
            A Junior Developer building innovative solutions with modern web technologies
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/projects">
              <Button variant="primary" size="lg">
                View My Work
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/request">
              <Button variant="outline" size="lg">
                Hire Me
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Optional personalized ad below hero */}
      <section className="max-w-6xl mx-auto px-4">
        <AdSlot placement="homepage_hero" />
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <FeaturedProjects projects={featuredProjects} />
      )}

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
            <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
              <Code2 className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Clean Code</h3>
            <p className="text-muted-foreground">
              Writing maintainable, scalable, and efficient code following best practices
            </p>
          </div>

          <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
            <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
              <Palette className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Modern Design</h3>
            <p className="text-muted-foreground">
              Creating beautiful, responsive interfaces that users love
            </p>
          </div>

          <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
            <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
              <Zap className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Fast Performance</h3>
            <p className="text-muted-foreground">
              Optimized applications that load quickly and run smoothly
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl p-12 md:p-20 text-center text-white shadow-xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">Ready to start your project?</h2>
          <p className="text-xl md:text-2xl mb-10 font-medium max-w-3xl mx-auto text-white/95 drop-shadow-md">
            Let's work together to bring your ideas to life
          </p>
          <Link href="/request">
            <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90 hover:scale-105 transition-transform font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
