"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const

export function FeaturedCategories() {
  const displayCategories = CATEGORIES.slice(0, 8)

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Explore our wide range of premium Islamic products curated for you
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayCategories.map((category) => (
            <motion.div key={category.slug} variants={cardVariants}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-6 text-center card-hover"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-3xl group-hover:bg-primary/10 transition-colors duration-300">
                  {category.icon?.startsWith("http") ? (
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{category.icon || "📦"}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-card-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shop Now →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 text-center sm:hidden"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
