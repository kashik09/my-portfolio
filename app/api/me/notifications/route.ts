import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const body = await request.json()
    const { emailNotifications } = body as {
      emailNotifications?: boolean
    }

    // For now we only log this preference change without a dedicated storage field,
    // to avoid additional schema changes beyond the requested models.
    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.SETTINGS_CHANGED,
        resource: 'User',
        resourceId: userId,
        details: {
          type: 'notifications',
          emailNotifications: !!emailNotifications,
        } as any,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        emailNotifications: !!emailNotifications,
      },
    })
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}

