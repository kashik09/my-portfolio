export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'
import { requireAdminStepUp } from '@/lib/admin-stepup'

// PATCH /api/admin/requests/[id] - Update request status (accept/reject)
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

    const body = await request.json()
    const { status, adminNotes } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    // Update the request
    const updatedRequest = await prisma.projectRequest.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes,
        respondedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: Send email notification to the requester
    // If accepted, send acceptance email
    // If rejected, send rejection email with reason

    return NextResponse.json({
      success: true,
      data: updatedRequest
    })
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/requests/[id] - Delete request
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

    const requestRecord = await prisma.projectRequest.findUnique({
      where: { id: params.id }
    })

    if (!requestRecord) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      )
    }

    await prisma.projectRequest.delete({
      where: { id: params.id }
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.ACCOUNT_LOCKED,
      resource: 'ProjectRequest',
      resourceId: requestRecord.id,
      details: {
        event: 'REQUEST_DELETED',
        projectType: requestRecord.projectType,
        status: requestRecord.status,
        userId: requestRecord.userId,
      },
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete request' },
      { status: 500 }
    )
  }
}
