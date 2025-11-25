'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function PaymentPage({ params }: { params: { tabId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  // Mock data - in a real app, fetch from API
  const total = 45.67
  const paymentMethods = [
    { id: '1', type: 'card', brand: 'Visa', last4: '4242', isDefault: true },
    { id: '2', type: 'card', brand: 'Mastercard', last4: '5555', isDefault: false },
  ]

  const handlePay = async () => {
    if (!selectedMethod) {
      toast({
        title: 'Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      title: 'Payment Successful!',
      description: 'Your tab has been closed.',
    })

    router.push('/payment/success')
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href={`/tab/${params.tabId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Payment</h1>
        </div>

        {/* Amount */}
        <Card className="mb-6 bg-black text-white">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-gray-300 mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold">{formatCurrency(total)}</p>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Payment Method</h2>
          
          {/* Apple Pay */}
          <Card 
            className={`mb-3 cursor-pointer transition-colors ${
              selectedMethod === 'apple_pay' ? 'ring-2 ring-black' : ''
            }`}
            onClick={() => setSelectedMethod('apple_pay')}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                  <span className="text-white">🍎</span>
                </div>
                <span className="font-medium">Apple Pay</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>

          {/* Saved Cards */}
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`mb-3 cursor-pointer transition-colors ${
                selectedMethod === method.id ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">{method.brand} •••• {method.last4}</div>
                    {method.isDefault && (
                      <span className="text-xs text-gray-600">Default</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          ))}

          {/* Add New Card */}
          <Button variant="outline" className="w-full">
            + Add New Card
          </Button>
        </div>

        {/* Security Badge */}
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm text-green-800">
            🔒 Payment securely encrypted
          </p>
        </div>

        {/* Bill Details (Expandable) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bill Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(38.50)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatCurrency(3.37)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tip (18%)</span>
              <span>{formatCurrency(3.80)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pay Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePay}
            disabled={isProcessing || !selectedMethod}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

