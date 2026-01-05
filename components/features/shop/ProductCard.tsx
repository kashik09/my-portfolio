'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Star, Download, ShoppingCart, Heart } from 'lucide-react'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
import { isLocalImageUrl, normalizePublicPath } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    price: number | string
    usdPrice?: number | string
    ugxPrice?: number | string
    displayPrice?: number
    displayCurrency?: string
    thumbnailUrl?: string | null
    featured: boolean
    downloadCount: number
    purchaseCount: number
  }
  onAddToCart?: (productId: string) => void
  showQuickAdd?: boolean
  initialIsSaved?: boolean
  onWishlistChange?: (productId: string, isSaved: boolean) => void
}

export function ProductCard({
  product,
  onAddToCart,
  showQuickAdd = true,
  initialIsSaved = false,
  onWishlistChange
}: ProductCardProps) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)

  const price = product.displayPrice || Number(product.usdPrice || product.price)
  const currency = (product.displayCurrency || 'USD') as SupportedCurrency
  const thumbnailSrc = normalizePublicPath(product.thumbnailUrl)
  const isLocalThumbnail = isLocalImageUrl(thumbnailSrc)

  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

  const handleWishlistToggle = async () => {
    if (!session?.user?.id) return

    setIsLoadingWishlist(true)
    const newSavedState = !isSaved
    setIsSaved(newSavedState) // Optimistic update
    onWishlistChange?.(product.id, newSavedState)

    try {
      if (newSavedState) {
        // Add to wishlist
        const res = await fetch('/api/me/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        })
        if (!res.ok) throw new Error()
      } else {
        // Remove from wishlist
        const res = await fetch(`/api/me/wishlist/${product.id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error()
      }
    } catch (error) {
      // Revert on error
      setIsSaved(!newSavedState)
      onWishlistChange?.(product.id, !newSavedState)
    } finally {
      setIsLoadingWishlist(false)
    }
  }

  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all hover:shadow-xl hover:border-primary/50">
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            Featured
          </Badge>
        </div>
      )}

      {/* Thumbnail */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-video bg-muted overflow-hidden">
        {thumbnailSrc ? (
          isLocalThumbnail ? (
            <Image
              src={thumbnailSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <img
              src={thumbnailSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/20" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{product.downloadCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            <span>{product.purchaseCount}</span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatPriceShort(price, currency)}
            </p>
            {currency !== 'USD' && (
              <p className="text-xs text-muted-foreground">
                {formatPriceShort(Number(product.usdPrice || product.price), 'USD')}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {/* Wishlist button - only for logged-in users */}
            {session?.user && (
              <button
                onClick={handleWishlistToggle}
                disabled={isLoadingWishlist}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save for later'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
            {showQuickAdd && onAddToCart && (
              <button
                onClick={() => onAddToCart(product.id)}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Quick add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
