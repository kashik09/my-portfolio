import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for project request
const projectRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, 'Project type is required'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
})

// GET /api/requests - Fetch all project requests (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const requests = await prisma.projectRequest.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        projectType: true,
        budget: true,
        timeline: true,
        description: true,
        status: true,
        priority: true,
        createdAt: true,
        respondedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch requests',
      },
      { status: 500 }
    )
  }
}

// POST /api/requests - Create a new project request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = projectRequestSchema.parse(body)

    // Get user ID from session if authenticated
    // const session = await getServerSession(authOptions)
    // const userId = session?.user?.id

    // Create project request
    const projectRequest = await prisma.projectRequest.create({
      data: {
        userId: null, // TODO: Add userId when auth is ready: userId || null
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        company: validatedData.company || '',
        projectType: validatedData.projectType,
        budget: validatedData.budget || '',
        timeline: validatedData.timeline || '',
        description: validatedData.description,
        requirements: validatedData.requirements || '',
        status: 'PENDING',
        priority: 'MEDIUM',
      },
    })

    // TODO: Send email notification

    return NextResponse.json(
      {
        success: true,
        message: 'Request submitted successfully! We will get back to you soon.',
        data: {
          id: projectRequest.id,
          createdAt: projectRequest.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    console.error('Error creating request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit request',
      },
      { status: 500 }
    )
  }
}
