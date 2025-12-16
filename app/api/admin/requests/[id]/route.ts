import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/requests/[id] - Update request status (accept/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    await prisma.projectRequest.delete({
      where: { id: params.id }
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
