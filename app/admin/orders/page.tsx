'use client'

export const dynamic = 'force-dynamic'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Clock, CheckCircle, DollarSign, Eye, User } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPriceShort } from '@/lib/currency'
import type { SupportedCurrency } from '@/lib/currency'
export default function AdminOrdersPage() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter)
      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders')
      }
      setOrders(data.orders || [])
      setStats(data.stats)
    } catch (error: any) {
      showToast(error.message || 'Failed to load orders', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [paymentStatusFilter, showToast, statusFilter])
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])
  async function handleFulfillOrder(orderNumber: string) {
    if (!confirm(`Fulfill order ${orderNumber}? This will issue licenses.`)) {
      return
    }
    try {
      const response = await fetch(`/api/orders/${orderNumber}/fulfill`, {
        method: 'POST',
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fulfill order')
      }
      showToast('Order fulfilled successfully!', 'success')
      fetchOrders()
    } catch (error: any) {
      showToast(error.message || 'Failed to fulfill order', 'error')
    }
  }
  function getStatusColor(status: string) {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-muted text-foreground border-border'
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Order Management</h1>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <User className="w-4 h-4" />
            View as User
          </Link>
        </div>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.pendingOrders}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.completedOrders}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatPriceShort(Number(stats.totalRevenue || 0), 'USD')}
              </p>
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Payment Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Payment</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{order.customerName || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        {formatPriceShort(Number(order.total), order.currency as SupportedCurrency)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        order.paymentStatus === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'PENDING' && order.paymentStatus === 'COMPLETED' && (
                          <button
                            onClick={() => handleFulfillOrder(order.orderNumber)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs font-medium"
                          >
                            Fulfill
                          </button>
                        )}
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-foreground" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
