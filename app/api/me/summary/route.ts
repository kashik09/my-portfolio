import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        membership: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const [licensesCount, requestsCount, pendingRequestsCount, recentDownloads, recentRequests] =
      await Promise.all([
        prisma.license.count({
          where: { userId },
        }),
        prisma.projectRequest.count({
          where: { userId },
        }),
        prisma.projectRequest.count({
          where: {
            userId,
            status: 'PENDING',
          },
        }),
        prisma.download.findMany({
          where: {
            userId,
            successful: true,
          },
          include: {
            product: true,
          },
          orderBy: {
            downloadedAt: 'desc',
          },
          take: 3,
        }),
        prisma.projectRequest.findMany({
          where: { userId },
          orderBy: {
            createdAt: 'desc',
          },
          take: 3,
        }),
      ])

    const membership = user.membership
      ? {
          tier: user.membership.tier,
          status: user.membership.status,
          totalCredits: user.membership.totalCredits,
          usedCredits: user.membership.usedCredits,
          remainingCredits: user.membership.remainingCredits,
          startDate: user.membership.startDate.toISOString(),
          endDate: user.membership.endDate.toISOString(),
          renewalDate: user.membership.renewalDate
            ? user.membership.renewalDate.toISOString()
            : null,
        }
      : null

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        stats: {
          licensesCount,
          requestsCount,
          pendingRequestsCount,
        },
        membership,
        recentDownloads: recentDownloads
          .filter(download => download.product)
          .map(download => ({
            slug: download.product.slug,
            name: download.product.name,
            category: download.product.category,
            downloadedAt: download.downloadedAt.toISOString(),
          })),
        recentRequests: recentRequests.map(request => ({
          id: request.id,
          projectType: request.projectType,
          status: request.status,
          createdAt: request.createdAt.toISOString(),
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching user summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load summary' },
      { status: 500 }
    )
  }
}

