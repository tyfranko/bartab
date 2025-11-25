'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/signin')
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="logo-text text-5xl text-white animate-pulse">
          <span className="logo-bar">Bar</span>
          <span className="logo-tab">Tab</span>
          <span className="logo-tm">™</span>
        </h1>
      </div>
    </div>
  )
}

