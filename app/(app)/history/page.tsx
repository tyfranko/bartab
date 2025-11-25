import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'

async function getUserTransactions(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      tabs: {
        where: {
          status: 'CLOSED',
        },
        orderBy: {
          closedAt: 'desc',
        },
        include: {
          venue: true,
          payment: true,
        },
      },
    },
  })

  return user?.tabs || []
}

function groupTransactionsByDate(transactions: any[]) {
  const groups: { [key: string]: any[] } = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.closedAt!)
    const dateKey = date.toDateString()

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
  })

  return Object.entries(groups).sort((a, b) => 
    new Date(b[1][0].closedAt).getTime() - new Date(a[1][0].closedAt).getTime()
  )
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const transactions = await getUserTransactions(session.user.email)
  const groupedTransactions = groupTransactionsByDate(transactions)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/home">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold">Transaction History</h1>
          </div>
        </div>

        {/* Filter Options (Future Enhancement) */}
        <div className="mb-6 flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="ghost" size="sm">This Month</Button>
          <Button variant="ghost" size="sm">Last 3 Months</Button>
        </div>

        {/* Transactions Grouped by Date */}
        {groupedTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No transactions yet</p>
              <Link href="/home">
                <Button className="mt-4">Start Your First Tab</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedTransactions.map(([dateKey, transactions]) => (
              <div key={dateKey}>
                <h2 className="mb-3 text-sm font-semibold text-gray-600">
                  {new Date(transactions[0].closedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{transaction.venue.name}</h3>
                              {transaction.payment?.status === 'SUCCEEDED' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Paid
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {formatDateTime(transaction.closedAt!)}
                            </p>
                            <div className="mt-2 flex items-center gap-4">
                              <span className="text-lg font-semibold">
                                {formatCurrency(transaction.total)}
                              </span>
                              {transaction.payment?.paymentMethod && (
                                <span className="text-sm text-gray-600">
                                  {/* Card •••• {transaction.payment.paymentMethod.last4} */}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="sm" className="h-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Download All Receipts */}
        {transactions.length > 0 && (
          <div className="mt-8">
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download All Receipts
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

