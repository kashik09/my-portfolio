'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Users,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Plus,
  Eye,
  Package,
  AlertCircle,
} from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

type DashboardStats = {
  pendingRequests: number
  completedRequests: { last7Days: number; last30Days: number }
  orders: { total: number; recent: number; pendingPayment: number }
  users: { new7Days: number; new30Days: number }
  revenue: { total: number; average: number; orderCount: number }
  system: {
    maintenanceMode: boolean
    availableForBusiness: boolean
    lastChecked: string
    status: string
  }
  recentActivity: Array<{
    id: string
    action: string
    resource: string
    resourceId: string
    userName: string
    createdAt: string
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/dashboard/stats', {
        signal: controller.signal
      })

      clearTimeout(timeout)

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Failed to fetch stats'
        if (response.status === 403) {
          throw new Error(`Access denied. Log out and log back in to refresh your session.`)
        }
        throw new Error(errorMsg)
      }

      setStats(data.data)
      setError(null)
    } catch (err: any) {
      clearTimeout(timeout)
      console.error('Error fetching dashboard stats:', err)

      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else {
        setError(err.message || 'Failed to load dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground mb-4">{error || 'Unknown error'}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      label: 'Pending Requests',
      value: stats.pendingRequests,
      icon: FileText,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      href: '/admin/requests?status=PENDING',
    },
    {
      label: 'Orders',
      value: stats.orders.total,
      sublabel: `${stats.orders.recent} recent`,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/orders',
    },
    {
      label: 'Revenue',
      value: `$${stats.revenue.total.toFixed(0)}`,
      sublabel: `Avg: $${stats.revenue.average.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/admin/orders?status=COMPLETED',
    },
    {
      label: 'New Users',
      value: stats.users.new7Days,
      sublabel: `${stats.users.new30Days} last 30d`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/admin/users',
    },
    {
      label: 'Pending Payment',
      value: stats.orders.pendingPayment,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/admin/orders?paymentStatus=PENDING',
    },
    {
      label: 'Completed (7d)',
      value: stats.completedRequests.last7Days,
      sublabel: `${stats.completedRequests.last30Days} last 30d`,
      icon: CheckCircle,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      href: '/admin/requests?status=COMPLETED',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your site overview.</p>
      </div>

      {/* System Health Widget */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">System Health</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stats.system.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-foreground">
                  API Status: <strong>{stats.system.status.toUpperCase()}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stats.system.availableForBusiness ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm text-foreground">
                  Availability:{' '}
                  <strong>{stats.system.availableForBusiness ? 'Open' : 'Closed'}</strong>
                </span>
              </div>
              {stats.system.maintenanceMode && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-foreground">
                    <strong>Maintenance Mode Active</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last checked</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(stats.system.lastChecked).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={kpi.color} size={24} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
            {kpi.sublabel && (
              <p className="text-xs text-muted-foreground mt-1">{kpi.sublabel}</p>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/digital-products/new"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-center font-medium shadow-sm"
          >
            <Plus size={20} />
            Create Product
          </Link>
          <Link
            href="/admin/requests?status=PENDING"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-card border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition text-center font-medium"
          >
            <FileText size={20} />
            View Pending Requests
          </Link>
          <Link
            href="/admin/orders?paymentStatus=PENDING"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-card border-2 border-border text-foreground rounded-lg hover:bg-muted transition text-center font-medium"
          >
            <ShoppingBag size={20} />
            Review Orders
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          <Link
            href="/admin/audit"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All
            <TrendingUp size={16} />
          </Link>
        </div>

        {stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Activity size={18} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action.replace(/_/g, ' ').toLowerCase()} on{' '}
                      {activity.resource} ({activity.resourceId.slice(0, 8)})
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="mx-auto mb-4" size={48} />
            <p className="text-lg font-medium mb-2">No recent activity</p>
            <p className="text-sm">Activity will appear here once actions are logged.</p>
          </div>
        )}
      </div>
    </div>
  )
}
