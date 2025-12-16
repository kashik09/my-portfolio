'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Github, Edit, Trash2, Calendar, Eye, Tag, Code } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Project {
  id: number
  title: string
  slug: string
  description: string
  category: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  techStack: string[]
  featured: boolean
  published: boolean
  createdAt: string
  views: number
  thumbnailUrl?: string
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    // TODO: Fetch from API
    // Mock data for now
    const mockProject: Project = {
      id: parseInt(params.id),
      title: 'JS Calculator',
      slug: 'js-calculator',
      description: 'A modern calculator built with Next.js and Tailwind CSS featuring a sleek UI and advanced calculations.',
      category: 'CLASS',
      githubUrl: 'https://github.com/yourusername/js-calculator',
      liveUrl: 'https://calculator.example.com',
      tags: ['javascript', 'calculator', 'webapp'],
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      featured: true,
      published: true,
      createdAt: '2024-01-15',
      views: 234,
      thumbnailUrl: '/projects/calculator.png'
    }
    
    setTimeout(() => {
      setProject(mockProject)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleDelete = async () => {
    try {
      // TODO: Call delete API
      showToast('Project deleted successfully', 'success')
      router.push('/admin/projects')
    } catch (error) {
      showToast('Failed to delete project', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Project not found</h2>
        <Link href="/admin/projects" className="text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
            <p className="text-muted-foreground">Project Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            <Edit size={18} />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {project.thumbnailUrl && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <img 
                src={project.thumbnailUrl} 
                alt={project.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Project+Image'
                }}
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
            <p className="text-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Tags & Tech Stack */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-foreground">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-foreground">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-muted text-foreground border border-border rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Project Info</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Category</span>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.published 
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {project.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Featured</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.featured 
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' 
                    : 'bg-muted text-foreground'
                }`}>
                  {project.featured ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar size={16} />
                  Created
                </div>
                <span className="text-foreground font-medium">{project.createdAt}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Eye size={16} />
                  Views
                </div>
                <span className="text-foreground font-medium">{project.views}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="text-lg font-bold text-foreground mb-4">Links</h3>
            
            {project.githubUrl && (
              
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition group"
              >
                <Github className="text-foreground" size={20} />
                <span className="text-foreground font-medium flex-1">GitHub</span>
                <ExternalLink className="text-muted-foreground group-hover:text-foreground transition" size={16} />
              </a>
            )}

            {project.liveUrl && (
              
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition group"
              >
                <ExternalLink className="text-foreground" size={20} />
                <span className="text-foreground font-medium flex-1">Live Demo</span>
                <ExternalLink className="text-muted-foreground group-hover:text-foreground transition" size={16} />
              </a>
            )}

            {!project.githubUrl && !project.liveUrl && (
              <p className="text-muted-foreground text-sm text-center py-4">No links available</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}