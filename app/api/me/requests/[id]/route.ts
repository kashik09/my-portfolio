import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = session.user.id

  try {
    const projectRequest = await prisma.projectRequest.findFirst({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!projectRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      )
    }

    const serviceProject = await prisma.serviceProject.findFirst({
      where: {
        userId,
      },
      include: {
        phases: {
          orderBy: {
            startedAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        request: {
          id: projectRequest.id,
          projectType: projectRequest.projectType,
          status: projectRequest.status,
          budget: projectRequest.budget,
          timeline: projectRequest.timeline,
          description: projectRequest.description,
          requirements: projectRequest.requirements,
          createdAt: projectRequest.createdAt.toISOString(),
        },
        serviceProject: serviceProject
          ? {
              id: serviceProject.id,
              name: serviceProject.name,
              currentPhase: serviceProject.currentPhase,
              status: serviceProject.status,
              designRevisions: serviceProject.designRevisions,
              designRevisionsMax: serviceProject.designRevisionsMax,
              buildRevisions: serviceProject.buildRevisions,
              buildRevisionsMax: serviceProject.buildRevisionsMax,
              approvedFeatures: serviceProject.approvedFeatures,
              scope: serviceProject.scope,
              phases: serviceProject.phases.map(phase => ({
                id: phase.id,
                phase: phase.phase,
                startedAt: phase.startedAt.toISOString(),
                completedAt: phase.completedAt
                  ? phase.completedAt.toISOString()
                  : null,
              })),
            }
          : null,
      },
    })
  } catch (error) {
    console.error('Error fetching request details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load request details' },
      { status: 500 }
    )
  }
}

