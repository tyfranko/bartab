import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding new users...')

  // User 1: Josh
  const joshPasswordHash = await bcrypt.hash('@@Josh2026!Pax', 12)
  
  const josh = await prisma.user.upsert({
    where: { email: 'musicjoshross@icloud.com' },
    update: {
      passwordHash: joshPasswordHash,
    },
    create: {
      email: 'musicjoshross@icloud.com',
      firstName: 'Josh',
      lastName: 'Ross',
      passwordHash: joshPasswordHash,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created/Updated user:', josh.email)

  // User 2: Tyler
  const tylerPasswordHash = await bcrypt.hash('Tf900822', 12)
  
  const tyler = await prisma.user.upsert({
    where: { email: 'tyler@dynamiccode.com.au' },
    update: {
      passwordHash: tylerPasswordHash,
    },
    create: {
      email: 'tyler@dynamiccode.com.au',
      firstName: 'Tyler',
      lastName: 'Franko',
      passwordHash: tylerPasswordHash,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created/Updated user:', tyler.email)
  console.log('🎉 Users added successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

