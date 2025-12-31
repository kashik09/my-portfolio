'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Package, Download, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import ConfirmModal from '@/components/ui/ConfirmModal'
interface DigitalProduct {
  id: string
  title: string
  slug: string
  description: string
  category: string
  price: number
  published: boolean
  featured: boolean
  downloadCount: number
  purchaseCount: number
  thumbnail?: string
  licenseTypes: string[]
  createdAt: string
}
export default function AdminDigitalProductsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<DigitalProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; productId: string | null }>({
    show: false,
    productId: null
  })
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/digital-products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  const handleDelete = async () => {
    if (!deleteModal.productId) return
    try {
      const response = await fetch(`/api/admin/digital-products/${deleteModal.productId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      showToast('Product deleted successfully', 'success')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('Failed to delete product', 'error')
    } finally {
      setDeleteModal({ show: false, productId: null })
    }
  }
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/digital-products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus })
      })
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      showToast(`Product ${!currentStatus ? 'published' : 'unpublished'} successfully`, 'success')
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('Failed to update product', 'error')
    }
  }
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && product.published) ||
      (statusFilter === 'DRAFT' && !product.published)
    return matchesSearch && matchesCategory && matchesStatus
  })
  const stats = {
    total: products.length,
    published: products.filter(p => p.published).length,
    draft: products.filter(p => !p.published).length,
    featured: products.filter(p => p.featured).length
  }
  const categories = Array.from(new Set(products.map(p => p.category)))
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Digital Products</h1>
          <p className="text-foreground-muted">Manage your digital products and licenses</p>
        </div>
        <Link
          href="/admin/digital-products/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-primary" size={20} />
            <p className="text-foreground-muted text-sm">Total Products</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-success" size={20} />
            <p className="text-foreground-muted text-sm">Published</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.published}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-warning" size={20} />
            <p className="text-foreground-muted text-sm">Drafts</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Download className="text-info" size={20} />
            <p className="text-foreground-muted text-sm">Featured</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.featured}</p>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground-muted" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-foreground-muted self-center">Status:</span>
            {['ALL', 'PUBLISHED', 'DRAFT'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-foreground-muted self-center">Category:</span>
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                categoryFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              ALL
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  categoryFilter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Products List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto text-foreground-muted mb-4" size={48} />
            <p className="text-foreground-muted">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Downloads</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Purchases</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="text-sm text-foreground-muted">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {product.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.published
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {product.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{product.downloadCount}</td>
                    <td className="p-4 text-foreground">{product.purchaseCount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublished(product.id, product.published)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title={product.published ? 'Unpublish' : 'Publish'}
                        >
                          {product.published ? (
                            <XCircle className="text-warning" size={18} />
                          ) : (
                            <CheckCircle className="text-success" size={18} />
                          )}
                        </button>
                        <Link
                          href={`/admin/digital-products/${product.slug}/edit`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="text-primary" size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, productId: product.id })}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="text-destructive" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, productId: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will also delete all associated licenses."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}
