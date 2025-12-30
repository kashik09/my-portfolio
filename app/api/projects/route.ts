import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { normalizePublicPath } from '@/lib/utils'
import { AuditAction } from '@prisma/client'
import { createAuditLog, getIpHash, getUserAgent } from '@/lib/audit-logger'

// GET /api/projects - Fetch all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // 'published', 'draft', 'all'
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Build where clause
    const where: any = {}

    // Public users only see published projects
    // Admin users can see all based on status param
    const isAdmin = session?.user?.role && ['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'].includes(session.user.role)

    if (!isAdmin) {
      where.published = true
    } else if (status === 'published') {
      where.published = true
    } else if (status === 'draft') {
      where.published = false
    }
    // 'all' or no status means no filter for admin

    // Filter by category
    if (category) {
      where.category = category
    }

    // Filter by search query
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Featured filter
    if (featured) {
      where.featured = true
    }

    // Fetch projects from database
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
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
        demoUrl: true,
        featured: true,
        published: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Transform for consistent card format
    const transformedProjects = projects.map(project => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      image: normalizePublicPath(project.thumbnail),
      technologies: project.techStack,
      category: project.category,
      tags: project.tags,
      featured: project.featured,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      demoUrl: project.demoUrl,
      status: project.published ? 'PUBLISHED' : 'DRAFT',
      publishedAt: project.publishedAt,
      viewCount: project.viewCount,
      likeCount: project.likeCount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length,
    })
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session?.user?.role || !['ADMIN', 'OWNER', 'MODERATOR', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        category: body.category,
        tags: body.tags || [],
        techStack: body.techStack || [],
        features: body.features || [],
        thumbnail: body.thumbnail || null,
        images: body.images || [],
        githubUrl: body.githubUrl || null,
        liveUrl: body.liveUrl || null,
        demoUrl: body.demoUrl || null,
        caseStudyUrl: body.caseStudyUrl || null,
        content: body.content || null,
        featured: body.featured || false,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: AuditAction.PROJECT_CREATED,
      resource: 'Project',
      resourceId: project.id,
      details: {
        event: 'CONTENT_CREATED',
        slug: project.slug,
        title: project.title,
        category: project.category,
        featured: project.featured,
        published: project.published,
      },
      ipHash: getIpHash(request),
      userAgent: getUserAgent(request),
    })

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create project',
      },
      { status: 500 }
    )
  }
}
