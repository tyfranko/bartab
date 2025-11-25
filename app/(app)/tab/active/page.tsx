'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatTime } from '@/lib/utils'

export default function ActiveTabPage() {
  const router = useRouter()

  // Mock data - in real app, fetch from API based on user's active tab
  const tab = {
    id: 'tab_123',
    venue: { 
      name: 'The Red Door Saloon',
      address: '1816 Division St, Nashville, TN'
    },
    tableNumber: 'T7',
    openedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
    items: [
      { 
        id: '1', 
        name: 'Jack Daniel\'s Tennessee Whiskey', 
        quantity: 2, 
        price: 9.00, 
        orderedAt: new Date(Date.now() - 5400000) 
      },
      { 
        id: '2', 
        name: 'Buffalo Trace Bourbon', 
        quantity: 1, 
        price: 10.00, 
        orderedAt: new Date(Date.now() - 4800000) 
      },
      { 
        id: '3', 
        name: 'Nashville Hot Wings', 
        quantity: 1, 
        price: 14.00, 
        orderedAt: new Date(Date.now() - 3600000) 
      },
      { 
        id: '4', 
        name: 'Craft IPA', 
        quantity: 3, 
        price: 8.50, 
        orderedAt: new Date(Date.now() - 2400000) 
      },
      { 
        id: '5', 
        name: 'Old Fashioned', 
        quantity: 1, 
        price: 12.00, 
        orderedAt: new Date(Date.now() - 1200000) 
      },
    ],
  }

  const subtotal = tab.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.0925
  const tax = subtotal * taxRate
  const currentTotal = subtotal + tax

  const handleRemoveItem = (itemId: string) => {
    // In real app, call API to remove item from tab
    console.log('Remove item:', itemId)
  }

  const handleCloseTab = () => {
    router.push(`/tab/${tab.id}/close`)
  }

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
                <p className="font-semibold">{tab.tableNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Opened</p>
                <p className="font-semibold">{formatTime(tab.openedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items on Tab */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Items on Tab</h2>
          {tab.items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                <p className="text-lg">No items yet</p>
                <p className="mt-2 text-sm">Start ordering to build your tab</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {tab.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{item.quantity}x</span>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Added {formatTime(item.orderedAt)}
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
        <Link href={`/menu/${tab.venue.name}`}>
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
            onClick={handleCloseTab}
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

