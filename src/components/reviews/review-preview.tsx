"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { StarRating } from "./stars"
import { testimonials } from "@/lib/data"

export function ReviewPreview() {
  if (testimonials.length === 0) return null

  const featured = testimonials[0]

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8 lg:p-10"
        >
          <h2 className="premium-heading text-2xl text-foreground sm:text-3xl">
            What Our Customers Say
          </h2>

          <div className="mt-4 flex justify-center">
            <StarRating rating={featured.rating} starClassName="h-5 w-5" />
          </div>

          <blockquote className="mx-auto mt-4 max-w-2xl text-base italic leading-relaxed text-foreground/90 sm:text-lg">
            &ldquo;{featured.content}&rdquo;
          </blockquote>

          <p className="mt-4 font-semibold text-foreground">{featured.name}</p>
          <p className="text-sm text-muted-foreground">{featured.location}</p>

          <Link
            href="/reviews"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Read Customer Reviews
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}