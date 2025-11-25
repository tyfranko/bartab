import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verifyPhoneSchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, code } = verifyPhoneSchema.parse(body)

    // Find the most recent verification for this phone
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'No verification found for this phone number' },
        { status: 404 }
      )
    }

    // Check if code is expired
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if too many attempts
    if (verification.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check if code matches
    if (verification.code !== code) {
      // Increment attempts
      await prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 },
      })

      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Mark as verified
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    })

    // Update user's phone verified status
    await prisma.user.updateMany({
      where: { phone },
      data: { phoneVerified: true },
    })

    return NextResponse.json(
      {
        message: 'Phone verified successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Verify phone error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

