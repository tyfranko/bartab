import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Settings, QrCode, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getUserData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      tabs: {
        where: {
          status: 'CLOSED',
        },
        orderBy: {
          closedAt: 'desc',
        },
        take: 5,
        include: {
          venue: true,
        },
      },
    },
  })

  return user
}

async function getNearbyVenues() {
  // In a real app, this would use the user's location
  // For now, return all active venues
  return await prisma.venue.findMany({
    where: { isActive: true },
    take: 5,
    include: {
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  })
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email ? await getUserData(session.user.email) : null
  const venues = await getNearbyVenues()

  return (
    <div className="container mx-auto max-w-md px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
          <p className="text-sm text-gray-600">Ready to order?</p>
        </div>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Quick Action - Scan QR Code */}
      <Card className="mb-6 bg-black text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-lg font-semibold">Scan QR Code</h2>
            <p className="text-sm text-gray-300">Start your tab at a table</p>
          </div>
          <Link href="/scan">
            <Button size="lg" variant="secondary">
              <QrCode className="mr-2 h-5 w-5" />
              Scan
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Nearby Venues */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Nearby Venues</h2>
        <div className="space-y-3">
          {venues.map((venue) => {
            const avgRating = venue.ratings.length > 0
              ? venue.ratings.reduce((sum, r) => sum + r.rating, 0) / venue.ratings.length
              : 0

            return (
              <Card key={venue.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{venue.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span>{venue.city}, {venue.state}</span>
                      </div>
                      {avgRating > 0 && (
                        <div className="mt-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/menu/${venue.id}`}>
                      <Button size="sm">View Menu</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {user?.tabs && user.tabs.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            {user.tabs.map((tab) => (
              <Card key={tab.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{tab.venue.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{formatDate(tab.closedAt!)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(tab.total)}</div>
                      <Link href={`/history`}>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          View Receipt
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

