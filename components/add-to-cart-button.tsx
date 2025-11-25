'use client'

import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'

interface MenuItem {
  id: string
  name: string
  price: number
}

interface AddToCartButtonProps {
  item: MenuItem
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { items, addItem, updateQuantity } = useCart()
  
  const cartItem = items.find(i => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem(item)
  }

  const handleRemove = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1)
    }
  }

  if (quantity === 0) {
    return (
      <Button size="sm" onClick={handleAdd}>
        Add to Tab
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={handleRemove}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-semibold">{quantity}</span>
      <Button size="sm" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
