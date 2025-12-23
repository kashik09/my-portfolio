'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Eye, MousePointer, Clock, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  avgTimeOnSite: number
  topPages: { page: string; views: number }[]
  devices: { type: string; count: number }[]
  popularProjects: { title: string; views: number }[]
  recentEvents: { action: string; timestamp: string; data: any }[]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/admin/analytics?range=${timeRange}`)

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }

        const json = await response.json()

        if (json.success && json.data) {
          setAnalytics(json.data)
        } else {
          throw new Error(json.error || 'Failed to load analytics')
        }
      } catch (err) {
        console.error('Analytics fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor size={20} />
      case 'mobile': return <Smartphone size={20} />
      case 'tablet': return <Tablet size={20} />
      default: return <Monitor size={20} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your portfolio performance</p>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Total Views</p>
            <Eye className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Unique Visitors</p>
            <Users className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.uniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Approximate (based on device/referrer)
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Avg. Time on Site</p>
            <Clock className="text-orange-600 dark:text-orange-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">{formatTime(analytics.avgTimeOnSite)}</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Total Events</p>
            <MousePointer className="text-green-600 dark:text-green-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.recentEvents.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Recent activity tracked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={24} />
            Top Pages
          </h2>
          <div className="space-y-4">
            {analytics.topPages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No page views yet</p>
            ) : (
              analytics.topPages.map((page, index) => {
              const maxViews = analytics.topPages[0].views
              const percentage = (page.views / maxViews) * 100

              return (
                <div key={page.page}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">{page.page}</span>
                    <span className="text-muted-foreground text-sm">{page.views} views</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Monitor size={24} />
            Device Breakdown
          </h2>
          <div className="space-y-4">
            {analytics.devices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No device data yet</p>
            ) : (
              analytics.devices.map((device) => {
              const total = analytics.devices.reduce((sum, d) => sum + d.count, 0)
              const percentage = ((device.count / total) * 100).toFixed(1)

              return (
                <div key={device.type}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-foreground font-medium capitalize">
                      {getDeviceIcon(device.type)}
                      {device.type}
                    </div>
                    <span className="text-muted-foreground text-sm">{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Projects */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            Popular Projects
          </h2>
          <div className="space-y-3">
            {analytics.popularProjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No project views yet</p>
            ) : (
              analytics.popularProjects.map((project, index) => (
              <div
                key={project.title}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                  <span className="text-foreground font-medium">{project.title}</span>
                </div>
                <span className="text-muted-foreground text-sm">{project.views} views</span>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock size={24} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {analytics.recentEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent events</p>
            ) : (
              analytics.recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground font-medium capitalize">
                    {event.action.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                  {event.data && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {JSON.stringify(event.data).slice(0, 50)}...
                    </p>
                  )}
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">📊 Analytics Overview</h3>
        <p className="text-foreground/80 text-sm">
          Analytics are tracked using a custom implementation with Postgres database storage. Data is collected
          client-side and stored securely. Unique visitor counts are approximated based on device and referrer
          combinations.
        </p>
      </div>
    </div>
  )
}
