'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface Splitter {
  id: string
  name: string
  amount: number
}

export default function SplitBillPage({ params }: { params: { tabId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even')
  const [numberOfPeople, setNumberOfPeople] = useState(2)
  const [customSplitters, setCustomSplitters] = useState<Splitter[]>([
    { id: '1', name: 'Person 1', amount: 0 },
    { id: '2', name: 'Person 2', amount: 0 },
  ])

  // Mock data - in real app, fetch from API
  const subtotal = 38.50
  const tax = 3.37
  const tipPercent = 18
  const tip = subtotal * (tipPercent / 100)
  const total = subtotal + tax + tip

  const handleEvenSplit = () => {
    const amountPerPerson = total / numberOfPeople
    toast({
      title: 'Bill Split',
      description: `Each person pays ${formatCurrency(amountPerPerson)}`,
    })
  }

  const handleAddSplitter = () => {
    setCustomSplitters([
      ...customSplitters,
      { id: Date.now().toString(), name: `Person ${customSplitters.length + 1}`, amount: 0 },
    ])
  }

  const handleRemoveSplitter = (id: string) => {
    if (customSplitters.length > 2) {
      setCustomSplitters(customSplitters.filter((s) => s.id !== id))
    }
  }

  const handleUpdateSplitter = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCustomSplitters(
      customSplitters.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const customTotal = customSplitters.reduce((sum, s) => sum + s.amount, 0)
  const isCustomBalanced = Math.abs(customTotal - total) < 0.01

  const handleProceed = async () => {
    if (splitType === 'custom' && !isCustomBalanced) {
      toast({
        title: 'Error',
        description: 'Split amounts must equal the total',
        variant: 'destructive',
      })
      return
    }

    // In real app, create split records via API
    toast({
      title: 'Split Created',
      description: 'Each person can now pay their share',
    })

    router.push(`/tab/${params.tabId}/payment`)
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
          <h1 className="ml-4 text-2xl font-bold">Split Bill</h1>
        </div>

        {/* Total Amount */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Bill</p>
              <p className="text-3xl font-bold">{formatCurrency(total)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Split Type Selection */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Split Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className={`cursor-pointer transition-colors ${
                splitType === 'even' ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setSplitType('even')}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold">Even Split</p>
                <p className="text-xs text-gray-600 mt-1">Divide equally</p>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-colors ${
                splitType === 'custom' ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setSplitType('custom')}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold">Custom Split</p>
                <p className="text-xs text-gray-600 mt-1">Set amounts</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Even Split */}
        {splitType === 'even' && (
          <Card>
            <CardHeader>
              <CardTitle>Number of People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setNumberOfPeople(Math.max(2, numberOfPeople - 1))}
                >
                  -
                </Button>
                <span className="text-3xl font-bold w-16 text-center">{numberOfPeople}</span>
                <Button
                  size="lg"
                  onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                >
                  +
                </Button>
              </div>
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Each person pays</p>
                <p className="text-2xl font-bold">{formatCurrency(total / numberOfPeople)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Split */}
        {splitType === 'custom' && (
          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Split Details</span>
                  <Button size="sm" variant="outline" onClick={handleAddSplitter}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Person
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customSplitters.map((splitter) => (
                  <div key={splitter.id} className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`name-${splitter.id}`} className="text-xs">
                        Name
                      </Label>
                      <Input
                        id={`name-${splitter.id}`}
                        value={splitter.name}
                        onChange={(e) =>
                          handleUpdateSplitter(splitter.id, 'name', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`amount-${splitter.id}`} className="text-xs">
                        Amount
                      </Label>
                      <Input
                        id={`amount-${splitter.id}`}
                        type="number"
                        step="0.01"
                        value={splitter.amount}
                        onChange={(e) =>
                          handleUpdateSplitter(splitter.id, 'amount', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    {customSplitters.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => handleRemoveSplitter(splitter.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Assigned</span>
                    <span
                      className={isCustomBalanced ? 'text-green-600' : 'text-red-600'}
                    >
                      {formatCurrency(customTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Bill Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  {!isCustomBalanced && (
                    <p className="mt-2 text-xs text-red-600">
                      Remaining: {formatCurrency(Math.abs(total - customTotal))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Proceed Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-md">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleProceed}
            disabled={splitType === 'custom' && !isCustomBalanced}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

