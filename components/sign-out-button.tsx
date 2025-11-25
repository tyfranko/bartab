'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' })
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 p-4 text-left text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut className="h-5 w-5" />
      <span>Sign Out</span>
    </button>
  )
}

