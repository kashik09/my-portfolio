import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { convertPrice } from '@/lib/currency'
import { ProductsClient } from './ProductsClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export const metadata: Metadata = {
  title: 'Products | Kashi Kweyu',
  description: "Templates, themes, and tools I've built and packaged. They exist because I needed them first - now you can use them too.",
  openGraph: {
    title: 'Products | Kashi Kweyu',
    description: "Templates, themes, and tools I've built and packaged.",
    type: 'website',
  },
  alternates: {
    canonical: SITE_URL ? `${SITE_URL}/products` : '/products',
  },
}

export default async function ProductsPage() {
  const products = await prisma.digitalProduct.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
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
      thumbnailUrl: true,
      previewImages: true,
      personalLicense: true,
      commercialLicense: true,
      teamLicense: true,
      version: true,
      featured: true,
      downloadCount: true,
      purchaseCount: true,
      publishedAt: true,
      createdAt: true,
    },
  })

  const initialProducts = products.map((product) => {
    const basePrice = Number(product.usdPrice || product.price || 0)

    return {
      ...product,
      price: product.usdPrice || product.price,
      usdPrice: product.usdPrice || product.price,
      ugxPrice: product.ugxPrice || convertPrice(basePrice, 'USD', 'UGX'),
      displayPrice: basePrice,
      displayCurrency: 'USD',
    }
  })

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <ProductsClient initialProducts={initialProducts} />
    </div>
  )
}
