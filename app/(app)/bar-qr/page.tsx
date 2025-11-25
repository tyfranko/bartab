'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import QRCode from 'qrcode'

export default function BarQRPage() {
  const { data: session } = useSession()
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      // Generate QR code with user ID
      const qrData = JSON.stringify({
        type: 'bartab_user',
        email: session.user.email,
        name: session.user.name,
      })
      
      QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCode)
    }
  }, [session])

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="logo-text text-2xl">
          <span className="logo-bar">Bar</span>
          <span className="logo-tab">Tab</span>
          <span className="logo-tm">™</span>
        </div>
        <Link href="/home">
          <Button variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* QR Code Display */}
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div>
            <h1 className="text-2xl font-bold">At The Bar</h1>
            <p className="mt-2 text-gray-600">
              Show this QR code to the bartender to open your tab
            </p>
          </div>

          {/* QR Code */}
          <div className="mx-auto rounded-2xl bg-white p-6 shadow-2xl">
            {qrCode ? (
              <img src={qrCode} alt="Bar Tab QR Code" className="w-full" />
            ) : (
              <div className="flex h-96 w-96 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-sm text-gray-600">{session?.user?.email}</p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm">
            <p className="font-medium text-blue-900">How it works:</p>
            <ol className="mt-2 space-y-1 text-left text-blue-800">
              <li>1. Show this QR code to the bartender</li>
              <li>2. They&apos;ll scan it to open your tab</li>
              <li>3. Order throughout the night</li>
              <li>4. Close your tab when you&apos;re ready to leave</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

