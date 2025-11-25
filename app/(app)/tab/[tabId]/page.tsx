import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
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

export default async function TabPage({ params }: { params: { tabId: string } }) {
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
      status: order.status,
    }))
  )

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="ml-4 flex-1">
            <h1 className="text-2xl font-bold">Active Tab</h1>
            <p className="text-sm text-gray-600">
              {tab.venue.name}{tab.table ? ` - Table ${tab.table.tableNumber}` : ''}
            </p>
          </div>
        </div>

        {/* Tab Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Opened at</span>
              <span className="font-medium">{formatTime(tab.openedAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Orders</h2>
            <Link href={`/menu/${tab.venueId}`}>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Items
              </Button>
            </Link>
          </div>

          {allOrderItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No items ordered yet</p>
                <Link href={`/menu/${tab.venueId}`}>
                  <Button className="mt-4">Browse Menu</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {allOrderItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.menuItem.name}</span>
                        </div>
                        {item.notes && (
                          <p className="mt-1 text-sm text-gray-600">Note: {item.notes}</p>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(item.orderedAt)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            item.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status.toLowerCase()}
                          </span>
                        </div>
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
            <CardTitle>Bill Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(tab.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({(tab.venue.taxRate * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(tab.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tip</span>
              <span>{formatCurrency(tab.tip)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(tab.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md space-y-2">
          <Link href={`/tab/${tab.id}/split`}>
            <Button variant="outline" className="w-full" size="lg">
              Split Bill
            </Button>
          </Link>
          <Link href={`/tab/${tab.id}/payment`}>
            <Button className="w-full" size="lg">
              Pay Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

