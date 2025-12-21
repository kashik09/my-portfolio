import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { generateSmartFilename } from '@/lib/upload-utils'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'])

export async function POST(req: Request) {
  try {
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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    const url = `/uploads/projects/${filename}`
    return NextResponse.json({ url }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
