import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sendVerificationSchema = z.object({
  phone: z.string().min(10),
})

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = sendVerificationSchema.parse(body)

    // Generate verification code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save verification code
    await prisma.phoneVerification.create({
      data: {
        phone,
        code,
        expiresAt,
        verified: false,
        attempts: 0,
      },
    })

    // TODO: Send SMS via Twilio
    // For now, log the code (in production, this would send SMS)
    console.log(`[DEV] Verification code for ${phone}: ${code}`)

    /* Twilio integration (uncomment when ready):
    const twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
    
    await twilioClient.messages.create({
      body: `Your BarTab verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    */

    return NextResponse.json(
      {
        message: 'Verification code sent successfully',
        // In development, return the code for testing
        ...(process.env.NODE_ENV === 'development' && { code }),
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

    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

