import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

async function getUserPreferences(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      pushNotifications: true,
      emailNotifications: true,
      defaultTipPercent: true,
    },
  })
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const preferences = await getUserPreferences(session.user.email)

  if (!preferences) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Notifications</h1>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Receive notifications on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Order Updates</Label>
                <p className="text-sm text-gray-600">When your order is ready</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={preferences.pushNotifications}
                className="h-5 w-5"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Payment Confirmations</Label>
                <p className="text-sm text-gray-600">When payments are processed</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={preferences.pushNotifications}
                className="h-5 w-5"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Promotions</Label>
                <p className="text-sm text-gray-600">Special offers and deals</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={false}
                className="h-5 w-5"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Receive updates via email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Transaction Receipts</Label>
                <p className="text-sm text-gray-600">Email receipts for all payments</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={preferences.emailNotifications}
                className="h-5 w-5"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Weekly Summary</Label>
                <p className="text-sm text-gray-600">Summary of your activity</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={false}
                className="h-5 w-5"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Tip</CardTitle>
            <CardDescription>Your preferred tip percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[15, 18, 20, 25].map((percent) => (
                <button
                  key={percent}
                  className={`flex-1 rounded-lg border-2 py-3 font-semibold transition-colors ${
                    percent === preferences.defaultTipPercent
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                  disabled
                >
                  {percent}%
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button className="w-full" disabled>
            Save Preferences
          </Button>
          <p className="mt-2 text-center text-xs text-gray-600">
            Notification settings coming soon
          </p>
        </div>
      </div>
    </div>
  )
}

