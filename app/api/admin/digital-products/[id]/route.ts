export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'
import { requireAdminStepUp } from '@/lib/admin-stepup'

// GET /api/admin/digital-products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const product = await prisma.digitalProduct.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            purchases: true,
            licenses: true,
            downloads: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/digital-products/[id] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const existingProduct = await prisma.digitalProduct.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Handle all possible update fields
    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.price !== undefined) updateData.price = body.price
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl
    if (body.fileSize !== undefined) updateData.fileSize = body.fileSize
    if (body.fileType !== undefined) updateData.fileType = body.fileType
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl
    if (body.personalLicense !== undefined) updateData.personalLicense = body.personalLicense
    if (body.commercialLicense !== undefined) updateData.commercialLicense = body.commercialLicense
    if (body.teamLicense !== undefined) updateData.teamLicense = body.teamLicense
    if (body.version !== undefined) updateData.version = body.version
    if (body.changelog !== undefined) updateData.changelog = body.changelog
    if (body.documentation !== undefined) updateData.documentation = body.documentation
    if (body.featured !== undefined) updateData.featured = body.featured
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.previewImages !== undefined) updateData.previewImages = body.previewImages

    // Handle published status
    if (body.published !== undefined) {
      updateData.published = body.published
      // Set publishedAt timestamp when first published
      if (body.published) {
        if (!existingProduct.publishedAt) {
          updateData.publishedAt = new Date()
        }
      }
    }

    const product = await prisma.digitalProduct.update({
      where: { id: params.id },
      data: updateData
    })

    const summarizeValue = (value: any) => {
      if (value === null || value === undefined) return value
      if (Array.isArray(value)) return { count: value.length }
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'string') {
        if (value.length > 200) return { length: value.length }
        return value
      }
      if (typeof value === 'object') return { keys: Object.keys(value) }
      return value
    }

    const changes: Record<string, { before: any; after: any }> = {}
    const recordChange = (key: string, nextValue: any) => {
      if (nextValue === undefined) return
      const before = summarizeValue((existingProduct as any)[key])
      const after = summarizeValue(nextValue)
      if (JSON.stringify(before) === JSON.stringify(after)) return
      changes[key] = { before, after }
    }

    Object.keys(body || {}).forEach((key) => recordChange(key, body[key]))

    if (Object.keys(changes).length > 0) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.SETTINGS_CHANGED,
        resource: 'DigitalProduct',
        resourceId: product.id,
        details: {
          event: 'CONTENT_UPDATED',
          name: product.name,
          slug: product.slug,
          changes,
        },
        ipHash: getIpHash(request),
        userAgent: getUserAgent(request),
      })
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/digital-products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const stepUp = await requireAdminStepUp(request, session)
    if (stepUp) return stepUp

    // Check if product exists
    const product = await prisma.digitalProduct.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            purchases: true,
            licenses: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Warn if product has purchases or licenses
    if (product._count.purchases > 0 || product._count.licenses > 0) {
      // For safety, we might want to prevent deletion of products with purchases
      // But the schema should handle cascade deletion properly
      console.warn(`Deleting product ${product.id} with ${product._count.purchases} purchases and ${product._count.licenses} licenses`)
    }

    // Delete product (cascade will handle related records)
    await prisma.digitalProduct.delete({
      where: { id: params.id }
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.ACCOUNT_LOCKED,
      resource: 'DigitalProduct',
      resourceId: product.id,
      details: {
        event: 'CONTENT_DELETED',
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price?.toString?.() || product.price,
        published: product.published,
        featured: product.featured,
      },
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
