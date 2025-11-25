import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Phone, HelpCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function HelpPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/signin')
  }

  const faqs = [
    {
      question: 'How do I scan a QR code?',
      answer: 'Open the app and tap the "Scan QR Code" button on the home screen. Point your camera at the QR code on your table.',
    },
    {
      question: 'How do I split a bill?',
      answer: 'On your active tab, tap "Split Bill" and choose either even split or custom amounts for each person.',
    },
    {
      question: 'Can I add a tip?',
      answer: 'Yes! You can adjust your tip percentage before paying on the payment screen.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard encryption and never store your full card details.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-md px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Help & Support</h1>
        </div>

        {/* Contact Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>We&apos;re here to help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm text-gray-600">Average response: 2 min</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-600">support@bartab.com</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-600">1-800-BARTAB (24/7)</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="mb-2 flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600" />
                  <div>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

