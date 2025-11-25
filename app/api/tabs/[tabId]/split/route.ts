import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSplitSchema = z.object({
  splits: z.array(
    z.object({
      userId: z.string().optional(),
      guestName: z.string().optional(),
      amount: z.number().positive(),
      tip: z.number().min(0),
    })
  ),
})

// Create tab split
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
    })

    if (!tab) {
      return NextResponse.json({ error: 'Tab not found or closed' }, { status: 404 })
    }

    const body = await request.json()
    const { splits } = createSplitSchema.parse(body)

    // Create split records
    const createdSplits = await Promise.all(
      splits.map((split) =>
        prisma.tabSplit.create({
          data: {
            tabId: params.tabId,
            userId: split.userId,
            guestName: split.guestName,
            amount: split.amount,
            tip: split.tip,
            total: split.amount + split.tip,
          },
        })
      )
    )

    return NextResponse.json({ splits: createdSplits }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create split error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get splits for tab
export async function GET(
  request: Request,
  { params }: { params: { tabId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const splits = await prisma.tabSplit.findMany({
      where: {
        tabId: params.tabId,
      },
    })

    return NextResponse.json({ splits })
  } catch (error) {
    console.error('Get splits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

