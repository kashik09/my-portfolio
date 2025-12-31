'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
export default function OrdersPage() {
  const { status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`/api/orders?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders')
      }
      setOrders(data.orders || [])
    } catch (error: any) {
      showToast(error.message || 'Failed to load orders', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast, statusFilter])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard/orders')
      return
    }
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [fetchOrders, router, status])
  function getStatusColor(status: string) {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-muted text-foreground border-border'
    }
  }
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">My Orders</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-24 h-24 text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-8">You haven't placed any orders yet</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {order.orderNumber}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {formatPriceShort(Number(order.total), order.currency as SupportedCurrency)}
                    </p>
                    {order.purchaseType === 'CREDITS' && order.creditsUsed && (
                      <p className="text-sm text-muted-foreground">
                        {order.creditsUsed} credits used
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.productName}</span>
                        <span className="text-muted-foreground">{item.licenseType}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/dashboard/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
