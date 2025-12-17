'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, Package, ArrowLeft, FileText, Calendar, Shield, Clock, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

interface DownloadHistory {
  id: string
  downloadedAt: string
  ipHash: string
  successful: boolean
}

interface ProductDownload {
  slug: string
  name: string
  description: string
  category: string
  thumbnailUrl?: string
  downloadLimit: number
  downloadsUsed: number
  purchasedAt: string
  expiresAt?: string
  fileSize: number
  fileType: string
  version: string
  licenseType: string
  licenseKey?: string
  downloadHistory: DownloadHistory[]
}

interface DownloadDetailPageProps {
  params: {
    slug: string
  }
}

export default function DownloadDetailPage({ params }: DownloadDetailPageProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [product, setProduct] = useState<ProductDownload | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchProductDetails()
  }, [params.slug])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/user/downloads/${params.slug}`)
      // const data = await response.json()

      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock product data matching the slug
      const mockProducts: Record<string, ProductDownload> = {
        'ui-kit-pro': {
          slug: 'ui-kit-pro',
          name: 'UI Kit Pro',
          description: 'Complete UI component library with 200+ components including buttons, forms, cards, modals, navigation elements, and more. Built with modern design principles and accessibility in mind. Includes both light and dark mode variants, fully customizable with CSS variables.',
          category: 'UI_KIT',
          thumbnailUrl: '/images/products/ui-kit.png',
          downloadLimit: 3,
          downloadsUsed: 1,
          purchasedAt: new Date(Date.now() - 2592000000).toISOString(),
          fileSize: 15728640,
          fileType: 'ZIP',
          version: '2.1.0',
          licenseType: 'Personal License',
          licenseKey: 'UIKIT-PRO-2024-XXXX-XXXX-XXXX',
          downloadHistory: [
            {
              id: '1',
              downloadedAt: new Date(Date.now() - 86400000).toISOString(),
              ipHash: 'hash123',
              successful: true
            }
          ]
        },
        'dashboard-template': {
          slug: 'dashboard-template',
          name: 'Dashboard Template',
          description: 'Modern admin dashboard template with dark mode support. Includes complete layouts for analytics, user management, settings, and more. Built with Next.js 14 and TypeScript. Features responsive design, chart integrations, and customizable components.',
          category: 'TEMPLATE',
          thumbnailUrl: '/images/products/dashboard.png',
          downloadLimit: 3,
          downloadsUsed: 2,
          purchasedAt: new Date(Date.now() - 5184000000).toISOString(),
          fileSize: 8388608,
          fileType: 'ZIP',
          version: '1.5.2',
          licenseType: 'Commercial License',
          licenseKey: 'DASH-TEMP-2024-XXXX-XXXX-XXXX',
          downloadHistory: [
            {
              id: '2',
              downloadedAt: new Date(Date.now() - 172800000).toISOString(),
              ipHash: 'hash456',
              successful: true
            },
            {
              id: '3',
              downloadedAt: new Date(Date.now() - 259200000).toISOString(),
              ipHash: 'hash789',
              successful: true
            }
          ]
        },
        'icon-pack': {
          slug: 'icon-pack',
          name: 'Premium Icon Pack',
          description: '500+ SVG icons for modern applications. Includes multiple styles (outline, filled, duotone) and categories (UI, social, business, etc). All icons are optimized for web use and available in multiple sizes. Fully customizable with CSS.',
          category: 'ASSET',
          downloadLimit: 3,
          downloadsUsed: 0,
          purchasedAt: new Date(Date.now() - 1296000000).toISOString(),
          fileSize: 2097152,
          fileType: 'ZIP',
          version: '3.0.0',
          licenseType: 'Extended License',
          licenseKey: 'ICON-PACK-2024-XXXX-XXXX-XXXX',
          downloadHistory: []
        }
      }

      const productData = mockProducts[params.slug]

      if (!productData) {
        setProduct(null)
      } else {
        setProduct(productData)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      showToast('Failed to load product details', 'error')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!product) return

    if (product.downloadsUsed >= product.downloadLimit) {
      showToast('Download limit reached', 'error')
      return
    }

    setShowConfirmModal(false)
    setDownloading(true)

    try {
      // TODO: Replace with actual download API call
      // const response = await fetch(`/api/user/downloads/${product.slug}/download`, {
      //   method: 'POST'
      // })
      // const data = await response.json()
      // window.location.href = data.downloadUrl

      // Mock download
      await new Promise(resolve => setTimeout(resolve, 2000))

      showToast('Download started successfully', 'success')

      // Update downloads used count
      setProduct({
        ...product,
        downloadsUsed: product.downloadsUsed + 1,
        downloadHistory: [
          {
            id: `new-${Date.now()}`,
            downloadedAt: new Date().toISOString(),
            ipHash: 'current-ip-hash',
            successful: true
          },
          ...product.downloadHistory
        ]
      })
    } catch (error) {
      console.error('Error downloading product:', error)
      showToast('Failed to download product', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = product?.expiresAt && new Date(product.expiresAt) < new Date()
  const canDownload = product && product.downloadsUsed < product.downloadLimit && !isExpired

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl">
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Package className="mx-auto mb-4 text-muted-foreground" size={64} />
          <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This product doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard/downloads"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            <ArrowLeft size={20} />
            Back to Downloads
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/dashboard/downloads"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft size={20} />
        Back to Downloads
      </Link>

      {/* Product Header */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Thumbnail */}
        {product.thumbnailUrl ? (
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Package className="text-primary" size={64} />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <span className="inline-block px-3 py-1 text-sm bg-primary/20 text-primary rounded-full font-medium">
                {formatCategory(product.category)}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Download Info Bar */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Downloads Remaining</p>
                <p className={`text-2xl font-bold ${
                  product.downloadsUsed >= product.downloadLimit
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {product.downloadLimit - product.downloadsUsed} / {product.downloadLimit}
                </p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="text-xl font-bold text-foreground">{formatFileSize(product.fileSize)}</p>
              </div>
            </div>

            {isExpired && (
              <div className="px-4 py-2 bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg font-medium">
                License Expired
              </div>
            )}
          </div>

          {/* Download Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Download Usage</span>
              <span className="font-medium text-foreground">
                {Math.round((product.downloadsUsed / product.downloadLimit) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  product.downloadsUsed >= product.downloadLimit
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${(product.downloadsUsed / product.downloadLimit) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={!canDownload || downloading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium transition ${
              canDownload && !downloading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download size={20} />
                {canDownload ? 'Download Product' :
                  isExpired ? 'License Expired' : 'Download Limit Reached'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Information */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground">File Information</h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">File Type</p>
              <p className="font-medium text-foreground">{product.fileType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Version</p>
              <p className="font-medium text-foreground">{product.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">File Size</p>
              <p className="font-medium text-foreground">{formatFileSize(product.fileSize)}</p>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground">License Information</h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">License Type</p>
              <p className="font-medium text-foreground">{product.licenseType}</p>
            </div>
            {product.licenseKey && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">License Key</p>
                <p className="font-mono text-sm text-foreground bg-muted px-3 py-2 rounded">
                  {product.licenseKey}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Purchased</p>
              <p className="font-medium text-foreground">{formatDate(product.purchasedAt)}</p>
            </div>
            {product.expiresAt && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expires</p>
                <p className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                  {formatDate(product.expiresAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download History */}
      {product.downloadHistory.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Download History</h2>
          </div>

          <div className="space-y-3">
            {product.downloadHistory.map((download) => (
              <div
                key={download.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  <div>
                    <p className="font-medium text-foreground">Downloaded successfully</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(download.downloadedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Download Modal */}
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDownload}
          title="Confirm Download"
          message={
            <div className="space-y-2">
              <p>You are about to download <strong>{product.name}</strong>.</p>
              <p>You have <strong>{product.downloadLimit - product.downloadsUsed}</strong> download{product.downloadLimit - product.downloadsUsed !== 1 ? 's' : ''} remaining.</p>
            </div>
          }
          confirmText="Download"
          type="primary"
        />
      )}
    </div>
  )
}
