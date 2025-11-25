import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SignOutButton } from '@/components/sign-out-button'

async function getUserData(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      defaultTipPercent: true,
      pushNotifications: true,
      emailNotifications: true,
    },
  })
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const user = await getUserData(session.user.email)

  if (!user) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Settings</h1>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white text-2xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Link href="/settings/profile">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold text-gray-600">ACCOUNT</h3>
            <Card>
              <CardContent className="p-0">
                <Link href="/settings/profile">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <span>Profile Information</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
                <div className="border-t" />
                <Link href="/settings/payment-methods">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span>Payment Methods</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold text-gray-600">PREFERENCES</h3>
            <Card>
              <CardContent className="p-0">
                <Link href="/settings/notifications">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <span>Notifications</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
                <div className="border-t" />
                <Link href="/settings/tip">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Default Tip</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold text-gray-600">SUPPORT</h3>
            <Card>
              <CardContent className="p-0">
                <Link href="/settings/help">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-gray-600" />
                      <span>Help & Support</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
                <div className="border-t" />
                <Link href="/settings/privacy">
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <span>Privacy & Security</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sign Out */}
          <Card>
            <CardContent className="p-0">
              <SignOutButton />
            </CardContent>
          </Card>
        </div>

        {/* App Version */}
        <p className="mt-8 text-center text-sm text-gray-500">
          BarTab v0.1.0
        </p>
      </div>
    </div>
  )
}

