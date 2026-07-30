import type { Metadata } from "next"
import Link from "next/link"
import { Truck, Package, MapPin, Clock, AlertCircle, Globe, CheckCircle2 } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Shipping Policy - Amir Islamic Collections",
  description: "Learn about our shipping rates, delivery times, tracking, and domestic/international shipping policies for your Islamic products.",
  openGraph: {
    title: "Shipping Policy - Amir Islamic Collections",
    description: "Fast and reliable shipping for your premium Islamic products across Kenya and internationally.",
    url: `${APP_URL}/shipping`,
  },
}

const shippingMethods = [
  {
    name: "Standard Shipping",
    price: "KES 150",
    days: "5-7 business days",
    icon: Package,
    description: "Reliable delivery to your doorstep. Free on orders over KES 5,000.",
  },
  {
    name: "Express Shipping",
    price: "KES 350",
    days: "2-3 business days",
    icon: Clock,
    description: "Priority handling and faster delivery for urgent orders.",
  },
  {
    name: "Next Day Delivery",
    price: "KES 500",
    days: "1 business day",
    icon: Truck,
    description: "Order before 12 PM for delivery the next business day (Nairobi only).",
  },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Shipping Policy" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Truck className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Shipping Policy</h1>
              <p className="text-muted-foreground mt-1">Last updated: January 1, 2026</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            We strive to deliver your orders promptly and reliably across Kenya
            and internationally. Here is everything you need to know about our
            shipping process.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Shipping Methods & Rates</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {shippingMethods.map((method) => (
                <Card key={method.name} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-1">{method.price}</p>
                    <p className="text-sm text-muted-foreground mb-2">{method.days}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Free standard shipping on all orders above KES 5,000
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              Orders are processed within 1-2 business days after payment confirmation.
              Processing may take longer during peak seasons (Ramadan, Eid) or for
              custom/personalized items.

              Business days are Monday through Friday, excluding public holidays.
              Orders placed on weekends or holidays are processed the next business day.

              You will receive a confirmation email once your order ships, along with
              tracking information where available.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Domestic Shipping (Kenya)</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Delivery Zones</h3>
                  <p>We deliver to all 47 counties in Kenya. Delivery times vary by location:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Nairobi Metro: 1-3 business days (express available)</li>
                    <li>County Capitals: 3-5 business days</li>
                    <li>Remote/Rural Areas: 5-7 business days</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Carriers</h3>
                  <p>We partner with trusted courier services including DHL, FedEx, UPS, and local Kenyan carriers to ensure reliable delivery across all zones.</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Available Destinations</h3>
                  <p>We ship to select countries worldwide including the UK, USA, Canada, UAE, Saudi Arabia, Malaysia, Indonesia, and most African nations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Import Duties & Customs</h3>
                  <p>
                    International orders may be subject to import duties, customs fees, and taxes
                    imposed by the destination country. These charges are the buyer&apos;s responsibility
                    and are not included in the product price or shipping cost. Customs policies vary
                    widely, so please check with your local customs office before ordering.
                  </p>
                </div>
              </div>
              <p className="text-sm">International shipping typically takes 7-21 business days depending on the destination and selected shipping method.</p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              Once your order is shipped, you will receive a tracking number via email and SMS
              (if provided). You can track your order through:

              • The tracking link in your shipping confirmation email
              • Your account dashboard under &quot;My Orders&quot;
              • Our Track Order page (enter your order number and email)

              Tracking availability depends on the shipping method and carrier. Standard
              shipping may not include real-time tracking for all zones.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              Certain items may have shipping restrictions due to size, weight, or regulatory
              requirements:
              • Large items (Qur&apos;an stands, furniture) may require special shipping arrangements
              • Perfumes and liquids have restrictions for international air shipping
              • Fragile items are packed with extra care but may require additional shipping charges
              • Some remote areas may not be serviceable by our carriers

              We will notify you if any restrictions apply to your order before shipping.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Missing or Damaged Packages</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              If your package arrives damaged or is missing:
              1. Document the damage with photos (for damaged items)
              2. Contact us within 48 hours of delivery
              3. We will arrange a replacement or refund

              If your package shows as delivered but you have not received it:
              1. Check with neighbors or building management
              2. Contact the carrier with your tracking number
              3. Contact us and we will initiate an investigation
              4. We will work with the carrier to resolve the issue

              We are committed to ensuring you receive your order in perfect condition.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Shipping Support</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Have a question about your shipment? Our shipping team is here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Contact Shipping Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
