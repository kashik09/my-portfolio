import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'

export interface ProjectCardData {
  id: string
  slug: string
  title: string
  description: string
  image?: string | null
  technologies: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  featured?: boolean
  status?: string
  category?: string | null
}

interface ProjectCardProps {
  project: ProjectCardData
  variant?: 'admin' | 'public'
  onEdit?: () => void
}

export function ProjectCard({ project, variant = 'public', onEdit }: ProjectCardProps) {
  const isPublic = variant === 'public'

  return (
    <div className="group vibey-card bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-accent-2 transition-all">
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl font-bold text-primary/30">{project.title.charAt(0)}</span>
          </div>
        )}

        {!isPublic && project.status && (
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                project.status === 'PUBLISHED'
                  ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                  : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
              }`}
            >
              {project.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full font-medium whitespace-nowrap ml-2">
              Featured
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-muted text-foreground rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={16} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
              Live
            </a>
          )}
          {!isPublic && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="ml-auto px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
