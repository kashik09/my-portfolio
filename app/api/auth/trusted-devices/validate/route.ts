import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { ADMIN_DEVICE_ID_COOKIE, getRequestIp, hashValue } from '@/lib/admin-security'

const ADMIN_ROLES = new Set(['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'])

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id || !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const deviceId = request.cookies.get(ADMIN_DEVICE_ID_COOKIE)?.value
    if (!deviceId) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const device = await prisma.deviceSession.findUnique({
      where: {
        userId_deviceFingerprint: {
          userId: session.user.id,
          deviceFingerprint: deviceId,
        },
      },
      select: {
        blocked: true,
        trustedUntil: true,
        ipHash: true,
        userAgent: true,
      },
    })

    if (!device || device.blocked) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    if (!device.trustedUntil) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    if (device.trustedUntil.getTime() < Date.now()) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const ip = getRequestIp(request.headers)
    const ipHash = ip ? await hashValue(ip) : null
    await prisma.deviceSession.update({
      where: {
        userId_deviceFingerprint: {
          userId: session.user.id,
          deviceFingerprint: deviceId,
        },
      },
      data: {
        lastSeen: new Date(),
        ipHash: ipHash || device.ipHash,
        userAgent: request.headers.get('user-agent') || device.userAgent,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error validating trusted device:', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
