'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ProjectCard, ProjectCardData } from '@/components/shared/ProjectCard'
import { FeaturedProjectsList } from '@/components/shared/FeaturedProjects'
import { usePageTracking, useAnalytics } from '@/lib/useAnalytics'

export default function ProjectsPage() {
  // Track page view automatically
  usePageTracking('Projects Page')
  const { trackClick, trackProjectView, trackEvent } = useAnalytics()

  const [filter, setFilter] = useState<'ALL' | 'PERSONAL' | 'CLASS'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState<ProjectCardData[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<ProjectCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProjects = React.useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') params.append('category', filter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/projects?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      const allProjects = data.data || []

      // Split into featured and archive
      setFeaturedProjects(allProjects.filter((p: ProjectCardData) => p.featured))
      setProjects(allProjects)

      // Track filter usage
      if (filter !== 'ALL') {
        trackEvent({
          action: 'filter_used',
          category: 'projects',
          label: filter
        })
      }

      // Track search usage
      if (searchQuery) {
        trackEvent({
          action: 'search_used',
          category: 'projects',
          label: searchQuery
        })
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filter, searchQuery, trackEvent])

  // Fetch projects from API
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleFilterChange = (newFilter: 'ALL' | 'PERSONAL' | 'CLASS') => {
    setFilter(newFilter)
    trackClick(`Filter: ${newFilter}`, 'Projects Page')
  }

  const handleProjectClick = (project: ProjectCardData) => {
    trackProjectView(project.id, project.title)
  }

  // Archive projects (not featured)
  const archiveProjects = projects.filter(p => !p.featured)

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section)' }}>
        {/* Header */}
        <div className="container-lg space-y-3">
          <h1 className="text-h1 font-bold text-foreground">projects</h1>
          <p className="text-body text-muted-foreground/90 max-w-2xl">
            things i've built to solve real problems or learn something new
          </p>
        </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </div>
      )}

        {!loading && !error && (
          <>
            {/* Featured */}
            {featuredProjects.length > 0 && (
              <section className="container-lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-block)' }}>
                  <h2 className="text-h2 font-bold text-foreground">featured</h2>
                  <FeaturedProjectsList projects={featuredProjects} />
                </div>
              </section>
            )}

            {/* Archive */}
            {archiveProjects.length > 0 && (
              <section className="container-lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-item)' }}>
                  <div className="space-y-1.5">
                    <h2 className="text-h2 font-bold text-foreground">archive</h2>
                    <p className="text-sm text-muted-foreground/80">
                      earlier work and experiments • not everything is polished
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('ALL')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          filter === 'ALL'
                            ? 'bg-primary text-primary-content'
                            : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        all
                      </button>
                      <button
                        onClick={() => handleFilterChange('PERSONAL')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          filter === 'PERSONAL'
                            ? 'bg-primary text-primary-content'
                            : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        personal
                      </button>
                      <button
                        onClick={() => handleFilterChange('CLASS')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          filter === 'CLASS'
                            ? 'bg-primary text-primary-content'
                            : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        class
                      </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
                      <input
                        type="text"
                        placeholder="search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  {/* Archive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2">
                    {archiveProjects.map((project) => (
                      <div key={project.id} onClick={() => handleProjectClick(project)}>
                        <ProjectCard project={project} variant="public" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="container-md text-center py-12">
            <p className="text-body text-muted-foreground/70">no projects found</p>
          </div>
        )}
      </div>
    </div>
  )
}
