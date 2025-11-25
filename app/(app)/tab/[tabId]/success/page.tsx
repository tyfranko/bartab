'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const total = searchParams.get('total')
  const venueName = searchParams.get('venue')
  const tabId = searchParams.get('tabId')
  const venueId = searchParams.get('venueId')

  const [showRating, setShowRating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Rating state
  const [overallRating, setOverallRating] = useState(0)
  const [drinksRating, setDrinksRating] = useState(0)
  const [vibeRating, setVibeRating] = useState(0)
  const [serverRating, setServerRating] = useState(0)
  const [serviceSpeed, setServiceSpeed] = useState('')
  const [crowdLevel, setCrowdLevel] = useState('')
  const [serverName, setServerName] = useState('')
  const [review, setReview] = useState('')

  const handleSubmitRating = async () => {
    if (overallRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide an overall rating',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          tabId,
          overallRating,
          drinksRating: drinksRating || null,
          vibeRating: vibeRating || null,
          serverRating: serverRating || null,
          serviceSpeed: serviceSpeed || null,
          crowdLevel: crowdLevel || null,
          serverName: serverName || null,
          review: review || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit rating')
      }

      toast({
        title: 'Thank You!',
        description: 'Your feedback has been submitted',
      })

      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit rating. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number
    onChange: (value: number) => void
    label: string 
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  if (showRating) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="container mx-auto max-w-md">
          <h1 className="text-2xl font-bold mb-6">Rate Your Experience</h1>

          <div className="space-y-6 mb-24">
            {/* Overall Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating
                  value={overallRating}
                  onChange={setOverallRating}
                  label="How was your overall experience?"
                />
              </CardContent>
            </Card>

            {/* Server Name & Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Who was your server tonight?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter name"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setServerName('Unknown')}
                    >
                      Unknown
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <StarRating
                      value={serverRating}
                      onChange={setServerRating}
                      label="Rate your server"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drinks Rating */}
            <Card>
              <CardHeader>
                <CardTitle>How were the drinks?</CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating
                  value={drinksRating}
                  onChange={setDrinksRating}
                  label="Rate the drinks"
                />
              </CardContent>
            </Card>

            {/* Bar Vibe */}
            <Card>
              <CardHeader>
                <CardTitle>Rate the bar vibe</CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating
                  value={vibeRating}
                  onChange={setVibeRating}
                  label="How was the atmosphere?"
                />
              </CardContent>
            </Card>

            {/* Service Speed */}
            <Card>
              <CardHeader>
                <CardTitle>How fast was the service?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {['Fast', 'Moderate', 'Slow'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setServiceSpeed(speed)}
                      className={`rounded-lg border-2 py-3 font-semibold transition-colors ${
                        serviceSpeed === speed
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crowd Level */}
            <Card>
              <CardHeader>
                <CardTitle>How busy was it?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {['Busy', 'Moderate', 'Empty'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCrowdLevel(level)}
                      className={`rounded-lg border-2 py-3 font-semibold transition-colors ${
                        crowdLevel === level
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Comments (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button - Fixed */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
            <div className="container mx-auto max-w-md space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitRating}
                disabled={isSubmitting || overallRating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push('/home')}
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowRating(true)}
          >
            Rate Your Experience ⭐
          </Button>

          <Link href="/home">
            <Button variant="outline" className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
          
          <Link href="/history">
            <Button variant="ghost" className="w-full" size="lg">
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
