import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { MenuClient } from './menu-client'

async function getVenueWithMenu(venueId: string) {
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      menuCategories: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          items: {
            where: { isAvailable: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  })

  return venue
}

export default async function MenuPage({ params }: { params: { venueId: string } }) {
  const venue = await getVenueWithMenu(params.venueId)

  if (!venue) {
    notFound()
  }

  return <MenuClient venue={venue} />
}
