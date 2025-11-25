'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const total = searchParams.get('total')
  const venueName = searchParams.get('venue')

  useEffect(() => {
    // Optional: Confetti or celebration animation
    const timer = setTimeout(() => {
      // Auto-redirect to home after 5 seconds
      // router.push('/home')
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="container mx-auto max-w-md">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500 p-6">
            <Check className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your tab has been closed and paid</p>
        </div>

        {/* Payment Details */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            {venueName && (
              <div className="text-center pb-4 border-b">
                <p className="text-sm text-gray-600">Venue</p>
                <p className="text-lg font-semibold">{decodeURIComponent(venueName)}</p>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-4xl font-bold text-green-600">
                {total ? formatCurrency(parseFloat(total)) : '$0.00'}
              </p>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                A receipt has been sent to your email
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/home">
            <Button className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
          
          <Link href="/history">
            <Button variant="outline" className="w-full" size="lg">
              View Receipt
            </Button>
          </Link>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Thank you for using BarTab! 🍻
          </p>
          <p className="text-xs text-gray-500 mt-2">
            We hope you had a great time
          </p>
        </div>
      </div>
    </div>
  )
}

