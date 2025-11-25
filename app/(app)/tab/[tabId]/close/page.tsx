'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatTime } from '@/lib/utils'

export default function CloseTabPage({ params }: { params: { tabId: string } }) {
  const router = useRouter()
  const [selectedTip, setSelectedTip] = useState(18)
  const [customTip, setCustomTip] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Mock data - in real app, fetch from API
  const tab = {
    id: params.tabId,
    venue: { name: 'The Red Door Saloon', taxRate: 0.0925 },
    openedAt: new Date(),
    subtotal: 85.50,
    items: [
      { id: '1', menuItem: { name: 'Jack Daniel\'s Tennessee Whiskey' }, quantity: 2, price: 9.00, orderedAt: new Date(Date.now() - 3600000) },
      { id: '2', menuItem: { name: 'Buffalo Trace Bourbon' }, quantity: 1, price: 10.00, orderedAt: new Date(Date.now() - 3000000) },
      { id: '3', menuItem: { name: 'Nashville Hot Wings' }, quantity: 1, price: 14.00, orderedAt: new Date(Date.now() - 2400000) },
      { id: '4', menuItem: { name: 'Craft IPA' }, quantity: 3, price: 8.50, orderedAt: new Date(Date.now() - 1800000) },
      { id: '5', menuItem: { name: 'Loaded Nachos' }, quantity: 2, price: 12.00, orderedAt: new Date(Date.now() - 900000) },
    ],
  }

  const tax = tab.subtotal * tab.venue.taxRate
  const tipAmount = showCustomInput && customTip 
    ? parseFloat(customTip) || 0 
    : (tab.subtotal * selectedTip) / 100
  const total = tab.subtotal + tax + tipAmount

  const handleTipSelect = (percent: number) => {
    setSelectedTip(percent)
    setShowCustomInput(false)
    setCustomTip('')
  }

  const handleCustomTip = () => {
    setShowCustomInput(true)
    setSelectedTip(0)
  }

  const handleNextStep = () => {
    router.push(`/tab/${params.tabId}/payment?tip=${tipAmount}&total=${total}`)
  }

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
          <div className="space-y-2">
            {tab.items.map((item) => (
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
        </div>

        {/* Bill Summary */}
        <Card className="mb-6">
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
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-600">Tip</span>
              <span>{formatCurrency(tipAmount)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Add Tip Section */}
        <Card className="mb-24">
          <CardHeader>
            <CardTitle>Add Tip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[10, 15, 18, 20].map((percent) => (
                <button
                  key={percent}
                  onClick={() => handleTipSelect(percent)}
                  className={`rounded-lg border-2 py-4 font-semibold transition-colors ${
                    selectedTip === percent && !showCustomInput
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {percent}%
                  <div className="text-sm font-normal mt-1">
                    {formatCurrency((tab.subtotal * percent) / 100)}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCustomTip}
              className={`w-full rounded-lg border-2 py-4 font-semibold transition-colors ${
                showCustomInput
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              Custom Amount
            </button>

            {showCustomInput && (
              <div className="space-y-2">
                <Label htmlFor="customTip">Enter Custom Tip Amount</Label>
                <Input
                  id="customTip"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="text-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Step Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleNextStep}
          >
            Next Step → {formatCurrency(total)}
          </Button>
        </div>
      </div>
    </div>
  )
}

