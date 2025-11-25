'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function PaymentSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Mock data
  const transaction = {
    id: 'txn_123456',
    amount: 45.67,
    venue: 'The Cozy Pub',
    date: new Date(),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-12">
        {/* Success Animation */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">Thank you for using BarTab</p>
        </div>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-3xl font-bold">{formatCurrency(transaction.amount)}</p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Venue</span>
                <span className="font-medium">{transaction.venue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">{formatDateTime(transaction.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium font-mono text-xs">{transaction.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Request */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="mb-3 text-center font-semibold">How was your experience?</h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  ⭐
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full" size="lg">
            <Share2 className="mr-2 h-5 w-5" />
            Share Receipt
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Receipt
          </Button>
          <Link href="/home">
            <Button className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Auto-redirect message */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Your tab has been closed successfully
        </p>
      </div>
    </div>
  )
}

