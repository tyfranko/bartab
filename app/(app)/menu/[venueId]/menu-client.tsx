'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/components/ui/use-toast'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  isVegan: boolean
  isVegetarian: boolean
  isGlutenFree: boolean
  allergens: string[]
}

type MenuCategory = {
  id: string
  name: string
  items: MenuItem[]
}

type Venue = {
  id: string
  name: string
  city: string
  state: string
  menuCategories: MenuCategory[]
}

export function MenuClient({ venue }: { venue: Venue }) {
  const router = useRouter()
  const { items, getTotalItems, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = venue.menuCategories
  const totalItems = getTotalItems()

  const handleAddToTab = async () => {
    if (totalItems === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select items to add to your tab',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare items for API
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }))

      // Call API to create/get tab and add items
      const response = await fetch('/api/tabs/add-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId: venue.id,
          items: orderItems,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add items to tab')
      }

      const data = await response.json()
      
      toast({
        title: 'Added to Tab!',
        description: `${totalItems} item${totalItems > 1 ? 's' : ''} added successfully`,
      })
      
      // Clear cart and redirect to view tab
      clearCart()
      router.push('/tab/active')
    } catch (error) {
      console.error('Error adding to tab:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add items to tab. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto max-w-md px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/home">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold">{venue.name}</h1>
              <p className="text-xs text-gray-600">{venue.city}, {venue.state}</p>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search menu..." 
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="container mx-auto max-w-md px-4 py-6">
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className={`w-full grid mb-6 gap-1 ${
            categories.length === 2 ? 'grid-cols-2' :
            categories.length === 3 ? 'grid-cols-3' :
            'grid-cols-4'
          }`}>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.isVegan && <span className="text-xs text-green-600">🌱</span>}
                            {item.isVegetarian && !item.isVegan && <span className="text-xs">🥬</span>}
                            {item.isGlutenFree && <span className="text-xs">GF</span>}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          {item.allergens.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                              Allergens: {item.allergens.join(', ')}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-lg font-semibold">{formatCurrency(item.price)}</span>
                            <AddToCartButton item={item} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Tab Preview - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="container mx-auto max-w-md">
          {totalItems === 0 ? (
            <Link href="/tab/active">
              <Button className="w-full" size="lg" variant="outline">
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Tab
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleAddToTab}
              disabled={isSubmitting}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Adding...' : `ADD TO TAB (${totalItems})`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

