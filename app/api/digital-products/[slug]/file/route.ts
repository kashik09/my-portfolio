import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { AuditAction, LicenseStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import {
  DOWNLOAD_LIMIT,
  DOWNLOAD_WINDOW_DAYS,
  getSafeProductFileUrl,
  verifyDownloadToken,
  hashIp,
  logDownloadEvent,
} from '@/lib/downloads'

function getClientIp(req: NextRequest): string | null {
  const headerList = headers()
  const forwardedFor = headerList.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    if (ips.length > 0 && ips[0]) {
      return ips[0]
    }
  }

  const realIp = headerList.get('x-real-ip')
  if (realIp) return realIp

  return null
}

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
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Missing download token' },
      { status: 400 }
    )
  }

  const ip = getClientIp(request)
  const ipHash = hashIp(ip)
  const userAgent = headers().get('user-agent')

  const payload = verifyDownloadToken(token)
  if (!payload) {
    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_FAILED,
      resourceId: params.slug,
      ipHash,
      userAgent,
      details: { reason: 'INVALID_OR_EXPIRED_TOKEN' },
    })

    return NextResponse.json(
      { success: false, error: 'Invalid or expired download token' },
      { status: 400 }
    )
  }

  if (payload.u !== userId) {
    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_FAILED,
      resourceId: params.slug,
      ipHash,
      userAgent,
      details: { reason: 'TOKEN_USER_MISMATCH' },
    })

    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    )
  }

  await logDownloadEvent({
    userId,
    action: AuditAction.DOWNLOAD_ATTEMPTED,
    resourceId: params.slug,
    ipHash,
    userAgent,
    details: { stage: 'FILE_REQUEST', downloadId: payload.d },
  })

  try {
    const download = await prisma.download.findUnique({
      where: { id: payload.d },
      include: {
        product: true,
        license: true,
      },
    })

    if (
      !download ||
      download.userId !== userId ||
      download.productId !== payload.p ||
      download.licenseId !== payload.l ||
      download.product.slug !== params.slug
    ) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: params.slug,
        ipHash,
        userAgent,
        details: { reason: 'DOWNLOAD_NOT_FOUND_OR_MISMATCH' },
      })

      return NextResponse.json(
        { success: false, error: 'Download not found' },
        { status: 404 }
      )
    }

    const { product, license } = download

    if (!product.published) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'PRODUCT_NOT_PUBLISHED' },
      })

      return NextResponse.json(
        { success: false, error: 'Product not available' },
        { status: 404 }
      )
    }

    if (
      license.status !== LicenseStatus.ACTIVE ||
      license.abuseDetected ||
      (license.expiresAt && license.expiresAt <= new Date())
    ) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'LICENSE_RESTRICTED', licenseStatus: license.status },
      })

      return NextResponse.json(
        { success: false, error: 'License is not in good standing' },
        { status: 403 }
      )
    }

    if (download.successful) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'TOKEN_ALREADY_USED', downloadId: download.id },
      })

      return NextResponse.json(
        { success: false, error: 'Download token already used' },
        { status: 410 }
      )
    }

    const now = new Date()
    const windowStart = new Date(
      now.getTime() - DOWNLOAD_WINDOW_DAYS * 24 * 60 * 60 * 1000
    )

    let fileResponse: Response
    try {
      const safeUrl = getSafeProductFileUrl(
        product.fileUrl,
        headers().get('host')
      )
      fileResponse = await fetch(safeUrl.toString())
    } catch (error) {
      console.error('Error fetching product file:', error)

      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'FILE_FETCH_ERROR' },
      })

      return NextResponse.json(
        { success: false, error: 'Failed to fetch file' },
        { status: 502 }
      )
    }

    if (!fileResponse.ok || !fileResponse.body) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: {
          reason: 'FILE_FETCH_FAILED',
          status: fileResponse.status,
        },
      })

      return NextResponse.json(
        { success: false, error: 'Failed to fetch file' },
        { status: 502 }
      )
    }

    const txResult = await prisma.$transaction(async tx => {
      const successfulDownloadsCount = await tx.download.count({
        where: {
          userId,
          productId: product.id,
          licenseId: license.id,
          successful: true,
          downloadedAt: {
            gte: windowStart,
          },
        },
      })

      if (successfulDownloadsCount >= DOWNLOAD_LIMIT) {
        return {
          allowed: false as const,
          reason: 'DOWNLOAD_LIMIT_REACHED' as const,
          successfulDownloadsCount,
        }
      }

      const updateResult = await tx.download.updateMany({
        where: {
          id: download.id,
          successful: false,
        },
        data: {
          successful: true,
          downloadedAt: now,
        },
      })

      if (updateResult.count === 0) {
        return {
          allowed: false as const,
          reason: 'TOKEN_ALREADY_USED' as const,
          successfulDownloadsCount,
        }
      }

      await tx.digitalProduct.update({
        where: { id: product.id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      })

      return {
        allowed: true as const,
        reason: null,
        successfulDownloadsCount,
      }
    })

    if (!txResult.allowed) {
      if (txResult.reason === 'DOWNLOAD_LIMIT_REACHED') {
        await logDownloadEvent({
          userId,
          action: AuditAction.DOWNLOAD_FAILED,
          resourceId: product.id,
          ipHash,
          userAgent,
          details: {
            reason: 'DOWNLOAD_LIMIT_REACHED',
            limit: DOWNLOAD_LIMIT,
            windowDays: DOWNLOAD_WINDOW_DAYS,
          },
        })

        return NextResponse.json(
          {
            success: false,
            error: 'Download limit reached for this period',
            code: 'DOWNLOAD_LIMIT_REACHED',
          },
          { status: 429 }
        )
      }

      if (txResult.reason === 'TOKEN_ALREADY_USED') {
        await logDownloadEvent({
          userId,
          action: AuditAction.DOWNLOAD_FAILED,
          resourceId: product.id,
          ipHash,
          userAgent,
          details: { reason: 'TOKEN_ALREADY_USED', downloadId: download.id },
        })

        return NextResponse.json(
          { success: false, error: 'Download token already used' },
          { status: 410 }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Failed to record download' },
        { status: 500 }
      )
    }

    const remainingDownloads =
      DOWNLOAD_LIMIT - (txResult.successfulDownloadsCount + 1)

    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_SUCCEEDED,
      resourceId: product.id,
      ipHash,
      userAgent,
      details: {
        downloadId: download.id,
        remainingDownloads,
        windowDays: DOWNLOAD_WINDOW_DAYS,
      },
    })

    const responseHeaders = new Headers(fileResponse.headers)
    responseHeaders.delete('set-cookie')
    responseHeaders.set(
      'x-download-remaining',
      remainingDownloads.toString()
    )
    responseHeaders.set(
      'x-download-window-days',
      DOWNLOAD_WINDOW_DAYS.toString()
    )
    responseHeaders.set('cache-control', 'no-store')

    // Suggest a safe filename for the attachment
    const extension =
      (product.fileType || '').toLowerCase().replace(/[^a-z0-9]/g, '') ||
      'bin'
    const slugOrId = product.slug || product.id
    const filename = `${slugOrId}.${extension}`
    responseHeaders.set(
      'content-disposition',
      `attachment; filename="${filename}"`
    )

    return new NextResponse(fileResponse.body, {
      status: fileResponse.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Error handling digital product file download:', error)

    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_FAILED,
      resourceId: params.slug,
      ipHash,
      userAgent,
      details: { reason: 'INTERNAL_ERROR' },
    })

    return NextResponse.json(
      { success: false, error: 'Failed to download file' },
      { status: 500 }
    )
  }
}
