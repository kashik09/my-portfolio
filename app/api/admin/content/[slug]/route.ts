import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

// GET /api/admin/content/[slug] - Get specific content page
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const page = await prisma.contentPage.findUnique({
      where: { slug: params.slug }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Content page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error fetching content page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content page' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/content/[slug] - Update content page
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, published } = body

    const page = await prisma.contentPage.update({
      where: { slug: params.slug },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published })
      }
    })

    return NextResponse.json({
      success: true,
      data: page
    })
  } catch (error) {
    console.error('Error updating content page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content page' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/content/[slug] - Delete content page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.contentPage.delete({
      where: { slug: params.slug }
    })

    return NextResponse.json({
      success: true,
      message: 'Content page deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting content page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete content page' },
      { status: 500 }
    )
  }
}
