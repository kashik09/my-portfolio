'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
const CATEGORIES = [
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'THEME', label: 'Theme' },
  { value: 'UI_KIT', label: 'UI Kit' },
  { value: 'CODE_SNIPPET', label: 'Code Snippet' },
  { value: 'DOCUMENTATION', label: 'Documentation' },
  { value: 'ASSET', label: 'Asset' },
  { value: 'LICENSE', label: 'License' },
  { value: 'OTHER', label: 'Other' }
]
interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  fileUrl: string
  fileSize: number
  fileType: string
  thumbnailUrl: string | null
  personalLicense: boolean
  commercialLicense: boolean
  teamLicense: boolean
  published: boolean
  featured: boolean
  version: string
  tags: string[]
  changelog: string | null
  documentation: string | null
}
export default function EditDigitalProductPage() {
  const router = useRouter()
  const params = useParams()
  const productSlug = params.slug as string
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'TEMPLATE',
    price: '',
    fileUrl: '',
    fileSize: '',
    fileType: '',
    thumbnailUrl: '',
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    published: false,
    featured: false,
    version: '1.0.0',
    tags: '',
    changelog: '',
    documentation: ''
  })
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      // First, get all products to find the one with this slug
      const response = await fetch('/api/admin/digital-products')
      const data = await response.json()
      if (data.success) {
        const product = data.products.find((p: any) => p.slug === productSlug)
        if (product) {
          // Fetch full product details using the ID
          const detailResponse = await fetch(`/api/admin/digital-products/${product.id}`)
          const detailData = await detailResponse.json()
          if (detailData.success) {
            const p = detailData.data
            setProduct(p)
            setFormData({
              name: p.name,
              slug: p.slug,
              description: p.description,
              category: p.category,
              price: p.price.toString(),
              fileUrl: p.fileUrl,
              fileSize: p.fileSize.toString(),
              fileType: p.fileType,
              thumbnailUrl: p.thumbnailUrl || '',
              personalLicense: p.personalLicense,
              commercialLicense: p.commercialLicense,
              teamLicense: p.teamLicense,
              published: p.published,
              featured: p.featured,
              version: p.version,
              tags: p.tags?.join(', ') || '',
              changelog: p.changelog || '',
              documentation: p.documentation || ''
            })
          }
        } else {
          showToast('Product not found', 'error')
          router.push('/admin/digital-products')
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      showToast('Failed to fetch product', 'error')
    } finally {
      setLoading(false)
    }
  }, [productSlug, router, showToast])
  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/digital-products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          fileUrl: formData.fileUrl,
          fileSize: parseInt(formData.fileSize),
          fileType: formData.fileType,
          thumbnailUrl: formData.thumbnailUrl || null,
          personalLicense: formData.personalLicense,
          commercialLicense: formData.commercialLicense,
          teamLicense: formData.teamLicense,
          published: formData.published,
          featured: formData.featured,
          version: formData.version,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          changelog: formData.changelog || null,
          documentation: formData.documentation || null
        })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Product updated successfully', 'success')
        router.push('/admin/digital-products')
      } else {
        showToast(data.error || 'Failed to update product', 'error')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('Failed to update product', 'error')
    } finally {
      setSaving(false)
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Link href="/admin/digital-products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    )
  }
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/digital-products"
          className="p-2 hover:bg-muted rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
            />
          </div>
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL-friendly version of the name
            </p>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
              required
            />
          </div>
          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
              />
            </div>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              placeholder="react, nextjs, tailwind (comma-separated)"
            />
          </div>
        </div>
        {/* Files */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Files</h2>
          {/* File URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product File URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              required
            />
          </div>
          {/* File Size and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                File Size (bytes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                File Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                required
              />
            </div>
          </div>
          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
        </div>
        {/* License Types */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Available Licenses</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="personalLicense"
                checked={formData.personalLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Personal License</span>
                <p className="text-sm text-muted-foreground">For individual use</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="commercialLicense"
                checked={formData.commercialLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Commercial License</span>
                <p className="text-sm text-muted-foreground">For commercial projects</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="teamLicense"
                checked={formData.teamLicense}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Team License</span>
                <p className="text-sm text-muted-foreground">For team collaboration</p>
              </div>
            </label>
          </div>
        </div>
        {/* Additional Information */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Version
            </label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
          {/* Changelog */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Changelog
            </label>
            <textarea
              name="changelog"
              value={formData.changelog}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            />
          </div>
          {/* Documentation */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Documentation
            </label>
            <textarea
              name="documentation"
              value={formData.documentation}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            />
          </div>
        </div>
        {/* Publishing Options */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Publishing Options</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Published</span>
                <p className="text-sm text-muted-foreground">Make this product available to customers</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div>
                <span className="text-foreground font-medium">Featured Product</span>
                <p className="text-sm text-muted-foreground">Highlight this product on the store</p>
              </div>
            </label>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Spinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
          <Link
            href="/admin/digital-products"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
