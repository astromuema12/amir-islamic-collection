"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  location: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Aisha Muhammad",
    role: "Verified Buyer",
    avatar: "",
    content:
      "I purchased the Premium Velvet Prayer Mat and it exceeded my expectations. The quality is exceptional — soft, durable, and beautifully designed. Shipping was fast too. JazakAllah khair!",
    rating: 5,
    location: "Nairobi, Kenya",
  },
  {
    id: "2",
    name: "Fatima Usman",
    role: "Verified Buyer",
    avatar: "",
    content:
      "Amir Islamic Collections is my go-to for all Islamic products. The Luxury Oud Perfume is absolutely divine, long-lasting and authentic. Their customer service is outstanding. Highly recommended!",
    rating: 5,
    location: "Mombasa, Kenya",
  },
  {
    id: "3",
    name: "Zaynab Abdullah",
    role: "Verified Buyer",
    avatar: "",
    content:
      "The Deluxe Quran Set made the perfect Eid gift for my parents. The leather binding is exquisite, and the calligraphy is stunning. Thank you for spreading barakah through your products.",
    rating: 5,
    location: "Kisumu, Kenya",
  },
  {
    id: "4",
    name: "Khadija Hassan",
    role: "Verified Buyer",
    avatar: "",
    content:
      "I bought the complete hijab collection and I'm thoroughly impressed. The fabrics are breathable, colors are vibrant, and the pricing is very fair. Will definitely be ordering again!",
    rating: 4,
    location: "Nakuru, Kenya",
  },
  {
    id: "5",
    name: "Aminat Bello",
    role: "Verified Buyer",
    avatar: "",
    content:
      "Their Ramadan collection is absolutely wonderful! The dates were fresh, the decor items tasteful, and the whole experience felt truly special. May Allah bless this business abundantly.",
    rating: 5,
    location: "Eldoret, Kenya",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next])

  const t = testimonials[current]

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  const initials = t.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <section className="py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Hear from our community of satisfied customers across Kenya and beyond
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -top-8 left-0 text-primary/10">
              <Quote className="h-16 w-16" />
            </div>

            <div className="min-h-[280px] flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-center px-4"
                >
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < t.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg sm:text-xl text-foreground/90 leading-relaxed italic font-medium">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex flex-col items-center gap-3">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.role} &middot; {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={prev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1)
                      setCurrent(i)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={next}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
