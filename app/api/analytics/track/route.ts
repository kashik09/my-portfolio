import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allow anonymous access - no authentication required
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Minimal validation - only action is required
    const { action, page, category, label, value, device, referrer, data } = body

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Action is required and must be a string' },
        { status: 400 }
      )
    }

    // Insert analytics event into database
    await prisma.analyticsEvent.create({
      data: {
        action,
        page: page || null,
        category: category || null,
        label: label || null,
        value: value ? parseInt(value) : null,
        device: device || null,
        referrer: referrer || null,
        data: data || null,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    // Fail gracefully - never throw uncaught errors
    console.error('Analytics tracking error:', error)

    // Return success even on error to avoid blocking client UI
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 200 }
    )
  }
}
