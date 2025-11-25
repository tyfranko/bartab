import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const passwordHash = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@bartab.com' },
    update: {},
    create: {
      email: 'test@bartab.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created test user:', user.email)

  // Create test venue
  const venue = await prisma.venue.upsert({
    where: { merchantId: 'merchant_test_123' },
    update: {},
    create: {
      name: 'The Cozy Pub',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      phone: '+1 (555) 123-4567',
      email: 'info@cozypub.com',
      latitude: 37.7749,
      longitude: -122.4194,
      merchantId: 'merchant_test_123',
      taxRate: 0.0875,
      description: 'A cozy neighborhood pub with craft beers and comfort food',
      openingHours: {
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '00:00' },
        friday: { open: '11:00', close: '02:00' },
        saturday: { open: '10:00', close: '02:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
    },
  })

  console.log('✅ Created test venue:', venue.name)

  // Create tables
  const tables = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.upsert({
        where: { 
          venueId_tableNumber: {
            venueId: venue.id,
            tableNumber,
          },
        },
        update: {},
        create: {
          venueId: venue.id,
          tableNumber,
          qrCode: `bartab://venue/${venue.id}/table/${tableNumber}`,
          capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
        },
      })
    })
  )

  console.log('✅ Created', tables.length, 'tables')

  // Create menu categories
  const drinksCategory = await prisma.menuCategory.create({
    data: {
      venueId: venue.id,
      name: 'Drinks',
      description: 'Refreshing beverages',
      sortOrder: 1,
    },
  })

  const startersCategory = await prisma.menuCategory.create({
    data: {
      venueId: venue.id,
      name: 'Starters',
      description: 'Small plates and appetizers',
      sortOrder: 2,
    },
  })

  const mainsCategory = await prisma.menuCategory.create({
    data: {
      venueId: venue.id,
      name: 'Mains',
      description: 'Hearty main courses',
      sortOrder: 3,
    },
  })

  const dessertsCategory = await prisma.menuCategory.create({
    data: {
      venueId: venue.id,
      name: 'Desserts',
      description: 'Sweet treats',
      sortOrder: 4,
    },
  })

  console.log('✅ Created menu categories')

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      // Drinks
      {
        categoryId: drinksCategory.id,
        name: 'Craft IPA',
        description: 'Local craft IPA with citrus notes',
        price: 8.50,
        allergens: ['gluten'],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 1,
      },
      {
        categoryId: drinksCategory.id,
        name: 'House Red Wine',
        description: 'Smooth Cabernet Sauvignon',
        price: 10.00,
        allergens: ['sulfites'],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 2,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Classic Margarita',
        description: 'Tequila, lime, triple sec',
        price: 12.00,
        allergens: [],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 3,
      },
      // Starters
      {
        categoryId: startersCategory.id,
        name: 'Truffle Fries',
        description: 'Crispy fries with truffle oil and parmesan',
        price: 9.00,
        allergens: ['dairy'],
        isVegetarian: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 1,
      },
      {
        categoryId: startersCategory.id,
        name: 'Buffalo Wings',
        description: '8 pieces with celery and ranch',
        price: 13.00,
        allergens: ['dairy'],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 2,
      },
      {
        categoryId: startersCategory.id,
        name: 'Hummus Plate',
        description: 'House-made hummus with pita bread',
        price: 8.00,
        allergens: ['gluten', 'sesame'],
        isVegan: true,
        isVegetarian: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 3,
      },
      // Mains
      {
        categoryId: mainsCategory.id,
        name: 'Classic Burger',
        description: 'Angus beef, lettuce, tomato, onion, pickles',
        price: 16.00,
        allergens: ['gluten', 'dairy'],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 1,
      },
      {
        categoryId: mainsCategory.id,
        name: 'Fish & Chips',
        description: 'Beer-battered cod with fries',
        price: 18.00,
        allergens: ['gluten', 'fish'],
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 2,
      },
      {
        categoryId: mainsCategory.id,
        name: 'Veggie Buddha Bowl',
        description: 'Quinoa, roasted vegetables, tahini dressing',
        price: 14.00,
        allergens: ['sesame'],
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 3,
      },
      // Desserts
      {
        categoryId: dessertsCategory.id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: 9.00,
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 1,
      },
      {
        categoryId: dessertsCategory.id,
        name: 'Tiramisu',
        description: 'Classic Italian dessert',
        price: 8.00,
        allergens: ['gluten', 'dairy', 'eggs'],
        isVegetarian: true,
        availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        sortOrder: 2,
      },
    ],
  })

  console.log('✅ Created menu items')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

