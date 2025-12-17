import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const consent = await prisma.userAdConsent.findUnique({
      where: { userId },
    })

    return NextResponse.json({
      success: true,
      data: {
        personalizedAds: consent?.personalizedAds ?? false,
        consentedAt: consent?.consentedAt
          ? consent.consentedAt.toISOString()
          : null,
      },
    })
  } catch (error) {
    console.error('Error fetching ad consent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load ad consent' },
      { status: 500 }
    )
  }
}

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
    const { personalizedAds } = body as {
      personalizedAds?: boolean
    }

    if (typeof personalizedAds !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'personalizedAds must be a boolean' },
        { status: 400 }
      )
    }

    const now = new Date()

    const consent = await prisma.userAdConsent.upsert({
      where: { userId },
      update: {
        personalizedAds,
        consentedAt: personalizedAds ? now : null,
      },
      create: {
        userId,
        personalizedAds,
        consentedAt: personalizedAds ? now : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        personalizedAds: consent.personalizedAds,
        consentedAt: consent.consentedAt
          ? consent.consentedAt.toISOString()
          : null,
      },
    })
  } catch (error) {
    console.error('Error updating ad consent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ad consent' },
      { status: 500 }
    )
  }
}

