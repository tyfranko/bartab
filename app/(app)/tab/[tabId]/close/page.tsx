import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatTime } from '@/lib/utils'

async function getTab(tabId: string, userId: string) {
  const tab = await prisma.tab.findFirst({
    where: {
      id: tabId,
      userId,
    },
    include: {
      venue: true,
      table: true,
      orders: {
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
        orderBy: {
          orderedAt: 'desc',
        },
      },
    },
  })

  return tab
}

export default async function CloseTabPage({ params }: { params: { tabId: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect('/signin')
  }

  const tab = await getTab(params.tabId, user.id)

  if (!tab) {
    notFound()
  }

  const allOrderItems = tab.orders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderedAt: order.orderedAt,
    }))
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Close Tab</h1>
        </div>

        {/* Venue Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{tab.venue.name}</h2>
            <p className="text-sm text-gray-600">
              Opened at {formatTime(tab.openedAt)}
            </p>
          </CardContent>
        </Card>

        {/* All Items Ordered */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Items Ordered</h2>
          {allOrderItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">
                No items ordered
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {allOrderItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.menuItem.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(item.orderedAt)}
                        </span>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bill Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tab</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(tab.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({(tab.venue.taxRate * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(tab.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Suggested Tip (18%)</span>
              <span>{formatCurrency(tab.subtotal * 0.18)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>{formatCurrency(tab.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pay Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md space-y-2">
          <Link href={`/tab/${tab.id}/payment`}>
            <Button className="w-full" size="lg">
              Pay Tab {formatCurrency(tab.total)}
            </Button>
          </Link>
          <p className="text-center text-xs text-gray-600">
            You can adjust tip on the next screen
          </p>
        </div>
      </div>
    </div>
  )
}

