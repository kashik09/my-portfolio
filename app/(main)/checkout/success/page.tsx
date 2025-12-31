'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('orderNumber')

  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${orderNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      router.push('/products')
    } finally {
      setIsLoading(false)
    }
  }, [orderNumber, router])

  useEffect(() => {
    if (!orderNumber) {
      router.push('/products')
      return
    }

    fetchOrder()
  }, [fetchOrder, orderNumber, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return null
  }

  const isCompleted = order.status === 'COMPLETED'
  const isPending = order.status === 'PENDING'

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {isCompleted ? 'Order Complete!' : 'Order Placed!'}
          </h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Order Number</p>
          <p className="text-2xl font-bold text-foreground">{order.orderNumber}</p>
        </div>

        {/* Status Message */}
        {isCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Download className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Your licenses are ready!</h3>
                <p className="text-sm text-green-800">
                  Your order has been fulfilled and licenses have been issued. You can download your products now!
                </p>
              </div>
            </div>
          </div>
        ) : isPending ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Payment Instructions</h3>
                <p className="text-sm text-yellow-800 mb-4">
                  To complete your order, please send payment via one of the following methods:
                </p>

                <div className="space-y-3 mb-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-yellow-900 mb-1">Mobile Money (Preferred)</p>
                    <p className="text-sm text-yellow-800">Send <strong>${order.total}</strong> to:</p>
                    <p className="text-sm font-mono text-yellow-900">+256 XXX XXX XXX</p>
                    <p className="text-xs text-yellow-700 mt-1">Reference: {order.orderNumber}</p>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-yellow-900 mb-1">Bank Transfer</p>
                    <p className="text-sm text-yellow-800">Amount: <strong>${order.total}</strong></p>
                    <p className="text-xs text-yellow-700">Account details sent to {order.customerEmail}</p>
                    <p className="text-xs text-yellow-700 mt-1">Reference: {order.orderNumber}</p>
                  </div>
                </div>

                <p className="text-xs text-yellow-700 mb-2">
                  <strong>Important:</strong> Include order number {order.orderNumber} in payment reference
                </p>
                <p className="text-xs text-yellow-700">
                  Once payment is confirmed (usually within 1-2 hours), we'll issue your licenses and send download instructions to {order.customerEmail}.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Order Items */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">{item.licenseType} License</p>
                </div>
                {item.license && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    License Issued
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isCompleted && (
            <Link
              href="/dashboard/downloads"
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Go to Downloads
            </Link>
          )}

          <Link
            href={`/dashboard/orders/${order.orderNumber}`}
            className="w-full py-3 px-6 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors font-medium flex items-center justify-center gap-2"
          >
            View Order Details
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/products"
            className="w-full py-3 px-6 text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
