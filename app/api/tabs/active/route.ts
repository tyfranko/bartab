import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get user's active tab
export async function GET() {
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
        userId: user.id,
        status: 'OPEN',
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
          orderBy: {
            orderedAt: 'desc',
          },
        },
      },
      orderBy: {
        openedAt: 'desc',
      },
    })

    if (!tab) {
      return NextResponse.json({ error: 'No active tab found' }, { status: 404 })
    }

    return NextResponse.json({ tab })
  } catch (error) {
    console.error('Get active tab error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

