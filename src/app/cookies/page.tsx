import type { Metadata } from "next"
import Link from "next/link"
import { Cookie, Settings, Shield, Info, BarChart3, Target } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Cookie Policy - Amir Islamic Collections",
  description: "How we use cookies and similar tracking technologies on our Islamic e-commerce marketplace.",
  openGraph: {
    title: "Cookie Policy - Amir Islamic Collections",
    description: "Learn about how we use cookies to enhance your browsing experience.",
    url: `${APP_URL}/cookies`,
  },
}

const cookieTypes = [
  {
    icon: Info,
    name: "Essential Cookies",
    purpose: "Required for basic site functionality",
    examples: "Authentication, shopping cart, security",
    duration: "Session / Persistent",
  },
  {
    icon: BarChart3,
    name: "Analytics Cookies",
    purpose: "Help us understand how visitors use our site",
    examples: "Page visits, click tracking, conversion data",
    duration: "Up to 2 years",
  },
  {
    icon: Target,
    name: "Marketing Cookies",
    purpose: "Deliver relevant advertisements",
    examples: "Retargeting, ad performance, social media",
    duration: "Up to 90 days",
  },
  {
    icon: Settings,
    name: "Preference Cookies",
    purpose: "Remember your settings and choices",
    examples: "Language, currency, theme preference",
    duration: "Up to 1 year",
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Cookie Policy" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Cookie className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Cookie Policy</h1>
              <p className="text-muted-foreground mt-1">Last updated: January 1, 2026</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            We use cookies and similar technologies to improve your browsing
            experience, analyze traffic, and personalize content. This policy
            explains what cookies are and how we use them.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that websites store on your device
              (computer, tablet, smartphone) when you visit them. They are widely
              used to make websites work more efficiently and provide useful
              information to website owners. Cookies allow a website to recognize
              your device and remember your preferences, browsing history, and
              login status.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-6">How We Use Cookies</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {cookieTypes.map((cookie) => (
                <Card key={cookie.name} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                      <cookie.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{cookie.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{cookie.purpose}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><span className="font-medium">Examples:</span> {cookie.examples}</p>
                      <p><span className="font-medium">Duration:</span> {cookie.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              In addition to our own cookies, we may use third-party cookies from
              trusted partners for analytics and marketing:
              • Google Analytics: Website traffic analysis
              • Facebook Pixel: Ad performance measurement
              • Paystack: Payment processing (essential cookies only)
              • Cloudflare: Security and performance optimization

              These third parties have their own privacy policies governing the use
              of your data. We encourage you to review them.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              You can control and manage cookies in several ways:

              Browser Settings: Most browsers allow you to view, block, or delete
              cookies through your settings. Here are links to instructions for
              common browsers:
              • Google Chrome
              • Mozilla Firefox
              • Apple Safari
              • Microsoft Edge

              Cookie Banner: When you first visit our site, you can accept or decline
              non-essential cookies through our cookie consent banner.

              Opt-Out Tools: You can opt out of Google Analytics by installing the
              Google Analytics Opt-Out Browser Add-on.

              Please note that blocking essential cookies may affect the functionality
              of our website, particularly features like the shopping cart and
              account login.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Consent</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              By continuing to use our website, you consent to the use of cookies
              as described in this policy. For non-essential cookies, we obtain
              your explicit consent through our cookie consent banner before
              setting them.

              You can withdraw or change your consent at any time by adjusting
              your browser settings or using the cookie preference center
              available on our website.

              We respect your choice and will not set non-essential cookies
              without your permission.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices, legal requirements, or the technologies
              we use. We will notify you of material changes by posting the
              updated policy on this page with a revised "Last Updated" date.

              We encourage you to review this policy periodically to stay
              informed about how we use cookies.
            </p>
          </section>

          <Separator />

          <section>
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-premium/5 border p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Questions About Cookies?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have questions about our use of cookies or tracking
                    technologies, please contact our privacy team.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Privacy Team
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
