'use client'

export const dynamic = 'force-dynamic'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, FileText, ArrowRight, Package, Clock } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { Spinner } from '@/components/ui/Spinner'
import { ProgressBar } from '@/components/ui/ProgressBar'
interface DashboardStats {
  totalDownloads: number
  totalRequests: number
  pendingRequests: number
}
interface RecentDownload {
  slug: string
  name: string
  category: string
  downloadedAt: string
}
interface RecentRequest {
  id: string
  projectType: string
  status: string
  createdAt: string
}
interface MembershipSummary {
  tier: string
  status: string
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  startDate: string
  endDate: string
  renewalDate?: string | null
}
interface MeSummaryResponse {
  success: boolean
  data?: {
    user: {
      id: string
      name: string | null
      email: string
    }
    stats: {
      licensesCount: number
      requestsCount: number
      pendingRequestsCount: number
    }
    membership: MembershipSummary | null
    recentDownloads: RecentDownload[]
    recentRequests: RecentRequest[]
  }
}
export default function DashboardPage() {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalDownloads: 0,
    totalRequests: 0,
    pendingRequests: 0
  })
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([])
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [membership, setMembership] = useState<MembershipSummary | null>(null)
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/me/summary', {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('Failed to load dashboard summary')
      }
      const json = (await response.json()) as MeSummaryResponse
      if (!json.success || !json.data) {
        throw new Error('Failed to load dashboard summary')
      }
      setStats({
        totalDownloads: json.data.stats.licensesCount,
        totalRequests: json.data.stats.requestsCount,
        pendingRequests: json.data.stats.pendingRequestsCount,
      })
      setMembership(json.data.membership)
      setRecentDownloads(json.data.recentDownloads || [])
      setRecentRequests(json.data.recentRequests || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [showToast])
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning/20 text-warning'
      case 'IN_PROGRESS':
      case 'REVIEWING':
        return 'bg-info/20 text-info'
      case 'COMPLETED':
        return 'bg-success/20 text-success'
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-destructive/20 text-destructive'
      default:
        return 'bg-primary/20 text-primary'
    }
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }
  const formatResetsIn = (endDate?: string | null) => {
    if (!endDate) return 'Unknown'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    if (diffTime <= 0) return 'Now'
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return '1 day'
    if (diffDays < 30) return `${diffDays} days`
    const diffMonths = Math.round(diffDays / 30)
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account activity
        </p>
        {error && (
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        )}
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Download className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Downloads Owned</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalDownloads}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info/10 rounded-lg">
              <FileText className="text-info" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requests Submitted</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalRequests}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <Clock className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-3xl font-bold text-foreground">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Usage Limits */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-base-content">Usage Limits</h2>
            <p className="text-sm text-muted-foreground">
              Current period credit usage for your membership
            </p>
          </div>
          {membership && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Membership</p>
              <p className="font-medium text-base-content">
                {membership.tier} · {membership.status}
              </p>
            </div>
          )}
        </div>
        {membership ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Credits used this period</span>
              <span className="font-medium text-base-content">
                {membership.usedCredits} / {membership.totalCredits} (
                {membership.totalCredits > 0
                  ? Math.round(
                      (membership.usedCredits / membership.totalCredits) * 100
                    )
                  : 0}
                %)
              </span>
            </div>
            <ProgressBar
              label="Credits used"
              value={
                membership.totalCredits > 0
                  ? (membership.usedCredits / membership.totalCredits) * 100
                  : 0
              }
            />
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span>
                Credits remaining:{' '}
                <span className="font-medium text-base-content">
                  {membership.remainingCredits}
                </span>
              </span>
              <span>
                Resets in{' '}
                <span className="font-medium text-base-content">
                  {formatResetsIn(membership.endDate)}
                </span>
              </span>
              <span>
                Weekly limits:{' '}
                <span className="font-medium text-base-content">
                  Not enforced yet
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have an active membership yet. Credits and usage limits will appear here once a membership is assigned to your account.
            </p>
            <Link
              href="/memberships"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Browse Membership Plans
              <ArrowRight size={18} className="animate-arrow-bounce" />
            </Link>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/request"
          className="bg-card border-2 border-primary/20 rounded-2xl p-8 hover:border-primary/40 hover:shadow-lg transition-all group"
        >
          <FileText size={32} className="mb-4 text-primary" />
          <h3 className="text-xl font-bold text-foreground mb-2">Request a Service</h3>
          <p className="text-muted-foreground mb-4">
            Need help with a project? Submit a service request and I'll get back to you.
          </p>
          <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            Get Started <ArrowRight size={20} />
          </span>
        </Link>
        <Link
          href="/services"
          className="bg-card border-2 border-primary/20 rounded-2xl p-8 hover:border-primary/40 hover:shadow-lg transition-all group"
        >
          <Package size={32} className="mb-4 text-primary" />
          <h3 className="text-xl font-bold text-foreground mb-2">Browse Services</h3>
          <p className="text-muted-foreground mb-4">
            Explore the services I offer and find the right solution for your needs.
          </p>
          <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            View Services <ArrowRight size={20} />
          </span>
        </Link>
      </div>
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Downloads */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Downloads</h2>
            {recentDownloads.length > 0 && (
              <Link
                href="/dashboard/downloads"
                className="text-sm text-primary hover:underline font-medium"
              >
                View all
              </Link>
            )}
          </div>
          {recentDownloads.length === 0 ? (
            <div className="text-center py-12">
              <Download className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground mb-4">No downloads yet</p>
              <Link
                href="/services"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDownloads.map((download) => (
                <Link
                  key={download.slug}
                  href={`/dashboard/downloads/${download.slug}`}
                  className="block p-4 bg-muted rounded-lg hover:bg-muted/70 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{download.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {download.category.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(download.downloadedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Recent Requests */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Requests</h2>
            {recentRequests.length > 0 && (
              <Link
                href="/dashboard/requests"
                className="text-sm text-primary hover:underline font-medium"
              >
                View all
              </Link>
            )}
          </div>
          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground mb-4">No requests submitted yet</p>
              <Link
                href="/request"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Submit Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  href={`/dashboard/requests/${request.id}`}
                  className="block p-4 bg-muted rounded-lg hover:bg-muted/70 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{request.projectType}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(request.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
