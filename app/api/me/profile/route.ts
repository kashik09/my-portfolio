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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
        theme: user.theme,
        emailNotifications: true,
        hasPassword: !!user.password,
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load profile' },
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
    const { name, image, theme } = body as {
      name?: string
      image?: string | null
      theme?: string
    }

    const data: any = {}

    if (typeof name === 'string') {
      data.name = name.trim() || null
    }

    if (image !== undefined) {
      data.image = image || null
    }

    if (theme && ['LIGHT', 'DARK', 'SYSTEM'].includes(theme)) {
      data.theme = theme
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    })

    return NextResponse.json({
      success: true,
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        theme: updatedUser.theme,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({
      success: true,
      message: 'Account deleted',
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

