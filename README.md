# BarTab - Contactless Ordering & Payment

A mobile-first progressive web application for contactless ordering and payment at bars and restaurants.

## Features

- 📱 Mobile-first PWA design
- 🔐 Secure authentication with NextAuth.js
- 💳 Payment processing with Stripe and Apple Pay
- 📊 Real-time order updates
- 💰 Bill splitting functionality
- 📍 QR code table scanning
- 🎯 User-friendly interface with shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Real-time**: Pusher
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Pusher account (for real-time features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BarTab
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your actual credentials.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- **Prisma Studio**: `npm run prisma:studio`
- **Migrations**: `npm run prisma:migrate`
- **Generate Client**: `npm run prisma:generate`

## Project Structure

```
/app                # Next.js app directory
  /api             # API routes
  /(auth)          # Authentication pages
  /(app)           # Main application pages
/components        # React components
  /ui              # shadcn/ui components
/lib               # Utility functions and configurations
/prisma            # Database schema and migrations
/public            # Static assets
```

## Development Workflow

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## License

Proprietary - All rights reserved

