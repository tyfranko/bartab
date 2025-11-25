import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppProviders } from '@/components/app-providers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AppProviders>
  )
}

