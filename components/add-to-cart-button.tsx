'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MenuItem {
  id: string
  name: string
  price: number
}

interface AddToCartButtonProps {
  item: MenuItem
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(0)

  const handleAdd = () => {
    setQuantity(q => q + 1)
    // In a real app, this would update a cart context/state
  }

  const handleRemove = () => {
    setQuantity(q => Math.max(0, q - 1))
  }

  if (quantity === 0) {
    return (
      <Button size="sm" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
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

