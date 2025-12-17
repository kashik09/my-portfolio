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

    if (body.adsClientId !== undefined) {
      data.adsClientId = body.adsClientId
    }

    if (body.adsPlacements !== undefined) {
      data.adsPlacements = body.adsPlacements
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

