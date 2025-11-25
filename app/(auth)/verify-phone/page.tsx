'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

function VerifyPhoneContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const phone = searchParams.get('phone') || ''
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    // Send initial verification code
    sendVerificationCode()
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const sendVerificationCode = async () => {
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) {
        throw new Error('Failed to send verification code')
      }

      toast({
        title: 'Code Sent',
        description: `Verification code sent to ${phone}`,
      })
    } catch (error) {
      console.error('Send verification error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send verification code',
        variant: 'destructive',
      })
    }
  }

  const handleResend = () => {
    setCountdown(60)
    setCanResend(false)
    sendVerificationCode()
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when all digits entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('')
    
    if (codeToVerify.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter all 6 digits',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: codeToVerify }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      toast({
        title: 'Phone Verified!',
        description: 'Your account is ready',
      })

      router.push('/signin')
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Invalid code',
        variant: 'destructive',
      })
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to<br />
            <span className="font-semibold text-black">{phone}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={() => handleVerify()}
              className="w-full"
              size="lg"
              disabled={isLoading || code.some(d => d === '')}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  className="text-sm"
                >
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-gray-600">
                  Resend code in {countdown}s
                </p>
              )}
            </div>

            <div className="text-center">
              <Link href="/signin">
                <Button variant="ghost" className="text-sm">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPhoneContent />
    </Suspense>
  )
}

