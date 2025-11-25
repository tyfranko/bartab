import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTabSchema = z.object({
  venueId: z.string(),
  tableId: z.string(),
})

// Create new tab
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
    const { venueId, tableId } = createTabSchema.parse(body)

    // Check if user already has an open tab at this venue
    const existingTab = await prisma.tab.findFirst({
      where: {
        userId: user.id,
        venueId,
        status: 'OPEN',
      },
    })

    if (existingTab) {
      return NextResponse.json(
        { error: 'You already have an open tab at this venue', tabId: existingTab.id },
        { status: 400 }
      )
    }

    // Create new tab
    const tab = await prisma.tab.create({
      data: {
        userId: user.id,
        venueId,
        tableId,
        status: 'OPEN',
      },
      include: {
        venue: true,
        table: true,
      },
    })

    return NextResponse.json({ tab }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create tab error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get user's tabs
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const tabs = await prisma.tab.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as any }),
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
      orderBy: {
        openedAt: 'desc',
      },
    })

    return NextResponse.json({ tabs })
  } catch (error) {
    console.error('Get tabs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

