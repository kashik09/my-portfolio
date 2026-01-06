'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { ProductGrid } from '@/components/features/shop/ProductGrid'
import { useToast } from '@/components/ui/Toast'
import { ProductsWishlistLink } from './ProductsWishlistLink'
import { isSupportedCurrency, type SupportedCurrency } from '@/lib/currency'
import {
  getDefaultCurrencyFromCountry,
  getSavedCurrency,
  saveCurrency,
} from '@/lib/currency-preference'

interface ProductsClientProps {
  initialProducts: any[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [products, setProducts] = useState<any[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [currency, setCurrency] = useState<SupportedCurrency>('USD')
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [wishlistLoaded, setWishlistLoaded] = useState(false)
  const hasMounted = useRef(false)
  const hasLoadedCurrency = useRef(false)

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (sort) params.append('sort', sort)
      if (currency) params.append('currency', currency)

      const response = await fetch(`/api/shop/products?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products')
      }

      setProducts(data.products || [])
    } catch (error: any) {
      console.error('Error fetching products:', error)
      showToast(error.message || 'Failed to load products', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [category, currency, search, showToast, sort])

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    fetchProducts()
  }, [category, currency, fetchProducts, search, sort])

  useEffect(() => {
    if (hasLoadedCurrency.current) return
    hasLoadedCurrency.current = true

    const saved = getSavedCurrency()
    if (saved) {
      setCurrency(saved)
      return
    }

    fetch('/api/geo')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const defaultCurrency = getDefaultCurrencyFromCountry(
          typeof data?.country === 'string' ? data.country : null
        )
        setCurrency(defaultCurrency)
        saveCurrency(defaultCurrency)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setWishlistIds([])
      setWishlistLoaded(false)
      return
    }

    let isMounted = true
    setWishlistLoaded(false)

    fetch('/api/me/wishlist')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return
        const ids = Array.isArray(data?.items)
          ? data.items.map((item: { productId: string }) => item.productId)
          : []
        setWishlistIds(ids)
        setWishlistLoaded(true)
      })
      .catch(() => {
        if (!isMounted) return
        setWishlistLoaded(true)
      })

    return () => {
      isMounted = false
    }
  }, [session?.user?.id, status])

  async function handleAddToCart(productId: string) {
    if (!session) {
      showToast('Please login to add items to cart', 'error')
      router.push('/login?callbackUrl=/products')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, licenseType: 'PERSONAL' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      showToast('Added to cart!', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    }
  }

  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds])
  const wishlistCount =
    status === 'authenticated' && wishlistLoaded ? wishlistIds.length : null

  const handleWishlistChange = useCallback((productId: string, isSaved: boolean) => {
    setWishlistIds((prev) => {
      const next = new Set(prev)
      if (isSaved) {
        next.add(productId)
      } else {
        next.delete(productId)
      }
      return Array.from(next)
    })
  }, [])

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = event.target.value
    if (!isSupportedCurrency(nextCurrency)) return
    setCurrency(nextCurrency)
    saveCurrency(nextCurrency)
  }

  return (
    <div className="flex flex-col gap-[var(--space-section)]">
      {/* Header */}
      <div className="container-lg space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-h1 font-bold text-foreground">products</h1>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              aria-label="Currency"
              className="px-3 py-2 text-sm border border-border/60 rounded-lg bg-muted/40 text-foreground focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="UGX">UGX</option>
            </select>
            <ProductsWishlistLink count={wishlistCount} />
          </div>
        </div>
        <p className="text-body text-muted-foreground/90 max-w-2xl">
          templates, themes, and tools i've built and packaged. they exist because i needed them first, now you can use them too.
        </p>
      </div>

      {/* Filters */}
      <div className="container-lg">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
            <input
              type="text"
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-border/60 rounded-lg bg-muted/40 text-foreground focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          >
            <option value="">all categories</option>
            <option value="TEMPLATE">templates</option>
            <option value="THEME">themes</option>
            <option value="UI_KIT">ui kits</option>
            <option value="CODE_SNIPPET">code snippets</option>
            <option value="ASSET">assets</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm border border-border/60 rounded-lg bg-muted/40 text-foreground focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          >
            <option value="newest">newest</option>
            <option value="oldest">oldest</option>
            <option value="price-asc">price: low to high</option>
            <option value="price-desc">price: high to low</option>
            <option value="popular">popular</option>
          </select>

        </div>
      </div>

      {/* Products Grid */}
      <div className="container-lg">
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
          savedProductIds={wishlistIdSet}
          onWishlistChange={handleWishlistChange}
          displayCurrency={currency}
        />
      </div>
    </div>
  )
}
