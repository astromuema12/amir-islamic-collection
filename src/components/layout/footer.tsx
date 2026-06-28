"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Lock,
  Truck,
  RefreshCw,
  HeadphonesIcon,
  ChevronRight,
  Loader2,
  Globe,
  MessageCircle,
  Camera,
  Play,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, CATEGORIES } from "@/lib/constants"

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Our Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/sitemap.xml", label: "Sitemap" },
]

const CUSTOMER_SERVICE = [
  { href: "/help", label: "Help Center" },
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns & Exchanges" },
  { href: "/track-order", label: "Track Order" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/account-deletion", label: "Account Deletion Policy" },
]

const SOCIAL_LINKS = [
  { href: "#", label: "Facebook", icon: Globe },
  { href: "#", label: "Twitter", icon: MessageCircle },
  { href: "#", label: "Instagram", icon: Camera },
  { href: "#", label: "Youtube", icon: Play },
  { href: "#", label: "LinkedIn", icon: Briefcase },
]

const PAYMENT_METHODS = [
  { name: "Visa", icon: CreditCard },
  { name: "Mastercard", icon: CreditCard },
  { name: "PayPal", icon: CreditCard },
  { name: "Apple Pay", icon: CreditCard },
  { name: "Google Pay", icon: CreditCard },
  { name: "Bank Transfer", icon: CreditCard },
]

const FEATURES = [
  { icon: Truck, title: "Free Shipping", description: "On orders over KES 5,000" },
  { icon: RefreshCw, title: "Easy Returns", description: "30-day return policy" },
  { icon: Lock, title: "Secure Payment", description: "100% secure checkout" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated customer support" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubscribing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubscribing(false)
    setSubscribed(true)
    setEmail("")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12 lg:py-16">
          <div className="lg:col-span-1 sm:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-primary">Amir</span>{" "}
                <span className="text-premium">Islamic</span>
                <span className="text-foreground"> Collections</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your trusted source for premium Islamic products. From prayer mats
              and Qur&rsquo;an to modest fashion and home decor, we bring you
              quality with barakah.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+254 800 AMIR ISLAM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>support@amirislamic.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 8).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View All
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {CUSTOMER_SERVICE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Newsletter</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Subscribe for exclusive deals, new arrivals, and Islamic inspiration.
              </p>
              {subscribed ? (
                <p className="text-sm text-success font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  JazakAllah khair! You&rsquo;re subscribed.
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 h-10 text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full gap-2"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-t">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 text-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{feature.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              We accept
            </p>
            <div className="flex items-center gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="flex h-8 w-12 items-center justify-center rounded border bg-muted/50"
                  title={method.name}
                >
                  <method.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>SSL Secure</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            Built with <Heart className="h-3 w-3 inline text-red-500" /> for the
            Ummah.
          </p>
          <p className="text-xs text-muted-foreground text-center italic">
            &ldquo;The best of you are those who are best to others.&rdquo;
            <br />
            <span className="not-italic text-[10px]">— Prophet Muhammad (PBUH)</span>
          </p>
        </div>
      </div>

      <Button
        onClick={scrollToTop}
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  )
}
