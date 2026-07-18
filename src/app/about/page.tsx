import type { Metadata } from "next"
import Link from "next/link"
import { Heart, Target, Eye, Award, Users, BookOpen, Star, MessageCircle, Store, HandHelping } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us - Amir Islamic Collections",
  description: "Learn about the mission, vision, and values behind Amir Islamic Collections. We are dedicated to providing premium Islamic products with barakah.",
  openGraph: {
    title: "About Us - Amir Islamic Collections",
    description: APP_DESCRIPTION,
    url: `${APP_URL}/about`,
  },
}

const values = [
  {
    icon: Star,
    title: "Ihsan (Excellence)",
    description: "We strive for excellence in everything we do, from product quality to customer service, following the Quranic principle of doing our best.",
  },
  {
    icon: HandHelping,
    title: "Amanah (Trust)",
    description: "Trust is the foundation of our business. We are honest, transparent, and reliable in all our dealings with customers, sellers, and partners.",
  },
  {
    icon: Heart,
    title: "Adl (Justice)",
    description: "We treat everyone fairly, ensuring just prices, honest product descriptions, and equitable treatment for all, regardless of background.",
  },
  {
    icon: Users,
    title: "Ummah (Community)",
    description: "We are building more than a marketplace — we are strengthening the Muslim community by supporting ethical businesses and charitable causes.",
  },
  {
    icon: BookOpen,
    title: "Ilm (Knowledge)",
    description: "We promote Islamic knowledge and education through our blog, product descriptions, and curated collections that enrich the mind and soul.",
  },
  {
    icon: Award,
    title: "Barakah (Blessing)",
    description: "We seek barakah in our earnings by conducting business ethically, paying dues on time, and giving back through charity (Sadaqah).",
  },
]

const team: { name: string; role: string; bio: string; initials: string }[] = []

const milestones: { year: string; event: string }[] = []

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "About Us" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About Us</h1>
              <p className="text-muted-foreground mt-1">Our story, mission, and values</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="space-y-16">
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Serving the Ummah with{" "}
              <span className="text-primary">Excellence</span> and{" "}
              <span className="text-premium">Barakah</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {APP_NAME} was founded with a simple yet powerful vision: to make
              premium Islamic products accessible to every Muslim home. We are more
              than an e-commerce marketplace — we are a community dedicated to
              helping you practice your faith with beauty, quality, and convenience.
            </p>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                Our Story
              </span>
            </div>
          </div>

          <section>
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">How It All Began</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    In 2022, our founder Abdullahi Ibrahim noticed a gap in the
                    market: Muslim families in Kenya and across Africa struggled
                    to find high-quality, authentic Islamic products in one place.
                    Prayer mats were imported at high costs, Qur&rsquo;ans were
                    hard to find in beautiful editions, and modest fashion
                    options were limited.
                  </p>
                  <p>
                    What started as a small online store selling prayer mats and
                    Qur&rsquo;ans quickly grew into a comprehensive marketplace
                    serving thousands of customers. We partnered with trusted
                    suppliers, artisans, and sellers who share our commitment to
                    quality and Islamic values.
                  </p>
                  <p>
                    Today, {APP_NAME} is a leading Islamic e-commerce platform
                    offering thousands of products across dozens of categories,
                    serving customers in Kenya and around the world. We remain
                    committed to our founding principles: quality, trust, and
                    service to the Ummah.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-premium/10 border flex items-center justify-center">
                  <div className="text-center p-8">
                    <Store className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-5xl font-bold text-primary">2022</p>
                    <p className="text-muted-foreground mt-2">Founded with faith</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                Our Milestones
              </span>
            </div>
          </div>

          <section>
            <div className="space-y-4">
              {milestones.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Milestones coming soon.</p>
              ) : (
                milestones.map((milestone) => (
                  <div
                    key={milestone.year}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {milestone.year}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-foreground">{milestone.event}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                Our Values
              </span>
            </div>
          </div>

          <section>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((value) => (
                <Card key={value.title} className="border-2 hover:border-primary/50 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                Our Team
              </span>
            </div>
          </div>

          <section>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 col-span-full">Team information coming soon.</p>
              ) : (
                team.map((member) => (
                  <Card key={member.name} className="border-2 text-center hover:border-primary/50 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-premium/20 mx-auto mb-4">
                        <span className="text-lg font-bold text-primary">{member.initials}</span>
                      </div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                Our Commitment
              </span>
            </div>
          </div>

          <section>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To provide the global Muslim community with convenient access
                    to premium, authentic Islamic products while promoting ethical
                    commerce, supporting Muslim entrepreneurs, and giving back
                    through charitable initiatives.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-premium/20 bg-gradient-to-br from-premium/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-premium/10">
                      <Eye className="h-5 w-5 text-premium" />
                    </div>
                    <h3 className="font-semibold">Our Vision</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To be the most trusted and beloved Islamic marketplace
                    worldwide, where every Muslim can find what they need for
                    their faith, home, and loved ones with ease and confidence.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-premium/5 border p-6 sm:p-8 mt-6">
              <div className="flex items-start gap-4">
                <HandHelping className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Giving Back (Sadaqah)</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A portion of every sale on our platform goes to charitable causes
                    supporting education, orphan care, and community development
                    across the Muslim world. We believe that business should be a
                    blessing (barakah) that extends beyond profit to benefit the
                    wider community. Together, we can make a difference.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied customers who trust us for their Islamic
              product needs.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground px-8 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Store className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
