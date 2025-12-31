'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CartItem } from '@/components/features/cart/CartItem'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'

export default function CartPage() {
  const { data: _session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [cart, setCart] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currency, _setCurrency] = useState<SupportedCurrency>('USD')

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?currency=${currency}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cart')
      }

      setCart(data.cart)
    } catch (error: any) {
      showToast(error.message || 'Failed to load cart', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [currency, showToast])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
      return
    }

    if (status === 'authenticated') {
      fetchCart()
    }
  }, [fetchCart, router, status])

  async function handleRemoveItem(itemId: string) {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item')
      }

      showToast('Item removed from cart', 'success')
      fetchCart()
    } catch (error: any) {
      showToast(error.message || 'Failed to remove item', 'error')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const items = cart?.items || []
  const totals = cart?.totals || { subtotal: 0, tax: 0, total: 0, itemCount: 0 }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-24 h-24 text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products to get started</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totals.itemCount} items)</span>
                    <span className="text-foreground font-medium">
                      {formatPriceShort(totals.subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground font-medium">
                      {formatPriceShort(totals.tax, currency)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-foreground text-xl">
                      {formatPriceShort(totals.total, currency)}
                    </span>
                  </div>
                </div>

                {totals.creditsRequired && totals.creditsRequired > 0 && (
                  <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">With Credits:</span> {totals.creditsRequired} credits
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/products"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
