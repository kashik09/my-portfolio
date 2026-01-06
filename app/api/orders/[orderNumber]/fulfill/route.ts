import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { fulfillOrder } from '@/lib/order-fulfillment'
import { sendLicenseIssuedEmail } from '@/lib/email/order-emails'
import { getIpHash, getUserAgent } from '@/lib/audit-logger'
import { requireAdminStepUp } from '@/lib/admin-stepup'

/**
 * POST /api/orders/[orderNumber]/fulfill
 * Fulfill order (issue licenses)
 * Requires admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const session = await requireAdmin()

    const stepUp = await requireAdminStepUp(request, session)
    if (stepUp) return stepUp

    const { orderNumber } = params

    // Get order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Fulfill order
    const result = await fulfillOrder(order.id, {
      actorId: session.user.id,
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Send license issued email
    await sendLicenseIssuedEmail(order.id)

    // Get updated order
    const fulfilledOrder = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
            license: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      order: fulfilledOrder,
      licenseIds: result.licenseIds,
      message: 'Order fulfilled successfully. Licenses have been issued.',
    })
  } catch (error: any) {
    console.error('Error fulfilling order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fulfill order' },
      { status: 500 }
    )
  }
}
