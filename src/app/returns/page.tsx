import type { Metadata } from "next"
import Link from "next/link"
import { RefreshCw, ArrowRight } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Returns & Exchanges - ${APP_NAME}`,
  description: "Learn about our return and exchange policy for Islamic products.",
  openGraph: {
    title: `Returns & Exchanges - ${APP_NAME}`,
    description: "Hassle-free returns and exchanges for your peace of mind.",
    url: `${APP_URL}/returns`,
  },
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Returns & Exchanges" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <RefreshCw className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Returns & Exchanges</h1>
              <p className="text-muted-foreground mt-1">Last updated: January 1, 2026</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            We want you to be completely satisfied with your purchase. Our return
            and exchange policy is designed to be fair, transparent, and hassle-free.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">30-Day Return Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may return most items within 30 days of delivery for a full refund
              or exchange. Items must be in original condition with all tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
            <ol className="list-decimal ml-5 space-y-2 text-muted-foreground">
              <li>Log in to your account and navigate to your orders</li>
              <li>Select the order containing the item you wish to return</li>
              <li>Click &quot;Request Return&quot; and follow the instructions</li>
              <li>Pack the item securely with all original packaging</li>
              <li>Ship the item back using the provided return label</li>
            </ol>
          </section>

          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-premium/5 border p-6 sm:p-8 text-center">
            <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Full Refund Policy Details</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For complete details on eligibility, timelines, and exceptions,
              please see our full Refund Policy.
            </p>
            <Link
              href="/refund"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Refund Policy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
