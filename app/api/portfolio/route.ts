import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectCategory, ProductCategory } from '@prisma/client'
import {
  projectToPortfolioItem,
  digitalProductToPortfolioItem,
  PortfolioItem,
} from '@/lib/portfolio/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDigitalProducts = searchParams.get('includeDigitalProducts') === 'true'
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const items: PortfolioItem[] = []

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(category && category !== 'ALL' ? { category: category as ProjectCategory } : {}),
      },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    })

    items.push(...projects.map(projectToPortfolioItem))

    // Fetch digital products if requested
    if (includeDigitalProducts) {
      const digitalProducts = await prisma.digitalProduct.findMany({
        where: {
          published: true,
          ...(category && category !== 'ALL' ? { category: category as ProductCategory } : {}),
        },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
        take: limit,
      })

      items.push(...digitalProducts.map(digitalProductToPortfolioItem))
    }

    // Sort combined items by featured and publishedAt
    items.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (!a.publishedAt || !b.publishedAt) return 0
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    // Apply limit after sorting if needed
    const finalItems = limit ? items.slice(0, limit) : items

    return NextResponse.json({
      success: true,
      data: finalItems,
    })
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch portfolio items',
      },
      { status: 500 }
    )
  }
}
