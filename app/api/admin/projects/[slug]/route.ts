export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()
    if (!session || !['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const project = await prisma.project.findUnique({
      where: { slug: params.slug }
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()
    if (!session || !['ADMIN', 'OWNER'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const existingProject = await prisma.project.findUnique({
      where: { slug: params.slug }
    })

    if (!existingProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const summarizeValue = (value: any) => {
      if (value === null || value === undefined) return value
      if (Array.isArray(value)) return { count: value.length }
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'string') {
        if (value.length > 200) return { length: value.length }
        return value
      }
      if (typeof value === 'object') return { keys: Object.keys(value) }
      return value
    }

    const changes: Record<string, { before: any; after: any }> = {}
    const recordChange = (key: string, nextValue: any) => {
      if (nextValue === undefined) return
      const before = summarizeValue((existingProject as any)[key])
      const after = summarizeValue(nextValue)
      if (JSON.stringify(before) === JSON.stringify(after)) return
      changes[key] = { before, after }
    }

    Object.keys(body || {}).forEach((key) => recordChange(key, body[key]))
    const project = await prisma.project.update({
      where: { slug: params.slug },
      data: body
    })

    if (Object.keys(changes).length > 0) {
      await createAuditLog({
        userId: session.user.id,
        action: AuditAction.SETTINGS_CHANGED,
        resource: 'Project',
        resourceId: project.id,
        details: {
          event: 'CONTENT_UPDATED',
          slug: project.slug,
          changes,
        },
        ipHash: getIpHash(request),
        userAgent: getUserAgent(request),
      })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 })
  }
}
