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
          OR: [
            { status: 'OPEN' },
            { status: 'CLOSED' },
          ],
        },
        orderBy: {
          openedAt: 'desc',
        },
        take: 10,
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
          overallRating: true,
        },
      },
    },
  })
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email ? await getUserData(session.user.email) : null
  const venues = await getNearbyVenues()

  // Get active (open) tabs
  const activeTabs = user?.tabs.filter(tab => tab.status === 'OPEN') || []
  const recentTabs = user?.tabs.filter(tab => tab.status === 'CLOSED').slice(0, 5) || []

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

      {/* Active Tab Alert */}
      {activeTabs.length > 0 && (
        <Card className="mb-6 border-2 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div>
              <h2 className="font-semibold text-green-900">Active Tab Open</h2>
              <p className="text-sm text-green-700">{activeTabs[0].venue.name}</p>
              <p className="text-xs text-green-600 mb-3">Running Total: {formatCurrency(activeTabs[0].total)}</p>
              <div className="flex gap-2">
                <Link href="/tab/active" className="flex-1">
                  <Button variant="outline" className="w-full bg-white border-green-600 text-green-700 hover:bg-green-50">
                    View Tab
                  </Button>
                </Link>
                <Link href={`/tab/${activeTabs[0].id}/close`} className="flex-1">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    CLOSE TAB
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Bar or Table */}
      {activeTabs.length === 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="mb-3 text-center text-sm font-semibold text-gray-600">Where are you?</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/bar-qr">
                <Button size="lg" className="h-24 w-full flex-col gap-2 bg-black hover:bg-gray-800">
                  <QrCode className="h-8 w-8" />
                  <span>I&apos;m at The Bar</span>
                </Button>
              </Link>
              <Link href="/venues">
                <Button size="lg" className="h-24 w-full flex-col gap-2 bg-black hover:bg-gray-800">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>I&apos;m at a Table</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Venues */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Nearby Venues</h2>
        <div className="space-y-3">
          {venues.map((venue) => {
            const avgRating = venue.ratings.length > 0
              ? venue.ratings.reduce((sum, r) => sum + r.overallRating, 0) / venue.ratings.length
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
      {recentTabs.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            {recentTabs.map((tab) => (
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

