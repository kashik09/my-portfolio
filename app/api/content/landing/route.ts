import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'public/content/landing.json')

const DEFAULT_CONTENT = {
  hero: {
    title: 'hey, i\'m',
    highlight: 'kashi',
    subtitle: 'i notice things that could work better, then i build them',
    primaryCtaLabel: 'see what i\'ve built',
    primaryCtaHref: '/projects',
    secondaryCtaLabel: 'get in touch',
    secondaryCtaHref: '/contact'
  },
  proofSnapshot: [
    { id: '1', text: 'this site is fully custom-built (no templates)' },
    { id: '2', text: 'theme palette system with 6 variants' },
    { id: '3', text: 'cms-driven content + full e-commerce' },
    { id: '4', text: 'designed + built end-to-end' }
  ],
  philosophy: [
    { id: '1', title: 'notice', description: 'i pay attention to friction. when something feels harder than it should, that\'s a signal.' },
    { id: '2', title: 'build', description: 'ideas don\'t count until they\'re real. i ship working code, not concepts.' },
    { id: '3', title: 'iterate', description: 'first version ships. then i learn what actually matters and improve it.' }
  ],
  cta: {
    text: 'view all projects',
    href: '/projects'
  }
}

// GET /api/content/landing - Fetch landing page content
export async function GET() {
  try {
    const fileContent = await fs.readFile(CONTENT_PATH, 'utf-8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    // If file doesn't exist, return default content
    console.error('Error reading landing content:', error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

// PUT /api/content/landing - Update landing page content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.hero || !body.proofSnapshot || !body.philosophy || !body.cta) {
      return NextResponse.json(
        { error: 'Invalid content structure. Required: hero, proofSnapshot, philosophy, cta' },
        { status: 400 }
      )
    }

    // Ensure content directory exists
    const contentDir = path.dirname(CONTENT_PATH)
    await fs.mkdir(contentDir, { recursive: true })

    // Write to file with pretty formatting
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify(body, null, 2),
      'utf-8'
    )

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: body
    })
  } catch (error) {
    console.error('Error updating landing content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
