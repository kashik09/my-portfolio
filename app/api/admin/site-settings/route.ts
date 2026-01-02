export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

async function requireAdminOrOwner() {
  const session = await getServerSession()

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return null
  }

  return session
}

function isValidAvatarUrl(value: string) {
  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// GET /api/admin/site-settings - Fetch singleton site settings
export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminOrOwner()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site_settings_singleton' },
      update: {},
      create: {
        id: 'site_settings_singleton',
      },
    })

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/site-settings - Update singleton site settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdminOrOwner()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const data: any = {}

    if (typeof body.maintenanceMode === 'boolean') {
      data.maintenanceMode = body.maintenanceMode
    }

    if (typeof body.availableForBusiness === 'boolean') {
      data.availableForBusiness = body.availableForBusiness
    }

    if (typeof body.adsEnabled === 'boolean') {
      data.adsEnabled = body.adsEnabled
    }

    if (typeof body.adsProvider === 'string') {
      data.adsProvider = body.adsProvider
    }

    if (body.avatarUrl !== undefined) {
      const avatarUrl =
        typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() : body.avatarUrl

      if (avatarUrl === null || avatarUrl === '') {
        data.avatarUrl = null
      } else if (typeof avatarUrl === 'string') {
        if (!isValidAvatarUrl(avatarUrl)) {
          return NextResponse.json(
            { success: false, error: 'Invalid avatar URL' },
            { status: 400 }
          )
        }
        data.avatarUrl = avatarUrl
      }
    }

    if (body.adsClientId !== undefined) {
      data.adsClientId = body.adsClientId
    }

    if (body.adsPlacements !== undefined) {
      data.adsPlacements = body.adsPlacements
    }

    // Service availability settings
    if (typeof body.availabilityStatus === 'string') {
      data.availabilityStatus = body.availabilityStatus
    }

    if (body.availabilityMessage !== undefined) {
      data.availabilityMessage = body.availabilityMessage
    }

    if (body.leaveStart !== undefined) {
      data.leaveStart = body.leaveStart ? new Date(body.leaveStart) : null
    }

    if (body.leaveEnd !== undefined) {
      data.leaveEnd = body.leaveEnd ? new Date(body.leaveEnd) : null
    }

    if (typeof body.manualOverride === 'boolean') {
      data.manualOverride = body.manualOverride
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site_settings_singleton' },
      update: data,
      create: {
        id: 'site_settings_singleton',
        ...data,
      },
    })

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}
