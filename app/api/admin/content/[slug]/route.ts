export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'

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

    const existingPage = await prisma.contentPage.findUnique({
      where: { slug: params.slug }
    })

    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Content page not found' },
        { status: 404 }
      )
    }

    const changes: Record<string, { before: any; after: any }> = {}

    if (title && title !== existingPage.title) {
      changes.title = { before: existingPage.title, after: title }
    }

    if (content) {
      const beforeLength = existingPage.content?.length || 0
      const afterLength = content?.length || 0
      if (beforeLength !== afterLength) {
        changes.contentLength = { before: beforeLength, after: afterLength }
      }
    }

    if (published !== undefined && published !== existingPage.published) {
      changes.published = { before: existingPage.published, after: published }
    }

    const page = await prisma.contentPage.update({
      where: { slug: params.slug },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published })
      }
    })

    if (Object.keys(changes).length > 0) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.SETTINGS_CHANGED,
        resource: 'ContentPage',
        resourceId: page.id,
        details: {
          event: 'CONTENT_UPDATED',
          slug: page.slug,
          type: page.type,
          changes,
        },
        ipHash: getIpHash(request),
        userAgent: getUserAgent(request),
      })
    }

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

    const page = await prisma.contentPage.findUnique({
      where: { slug: params.slug }
    })

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Content page not found' },
        { status: 404 }
      )
    }

    await prisma.contentPage.delete({
      where: { slug: params.slug }
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.ACCOUNT_LOCKED,
      resource: 'ContentPage',
      resourceId: page.id,
      details: {
        event: 'CONTENT_DELETED',
        slug: page.slug,
        title: page.title,
        type: page.type,
        published: page.published,
        contentLength: page.content?.length || 0,
      },
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
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
