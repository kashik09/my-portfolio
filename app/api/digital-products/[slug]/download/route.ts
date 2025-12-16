import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { AuditAction, LicenseStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import {
  DOWNLOAD_TOKEN_TTL_SECONDS,
  hashIp,
  logDownloadEvent,
  createDownloadToken,
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

  // @ts-expect-error - ip is not part of NextRequest typings but may exist
  if (req.ip) return req.ip as string

  return null
}

export async function POST(
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
  const ip = getClientIp(request)
  const ipHash = hashIp(ip)
  const userAgent = headers().get('user-agent')

  // Record attempted download early for security visibility
  await logDownloadEvent({
    userId,
    action: AuditAction.DOWNLOAD_ATTEMPTED,
    resourceId: params.slug,
    ipHash,
    userAgent,
  })

  try {
    const product = await prisma.digitalProduct.findUnique({
      where: { slug: params.slug },
    })

    if (!product || !product.published) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: params.slug,
        ipHash,
        userAgent,
        details: { reason: 'PRODUCT_NOT_FOUND_OR_UNPUBLISHED' },
      })

      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure user has an active license for this product
    const license = await prisma.license.findFirst({
      where: {
        userId,
        productId: product.id,
        status: LicenseStatus.ACTIVE,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    })

    if (!license) {
      await logDownloadEvent({
        userId,
        action: AuditAction.DOWNLOAD_FAILED,
        resourceId: product.id,
        ipHash,
        userAgent,
        details: { reason: 'NO_ACTIVE_LICENSE' },
      })

      return NextResponse.json(
        { success: false, error: 'No active license for this product' },
        { status: 403 }
      )
    }

    if (license.abuseDetected || license.status !== LicenseStatus.ACTIVE) {
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

    // Optional device fingerprint from client
    let deviceFingerprint: string | undefined
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        const body = await request.json()
        if (body && typeof body.deviceFingerprint === 'string') {
          deviceFingerprint = body.deviceFingerprint
        }
      } catch {
        // Ignore body parse errors - do not block download
      }
    }

    const download = await prisma.download.create({
      data: {
        userId,
        productId: product.id,
        licenseId: license.id,
        successful: false,
        ipHash,
        deviceFingerprint,
        userAgent: userAgent ?? undefined,
      },
    })

    const nowEpoch = Math.floor(Date.now() / 1000)
    const token = createDownloadToken({
      d: download.id,
      u: userId,
      p: product.id,
      l: license.id,
      exp: nowEpoch + DOWNLOAD_TOKEN_TTL_SECONDS,
    })

    return NextResponse.json({
      success: true,
      data: {
        downloadToken: token,
        expiresIn: DOWNLOAD_TOKEN_TTL_SECONDS,
      },
    })
  } catch (error) {
    console.error('Error handling digital product download:', error)

    await logDownloadEvent({
      userId,
      action: AuditAction.DOWNLOAD_FAILED,
      resourceId: params.slug,
      ipHash,
      userAgent,
      details: { reason: 'INTERNAL_ERROR' },
    })

    return NextResponse.json(
      { success: false, error: 'Failed to initiate download' },
      { status: 500 }
    )
  }
}
