import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

// GET /api/admin/content - List all content pages
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
    const type = searchParams.get('type')

    const where: any = {}
    if (type) {
      where.type = type
    }

    const pages = await prisma.contentPage.findMany({
      where,
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: pages
    })
  } catch (error) {
    console.error('Error fetching content pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content pages' },
      { status: 500 }
    )
  }
}

// POST /api/admin/content - Create new content page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { slug, title, type, content, published } = body

    if (!slug || !title || !type || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.contentPage.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const page = await prisma.contentPage.create({
      data: {
        slug,
        title,
        type,
        content,
        published: published ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error creating content page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create content page' },
      { status: 500 }
    )
  }
}
