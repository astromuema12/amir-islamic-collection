"use client"

import { motion } from "framer-motion"
import { Phone, ExternalLink, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const INSTAGRAM_URL =
  "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=4rx6sc5"
const TIKTOK_URL =
  "https://www.tiktok.com/@amir.islamic.coll?_r=1&_t=ZS-98Lwhy4rQqw"
const PHONE_NUMBER = "+254769269694"
const PHONE_HREF = "tel:+254769269694"
const WHATSAPP_NUMBER = "+254 759 632162"
const WHATSAPP_HREF = "https://wa.me/254759632162"
const EMAIL_ADDRESS = "amirislamiccollections@gmail.com"
const EMAIL_HREF = "mailto:amirislamiccollections@gmail.com"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.05a4.84 4.84 0 0 1-1-.36z" />
    </svg>
  )
}

function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.03]"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern id="islamic-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0L40 20L20 40L0 20Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="0.3" fill="none" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.3" fill="none" />
      </pattern>
      <rect width="200" height="200" fill="url(#islamic-grid)" />
    </svg>
  )
}

export function ConnectWithUs() {
  const socialLinks = [
    {
      name: "Instagram",
      url: INSTAGRAM_URL,
      icon: InstagramIcon,
      gradient: "from-purple-500 via-pink-500 to-orange-400",
      hoverBg: "hover:bg-gradient-to-br hover:from-purple-500/10 hover:via-pink-500/10 hover:to-orange-400/10",
      label: "Follow us on Instagram",
    },
    {
      name: "TikTok",
      url: TIKTOK_URL,
      icon: TikTokIcon,
      gradient: "from-black via-gray-800 to-pink-500",
      hoverBg: "hover:bg-gradient-to-br hover:from-black/10 hover:via-gray-800/10 hover:to-pink-500/10",
      label: "Follow us on TikTok",
    },
  ]

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#0d665e] to-[#0a4f48]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 sm:p-12 lg:p-16 overflow-hidden"
        >
          <IslamicPattern />

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-medium text-[#D4AF37] backdrop-blur-sm mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  Stay Connected
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white premium-heading"
              >
                Connect With{" "}
                <span className="text-[#D4AF37]">Amir Islamic Collection</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-4 text-white/70 max-w-lg mx-auto leading-relaxed"
              >
                Stay connected with us for the latest Islamic clothing, modest
                fashion, exclusive collections, and special offers. Follow us on
                social media or contact us directly for orders and inquiries.
              </motion.p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="group"
              >
                <a
                  href={PHONE_HREF}
                  className="block h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#0d665e] border border-white/10 shadow-lg shadow-[#0F766E]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#0F766E]/30">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">Call Us</p>
                      <p className="text-[#D4AF37] font-medium mt-1 text-sm tracking-wide">
                        {PHONE_NUMBER}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/50 group-hover:text-[#D4AF37] transition-colors">
                      Tap to call
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              </motion.div>

              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="group"
              >
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#25D366]/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#25D366]/5 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] border border-white/10 shadow-lg shadow-[#25D366]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#25D366]/30">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">WhatsApp</p>
                      <p className="text-[#D4AF37] font-medium mt-1 text-sm tracking-wide">
                        {WHATSAPP_NUMBER}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/50 group-hover:text-[#25D366] transition-colors">
                      Chat on WhatsApp
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="group"
              >
                <a
                  href={EMAIL_HREF}
                  className="block h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#EA4335]/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-[#EA4335]/5 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EA4335] to-[#C5221F] border border-white/10 shadow-lg shadow-[#EA4335]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#EA4335]/30">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">Email Us</p>
                      <p className="text-[#D4AF37] font-medium mt-1 text-sm tracking-wide truncate max-w-[200px]">
                        {EMAIL_ADDRESS}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/50 group-hover:text-[#EA4335] transition-colors">
                      Send an email
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </a>
              </motion.div>

              {/* Social Media Cards */}
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="block h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${social.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                      >
                        <social.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {social.name}
                        </p>
                        <p className="text-white/50 text-sm mt-1">
                          Follow our latest
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/80 transition-colors">
                        Visit profile
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#c9a230] text-white hover:from-[#c9a230] hover:to-[#b8922a] shadow-lg shadow-[#D4AF37]/25 text-base gap-2 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5"
              >
                <a href="/contact">
                  Contact Us
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
