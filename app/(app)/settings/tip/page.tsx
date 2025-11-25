import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getUserPreferences(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      defaultTipPercent: true,
    },
  })
}

export default async function DefaultTipPage() {
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
          <h1 className="ml-4 text-2xl font-bold">Default Tip</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Preferred Tip Percentage</CardTitle>
            <CardDescription>This will be pre-selected when closing your tab</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[10, 15, 18, 20, 25, 30].map((percent) => (
                <button
                  key={percent}
                  className={`rounded-lg border-2 py-4 font-semibold transition-colors ${
                    percent === preferences.defaultTipPercent
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                  disabled
                >
                  {percent}%
                </button>
              ))}
            </div>

            <div className="mt-6">
              <Button className="w-full" disabled>
                Save Preference
              </Button>
              <p className="mt-2 text-center text-xs text-gray-600">
                Tip settings coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip Info</strong>
          </p>
          <p className="mt-1 text-xs text-blue-800">
            Your default tip will be automatically suggested, but you can always change it when closing your tab.
          </p>
        </div>
      </div>
    </div>
  )
}

