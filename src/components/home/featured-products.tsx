"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Star,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import type { Product } from "@/types"

const sampleProducts: Product[] = [
  {
    id: "fp1",
    name: "Premium Velvet Prayer Mat - Extra Large",
    slug: "premium-velvet-prayer-mat-xl",
    description: "",
    price: 18900,
    discountPrice: 12900,
    currency: "KES",
    images: [],
    categoryId: "1",
    sellerId: "1",
    sku: "PVM-XL",
    stock: 32,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["prayer-mat", "velvet"],
    averageRating: 4.9,
    reviewCount: 312,
    salesCount: 890,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fp2",
    name: "Deluxe Quran Set with Rehal & Tasbih",
    slug: "deluxe-quran-set-rehal-tasbih",
    description: "",
    price: 35000,
    discountPrice: 24900,
    currency: "KES",
    images: [],
    categoryId: "2",
    sellerId: "1",
    sku: "DQS-002",
    stock: 18,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["quran", "set"],
    averageRating: 5.0,
    reviewCount: 445,
    salesCount: 1203,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fp3",
    name: "Organic Black Seed Oil - 500ml",
    slug: "organic-black-seed-oil-500ml",
    description: "",
    price: 9500,
    discountPrice: 6900,
    currency: "KES",
    images: [],
    categoryId: "11",
    sellerId: "1",
    sku: "BSO-003",
    stock: 64,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["oil", "black-seed"],
    averageRating: 4.7,
    reviewCount: 198,
    salesCount: 567,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fp4",
    name: "Embroidered Kaftan Abaya - Gold Trim",
    slug: "embroidered-kaftan-abaya-gold",
    description: "",
    price: 45000,
    discountPrice: 32900,
    currency: "KES",
    images: [],
    categoryId: "5",
    sellerId: "1",
    sku: "EKA-004",
    stock: 12,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["abaya", "kaftan"],
    averageRating: 4.8,
    reviewCount: 167,
    salesCount: 423,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fp5",
    name: "Premium Oud Bakhoor Gift Set",
    slug: "premium-oud-bakhoor-gift-set",
    description: "",
    price: 22000,
    discountPrice: 15900,
    currency: "KES",
    images: [],
    categoryId: "11",
    sellerId: "1",
    sku: "OBG-005",
    stock: 27,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["oud", "bakhoor"],
    averageRating: 4.9,
    reviewCount: 256,
    salesCount: 678,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fp6",
    name: "Islamic Wall Art - Ayatul Kursi Calligraphy",
    slug: "islamic-wall-art-ayatul-kursi",
    description: "",
    price: 28000,
    discountPrice: 19900,
    currency: "KES",
    images: [],
    categoryId: "15",
    sellerId: "1",
    sku: "IWA-006",
    stock: 21,
    isActive: true,
    isFeatured: true,
    isFlashSale: false,
    tags: ["wall-art", "calligraphy"],
    averageRating: 4.9,
    reviewCount: 289,
    salesCount: 745,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const productEmojis: Record<string, string> = {
  fp1: "🕌",
  fp2: "📖",
  fp3: "🫒",
  fp4: "👗",
  fp5: "🎁",
  fp6: "🖼️",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating)
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

export function FeaturedProducts() {
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useState<HTMLDivElement | null>(null)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("featured-scroll")
    if (container) {
      const scrollAmount = 320
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96 mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 overflow-hidden">
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
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked premium products for you
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          id="featured-scroll"
          className="flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {sampleProducts.map((product, index) => {
            const discount = product.discountPrice
              ? calculateDiscount(product.price, product.discountPrice)
              : 0

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="min-w-[250px] sm:min-w-[280px] flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden card-hover">
                    <div className="absolute top-3 left-3 z-10">
                      {discount > 0 && (
                        <Badge variant="danger" className="border-0 shadow-lg">
                          -{discount}%
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-8">
                      <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                        {productEmojis[product.id] || "📦"}
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      <StarRating rating={product.averageRating} />

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

                      <Button
                        size="sm"
                        className="w-full gap-2 rounded-xl"
                        onClick={(e) => e.preventDefault()}
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
