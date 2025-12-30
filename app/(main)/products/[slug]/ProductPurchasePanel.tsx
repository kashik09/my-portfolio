'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { LicenseSelector } from '@/components/features/shop/LicenseSelector'
import { PriceDisplay } from '@/components/features/shop/PriceDisplay'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'

interface LicenseOption {
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
}

interface ProductPurchasePanelProps {
  product: {
    id: string
    slug: string
    prices: {
      usd: number | string
      ugx: number | string
      credits: number | null
    }
    licenseOptions: LicenseOption[]
  }
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [selectedLicense, setSelectedLicense] = useState(
    product.licenseOptions?.[0]?.type || 'PERSONAL'
  )
  const [addingToCart, setAddingToCart] = useState(false)

  async function handleAddToCart() {
    if (!session) {
      showToast('Please login to add items to cart', 'error')
      router.push(`/login?callbackUrl=/products/${product.slug}`)
      return
    }

    try {
      setAddingToCart(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          licenseType: selectedLicense,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      showToast('Added to cart successfully!', 'success')
      router.push('/cart')
    } catch (error: any) {
      showToast(error.message || 'Failed to add to cart', 'error')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pt-6 border-t border-border">
        <PriceDisplay
          usdPrice={Number(product.prices.usd)}
          ugxPrice={Number(product.prices.ugx)}
          creditPrice={product.prices.credits}
        />
      </div>

      {product.licenseOptions.length > 0 && (
        <div className="pt-6 border-t border-border">
          <LicenseSelector
            options={product.licenseOptions}
            selected={selectedLicense}
            onChange={setSelectedLicense}
          />
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {addingToCart ? (
          <>
            <Spinner size="sm" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
