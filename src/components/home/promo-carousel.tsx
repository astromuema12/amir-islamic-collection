"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    id: "discover",
    badge: "Premium Islamic Essentials",
    title: "Discover Premium Islamic Essentials",
    highlight: "Islamic Essentials",
    description: "Prayer mats, Qur'an collections, hijabs, perfumes, clothing and more.",
    cta: "Shop Now",
    href: "/products",
    gradient: "from-emerald-950 via-emerald-900 to-emerald-800",
    accent: "text-amber-300",
  },
  {
    id: "worship",
    badge: "Devotion",
    title: "Elevate Your Worship",
    highlight: "Worship",
    description: "Beautiful prayer essentials designed for comfort and devotion.",
    cta: "Explore Essentials",
    href: "/categories",
    gradient: "from-emerald-950 via-emerald-900 to-teal-900",
    accent: "text-amber-300",
  },
  {
    id: "gifts",
    badge: "Thoughtful Gifting",
    title: "Shop Islamic Gifts",
    highlight: "Islamic Gifts",
    description: "Thoughtful gifts for family, friends and loved ones.",
    cta: "Gift Collection",
    href: "/categories/eid-collection",
    gradient: "from-emerald-950 via-emerald-900 to-emerald-900",
    accent: "text-amber-300",
  },
]

const HERO_IMAGE = "/hero/hero-essentials.png"

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
      className="relative overflow-hidden rounded-2xl border border-emerald-400/15 shadow-[0_28px_70px_-30px_rgba(2,44,34,0.75)] sm:rounded-3xl"
      onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, index) => {
          const parts = slide.title.split(slide.highlight)
          const isHighlighted = parts.length > 1

          return (
            <div
              key={slide.id}
              className="min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${SLIDES.length}`}
            >
              <Link
                href={slide.href}
                className={cn(
                  "group relative block h-full overflow-hidden bg-gradient-to-br",
                  slide.gradient
                )}
              >
                {/* Islamic geometric weave */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
                >
                  <defs>
                    <pattern
                      id={`hero-islamic-${slide.id}`}
                      width="120"
                      height="120"
                      patternUnits="userSpaceOnUse"
                    >
                      <g fill="none" stroke="#fbbf24" strokeWidth="1.25">
                        <rect x="30" y="30" width="60" height="60" />
                        <rect
                          x="30"
                          y="30"
                          width="60"
                          height="60"
                          transform="rotate(45 60 60)"
                        />
                      </g>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#hero-islamic-${slide.id})`} />
                </svg>

                {/* Warm key light + vignette */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-amber-300/10 blur-3xl"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-950/70 to-transparent"
                />

                <div className="relative grid items-center lg:grid-cols-[45fr_55fr]">
                  {/* Copy column */}
                  <div className="px-5 pb-4 pt-8 sm:px-8 sm:pb-6 sm:pt-10 lg:px-12 lg:py-16">
                    <span
                      className={cn(
                        "inline-flex max-w-full items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm",
                        slide.accent
                      )}
                    >
                      {slide.badge}
                    </span>

                    <h2 className="premium-heading mt-4 text-2xl leading-[1.12] text-white sm:text-3xl lg:text-[2.7rem]">
                      {isHighlighted ? (
                        <>
                          {parts[0]}
                          <span className="gold-gradient bg-clip-text text-transparent">
                            {slide.highlight}
                          </span>
                          {parts[1]}
                        </>
                      ) : (
                        slide.title
                      )}
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-emerald-50/75 sm:text-base">
                      {slide.description}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-amber-500/20 transition-all duration-200 group-hover:from-amber-300 group-hover:via-amber-200 group-hover:to-amber-400">
                      {slide.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>

                  {/* Product photograph column */}
                  <div className="relative w-full px-3 pb-10 sm:px-6 lg:px-0 lg:pb-0 lg:pr-8">
                    <div className="relative mx-auto aspect-[16/11] w-full max-w-[520px] lg:aspect-auto lg:h-[500px] lg:max-w-[680px]">
                      <Image
                        src={HERO_IMAGE}
                        alt="Prayer mat, Qur'an, tasbih beads, perfume and folded textile from the Islamic essentials collection"
                        fill
                        priority={index === 0}
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-emerald-950/50 text-white backdrop-blur-sm transition-colors hover:border-amber-300/60 hover:bg-amber-300 hover:text-emerald-950 sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-emerald-950/50 text-white backdrop-blur-sm transition-colors hover:border-amber-300/60 hover:bg-amber-300 hover:text-emerald-950 sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-emerald-950/50 px-3 py-2 backdrop-blur-sm">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            className={cn(
              "rounded-full transition-all duration-300",
              index === current
                ? "h-1.5 w-7 bg-amber-300"
                : "h-1.5 w-1.5 bg-white/45 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  )
}
