"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Clock, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { sampleFlashDeals, flashDealEmojis } from "@/lib/data"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    function calculate() {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const diff = Math.max(0, target - now)

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

function CountdownTimer() {
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 2)
  endDate.setHours(23, 59, 59, 0)

  const timeLeft = useCountdown(endDate)

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ]

  return (
    <div className="flex items-center gap-2">
      {units.map(({ value, label }) => (
        <div key={label} className="countdown-item">
          <span className="countdown-value text-white">{String(value).padStart(2, "0")}</span>
          <span className="countdown-label text-white/70">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function FlashSales() {
  if (sampleFlashDeals.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading">
                  Flash Sales
                </h2>
                <Zap className="h-5 w-5 text-amber-500 hidden sm:block" />
              </div>
              <p className="text-muted-foreground text-sm">
                Limited-time offers — grab them before they&apos;re gone
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ends in:</span>
            </div>
            <CountdownTimer />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sampleFlashDeals.map((product, index) => {
            const discount = product.discountPrice
              ? calculateDiscount(product.price, product.discountPrice)
              : 0

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden card-hover">
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                        -{discount}%
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-0">
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        Flash Sale
                      </Badge>
                    </div>

                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-8">
                      <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                        {flashDealEmojis[product.id] || "📦"}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {product.discountPrice
                            ? formatPrice(product.discountPrice)
                            : formatPrice(product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Sold: {product.soldPercent}%</span>
                          <span>{product.stock} left</span>
                        </div>
                        <Progress value={product.soldPercent} className="h-1.5" />
                      </div>

                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-xl"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
