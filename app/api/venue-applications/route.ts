import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const venueApplicationSchema = z.object({
  businessName: z.string().min(1),
  managerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(5),
  posSystem: z.string().min(1),
  estimatedVolume: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = venueApplicationSchema.parse(body)

    // Check if application already exists
    const existingApplication = await prisma.venueApplication.findUnique({
      where: { email: data.email },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      )
    }

    // Create venue application
    const application = await prisma.venueApplication.create({
      data: {
        businessName: data.businessName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        posSystem: data.posSystem,
        estimatedVolume: data.estimatedVolume,
        notes: data.notes,
        status: 'PENDING',
      },
    })

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        application: {
          id: application.id,
          businessName: application.businessName,
          status: application.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Venue application error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get all venue applications (admin only - TODO: add auth)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const applications = await prisma.venueApplication.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

