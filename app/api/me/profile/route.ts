import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const image = body?.image

  if (!image || typeof image !== 'string') {
    return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { image },
    select: { id: true, name: true, email: true, image: true, role: true },
  })

  return NextResponse.json({ user: updated }, { status: 200 })
}
