"use client"

import type { Product } from "@/types"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, TrendingUp, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

export function TrendingProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading">
                Trending Now
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Most popular products in the community
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden card-hover">
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-0">
                      <TrendingUp className="h-3 w-3 mr-1 text-purple-500" />
                      #{index + 1}
                    </Badge>
                  </div>

                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-8">
                    <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                      📦
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{product.averageRating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.salesCount} sold)
                      </span>
                    </div>

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
          ))}
        </div>
      </div>
    </section>
  )
}
