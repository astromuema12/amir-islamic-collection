"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  ShoppingBag,
  Store,
  Star,
  Users,
  Package,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const stats = [
  { icon: Package, value: "10,000+", label: "Products" },
  { icon: Store, value: "5,000+", label: "Sellers" },
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: Star, value: "4.8", label: "Average Rating" },
]

const floatingIcons = [
  { Icon: Star, delay: 0, x: "10%", y: "20%", size: 24 },
  { Icon: TrendingUp, delay: 0.3, x: "85%", y: "30%", size: 28 },
  { Icon: ShoppingBag, delay: 0.6, x: "15%", y: "70%", size: 20 },
  { Icon: Package, delay: 0.9, x: "80%", y: "65%", size: 22 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} as const

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {floatingIcons.map(({ Icon, delay, x, y, size }) => (
          <motion.div
            key={delay}
            className="absolute hidden lg:block text-white/10"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 1, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon size={size} />
            </motion.div>
          </motion.div>
        ))}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="flex flex-col items-center text-center pt-20 pb-12 lg:pt-32 lg:pb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 text-yellow-400" />
                Trusted by 50,000+ customers worldwide
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="premium-heading">Discover Premium</span>
              <br />
              <span className="gold-gradient bg-clip-text text-transparent">
                Islamic Products
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed"
            >
              Your trusted marketplace for prayer mats, Qur&apos;an, hijabs,
              perfumes, Islamic clothing &amp; more — all with quality and
              barakah.
            </motion.p>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSearch}
              className="mt-8 w-full max-w-xl"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search for Islamic products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-white/20 bg-white/10 text-white placeholder:text-white/40 backdrop-blur-md text-base focus-visible:ring-white/30 focus-visible:border-white/30 transition-all"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/25"
                >
                  Search
                </Button>
              </div>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/categories">
                <Button
                  size="xl"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/25 rounded-2xl text-base gap-2 w-full sm:w-auto"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-2xl text-base gap-2 w-full sm:w-auto"
                >
                  <Store className="h-5 w-5" />
                  Become a Seller
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="relative -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={statVariants}
              className="flex flex-col items-center gap-1.5 py-2 sm:py-3 text-center"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                {value}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="h-12 sm:h-16 lg:h-24" />
    </section>
  )
}
