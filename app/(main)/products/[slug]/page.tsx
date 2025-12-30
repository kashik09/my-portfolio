import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Download, FileText, Package, ShieldCheck, Headphones, Zap } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { convertPrice } from '@/lib/currency'
import { normalizePublicPath } from '@/lib/utils'
import { ProductPurchasePanel } from './ProductPurchasePanel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

const getProduct = cache(async (slug: string) =>
  prisma.digitalProduct.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: true,
      tags: true,
      price: true,
      currency: true,
      usdPrice: true,
      ugxPrice: true,
      creditPrice: true,
      fileSize: true,
      fileType: true,
      thumbnailUrl: true,
      previewImages: true,
      personalLicense: true,
      commercialLicense: true,
      teamLicense: true,
      version: true,
      changelog: true,
      documentation: true,
      featured: true,
      downloadCount: true,
      purchaseCount: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })
)

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: 'Product not found',
      robots: { index: false, follow: false },
    }
  }

  const canonical = SITE_URL
    ? `${SITE_URL}/products/${product.slug}`
    : `/products/${product.slug}`
  const description = product.description || product.name
  const imagePath = normalizePublicPath(product.thumbnailUrl)
  const imageUrl = imagePath && SITE_URL ? `${SITE_URL}${imagePath}` : imagePath

  return {
    title: `${product.name} | Products`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: product.name,
      description,
      type: 'product',
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const basePrice = Number(product.usdPrice || product.price || 0)
  const prices = {
    usd: product.usdPrice || product.price,
    ugx: product.ugxPrice || convertPrice(basePrice, 'USD', 'UGX'),
    credits: product.creditPrice || null,
  }

  const licenseOptions = [] as Array<{
    type: 'PERSONAL' | 'COMMERCIAL' | 'TEAM'
    name: string
    description: string
    price: number
    currency: string
    prices: {
      usd: number | string
      ugx: number | string
      credits: number | null
    }
  }>

  if (product.personalLicense) {
    licenseOptions.push({
      type: 'PERSONAL',
      name: 'Personal License',
      description: 'For individual use on a single device',
      price: basePrice,
      currency: 'USD',
      prices,
    })
  }

  if (product.commercialLicense) {
    licenseOptions.push({
      type: 'COMMERCIAL',
      name: 'Commercial License',
      description: 'For commercial projects and clients',
      price: basePrice * 1.5,
      currency: 'USD',
      prices: {
        usd: Number(prices.usd) * 1.5,
        ugx: Number(prices.ugx) * 1.5,
        credits: prices.credits ? prices.credits * 1.5 : null,
      },
    })
  }

  if (product.teamLicense) {
    licenseOptions.push({
      type: 'TEAM',
      name: 'Team License',
      description: 'For teams up to 5 members',
      price: basePrice * 3,
      currency: 'USD',
      prices: {
        usd: Number(prices.usd) * 3,
        ugx: Number(prices.ugx) * 3,
        credits: prices.credits ? prices.credits * 3 : null,
      },
    })
  }

  const canonical = SITE_URL
    ? `${SITE_URL}/products/${product.slug}`
    : `/products/${product.slug}`
  const imagePath = normalizePublicPath(product.thumbnailUrl)
  const imageUrl = imagePath && SITE_URL ? `${SITE_URL}${imagePath}` : imagePath

  const productJsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: basePrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
  }

  if (imageUrl) {
    productJsonLd.image = [imageUrl]
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {product.previewImages && product.previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {product.previewImages.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border"
                  >
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {product.category.replace(/_/g, ' ')}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{product.downloadCount} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{product.purchaseCount} purchases</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">v{product.version}</span>
              </div>
            </div>

            <ProductPurchasePanel
              product={{
                id: product.id,
                slug: product.slug,
                prices,
                licenseOptions,
              }}
            />

            <div className="grid gap-4 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Instant delivery</h3>
                  <p className="text-sm text-muted-foreground">Get immediate access after checkout.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Secure checkout</h3>
                  <p className="text-sm text-muted-foreground">Payments are protected and encrypted.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Support if you need it</h3>
                  <p className="text-sm text-muted-foreground">Email help for setup, downloads, and licensing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(product.documentation || product.changelog) && (
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {product.documentation && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Documentation</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {product.documentation}
                </div>
              </div>
            )}

            {product.changelog && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Changelog</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {product.changelog}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
    </div>
  )
}
