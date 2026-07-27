"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageCircle, Globe, Camera, Play, Briefcase, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const contactInfo = [
  {
    icon: MapPin,
    label: "Our Address",
    value: "Kimathi Street,\nNairobi, Kenya",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+254769269694"
    href: "tel:+2548002647526",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@amirislamic.com\ninfo@amirislamic.com",
    href: "mailto:support@amirislamic.com",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed",
  },
]

const socialLinks = [
  { label: "Facebook", icon: MessageCircle, href: "#" },
  { label: "Twitter / X", icon: Globe, href: "#" },
  { label: "Instagram", icon: Camera, href: "#" },
  { label: "YouTube", icon: Play, href: "#" },
  { label: "LinkedIn", icon: Briefcase, href: "#" },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setIsSuccess(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Contact Us" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Us</h1>
              <p className="text-muted-foreground mt-1">We would love to hear from you</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Have a question, feedback, or need assistance? Our team is here to
            help. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-sm text-muted-foreground">
                      JazakAllah khair! We have received your message and will respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none mb-1.5 block text-foreground">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Order Inquiry">Order Inquiry</option>
                        <option value="Shipping Question">Shipping Question</option>
                        <option value="Returns & Refunds">Returns & Refunds</option>
                        <option value="Product Question">Product Question</option>
                        <option value="Seller Inquiry">Seller Inquiry</option>
                        <option value="Partnership">Partnership Opportunity</option>
                        <option value="Feedback">Feedback / Suggestion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <Textarea
                      label="Message"
                      name="message"
                      placeholder="How can we help you?"
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card className="border-2 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[21/9] bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Map Placeholder — Nairobi, Kenya</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Kimathi Street, Nairobi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {contactInfo.map((info) => (
              <Card key={info.label} className="border-2">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm mb-1">{info.label}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-2">
              <CardContent className="p-5">
                <h3 className="font-medium text-sm mb-3">Follow Us</h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-5">
                <h3 className="font-medium text-sm mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days. For
                  urgent matters, please call our support line.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
