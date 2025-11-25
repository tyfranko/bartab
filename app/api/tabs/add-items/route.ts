import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addItemsSchema = z.object({
  venueId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
})

// Create or get active tab and add items
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { venueId, items } = addItemsSchema.parse(body)

    // Get venue to access tax rate
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // Check if user already has an open tab at this venue
    let tab = await prisma.tab.findFirst({
      where: {
        userId: user.id,
        venueId,
        status: 'OPEN',
      },
    })

    // If no tab exists, create one
    if (!tab) {
      tab = await prisma.tab.create({
        data: {
          userId: user.id,
          venueId,
          status: 'OPEN',
          subtotal: 0,
          tax: 0,
          tip: 0,
          total: 0,
        },
      })
    }

    // Fetch menu items to get prices
    const menuItemIds = items.map((item) => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    })

    // Create order with items
    const order = await prisma.order.create({
      data: {
        tabId: tab.id,
        status: 'PENDING',
        items: {
          create: items.map((item) => {
            const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)
            if (!menuItem) {
              throw new Error(`Menu item ${item.menuItemId} not found`)
            }
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: menuItem.price,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    // Calculate order total
    const orderTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Update tab totals
    const newSubtotal = tab.subtotal + orderTotal
    const newTax = newSubtotal * venue.taxRate
    const newTotal = newSubtotal + newTax + tab.tip

    const updatedTab = await prisma.tab.update({
      where: { id: tab.id },
      data: {
        subtotal: newSubtotal,
        tax: newTax,
        total: newTotal,
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
        },
      },
    })

    return NextResponse.json({ tab: updatedTab, order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add items to tab error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

