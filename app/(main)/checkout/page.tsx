'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
import { Check, CreditCard, Coins } from 'lucide-react'

export default function CheckoutPage() {
  const { data: _session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [cart, setCart] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, _setPaymentMethod] = useState('MANUAL')
  const [purchaseType, setPurchaseType] = useState<'ONE_TIME' | 'CREDITS'>('ONE_TIME')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [currency, _setCurrency] = useState<SupportedCurrency>('USD')

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?currency=${currency}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cart')
      }

      if (!data.cart?.items || data.cart.items.length === 0) {
        router.push('/cart')
        return
      }

      setCart(data.cart)
    } catch (error: any) {
      showToast(error.message || 'Failed to load cart', 'error')
      router.push('/cart')
    } finally {
      setIsLoading(false)
    }
  }, [currency, router, showToast])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
      return
    }

    if (status === 'authenticated') {
      fetchCart()
    }
  }, [fetchCart, router, status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!termsAccepted) {
      showToast('Please accept the terms and conditions', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          termsAccepted,
          purchaseType,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      showToast(data.message || 'Order placed successfully!', 'success')
      router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`)
    } catch (error: any) {
      showToast(error.message || 'Checkout failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const totals = cart?.totals || { subtotal: 0, tax: 0, total: 0 }
  const hasCreditsOption = totals.creditsRequired && totals.creditsRequired > 0

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>

              <div className="space-y-3">
                {/* One-Time Payment */}
                <button
                  type="button"
                  onClick={() => setPurchaseType('ONE_TIME')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    purchaseType === 'ONE_TIME' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      purchaseType === 'ONE_TIME' ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {purchaseType === 'ONE_TIME' && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-foreground" />
                        <span className="font-semibold text-foreground">One-Time Payment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pay via bank transfer or WhatsApp. Manual confirmation required.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Credits Payment */}
                {hasCreditsOption && (
                  <button
                    type="button"
                    onClick={() => setPurchaseType('CREDITS')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      purchaseType === 'CREDITS' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        purchaseType === 'CREDITS' ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {purchaseType === 'CREDITS' && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Coins className="w-4 h-4 text-foreground" />
                          <span className="font-semibold text-foreground">Pay with Credits</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Use {totals.creditsRequired} credits from your membership. Instant activation!
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-card rounded-xl border border-border p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <a href="/legal/terms" target="_blank" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/legal/privacy-policy" target="_blank" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
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
                    {purchaseType === 'CREDITS' && totals.creditsRequired
                      ? `${totals.creditsRequired} Credits`
                      : formatPriceShort(totals.total, currency)
                    }
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !termsAccepted}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
