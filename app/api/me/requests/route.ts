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
    const requests = await prisma.projectRequest.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        requests: requests.map(request => ({
          id: request.id,
          projectType: request.projectType,
          status: request.status,
          createdAt: request.createdAt.toISOString(),
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching user requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load requests' },
      { status: 500 }
    )
  }
}

