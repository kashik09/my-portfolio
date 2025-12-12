'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

// Define the Project type to match API response
interface Project {
  id: string
  slug: string
  title: string
  description: string
  category: 'PERSONAL' | 'CLASS'
  tags: string[]
  techStack: string[]
  thumbnail: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  publishedAt: string | null
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PERSONAL' | 'CLASS'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch projects from API
  useEffect(() => {
    fetchProjects()
  }, [filter, searchQuery])

  const fetchProjects = async () => {
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
      setProjects(data.data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 py-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">My Projects</h1>
        <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
          A collection of my work showcasing various technologies
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'ALL' ? 'primary' : 'outline'}
            onClick={() => setFilter('ALL')}
          >
            All Projects
          </Button>
          <Button
            variant={filter === 'PERSONAL' ? 'primary' : 'outline'}
            onClick={() => setFilter('PERSONAL')}
          >
            Personal
          </Button>
          <Button
            variant={filter === 'CLASS' ? 'primary' : 'outline'}
            onClick={() => setFilter('CLASS')}
          >
            Class Projects
          </Button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground"
          />
        </div>
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
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden bg-accent/10">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition">
                  {project.title}
                </h3>
                <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-primary rounded text-primary-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline font-medium"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/70 hover:text-foreground font-medium"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-muted text-lg">No projects found</p>
          <p className="text-foreground/50 text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}