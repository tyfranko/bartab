import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding new venues...')

  // Venue 1: The Red Door Saloon
  const redDoor = await prisma.venue.create({
    data: {
      name: 'The Red Door Saloon',
      address: '789 Broadway',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      phone: '+1 (615) 555-0101',
      email: 'info@reddoorsaloon.com',
      latitude: 36.1627,
      longitude: -86.7816,
      merchantId: 'merchant_red_door_001',
      taxRate: 0.0925,
      description: 'Nashville\'s premier country music venue and saloon',
      openingHours: {
        monday: { open: '16:00', close: '02:00' },
        tuesday: { open: '16:00', close: '02:00' },
        wednesday: { open: '16:00', close: '02:00' },
        thursday: { open: '16:00', close: '03:00' },
        friday: { open: '14:00', close: '03:00' },
        saturday: { open: '12:00', close: '03:00' },
        sunday: { open: '12:00', close: '00:00' },
      },
    },
  })

  // Add tables for Red Door
  await Promise.all(
    Array.from({ length: 15 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.create({
        data: {
          venueId: redDoor.id,
          tableNumber,
          qrCode: `bartab://venue/${redDoor.id}/table/${tableNumber}`,
          capacity: i < 8 ? 4 : i < 12 ? 6 : 8,
        },
      })
    })
  )

  // Menu categories for Red Door
  const rdDrinks = await prisma.menuCategory.create({
    data: { venueId: redDoor.id, name: 'Whiskey & Bourbon', sortOrder: 1 },
  })
  const rdBeer = await prisma.menuCategory.create({
    data: { venueId: redDoor.id, name: 'Beer', sortOrder: 2 },
  })
  const rdCocktails = await prisma.menuCategory.create({
    data: { venueId: redDoor.id, name: 'Cocktails', sortOrder: 3 },
  })
  const rdFood = await prisma.menuCategory.create({
    data: { venueId: redDoor.id, name: 'Bar Bites', sortOrder: 4 },
  })

  // Menu items for Red Door
  await prisma.menuItem.createMany({
    data: [
      // Whiskey & Bourbon
      { categoryId: rdDrinks.id, name: 'Jack Daniel\'s Tennessee Whiskey', description: 'Classic Tennessee whiskey', price: 9.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdDrinks.id, name: 'Buffalo Trace Bourbon', description: 'Kentucky straight bourbon', price: 10.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdDrinks.id, name: 'Maker\'s Mark', description: 'Smooth wheated bourbon', price: 11.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Beer
      { categoryId: rdBeer.id, name: 'Bud Light', description: 'Light lager', price: 5.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdBeer.id, name: 'Miller Lite', description: 'American light lager', price: 5.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdBeer.id, name: 'Local IPA', description: 'Nashville craft IPA', price: 7.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Cocktails
      { categoryId: rdCocktails.id, name: 'Whiskey Sour', description: 'Bourbon, lemon, simple syrup', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdCocktails.id, name: 'Old Fashioned', description: 'Bourbon, bitters, sugar', price: 13.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Food
      { categoryId: rdFood.id, name: 'Nashville Hot Wings', description: '8 pieces with ranch', price: 14.00, allergens: ['dairy'], availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: rdFood.id, name: 'Loaded Nachos', description: 'Cheese, jalapeños, sour cream', price: 12.00, allergens: ['dairy'], isVegetarian: true, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  })

  console.log('✅ Created venue: The Red Door Saloon')

  // Venue 2: Losers Bar & Grill
  const losers = await prisma.venue.create({
    data: {
      name: 'Losers Bar & Grill',
      address: '456 Music Row',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37212',
      phone: '+1 (615) 555-0202',
      email: 'info@losersbar.com',
      latitude: 36.1519,
      longitude: -86.7980,
      merchantId: 'merchant_losers_002',
      taxRate: 0.0925,
      description: 'Dive bar atmosphere with great drinks and grub',
      openingHours: {
        monday: { open: '11:00', close: '02:00' },
        tuesday: { open: '11:00', close: '02:00' },
        wednesday: { open: '11:00', close: '02:00' },
        thursday: { open: '11:00', close: '03:00' },
        friday: { open: '11:00', close: '03:00' },
        saturday: { open: '10:00', close: '03:00' },
        sunday: { open: '10:00', close: '00:00' },
      },
    },
  })

  // Add tables
  await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.create({
        data: {
          venueId: losers.id,
          tableNumber,
          qrCode: `bartab://venue/${losers.id}/table/${tableNumber}`,
          capacity: i < 6 ? 2 : i < 10 ? 4 : 6,
        },
      })
    })
  )

  const lsDrinks = await prisma.menuCategory.create({
    data: { venueId: losers.id, name: 'Draft Beer', sortOrder: 1 },
  })
  const lsShots = await prisma.menuCategory.create({
    data: { venueId: losers.id, name: 'Shots & Shooters', sortOrder: 2 },
  })
  const lsCocktails = await prisma.menuCategory.create({
    data: { venueId: losers.id, name: 'Mixed Drinks', sortOrder: 3 },
  })

  await prisma.menuItem.createMany({
    data: [
      // Draft Beer
      { categoryId: lsDrinks.id, name: 'Coors Light', description: 'Light beer', price: 4.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: lsDrinks.id, name: 'Blue Moon', description: 'Belgian-style wheat ale', price: 6.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: lsDrinks.id, name: 'Guinness', description: 'Irish stout', price: 7.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Shots
      { categoryId: lsShots.id, name: 'Tequila Shot', description: 'With lime and salt', price: 7.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: lsShots.id, name: 'Jägermeister', description: 'German herbal liqueur', price: 7.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: lsShots.id, name: 'Fireball', description: 'Cinnamon whisky', price: 6.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Cocktails
      { categoryId: lsCocktails.id, name: 'Long Island Iced Tea', description: 'Multiple spirits, cola', price: 11.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: lsCocktails.id, name: 'Margarita', description: 'Tequila, triple sec, lime', price: 10.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  })

  console.log('✅ Created venue: Losers Bar & Grill')

  // Venue 3: Riley Green's Duck Blind
  const duckBlind = await prisma.venue.create({
    data: {
      name: 'Riley Green\'s Duck Blind',
      address: '321 Hunting Lodge Rd',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      phone: '+1 (615) 555-0303',
      email: 'info@duckblindbar.com',
      latitude: 36.1699,
      longitude: -86.7831,
      merchantId: 'merchant_duck_blind_003',
      taxRate: 0.0925,
      description: 'Hunting lodge themed bar with Southern hospitality',
      openingHours: {
        monday: { open: '15:00', close: '00:00' },
        tuesday: { open: '15:00', close: '00:00' },
        wednesday: { open: '15:00', close: '00:00' },
        thursday: { open: '15:00', close: '02:00' },
        friday: { open: '12:00', close: '02:00' },
        saturday: { open: '12:00', close: '02:00' },
        sunday: { open: '12:00', close: '00:00' },
      },
    },
  })

  await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.create({
        data: {
          venueId: duckBlind.id,
          tableNumber,
          qrCode: `bartab://venue/${duckBlind.id}/table/${tableNumber}`,
          capacity: i < 4 ? 4 : i < 8 ? 6 : 8,
        },
      })
    })
  )

  const dbBeer = await prisma.menuCategory.create({
    data: { venueId: duckBlind.id, name: 'Cold Beer', sortOrder: 1 },
  })
  const dbWhiskey = await prisma.menuCategory.create({
    data: { venueId: duckBlind.id, name: 'Whiskey Selection', sortOrder: 2 },
  })
  const dbSpecialty = await prisma.menuCategory.create({
    data: { venueId: duckBlind.id, name: 'Specialty Drinks', sortOrder: 3 },
  })

  await prisma.menuItem.createMany({
    data: [
      // Beer
      { categoryId: dbBeer.id, name: 'Budweiser', description: 'American lager', price: 5.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: dbBeer.id, name: 'Yuengling', description: 'Traditional lager', price: 5.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: dbBeer.id, name: 'Sam Adams Boston Lager', description: 'Vienna lager', price: 6.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Whiskey
      { categoryId: dbWhiskey.id, name: 'Jim Beam', description: 'Kentucky bourbon', price: 8.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: dbWhiskey.id, name: 'Crown Royal', description: 'Canadian whisky', price: 10.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: dbWhiskey.id, name: 'Jameson', description: 'Irish whiskey', price: 9.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Specialty
      { categoryId: dbSpecialty.id, name: 'Duck Blind Mule', description: 'Vodka, ginger beer, lime', price: 11.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: dbSpecialty.id, name: 'Hunter\'s Punch', description: 'Rum, tropical juices', price: 10.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  })

  console.log('✅ Created venue: Riley Green\'s Duck Blind')

  // Venue 4: Jason Aldean's
  const aldeans = await prisma.venue.create({
    data: {
      name: 'Jason Aldean\'s',
      address: '208 Broadway',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      phone: '+1 (615) 555-0404',
      email: 'info@jasonaldeans.com',
      latitude: 36.1615,
      longitude: -86.7779,
      merchantId: 'merchant_aldeans_004',
      taxRate: 0.0925,
      description: 'Multi-level entertainment venue on Broadway',
      openingHours: {
        monday: { open: '11:00', close: '02:00' },
        tuesday: { open: '11:00', close: '02:00' },
        wednesday: { open: '11:00', close: '02:00' },
        thursday: { open: '11:00', close: '03:00' },
        friday: { open: '11:00', close: '03:00' },
        saturday: { open: '10:00', close: '03:00' },
        sunday: { open: '10:00', close: '02:00' },
      },
    },
  })

  await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.create({
        data: {
          venueId: aldeans.id,
          tableNumber,
          qrCode: `bartab://venue/${aldeans.id}/table/${tableNumber}`,
          capacity: i < 10 ? 4 : i < 16 ? 6 : 8,
        },
      })
    })
  )

  const jaBeer = await prisma.menuCategory.create({
    data: { venueId: aldeans.id, name: 'Beer & Seltzers', sortOrder: 1 },
  })
  const jaCocktails = await prisma.menuCategory.create({
    data: { venueId: aldeans.id, name: 'Signature Cocktails', sortOrder: 2 },
  })
  const jaSpirits = await prisma.menuCategory.create({
    data: { venueId: aldeans.id, name: 'Premium Spirits', sortOrder: 3 },
  })

  await prisma.menuItem.createMany({
    data: [
      // Beer
      { categoryId: jaBeer.id, name: 'Michelob Ultra', description: 'Low-carb light beer', price: 5.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaBeer.id, name: 'Corona Extra', description: 'Mexican lager', price: 6.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaBeer.id, name: 'White Claw', description: 'Hard seltzer', price: 6.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Cocktails
      { categoryId: jaCocktails.id, name: 'Broadway Crush', description: 'Vodka, cranberry, lime', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaCocktails.id, name: 'Music City Mule', description: 'Whiskey, ginger beer, lime', price: 13.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaCocktails.id, name: 'Dirt Road Rita', description: 'Tequila margarita with a twist', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Premium Spirits
      { categoryId: jaSpirits.id, name: 'Woodford Reserve', description: 'Premium bourbon', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaSpirits.id, name: 'Patron Silver', description: 'Premium tequila', price: 13.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: jaSpirits.id, name: 'Grey Goose', description: 'Premium vodka', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  })

  console.log('✅ Created venue: Jason Aldean\'s')

  // Venue 5: Dierks Bentley's Whiskey Row
  const whiskyRow = await prisma.venue.create({
    data: {
      name: 'Dierks Bentley\'s Whiskey Row',
      address: '400 Broadway',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      phone: '+1 (615) 555-0505',
      email: 'info@whiskeyrow.com',
      latitude: 36.1606,
      longitude: -86.7775,
      merchantId: 'merchant_whiskey_row_005',
      taxRate: 0.0925,
      description: 'Premium whiskey bar with rooftop views',
      openingHours: {
        monday: { open: '11:00', close: '02:00' },
        tuesday: { open: '11:00', close: '02:00' },
        wednesday: { open: '11:00', close: '02:00' },
        thursday: { open: '11:00', close: '03:00' },
        friday: { open: '11:00', close: '03:00' },
        saturday: { open: '10:00', close: '03:00' },
        sunday: { open: '10:00', close: '02:00' },
      },
    },
  })

  await Promise.all(
    Array.from({ length: 18 }, async (_, i) => {
      const tableNumber = `${i + 1}`
      return prisma.table.create({
        data: {
          venueId: whiskyRow.id,
          tableNumber,
          qrCode: `bartab://venue/${whiskyRow.id}/table/${tableNumber}`,
          capacity: i < 8 ? 4 : i < 14 ? 6 : 8,
        },
      })
    })
  )

  const wrWhiskey = await prisma.menuCategory.create({
    data: { venueId: whiskyRow.id, name: 'Whiskey Library', sortOrder: 1 },
  })
  const wrCocktails = await prisma.menuCategory.create({
    data: { venueId: whiskyRow.id, name: 'Craft Cocktails', sortOrder: 2 },
  })
  const wrBeer = await prisma.menuCategory.create({
    data: { venueId: whiskyRow.id, name: 'Local Drafts', sortOrder: 3 },
  })

  await prisma.menuItem.createMany({
    data: [
      // Whiskey
      { categoryId: wrWhiskey.id, name: 'Blanton\'s Single Barrel', description: 'Premium bourbon', price: 18.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrWhiskey.id, name: 'Pappy Van Winkle 15yr', description: 'Ultra-premium bourbon', price: 50.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrWhiskey.id, name: 'Eagle Rare 10yr', description: 'Kentucky straight bourbon', price: 14.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrWhiskey.id, name: 'Knob Creek', description: 'Small batch bourbon', price: 11.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Cocktails
      { categoryId: wrCocktails.id, name: 'Whiskey Row Old Fashioned', description: 'House bourbon, bitters, orange', price: 14.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrCocktails.id, name: 'Manhattan', description: 'Rye whiskey, vermouth, bitters', price: 13.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrCocktails.id, name: 'Mint Julep', description: 'Bourbon, mint, sugar', price: 12.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      // Beer
      { categoryId: wrBeer.id, name: 'Tennessee Brew Works IPA', description: 'Local Nashville IPA', price: 7.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrBeer.id, name: 'Yazoo Pale Ale', description: 'Nashville craft beer', price: 7.00, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      { categoryId: wrBeer.id, name: 'Blackstone Nut Brown Ale', description: 'English brown ale', price: 6.50, availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    ],
  })

  console.log('✅ Created venue: Dierks Bentley\'s Whiskey Row')
  console.log('🎉 All venues created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

