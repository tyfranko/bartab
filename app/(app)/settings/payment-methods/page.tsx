import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function PaymentMethodsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  // Mock data - in real app, fetch from database
  const paymentMethods = [
    { id: '1', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2025, isDefault: true },
    { id: '2', brand: 'Mastercard', last4: '5555', expiryMonth: 8, expiryYear: 2026, isDefault: false },
  ]

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
          <h1 className="ml-4 text-2xl font-bold">Payment Methods</h1>
        </div>

        {/* Add New Card */}
        <Button className="mb-4 w-full" variant="outline">
          <Plus className="mr-2 h-5 w-5" />
          Add New Card
        </Button>

        {/* Saved Cards */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <CreditCard className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{method.brand} •••• {method.last4}</div>
                      <div className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                      {method.isDefault && (
                        <span className="text-xs text-green-600">✓ Default</span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            <strong>Secure payments</strong>
          </p>
          <p className="mt-1 text-xs text-blue-800">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>
    </div>
  )
}

