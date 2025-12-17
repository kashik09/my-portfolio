import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { DOWNLOAD_LIMIT, DOWNLOAD_WINDOW_DAYS } from '@/lib/downloads'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: { slug: params.slug },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const license = await prisma.license.findFirst({
      where: {
        userId,
        productId: product.id,
      },
      include: {
        downloads: {
          orderBy: {
            downloadedAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!license) {
      return NextResponse.json(
        { success: false, error: 'No license for this product' },
        { status: 404 }
      )
    }

    const now = new Date()
    const windowStart = new Date(
      now.getTime() - DOWNLOAD_WINDOW_DAYS * 24 * 60 * 60 * 1000
    )

    const successfulDownloads = license.downloads.filter(d => d.successful)
    const windowDownloads = successfulDownloads.filter(download => {
      return download.downloadedAt >= windowStart
    }).length

    let licenseStatus: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED' | 'RESTRICTED'
    if (
      license.status !== 'ACTIVE' ||
      license.abuseDetected ||
      (license.expiresAt && license.expiresAt <= now)
    ) {
      if (license.status === 'EXPIRED' || (license.expiresAt && license.expiresAt <= now)) {
        licenseStatus = 'EXPIRED'
      } else if (license.status === 'REVOKED') {
        licenseStatus = 'REVOKED'
      } else if (license.status === 'SUSPENDED') {
        licenseStatus = 'SUSPENDED'
      } else {
        licenseStatus = 'RESTRICTED'
      }
    } else {
      licenseStatus = 'ACTIVE'
    }

    const data = {
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
      thumbnailUrl: product.thumbnailUrl,
      downloadLimit: DOWNLOAD_LIMIT,
      downloadsUsed: windowDownloads,
      purchasedAt: license.issuedAt.toISOString(),
      expiresAt: license.expiresAt ? license.expiresAt.toISOString() : undefined,
      fileSize: product.fileSize,
      fileType: product.fileType,
      version: product.version,
      licenseType: license.licenseType,
      licenseKey: license.licenseKey,
      licenseStatus,
      downloadWindowDays: DOWNLOAD_WINDOW_DAYS,
      downloadHistory: successfulDownloads.map(download => ({
        id: download.id,
        downloadedAt: download.downloadedAt.toISOString(),
        successful: download.successful,
      })),
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching download details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load download details' },
      { status: 500 }
    )
  }
}

