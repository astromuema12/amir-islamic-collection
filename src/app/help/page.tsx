import type { Metadata } from "next"
import Link from "next/link"
import { HelpCircle, Mail, Phone, MessageCircle, FileText, ShoppingBag, Truck, RefreshCw, Shield } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Help Center - ${APP_NAME}`,
  description: `Find answers to common questions and get support from the ${APP_NAME} team.`,
  openGraph: {
    title: `Help Center - ${APP_NAME}`,
    description: "We are here to help with your questions, orders, and support needs.",
    url: `${APP_URL}/help`,
  },
}

const helpTopics = [
  { icon: ShoppingBag, title: "Orders", description: "Placing, modifying, or cancelling orders", href: "/orders" },
  { icon: Truck, title: "Shipping", description: "Delivery times, rates, and tracking", href: "/shipping" },
  { icon: RefreshCw, title: "Returns & Refunds", description: "Return policy and refund process", href: "/refund" },
  { icon: Shield, title: "Account & Privacy", description: "Account settings and data protection", href: "/privacy" },
  { icon: FileText, title: "Payment", description: "Payment methods and billing", href: "/faq" },
  { icon: HelpCircle, title: "FAQ", description: "Frequently asked questions", href: "/faq" },
]

const contactMethods = [
  { icon: Mail, title: "Email Us", description: "support@amirislamic.com", action: "Send an email" },
  { icon: Phone, title: "Call Us", description: "+254769269694", action: "Call now" },
  { icon: MessageCircle, title: "Live Chat", description: "Available 24/7", action: "Start chat" },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Help Center" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Help Center</h1>
              <p className="text-muted-foreground mt-1">How can we help you today?</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Find answers to common questions or reach out to our support team.
            We are here to assist you with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Browse by Topic</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpTopics.map((topic) => (
                <Link key={topic.title} href={topic.href}>
                  <Card className="border-2 hover:border-primary/50 transition-colors h-full">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                        <topic.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {contactMethods.map((method) => (
                <Card key={method.title} className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <p className="text-sm font-medium text-primary">{method.action}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-premium/5 border p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Still Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist you. We typically respond
                  within 2 hours during business hours.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
