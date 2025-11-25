'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatTime } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

type TabItem = {
  id: string
  quantity: number
  price: number
  menuItem: {
    name: string
    description: string | null
  }
}

type Order = {
  id: string
  orderedAt: Date
  items: TabItem[]
}

type Tab = {
  id: string
  openedAt: Date
  subtotal: number
  venue: {
    id: string
    name: string
    address: string
    city: string
    state: string
    taxRate: number
  }
  table: {
    tableNumber: string
  } | null
  orders: Order[]
}

export default function ActiveTabPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveTab()
  }, [])

  const fetchActiveTab = async () => {
    try {
      const response = await fetch('/api/tabs/active')
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: 'No Active Tab',
            description: 'You don\'t have an active tab. Start one at a venue!',
            variant: 'destructive',
          })
          router.push('/home')
          return
        }
        throw new Error('Failed to fetch tab')
      }

      const data = await response.json()
      setTab(data.tab)
    } catch (error) {
      console.error('Error fetching active tab:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your tab. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Item removal will be available soon!',
    })
    // TODO: Implement remove item API call
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tab) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No active tab found</p>
          <Link href="/home">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Flatten all order items
  const allItems = tab.orders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderedAt: order.orderedAt,
    }))
  )

  const subtotal = tab.subtotal
  const taxRate = tab.venue.taxRate
  const tax = subtotal * taxRate
  const currentTotal = subtotal + tax

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/home">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Your Tab</h1>
              <p className="text-sm text-gray-600">{tab.venue.name}</p>
            </div>
          </div>
        </div>

        {/* Tab Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Table</p>
                <p className="font-semibold">{tab.table?.tableNumber || 'Bar'}</p>
              </div>
              <div>
                <p className="text-gray-600">Opened</p>
                <p className="font-semibold">{formatTime(new Date(tab.openedAt))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items on Tab */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Items on Tab</h2>
          {allItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                <p className="text-lg">No items yet</p>
                <p className="mt-2 text-sm">Start ordering to build your tab</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {allItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{item.quantity}x</span>
                          <div>
                            <p className="font-medium">{item.menuItem.name}</p>
                            <p className="text-xs text-gray-500">
                              Added {formatTime(new Date(item.orderedAt))}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Running Total */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Tax ({(taxRate * 100).toFixed(1)}%)</span>
              <span className="font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-xl">
              <span>Current Total</span>
              <span>{formatCurrency(currentTotal)}</span>
            </div>
            <p className="text-xs text-gray-500 text-center pt-2">
              Tip will be added when you close your tab
            </p>
          </CardContent>
        </Card>

        {/* Add More Items */}
        <Link href={`/menu/${tab.venue.id}`}>
          <Button variant="outline" className="w-full mb-4">
            Add More Items
          </Button>
        </Link>
      </div>

      {/* Close Tab Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="container mx-auto max-w-md">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            size="lg"
            onClick={() => router.push(`/tab/${tab.id}/close`)}
          >
            CLOSE TAB
          </Button>
          <p className="mt-2 text-center text-xs text-gray-600">
            Review and pay your tab
          </p>
        </div>
      </div>
    </div>
  )
}
