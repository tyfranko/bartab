import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

async function getVenues() {
  return await prisma.venue.findMany({
    where: { isActive: true },
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function VenuesPage() {
  const venues = await getVenues()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Select Venue</h1>
        </div>

        <p className="mb-6 text-gray-600">Choose where you&apos;re dining to view the menu</p>

        {/* Venues List */}
        <div className="space-y-3">
          {venues.map((venue) => {
            const avgRating = venue.ratings.length > 0
              ? venue.ratings.reduce((sum, r) => sum + r.rating, 0) / venue.ratings.length
              : 0

            return (
              <Link key={venue.id} href={`/menu/${venue.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{venue.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span>{venue.city}, {venue.state}</span>
                        </div>
                        {venue.description && (
                          <p className="mt-2 text-sm text-gray-600">{venue.description}</p>
                        )}
                        {avgRating > 0 && (
                          <div className="mt-2 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{avgRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Button>Menu</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

