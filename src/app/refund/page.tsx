import type { Metadata } from "next"
import Link from "next/link"
import { RefreshCw, CreditCard, AlertTriangle, CheckCircle2, XCircle, FileText, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Refund Policy - Amir Islamic Collections",
  description: "Our fair and transparent refund and return policy. Learn about eligibility, timelines, and the refund process for your Islamic products.",
  openGraph: {
    title: "Refund Policy - Amir Islamic Collections",
    description: "Hassle-free returns and refunds for your peace of mind.",
    url: `${APP_URL}/refund`,
  },
}

const returnSteps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Contact us within 30 days of delivery through your account or email.",
  },
  {
    step: 2,
    title: "Get Approval",
    description: "We review your request and provide a return authorization within 24 hours.",
  },
  {
    step: 3,
    title: "Ship Item Back",
    description: "Pack the item securely and ship it back using our recommended carrier.",
  },
  {
    step: 4,
    title: "Inspection & Refund",
    description: "We inspect the returned item and process your refund within 5-10 business days.",
  },
]

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Refund Policy" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <RefreshCw className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Refund & Return Policy</h1>
              <p className="text-muted-foreground mt-1">Last updated: January 1, 2026</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Your satisfaction matters to us. We offer a fair and transparent
            return policy guided by Islamic principles of justice and consumer
            protection.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">30-Day Return Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              We want you to be completely satisfied with your purchase. If for any
              reason you are not happy, you may return most items within 30 days of
              delivery for a full refund or exchange. This policy reflects our
              commitment to fair dealing as taught in Islamic commerce.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6">Return Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {returnSteps.map((step) => (
                <Card key={step.step} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mb-3">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Eligibility Criteria</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Eligible for Return</h3>
                  <ul className="list-disc ml-5 mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>Items in original condition, unworn, unused, with all tags attached</li>
                    <li>Items in original packaging with all accessories</li>
                    <li>Defective or damaged items (we cover return shipping)</li>
                    <li>Incorrect items received (we cover return shipping)</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Not Eligible for Return</h3>
                  <ul className="list-disc ml-5 mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>Custom or personalized items (unless defective)</li>
                    <li>Digital products (once downloaded or accessed)</li>
                    <li>Final sale or clearance items</li>
                    <li>Intimate apparel (for hygiene reasons)</li>
                    <li>Items returned after 30 days of delivery</li>
                    <li>Items showing signs of wear, use, or damage by the customer</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Refund Timeline & Method</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Timeline</h3>
                  <p>Refunds are processed within 5-10 business days after we receive and inspect the returned item. The total time from initiating a return to receiving your refund is typically 10-20 business days depending on shipping time.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Method</h3>
                  <p>Refunds are issued to the original payment method. Card payments are refunded to the same card (3-5 business days to reflect). Bank transfers are processed to the original account (5-7 business days). Wallet/store credit is available immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Shipping Costs</h3>
                  <p>Original shipping costs are non-refundable unless the return is due to our error (wrong item sent, defective product). Return shipping costs are borne by the customer for change-of-mind returns.</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              We offer exchanges for size, color, or product variants subject to
              availability. Exchange requests follow the same process as returns:

              1. Initiate an exchange request within 30 days
              2. Return the original item (must meet eligibility criteria)
              3. We ship the replacement item once the return is processed

              For faster service, you may prefer to return the original item for a
              refund and place a new order for the desired item.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Defective or Wrong Items</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              If you receive a defective, damaged, or incorrect item, please contact
              us immediately. We will:

              1. Apologize for the inconvenience
              2. Provide a prepaid return shipping label
              3. Process a full refund or send a replacement promptly
              4. Offer a discount on your next purchase

              Please include photos of the damage or defect when contacting us to
              expedite the process. Claims for damage during transit must be
              reported within 48 hours of delivery.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              The following items are non-refundable and non-returnable:
              • Digital downloads and software (once accessed)
              • Gift cards and store credit
              • Custom/personalized items (barring manufacturing defects)
              • Perishable goods
              • Intimate apparel and undergarments
              • Items marked as "Final Sale"

              Items that have been used, washed, altered, or damaged by the customer
              will not be accepted for return and may be returned to the customer at
              their expense.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Your Rights Under Consumer Law
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              Nothing in this policy reduces your statutory rights under applicable
              consumer protection laws. If goods you purchased are faulty, not as
              described, or unfit for purpose, you are entitled to a remedy under
              the law regardless of our voluntary policy.

              This policy is designed to go beyond legal requirements in
              accommodating our customers, reflecting the Islamic principle that
              "the buyer and seller have the option of cancelling or confirming the
              transaction as long as they have not parted." (Hadith)
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Returns Team</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Have a question about returns or need help with a refund? We are
              here to assist you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Contact Returns & Refunds Team
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
