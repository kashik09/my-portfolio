export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'
import { requireAdminStepUp } from '@/lib/admin-stepup'

// GET /api/admin/users/[id] - Get single user
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

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        projectRequests: {
          select: {
            id: true,
            projectType: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        serviceProjects: {
          select: {
            id: true,
            name: true,
            status: true,
            currentPhase: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        membership: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user
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

    const stepUp = await requireAdminStepUp(request, session)
    if (stepUp) return stepUp

    const body = await request.json()
    const { name, email, role, accountStatus } = body

    const existingUser = role !== undefined
      ? await prisma.user.findUnique({
          where: { id: params.id },
          select: { id: true, role: true, email: true, name: true },
        })
      : null

    if (role !== undefined && !existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (accountStatus !== undefined) {
      updateData.accountStatus = accountStatus
      if (accountStatus === 'LOCKED') {
        updateData.accountLockedAt = new Date()
        updateData.accountLockedReason = body.lockReason || 'Locked by admin'
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        createdAt: true
      }
    })

    if (role !== undefined && existingUser && existingUser.role !== user.role) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.SETTINGS_CHANGED,
        resource: 'User',
        resourceId: user.id,
        details: {
          event: 'USER_ROLE_CHANGED',
          changes: {
            role: { before: existingUser.role, after: user.role },
          },
          target: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        ipHash: getIpHash(request),
        userAgent: getUserAgent(request),
      })
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting owner accounts
    if (user.role === 'OWNER') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete owner account' },
        { status: 403 }
      )
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: params.id }
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.ACCOUNT_LOCKED,
      resource: 'User',
      resourceId: user.id,
      details: {
        event: 'USER_DELETED',
        target: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
