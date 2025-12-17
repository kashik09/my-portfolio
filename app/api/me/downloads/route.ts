import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { DOWNLOAD_LIMIT, DOWNLOAD_WINDOW_DAYS } from '@/lib/downloads'

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
    const now = new Date()
    const windowStart = new Date(
      now.getTime() - DOWNLOAD_WINDOW_DAYS * 24 * 60 * 60 * 1000
    )

    const licenses = await prisma.license.findMany({
      where: { userId },
      include: {
        product: true,
        downloads: {
          where: {
            successful: true,
          },
          orderBy: {
            downloadedAt: 'desc',
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    })

    const downloads = licenses
      .filter(license => license.product)
      .map(license => {
        const successfulDownloads = license.downloads
        const windowDownloads = successfulDownloads.filter(download => {
          return download.downloadedAt >= windowStart
        }).length

        let licenseStatus: 'ACTIVE' | 'EXPIRED' | 'RESTRICTED'
        if (
          license.status !== 'ACTIVE' ||
          license.abuseDetected ||
          (license.expiresAt && license.expiresAt <= now)
        ) {
          licenseStatus =
            license.status === 'EXPIRED' || (license.expiresAt && license.expiresAt <= now)
              ? 'EXPIRED'
              : 'RESTRICTED'
        } else {
          licenseStatus = 'ACTIVE'
        }

        return {
          slug: license.product.slug,
          name: license.product.name,
          description: license.product.description,
          category: license.product.category,
          thumbnailUrl: license.product.thumbnailUrl,
          downloadLimit: DOWNLOAD_LIMIT,
          downloadsUsed: windowDownloads,
          purchasedAt: license.issuedAt.toISOString(),
          expiresAt: license.expiresAt ? license.expiresAt.toISOString() : undefined,
          fileSize: license.product.fileSize,
          licenseStatus,
        }
      })

    return NextResponse.json({
      success: true,
      data: {
        downloads,
        windowDays: DOWNLOAD_WINDOW_DAYS,
        windowLimit: DOWNLOAD_LIMIT,
      },
    })
  } catch (error) {
    console.error('Error fetching user downloads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load downloads' },
      { status: 500 }
    )
  }
}

