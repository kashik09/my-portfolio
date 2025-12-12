'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PERSONAL' | 'CLASS'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const projects = [
    {
      id: 1,
      title: 'JS Calculator',
      description: 'A feature-rich calculator with draggable modals and multiple themes',
      category: 'CLASS' as const,
      techStack: ['Next.js', 'React', 'Tailwind CSS'],
      imageUrl: 'https://via.placeholder.com/400x300',
      demoUrl: '',
      githubUrl: 'https://github.com/kashik09/js-calc'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'ALL' || project.category === filter
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-text">My Projects</h1>
        <p className="text-xl text-text/70 max-w-2xl mx-auto">
          A collection of my work showcasing various technologies
        </p>
      </div>

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all hover:shadow-xl"
          >
            <div className="aspect-video overflow-hidden bg-accent/10">
              <img
                src={project.imageUrl}
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
              <h3 className="text-xl font-bold text-text mb-2 group-hover:text-accent transition">
                {project.title}
              </h3>
              <p className="text-text/70 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 bg-primary rounded text-text">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.demoUrl && (
                  
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline font-medium"
                  >
                    Live Demo →
                  </a>
                )}
                {project.githubUrl && (
                  
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text/70 hover:text-text font-medium"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text/70 text-lg">No projects found</p>
          <p className="text-text/50 text-sm">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}