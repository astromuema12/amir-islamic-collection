"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewCard } from "./review-card"
import type { Testimonial } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ReviewCarouselProps {
  reviews: Testimonial[]
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const reducedMotion = useReducedMotion()
  const count = reviews.length
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((p) => (p - 1 + count) % count)
  }, [count])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((p) => (p + 1) % count)
  }, [count])

  useEffect(() => {
    if (reducedMotion || isPaused || count <= 1) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next, reducedMotion, isPaused, count])

  useEffect(() => {
    if (count <= 1) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prev, next, count])

  if (count === 0) return null

  const goTo = (index: number) => {
    if (index === current) return
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const slideVariants = {
    enter: (dir: number) =>
      reducedMotion ? { opacity: 0 } : { x: dir > 0 ? 120 : -120, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: (dir: number) =>
      reducedMotion ? { opacity: 0 } : { x: dir > 0 ? -120 : 120, opacity: 0 },
  }

  const t = reviews[current]

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(delta) > 40) {
          if (delta < 0) next()
          else prev()
        }
        touchStartX.current = null
      }}
      className="outline-none"
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-6 left-2 text-primary/10 lg:-left-8">
            <Quote className="h-14 w-14 lg:h-20 lg:w-20" aria-hidden="true" />
          </div>

          <div className="flex min-h-[340px] items-center justify-center sm:min-h-[360px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <ReviewCard review={t} variant="featured" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              {reviews.map((review, i) => (
                <button
                  key={review.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={next}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}