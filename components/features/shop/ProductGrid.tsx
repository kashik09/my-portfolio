'use client'

import { ProductCard } from './ProductCard'
import { Package } from 'lucide-react'
import type { SupportedCurrency } from '@/lib/currency'

interface ProductGridProps {
  products: any[]
  onAddToCart?: (productId: string) => void
  isLoading?: boolean
  savedProductIds?: Set<string>
  onWishlistChange?: (productId: string, isSaved: boolean) => void
  displayCurrency?: SupportedCurrency
}

export function ProductGrid({
  products,
  onAddToCart,
  isLoading = false,
  savedProductIds,
  onWishlistChange,
  displayCurrency
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Package className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          showQuickAdd={!!onAddToCart}
          initialIsSaved={savedProductIds?.has(product.id)}
          onWishlistChange={onWishlistChange}
          displayCurrency={displayCurrency}
        />
      ))}
    </div>
  )
}
