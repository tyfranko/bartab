import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PrivacyPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
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
          <h1 className="ml-4 text-2xl font-bold">Privacy & Security</h1>
        </div>

        {/* Security Overview */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Your Account is Protected
            </CardTitle>
            <CardDescription>
              We use industry-standard security measures to protect your data
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Security Settings */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-gray-600">Update your password</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">→</div>
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add extra security</div>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                Coming Soon
              </span>
            </button>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Privacy Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-gray-600">How we handle your data</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">→</div>
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Download Your Data</div>
                  <div className="text-sm text-gray-600">Get a copy of your information</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">→</div>
            </button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <button className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-left transition-colors hover:bg-red-100">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-600">Delete Account</div>
                  <div className="text-sm text-red-500">Permanently delete your account</div>
                </div>
              </div>
              <div className="text-sm text-red-500">→</div>
            </button>
          </CardContent>
        </Card>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>Your data is safe with us</strong>
          </p>
          <p className="mt-1 text-xs text-blue-800">
            We use bank-level encryption to protect your personal and payment information. 
            We never sell your data to third parties.
          </p>
        </div>
      </div>
    </div>
  )
}

