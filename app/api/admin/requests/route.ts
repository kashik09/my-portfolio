import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

// GET /api/admin/requests - Fetch all requests for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const userId = searchParams.get('user')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { projectType: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (userId) {
      where.userId = userId
    }

    // Fetch requests
    const requests = await prisma.projectRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate stats
    const stats = {
      total: await prisma.projectRequest.count(),
      pending: await prisma.projectRequest.count({ where: { status: 'PENDING' } }),
      contacted: await prisma.projectRequest.count({ where: { status: 'REVIEWING' } }),
      completed: await prisma.projectRequest.count({ where: { status: 'COMPLETED' } }),
      rejected: await prisma.projectRequest.count({ where: { status: 'REJECTED' } })
    }

    return NextResponse.json({
      success: true,
      data: requests,
      stats
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
