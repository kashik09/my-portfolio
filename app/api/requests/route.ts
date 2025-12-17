import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type IncomingBody = {
  name?: string
  email?: string
  serviceType?: string
  budget?: string
  timeline?: string
  description?: string
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = (await req.json()) as IncomingBody

    const name = session?.user?.name ?? body.name ?? ''
    const email = session?.user?.email ?? body.email ?? ''

    const serviceType = body.serviceType ?? ''
    const budget = body.budget ?? ''
    const timeline = body.timeline ?? ''
    const description = body.description ?? ''

    // Hard validation (keep it strict)
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }
    if (!serviceType || !budget || !timeline || !description) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    // Create request
    // NOTE: This assumes your Prisma model has these fields:
    // name, email, serviceType, budget, timeline, description
    const created = await prisma.request.create({
      data: {
        name,
        email,
        serviceType,
        budget,
        timeline,
        description
      }
    })

    return NextResponse.json({ ok: true, request: created }, { status: 201 })
  } catch (err) {
    console.error('POST /api/requests error:', err)
    return NextResponse.json(
      { error: 'Failed to submit request.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed.' },
    { status: 405 }
  )
}
