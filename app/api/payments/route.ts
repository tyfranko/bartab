import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { stripe, createPaymentIntent } from '@/lib/stripe'
import { pusherServer, getTabChannel, PUSHER_EVENTS } from '@/lib/pusher'

const createPaymentSchema = z.object({
  tabId: z.string(),
  tabSplitId: z.string().optional(),
  paymentMethodId: z.string(),
})

// Process payment
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
    const { tabId, tabSplitId, paymentMethodId } = createPaymentSchema.parse(body)

    // Get tab details
    const tab = await prisma.tab.findFirst({
      where: {
        id: tabId,
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

    // Determine amount to charge
    let amount: number
    if (tabSplitId) {
      const split = await prisma.tabSplit.findUnique({
        where: { id: tabSplitId },
      })
      if (!split || split.tabId !== tabId) {
        return NextResponse.json({ error: 'Split not found' }, { status: 404 })
      }
      amount = split.total
    } else {
      amount = tab.total
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent(amount, 'usd', {
      tabId,
      userId: user.id,
      venueId: tab.venueId,
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        tabId,
        tabSplitId,
        userId: user.id,
        amount,
        paymentMethodId,
        stripePaymentId: paymentIntent.id,
        status: 'PROCESSING',
      },
    })

    // Confirm payment (in a real app, this would be done via webhook)
    // For now, we'll simulate success
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCEEDED' },
    })

    // Close tab if full payment (not split)
    if (!tabSplitId) {
      await prisma.tab.update({
        where: { id: tabId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        },
      })

      // Send real-time update
      try {
        await pusherServer.trigger(
          getTabChannel(tabId),
          PUSHER_EVENTS.TAB_PAID,
          {
            tabId,
            status: 'CLOSED',
          }
        )
      } catch (pusherError) {
        console.error('Pusher error:', pusherError)
      }
    }

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

