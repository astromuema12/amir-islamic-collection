"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    id: "discover",
    badge: "Premium Islamic Essentials",
    title: "Discover Premium Islamic Essentials",
    description: "Prayer mats, Qur'an collections, hijabs, perfumes, clothing and more.",
    cta: "Shop Now",
    href: "/products",
    gradient: "from-emerald-950 via-emerald-800 to-emerald-600",
    accent: "text-amber-400",
  },
  {
    id: "worship",
    badge: "Devotion",
    title: "Elevate Your Worship",
    description: "Beautiful prayer essentials designed for comfort and devotion.",
    cta: "Explore Essentials",
    href: "/categories",
    gradient: "from-teal-950 via-teal-800 to-teal-600",
    accent: "text-amber-300",
  },
  {
    id: "gifts",
    badge: "Thoughtful Gifting",
    title: "Shop Islamic Gifts",
    description: "Thoughtful gifts for family, friends and loved ones.",
    cta: "Gift Collection",
    href: "/categories/eid-collection",
    gradient: "from-green-950 via-slate-800 to-slate-700",
    accent: "text-amber-400",
  },
]

export function PromoCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const timerRef = useRef<number | null>(null)

  const goTo = useCallback((index: number) => {
    const total = SLIDES.length
    setCurrent(((index % total) + total) % total)
  }, [])

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  const handleTouchStart = useCallback((clientX: number) => {
    touchStartX.current = clientX
  }, [])

  const handleTouchEnd = useCallback(
    (clientX: number) => {
      const delta = touchStartX.current - clientX
      if (Math.abs(delta) > 40) {
        if (delta > 0) goNext()
        else goPrev()
      }
    },
    [goNext, goPrev],
  )

  useEffect(() => {
    timerRef.current = window.setInterval(goNext, 5000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [goNext])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-xl sm:rounded-2xl border shadow-sm"
      onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={cn("min-w-0 shrink-0 grow-0 basis-full")}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${SLIDES.findIndex((s) => s.id === slide.id) + 1} of ${SLIDES.length}`}
          >
            <Link
              href={slide.href}
              className={`block bg-gradient-to-r ${slide.gradient} px-5 py-8 sm:px-8 sm:py-14 lg:px-10 lg:py-16`}
            >
              <div className="max-w-lg">
                <span className={cn("inline-block text-xs font-semibold uppercase tracking-wider", slide.accent)}>
                  {slide.badge}
                </span>
                <h2 className="mt-2 text-lg font-bold text-white leading-tight sm:text-2xl lg:text-3xl">
                  {slide.title}
                </h2>
                <p className="mt-1.5 text-sm text-white/80 sm:text-base">
                  {slide.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25">
                  {slide.cta}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  )
}
