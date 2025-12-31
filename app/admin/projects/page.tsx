'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Package, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ProjectCard, ProjectCardData } from '@/components/shared/ProjectCard'
import { StyledSelect } from '@/components/ui/StyledSelect'
import { Spinner } from '@/components/ui/Spinner'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { FeaturedCheckbox } from '@/components/features/admin/FeaturedToggle'
export default function AdminProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all')
  const [projects, setProjects] = useState<ProjectCardData[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, featured: 0 })
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectCardData | null>(null)
  const { showToast } = useToast()
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      const response = await fetch(`/api/projects?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      let filteredProjects = data.data || []
      // Apply featured filter
      if (featuredFilter === 'featured') {
        filteredProjects = filteredProjects.filter((p: ProjectCardData) => p.featured)
      } else if (featuredFilter === 'not-featured') {
        filteredProjects = filteredProjects.filter((p: ProjectCardData) => !p.featured)
      }
      setProjects(filteredProjects)
      // Calculate stats
      const allProjects = data.data || []
      setStats({
        total: allProjects.length,
        published: allProjects.filter((p: ProjectCardData) => p.status === 'PUBLISHED').length,
        drafts: allProjects.filter((p: ProjectCardData) => p.status !== 'PUBLISHED').length,
        featured: allProjects.filter((p: ProjectCardData) => p.featured).length
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
      showToast('Failed to load projects', 'error')
    } finally {
      setLoading(false)
    }
  }, [featuredFilter, searchQuery, showToast, statusFilter])
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])
  const handleEdit = (slug: string) => {
    router.push(`/admin/projects/${slug}/edit`)
  }
  const handleDelete = async () => {
    if (!projectToDelete) return
    try {
      const response = await fetch(`/api/projects/${projectToDelete.slug}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      showToast('Project deleted successfully', 'success')
      setShowDeleteModal(false)
      setProjectToDelete(null)
      fetchProjects() // Refresh the list
    } catch (error) {
      console.error('Error deleting project:', error)
      showToast('Failed to delete project', 'error')
    }
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </Link>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{stats.featured}</div>
            <Star size={18} className="text-primary" fill="currentColor" />
          </div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card text-foreground border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          />
        </div>
        {/* Status Filter */}
        <div className="w-full md:w-48">
          <StyledSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
          >
            <option value="all">All Projects</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </StyledSelect>
        </div>
        {/* Featured Filter */}
        <div className="w-full md:w-48">
          <StyledSelect
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'not-featured')}
          >
            <option value="all">All Featured</option>
            <option value="featured">Featured Only</option>
            <option value="not-featured">Not Featured</option>
          </StyledSelect>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {/* Projects Grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <ProjectCard
                project={project}
                variant="admin"
                onEdit={() => handleEdit(project.slug)}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-border shadow-sm">
                <label className="text-xs text-muted-foreground font-medium">Featured</label>
                <FeaturedCheckbox
                  slug={project.slug}
                  initialFeatured={project.featured || false}
                  onToggle={() => fetchProjects()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="mb-4 text-muted-foreground">
            <Package className="mx-auto mb-4" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No projects found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first project'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              <Plus size={20} />
              Create First Project
            </Link>
          )}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setProjectToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Project"
        message={
          <div className="space-y-2">
            <p>Are you sure you want to delete <strong>{projectToDelete?.title}</strong>?</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
        }
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
