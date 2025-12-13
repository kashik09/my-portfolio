import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONTENT_PATH = path.join(process.cwd(), 'public/content/about.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(CONTENT_PATH, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error reading about content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate that the data has the expected structure
    if (!body.hero || !body.story || !body.skills || !body.timeline) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content structure. Required fields: hero, story, skills, timeline'
        },
        { status: 400 }
      )
    }

    // Update metadata
    const updatedContent = {
      ...body,
      metadata: {
        ...body.metadata,
        lastUpdated: new Date().toISOString(),
        version: body.metadata?.version || '1.0'
      }
    }

    // Write to file with pretty formatting
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify(updatedContent, null, 2),
      'utf-8'
    )

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    })
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
