import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createRatingSchema = z.object({
  venueId: z.string(),
  tabId: z.string().optional(),
  overallRating: z.number().int().min(1).max(5),
  drinksRating: z.number().int().min(1).max(5).optional().nullable(),
  vibeRating: z.number().int().min(1).max(5).optional().nullable(),
  serviceSpeed: z.enum(['Fast', 'Moderate', 'Slow']).optional().nullable(),
  crowdLevel: z.enum(['Busy', 'Moderate', 'Empty']).optional().nullable(),
  serverName: z.string().optional().nullable(),
  review: z.string().optional().nullable(),
})

// Create rating
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = createRatingSchema.parse(body)

    const rating = await prisma.rating.create({
      data: {
        userId: user.id,
        venueId: data.venueId,
        tabId: data.tabId,
        overallRating: data.overallRating,
        drinksRating: data.drinksRating,
        vibeRating: data.vibeRating,
        serviceSpeed: data.serviceSpeed,
        crowdLevel: data.crowdLevel,
        serverName: data.serverName,
        review: data.review,
      },
      include: {
        venue: true,
      },
    })

    return NextResponse.json({ rating }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create rating error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get ratings for a venue
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')

    if (!venueId) {
      return NextResponse.json(
        { error: 'venueId is required' },
        { status: 400 }
      )
    }

    const ratings = await prisma.rating.findMany({
      where: { venueId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    // Calculate average ratings
    const avgOverall =
      ratings.reduce((sum, r) => sum + r.overallRating, 0) / ratings.length || 0
    const avgDrinks =
      ratings.filter((r) => r.drinksRating).reduce((sum, r) => sum + (r.drinksRating || 0), 0) /
        ratings.filter((r) => r.drinksRating).length || 0
    const avgVibe =
      ratings.filter((r) => r.vibeRating).reduce((sum, r) => sum + (r.vibeRating || 0), 0) /
        ratings.filter((r) => r.vibeRating).length || 0

    return NextResponse.json({
      ratings,
      averages: {
        overall: avgOverall,
        drinks: avgDrinks,
        vibe: avgVibe,
      },
      total: ratings.length,
    })
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

