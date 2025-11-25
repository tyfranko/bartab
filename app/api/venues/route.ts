import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateDistance } from '@/lib/utils'

// Get nearby venues
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '10') // miles

    // Get all active venues
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    })

    // Filter by distance if coordinates provided
    let filteredVenues = venues
    if (lat !== 0 && lng !== 0) {
      filteredVenues = venues.filter((venue) => {
        const distance = calculateDistance(lat, lng, venue.latitude, venue.longitude)
        return distance <= radius
      })
    }

    // Add computed fields
    const venuesWithMetadata = filteredVenues.map((venue) => {
      const avgRating =
        venue.ratings.length > 0
          ? venue.ratings.reduce((sum, r) => sum + r.rating, 0) / venue.ratings.length
          : 0

      const distance =
        lat !== 0 && lng !== 0
          ? calculateDistance(lat, lng, venue.latitude, venue.longitude)
          : null

      return {
        ...venue,
        avgRating: Math.round(avgRating * 10) / 10,
        distance: distance ? Math.round(distance * 10) / 10 : null,
      }
    })

    // Sort by distance if available
    if (lat !== 0 && lng !== 0) {
      venuesWithMetadata.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    return NextResponse.json({ venues: venuesWithMetadata })
  } catch (error) {
    console.error('Get venues error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

