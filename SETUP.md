# BarTab Setup Guide

This guide will help you set up and run the BarTab application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed due to some peer dependency conflicts between packages.

## Step 2: Set Up the Database

1. Create a PostgreSQL database:
```bash
createdb bartab
```

2. Create a `.env.local` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env.local
```

3. Update the `DATABASE_URL` in `.env.local`:
```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/bartab"
```

4. Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```
Add this to your `.env.local` file.

## Step 3: Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all the necessary tables in your database.

## Step 4: Seed the Database

```bash
npm run prisma:seed
```

This will create:
- A test user (email: test@bartab.com, password: password123)
- A test venue (The Cozy Pub)
- 10 tables
- Menu categories and items

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Test Credentials

Use these credentials to sign in:
- **Email:** test@bartab.com
- **Password:** password123

## Optional: Set Up External Services

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add the credentials to your `.env.local`:
```
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Stripe (Required for Payments)

1. Sign up at [Stripe](https://stripe.com)
2. Get your test API keys from the dashboard
3. Add them to `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### Pusher (Optional for Real-time Features)

1. Sign up at [Pusher](https://pusher.com)
2. Create a new Channels app
3. Add credentials to `.env.local`:
```
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"
```

## Development Tools

### Prisma Studio

View and edit your database with a GUI:
```bash
npm run prisma:studio
```

Access at [http://localhost:5555](http://localhost:5555)

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
/app                    # Next.js app directory
  /api                  # API routes
    /auth               # Authentication endpoints
    /tabs               # Tab management
    /payments           # Payment processing
    /venues             # Venue and menu data
  /(auth)               # Authentication pages
  /(app)                # Main application pages
/components             # React components
  /ui                   # shadcn/ui components
/lib                    # Utility functions
  prisma.ts            # Prisma client
  auth.ts              # NextAuth configuration
  stripe.ts            # Stripe integration
  pusher.ts            # Real-time updates
/prisma                 # Database schema and migrations
  schema.prisma        # Database schema
  seed.ts              # Seed data
/public                 # Static assets
```

## Key Features

✅ **Authentication**
- Email/password sign up and sign in
- Google OAuth (optional)
- Session management with NextAuth.js

✅ **User Experience**
- Home dashboard with recent activity
- QR code scanning (simulated)
- Menu browsing with categories
- Shopping cart
- Order placement

✅ **Tab Management**
- Create and view tabs
- Real-time order updates
- Bill splitting (even or custom)
- Payment processing

✅ **Payment**
- Stripe integration
- Multiple payment methods
- Apple Pay support (when configured)
- Receipt generation

✅ **Settings & Profile**
- User profile management
- Payment method management
- Transaction history
- Notification preferences

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_ctl status`
- Check your DATABASE_URL is correct
- Verify database exists: `psql -l`

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run prisma:generate
```

## Next Steps

1. Set up a production database (Supabase, Railway, etc.)
2. Configure Stripe webhooks for production
3. Set up real QR code generation for tables
4. Implement actual camera QR scanning
5. Add email notifications
6. Set up monitoring (Sentry)
7. Deploy to Vercel

## Support

For issues or questions:
- Check the main README.md
- Review the technical documentation
- Check Next.js docs: https://nextjs.org/docs
- Check Prisma docs: https://www.prisma.io/docs

Happy coding! 🎉

