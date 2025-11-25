'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock cart items - in a real app, this would come from context/state
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Craft IPA',
      price: 8.50,
      quantity: 2,
      notes: '',
    },
    {
      id: '2',
      name: 'Truffle Fries',
      price: 9.00,
      quantity: 1,
      notes: 'Extra crispy please',
    },
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id))
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const handleUpdateNotes = (id: string, notes: string) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    )
  }

  const handleConfirmOrder = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Order Placed!',
      description: 'Your order has been sent to the kitchen.',
    })
    
    router.push('/tab/active')
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-6">
        <div className="mb-6 flex items-center">
          <Link href="/menu/test">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Your Cart</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">Your cart is empty</p>
            <Link href="/menu/test">
              <Button className="mt-4">Browse Menu</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/menu/test">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Review Order</h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, 0)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>

                    <div className="mt-3">
                      <Label htmlFor={`notes-${item.id}`} className="text-xs text-gray-600">
                        Special instructions
                      </Label>
                      <Input
                        id={`notes-${item.id}`}
                        placeholder="e.g., no onions"
                        value={item.notes}
                        onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add More Items */}
        <Link href="/menu/test">
          <Button variant="outline" className="mt-4 w-full">
            + Add More Items
          </Button>
        </Link>
      </div>

      {/* Summary - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md space-y-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
          </Button>
          <p className="text-center text-xs text-gray-600">
            Tax and tip will be added at checkout
          </p>
        </div>
      </div>
    </div>
  )
}

