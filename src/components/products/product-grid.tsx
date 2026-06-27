"use client"

import { ProductCard } from "./product-card"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  view?: "grid" | "list"
}

export function ProductGrid({ products, view = "grid" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl">📦</div>
        <h3 className="text-lg font-semibold text-foreground">No products found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} view="list" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view="grid" />
      ))}
    </div>
  )
}
