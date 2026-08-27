"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/types"

interface ProductSectionProps {
  title: string
  description?: string
  products: Product[]
  href?: string
  actionLabel?: string
  showSeeAll?: boolean
}

export function ProductSection({
  title,
  description,
  products,
  href,
  actionLabel = "See All",
  showSeeAll = true,
}: ProductSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="py-5 sm:py-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-foreground sm:text-xl premium-heading">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>
        {showSeeAll && href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 sm:text-sm transition-colors"
          >
            {actionLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="mt-3 sm:mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
