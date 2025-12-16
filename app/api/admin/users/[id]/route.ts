import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    const body = await request.json()
    const { name, role, accountStatus } = body

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
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
