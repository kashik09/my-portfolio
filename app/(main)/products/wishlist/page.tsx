'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { ProductCard } from '@/components/features/shop/ProductCard'
import { Spinner } from '@/components/ui/Spinner'
import { convertPrice, isSupportedCurrency, type SupportedCurrency } from '@/lib/currency'
import {
  getDefaultCurrencyFromCountry,
  getSavedCurrency,
  saveCurrency,
} from '@/lib/currency-preference'

interface WishlistItem {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  currency: string
  usdPrice: number
  ugxPrice: number
  creditPrice: number | null
  thumbnailUrl: string | null
  category: string
  published: boolean
  createdAt: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayCurrency, setDisplayCurrency] = useState<SupportedCurrency>('USD')
  const hasLoadedCurrency = useRef(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/login?callbackUrl=/products/wishlist')
      return
    }

    fetchWishlist()
  }, [session, status, router])

  useEffect(() => {
    if (hasLoadedCurrency.current) return
    hasLoadedCurrency.current = true

    const saved = getSavedCurrency()
    if (saved) {
      setDisplayCurrency(saved)
      return
    }

    fetch('/api/geo')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const defaultCurrency = getDefaultCurrencyFromCountry(
          typeof data?.country === 'string' ? data.country : null
        )
        setDisplayCurrency(defaultCurrency)
        saveCurrency(defaultCurrency)
      })
      .catch(() => {})
  }, [])

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = event.target.value
    if (!isSupportedCurrency(nextCurrency)) return
    setDisplayCurrency(nextCurrency)
    saveCurrency(nextCurrency)
  }

  async function fetchWishlist() {
    try {
      setIsLoading(true)
      const res = await fetch('/api/me/wishlist')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch wishlist')
      }

      setItems(data.items || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session?.user) {
    return null // Redirecting
  }

  return (
    <div style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-section)' }}>
      <div className="container-lg">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <h1 className="text-h1 font-bold text-foreground mb-3">Saved for later</h1>
            <p className="text-body text-muted-foreground/90">
              Products you've saved for later
            </p>
            <div className="mt-4">
              <select
                value={displayCurrency}
                onChange={handleCurrencyChange}
                aria-label="Currency"
                className="px-3 py-2 text-sm border border-border/60 rounded-lg bg-muted/40 text-foreground focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              >
                <option value="USD">USD ($)</option>
                <option value="UGX">UGX</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Start adding products you're interested in to keep track of them for later.
              </p>
              <Link
                href="/products"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Browse Products
              </Link>
            </div>
          )}

          {/* Products Grid */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.productId,
                    name: item.name,
                    slug: item.slug,
                    description: '', // Not provided in wishlist API
                    category: item.category,
                    price: item.price,
                    usdPrice: item.usdPrice,
                    ugxPrice: item.ugxPrice,
                    displayPrice:
                      displayCurrency === 'UGX'
                        ? (item.ugxPrice ?? convertPrice(item.usdPrice, 'USD', 'UGX'))
                        : item.usdPrice,
                    displayCurrency: displayCurrency,
                    thumbnailUrl: item.thumbnailUrl,
                    featured: false, // Not tracked in wishlist
                    downloadCount: 0, // Not provided
                    purchaseCount: 0, // Not provided
                  }}
                  showQuickAdd={false}
                  initialIsSaved
                  displayCurrency={displayCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
