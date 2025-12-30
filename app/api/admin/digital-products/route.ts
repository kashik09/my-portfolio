export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'

// GET /api/admin/digital-products - Fetch all digital products
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
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (published !== null && published !== undefined) {
      where.published = published === 'true'
    }

    // Fetch products
    const products = await prisma.digitalProduct.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        price: true,
        published: true,
        featured: true,
        downloadCount: true,
        purchaseCount: true,
        thumbnailUrl: true,
        personalLicense: true,
        commercialLicense: true,
        teamLicense: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      published: product.published,
      featured: product.featured,
      downloadCount: product.downloadCount,
      purchaseCount: product.purchaseCount,
      thumbnail: product.thumbnailUrl,
      licenseTypes: [
        product.personalLicense && 'PERSONAL',
        product.commercialLicense && 'COMMERCIAL',
        product.teamLicense && 'TEAM'
      ].filter(Boolean),
      createdAt: product.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      products: transformedProducts
    })
  } catch (error) {
    console.error('Error fetching digital products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/digital-products - Create new digital product
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
    const {
      name,
      slug,
      description,
      category,
      price,
      fileUrl,
      fileSize,
      fileType,
      thumbnailUrl,
      personalLicense,
      commercialLicense,
      teamLicense,
      published,
      featured
    } = body

    // Validate required fields
    if (!name || !slug || !description || !category || price === undefined || !fileUrl || !fileSize || !fileType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.digitalProduct.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.digitalProduct.create({
      data: {
        name,
        slug,
        description,
        category,
        price,
        fileUrl,
        fileSize,
        fileType,
        thumbnailUrl,
        personalLicense: personalLicense ?? true,
        commercialLicense: commercialLicense ?? true,
        teamLicense: teamLicense ?? false,
        published: published ?? false,
        featured: featured ?? false,
        publishedAt: published ? new Date() : null
      }
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.PROJECT_CREATED,
      resource: 'DigitalProduct',
      resourceId: product.id,
      details: {
        event: 'CONTENT_CREATED',
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
      data: product
    })
  } catch (error) {
    console.error('Error creating digital product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create digital product' },
      { status: 500 }
    )
  }
}
