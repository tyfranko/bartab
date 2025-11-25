'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function ScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartScan = async () => {
    try {
      setIsScanning(true)
      setError(null)

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      
      // In a real implementation, you'd use a QR code scanner library here
      // For now, we'll simulate a scan after 2 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        
        // Simulate successful scan - redirect to a test venue/table
        toast({
          title: 'QR Code Scanned',
          description: 'Opening your tab...',
        })
        
        // This would normally parse the QR code and extract venue/table IDs
        router.push('/tab/new?venueId=test&tableId=test')
      }, 2000)

    } catch (err) {
      console.error('Camera error:', err)
      setError('Unable to access camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const handleManualEntry = () => {
    toast({
      title: 'Manual Entry',
      description: 'This feature is coming soon!',
    })
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scan QR Code</h1>
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Your Tab</CardTitle>
          <CardDescription>
            Scan the QR code on your table to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <>
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleStartScan} 
                className="w-full"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Open Camera
              </Button>

              <Button 
                onClick={handleManualEntry} 
                variant="outline"
                className="w-full"
              >
                Enter Table Code Manually
              </Button>
            </>
          ) : (
            <>
              <div className="flex h-64 items-center justify-center rounded-lg bg-black">
                <div className="text-center">
                  <div className="mb-4 h-48 w-48 border-4 border-white opacity-50"></div>
                  <p className="text-white">Position QR code within frame</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setIsScanning(false)
                  setError(null)
                }}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}

          <div className="rounded-lg bg-blue-50 p-4 text-sm">
            <p className="font-medium text-blue-900">📱 How it works</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-blue-800">
              <li>Scan the QR code at your table</li>
              <li>Browse the menu and add items</li>
              <li>Pay directly from your phone</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

