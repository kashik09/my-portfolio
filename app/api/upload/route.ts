import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { generateSmartFilename, sanitizeFilename } from '@/lib/upload-utils'
import { getServerSession } from '@/lib/auth'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'])

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowedRoles = new Set(['ADMIN', 'OWNER', 'EDITOR'])
    if (!allowedRoles.has(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const form = await req.formData()
    const file = form.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extract context from formData
    const projectTitle = form.get('projectTitle')?.toString()
    const projectSlug = form.get('projectSlug')?.toString()
    const type = form.get('type')?.toString()

    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]
    const filename = generateSmartFilename({
      originalName: file.name,
      prefix: 'project',
      extension: ext,
      context: {
        projectTitle,
        projectSlug,
        type,
      },
    })

    const safeFilename = sanitizeFilename(filename)
    if (!safeFilename) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    await fs.mkdir(uploadDir, { recursive: true })

    const resolvedUploadDir = path.resolve(uploadDir)
    const filePath = path.resolve(uploadDir, safeFilename)
    if (!filePath.startsWith(`${resolvedUploadDir}${path.sep}`)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    await fs.writeFile(filePath, buffer)

    const url = `/uploads/projects/${safeFilename}`
    return NextResponse.json({ url }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
