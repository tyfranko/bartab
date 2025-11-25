import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { pusherServer, getTabChannel, PUSHER_EVENTS } from '@/lib/pusher'

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      notes: z.string().optional(),
    })
  ),
  specialInstructions: z.string().optional(),
})

// Create order for tab
export async function POST(
  request: Request,
  { params }: { params: { tabId: string } }
) {
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

    const tab = await prisma.tab.findFirst({
      where: {
        id: params.tabId,
        userId: user.id,
        status: 'OPEN',
      },
      include: {
        venue: true,
      },
    })

    if (!tab) {
      return NextResponse.json({ error: 'Tab not found or closed' }, { status: 404 })
    }

    const body = await request.json()
    const { items, specialInstructions } = createOrderSchema.parse(body)

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
        tabId: params.tabId,
        status: 'PENDING',
        specialInstructions,
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
              notes: item.notes,
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

    // Update tab totals
    const orderTotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const newSubtotal = tab.subtotal + orderTotal
    const newTax = newSubtotal * tab.venue.taxRate
    const newTotal = newSubtotal + newTax + tab.tip

    await prisma.tab.update({
      where: { id: params.tabId },
      data: {
        subtotal: newSubtotal,
        tax: newTax,
        total: newTotal,
      },
    })

    // Send real-time update
    try {
      await pusherServer.trigger(
        getTabChannel(params.tabId),
        PUSHER_EVENTS.TAB_ITEM_ADDED,
        {
          tabId: params.tabId,
          order,
        }
      )
    } catch (pusherError) {
      console.error('Pusher error:', pusherError)
      // Don't fail the request if Pusher fails
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get orders for tab
export async function GET(
  request: Request,
  { params }: { params: { tabId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        tabId: params.tabId,
      },
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
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

