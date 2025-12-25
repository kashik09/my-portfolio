'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { ProjectCard, ProjectCardData } from './ProjectCard'

interface FeaturedProjectsProps {
  projects: ProjectCardData[]
  variant?: 'full' | 'compact'
  showViewAll?: boolean
}

export function FeaturedProjects({
  projects,
  variant = 'full',
  showViewAll = true
}: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return null
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="text-primary" size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured Projects
              </h2>
              <p className="text-muted-foreground">
                Showcasing my best work
              </p>
            </div>
          </div>

          {showViewAll && (
            <Link
              href="/projects"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        {variant === 'full' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="public" />
            ))}
          </div>
        ) : (
          <FeaturedProjectsList projects={projects} />
        )}
      </div>
    </section>
  )
}

export function FeaturedProjectsList({
  projects
}: {
  projects: ProjectCardData[]
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Show all items immediately
      itemRefs.current.forEach(item => {
        if (item) {
          item.style.opacity = '1'
          item.style.transform = 'translateY(0)'
        }
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('project-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => observer.disconnect()
  }, [projects])

  if (projects.length === 0) {
    return null
  }

  return (
    <>
      <style jsx global>{`
        .project-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .project-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-item {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => { itemRefs.current[index] = el }}
            className="project-item"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-300">
                {/* Thumbnail */}
                <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-2xl font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                    <Star
                      size={14}
                      className="text-primary flex-shrink-0"
                      fill="currentColor"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs bg-muted text-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow Icon */}
                <ArrowRight
                  size={20}
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
