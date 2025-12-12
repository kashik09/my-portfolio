import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ProjectCategory } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/projects - Fetch all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as ProjectCategory | null
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    // Build where clause
    const where: any = {}

    // Filter by category
    if (category && (category === 'PERSONAL' || category === 'CLASS')) {
      where.category = category
    }

    // Filter by search query (search in title and description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filter by published status (default to true)
    if (published !== 'false') {
      where.published = true
    }

    // Fetch projects from database
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' }, // Featured projects first
        { publishedAt: 'desc' }, // Then by publish date
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        tags: true,
        techStack: true,
        thumbnail: true,
        githubUrl: true,
        liveUrl: true,
        featured: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Add authentication check here
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        category: body.category,
        tags: body.tags || [],
        techStack: body.techStack || [],
        features: body.features || [],
        thumbnail: body.thumbnail || '',
        images: body.images || [],
        githubUrl: body.githubUrl || '',
        liveUrl: body.liveUrl || '',
        featured: body.featured || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
      },
      { status: 500 }
    )
  }
}
