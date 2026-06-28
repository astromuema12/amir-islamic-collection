import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, Heart, Users, Globe, Mail } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Careers - ${APP_NAME}`,
  description: `Join the ${APP_NAME} team and help us serve the Ummah with quality Islamic products.`,
  openGraph: {
    title: `Careers - ${APP_NAME}`,
    description: "Build your career with a purpose-driven company serving the Muslim community.",
    url: `${APP_URL}/careers`,
  },
}

const values = [
  { icon: Heart, title: "Faith-Driven", description: "Our work is guided by Islamic principles of integrity and service." },
  { icon: Users, title: "Community Focused", description: "We build products that bring value to the Ummah." },
  { icon: Globe, title: "Global Reach", description: "We serve customers worldwide with quality and care." },
  { icon: Briefcase, title: "Growth Mindset", description: "We invest in our team's professional and personal development." },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Careers" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Careers</h1>
              <p className="text-muted-foreground mt-1">Join our mission to serve the Ummah</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            At {APP_NAME}, we are building a team of passionate individuals dedicated
            to providing premium Islamic products with exceptional service.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value) => (
                <Card key={value.title} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">No Open Positions Right Now</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not have any open positions at this time, but we are always
              interested in connecting with talented individuals who share our vision.
              Send us your resume and we will keep you in mind for future opportunities.
            </p>
          </section>

          <Separator />

          <section className="rounded-2xl bg-gradient-to-br from-primary/5 to-premium/5 border p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Get in Touch</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send your resume and a brief introduction to our hiring team.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
