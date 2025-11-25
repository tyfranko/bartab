import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get venue menu
export async function GET(
  request: Request,
  { params }: { params: { venueId: string } }
) {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: params.venueId },
      include: {
        menuCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    return NextResponse.json({ venue })
  } catch (error) {
    console.error('Get menu error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

