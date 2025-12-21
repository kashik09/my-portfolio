'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, Plus, X, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

interface Project {
  id: number
  title: string
  slug: string
  description: string
  category: string
  githubUrl: string
  liveUrl: string
  tags: string[]
  techStack: string[]
  featured: boolean
  published: boolean
}

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [thumbnailPath, setThumbnailPath] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    published: true
  })

  // Preset suggestions
  const tagSuggestions = [
    'javascript', 'typescript', 'react', 'nextjs', 'calculator',
    'webapp', 'mobile', 'api', 'fullstack', 'backend', 'frontend',
    'ui-ux', 'database', 'authentication', 'realtime'
  ]

  const techSuggestions = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS',
    'Node.js', 'PostgreSQL', 'Prisma', 'MongoDB', 'Express',
    'Swift', 'PHP', 'Python', 'Git', 'Vercel', 'Supabase',
    'NextAuth', 'Lucide React'
  ]

  useEffect(() => {
    fetchProject()
  }, [params.slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/projects/${params.slug}`)
      const data = await response.json()

      if (data.success && data.data) {
        const project = data.data
        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description,
          category: project.category,
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          featured: project.featured,
          published: project.published
        })
        setTags(project.tags || [])
        setTechStack(project.techStack || [])
        if (project.thumbnail) {
          setImagePreview(project.thumbnail)
          setThumbnailPath(project.thumbnail)
        }
      } else {
        showToast('Project not found', 'error')
        router.push('/admin/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      showToast('Failed to fetch project', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: generateSlug(title) })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      showToast('Image uploaded successfully', 'success')
    }
  }

  const addTag = (tag?: string) => {
    const tagToAdd = tag || tagInput.trim()
    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd])
      if (!tag) setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const addTech = (tech?: string) => {
    const techToAdd = tech || techInput.trim()
    if (techToAdd && !techStack.includes(techToAdd)) {
      setTechStack([...techStack, techToAdd])
      if (!tech) setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/projects/${params.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
          techStack,
          thumbnail: thumbnailPath || null
        })
      })

      const data = await response.json()

      if (data.success) {
        showToast('Project updated successfully', 'success')
        router.push(`/admin/projects/${params.slug}`)
      } else {
        showToast(data.error || 'Failed to update project', 'error')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      showToast('Failed to update project', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/projects/${params.slug}`}
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                placeholder="JS Calculator"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug * <span className="text-muted-foreground text-xs">(auto-generated)</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                placeholder="js-calculator"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none text-foreground"
              placeholder="A brief description of your project..."
              required
            />
          </div>

          {/* Category & URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[center_right_1rem] bg-no-repeat pr-10 cursor-pointer"
                required
              >
                <option value="">Select category...</option>
                <option value="PERSONAL">Personal</option>
                <option value="CLASS">Class</option>
                <option value="WEB_DEVELOPMENT">Web Development</option>
                <option value="MOBILE_DEVELOPMENT">Mobile Development</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>

            {/* Suggestions */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Click to add or type your own:</p>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions.filter(s => !tags.includes(s)).map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground"
                placeholder="Type a custom tag and press Enter"
              />
              <button
                type="button"
                onClick={() => addTag()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted border border-border rounded-full text-sm flex items-center gap-2 text-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tech Stack
            </label>

            {/* Suggestions */}
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-2">Click to add or type your own:</p>
              <div className="flex flex-wrap gap-2">
                {techSuggestions.filter(s => !techStack.includes(s)).map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTech(suggestion)}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 transition"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const formData = new FormData()
                    formData.append('file', file)
                    const res = await fetch('/api/upload', { method: 'POST', body: formData })
                    const data = await res.json()
                    if (data.url) {
                      setThumbnailPath(data.url)
                      setImagePreview(data.url)
                      showToast('Image uploaded!', 'success')
                    }
                  }
                }}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg"
              />
              <button
                type="button"
                onClick={() => addTech()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-muted border border-border rounded-full text-sm flex items-center gap-2 text-foreground"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="hover:text-red-500 transition"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Thumbnail Image Path
            </label>
            
            <p className="text-xs text-muted-foreground mb-3">
              <FolderOpen size={14} className="inline mr-1" /> Upload your image to <code className="bg-muted px-2 py-1 rounded">public/uploads/projects/</code> then enter the path below
            </p>

            <input
              type="text"
              value={thumbnailPath}
              onChange={(e) => {
                setThumbnailPath(e.target.value)
                setImagePreview(e.target.value)
              }}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-foreground mb-4"
              placeholder="/uploads/projects/my-project.png"
            />
            
            {imagePreview && (
              <div className="mb-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-border"
                  onError={() => setImagePreview(null)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setThumbnailPath('')
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-border mt-1"
              />
              <div>
                <span className="text-foreground font-medium">Featured Project</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Featured projects appear first on your projects page and homepage, highlighting your best work.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded border-border mt-1"
              />
              <div>
                <span className="text-foreground font-medium">Publish Immediately</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Make this project visible to visitors right away. Uncheck to save as draft.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/admin/projects/${params.slug}`}
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition text-foreground font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  )
}