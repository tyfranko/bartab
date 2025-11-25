import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'

async function getVenueWithMenu(venueId: string) {
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      menuCategories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })

  return venue
}

export default async function MenuPage({ params }: { params: { venueId: string } }) {
  const venue = await getVenueWithMenu(params.venueId)

  if (!venue) {
    notFound()
  }

  const categories = venue.menuCategories

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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md">
          <Link href="/home">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Tab
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

