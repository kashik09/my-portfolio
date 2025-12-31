'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, Copy, CheckCircle, Clock } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
export default function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${params.orderNumber}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Order not found')
      }
      setOrder(data.order)
    } catch (error: any) {
      showToast(error.message || 'Failed to load order', 'error')
      router.push('/dashboard/orders')
    } finally {
      setIsLoading(false)
    }
  }, [params.orderNumber, router, showToast])
  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }
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
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.orderNumber}</p>
        </div>
        {/* Order Status */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {isCompleted ? 'Order Completed' : 'Order Pending'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                {formatPriceShort(Number(order.total), order.currency as SupportedCurrency)}
              </p>
              {order.purchaseType === 'CREDITS' && (
                <p className="text-sm text-muted-foreground">
                  Paid with {order.creditsUsed} credits
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Order Items */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">{item.licenseType} License</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatPriceShort(Number(item.price), item.currency as SupportedCurrency)}
                  </p>
                </div>
                {item.license && (
                  <div className="bg-muted rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">License Key:</span>
                      <button
                        onClick={() => copyToClipboard(item.license.licenseKey)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <code className="block text-sm text-foreground font-mono break-all">
                      {item.license.licenseKey}
                    </code>
                    {item.license.status === 'ACTIVE' && (
                      <Link
                        href={`/dashboard/downloads/${item.product.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium mt-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Now
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Payment Information */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Payment Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Payment Method</p>
              <p className="text-foreground font-medium">
                {order.purchaseType === 'CREDITS' ? 'Membership Credits' : order.paymentMethod || 'Manual'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Status</p>
              <p className="text-foreground font-medium">{order.paymentStatus}</p>
            </div>
            {order.transactionId && (
              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Transaction ID</p>
                <p className="text-foreground font-mono text-xs">{order.transactionId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
