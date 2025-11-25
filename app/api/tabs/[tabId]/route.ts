import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateTabSchema = z.object({
  tip: z.number().optional(),
})

// Get tab details
export async function GET(
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

    if (!tab) {
      return NextResponse.json({ error: 'Tab not found' }, { status: 404 })
    }

    return NextResponse.json({ tab })
  } catch (error) {
    console.error('Get tab error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update tab (e.g., add tip)
export async function PATCH(
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

    const body = await request.json()
    const { tip } = updateTabSchema.parse(body)

    const tab = await prisma.tab.findFirst({
      where: {
        id: params.tabId,
        userId: user.id,
      },
      include: {
        venue: true,
      },
    })

    if (!tab) {
      return NextResponse.json({ error: 'Tab not found' }, { status: 404 })
    }

    // Recalculate totals
    const tax = tab.subtotal * tab.venue.taxRate
    const total = tab.subtotal + tax + (tip || tab.tip)

    const updatedTab = await prisma.tab.update({
      where: { id: params.tabId },
      data: {
        tip: tip || tab.tip,
        tax,
        total,
      },
    })

    return NextResponse.json({ tab: updatedTab })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update tab error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

