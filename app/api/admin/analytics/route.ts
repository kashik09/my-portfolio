import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get time range from query params (default to 7 days)
    const { searchParams } = new URL(req.url)
    const rangeParam = searchParams.get('range') || '7d'

    let startDate: Date
    const now = new Date()

    switch (rangeParam) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Query analytics events
    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate total page views
    const totalViews = events.filter((e) => e.action === 'page_view').length

    // Approximate unique visitors
    // Assumption: We use device + referrer combination as a proxy for unique visitors
    // This is not perfect but works without user tracking
    const uniqueDevices = new Set(
      events
        .filter((e) => e.action === 'page_view')
        .map((e) => `${e.device || 'unknown'}-${e.referrer || 'direct'}`)
    )
    const uniqueVisitors = uniqueDevices.size

    // Calculate average time on site (from time_on_page events)
    const timeOnPageEvents = events.filter((e) => e.action === 'time_on_page')
    const totalTimeSpent = timeOnPageEvents.reduce((sum, e) => sum + (e.value || 0), 0)
    const avgTimeOnSite = timeOnPageEvents.length > 0
      ? Math.round(totalTimeSpent / timeOnPageEvents.length)
      : 0

    // Get top pages
    const pageViews = events.filter((e) => e.action === 'page_view' && e.page)
    const pageViewCounts = pageViews.reduce((acc, e) => {
      const page = e.page!
      acc[page] = (acc[page] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageViewCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Get device breakdown
    const deviceCounts = events
      .filter((e) => e.device)
      .reduce((acc, e) => {
        const device = e.device!
        acc[device] = (acc[device] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    const devices = Object.entries(deviceCounts).map(([type, count]) => ({
      type,
      count,
    }))

    // Get popular projects (from project_view events)
    const projectViews = events.filter((e) => e.action === 'project_view')
    const projectViewCounts = projectViews.reduce((acc, e) => {
      const title = (e.data as any)?.projectTitle || 'Unknown'
      acc[title] = (acc[title] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const popularProjects = Object.entries(projectViewCounts)
      .map(([title, views]) => ({ title, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Get recent events (last 20)
    const recentEvents = events.slice(0, 20).map((e) => ({
      action: e.action,
      timestamp: e.createdAt.toISOString(),
      data: e.data,
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors,
        avgTimeOnSite,
        topPages,
        devices,
        popularProjects,
        recentEvents,
      },
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
