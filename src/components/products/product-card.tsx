"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { cn, formatPrice, calculateDiscount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  view?: "grid" | "list"
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const discount = useMemo(() => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return calculateDiscount(product.price, product.discountPrice)
    }
    return 0
  }, [product.price, product.discountPrice])

  const imageUrl = product.images?.[0] || "/placeholder.svg"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      image: imageUrl,
      price: product.discountPrice || product.price,
      quantity: 1,
      maxQuantity: product.stock,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product.id)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
      >
        <Link href={`/products/${product.slug}`} className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute left-2 top-2">
              -{discount}%
            </Badge>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{product.name}</h3>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < Math.round(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={handleToggleWishlist}>
                <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
              </Button>
              <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {discount > 0 && (
          <Badge variant="danger" className="absolute left-2 top-2">
            -{discount}%
          </Badge>
        )}
        {product.isFlashSale && (
          <Badge variant="warning" className="absolute right-2 top-2">
            Flash Sale
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < Math.round(product.averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30",
              )}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-base font-bold text-foreground">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Button size="sm" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            {product.stock === 0 ? "Sold Out" : "Add"}
          </Button>
          <Button size="icon" variant="outline" onClick={handleToggleWishlist}>
            <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
          </Button>
          <Button size="icon" variant="outline" onClick={handleQuickView}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
