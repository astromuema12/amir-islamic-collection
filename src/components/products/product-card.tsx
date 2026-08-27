"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { cn, formatPrice, calculateDiscount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  view?: "grid" | "list"
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) => s.isInWishlist(product.id))

  const discount = useMemo(() => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return calculateDiscount(product.price, product.discountPrice)
    }
    return 0
  }, [product.price, product.discountPrice])

  const imageUrl = product.images?.[0] || "/placeholder.svg"
  const currentPrice = product.discountPrice || product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      image: imageUrl,
      price: currentPrice,
      quantity: 1,
      maxQuantity: product.stock,
    })
    toast.success("Added to cart")
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const before = useWishlistStore.getState().isInWishlist(product.id)
    toggleItem(product.id)
    toast.success(before ? "Removed from wishlist" : "Added to wishlist")
  }

  if (view === "list") {
    return (
      <div className="flex gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:gap-4 sm:p-4">
        <Link
          href={`/products/${product.slug}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-32"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute left-2 top-2">
              -{discount}%
            </Badge>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-amber-500" aria-hidden="true">★</span>
              <span className="text-xs font-medium text-foreground">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-sm font-bold text-foreground sm:text-base">
                {formatPrice(currentPrice)}
              </span>
              {product.discountPrice && (
                <span className="ml-1.5 text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9"
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge variant="danger" className="absolute left-1.5 top-1.5">
            -{discount}%
          </Badge>
        )}
        {product.isFlashSale && (
          <Badge variant="warning" className="absolute right-1.5 top-1.5">
            Flash
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-0.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.round(product.averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          {product.reviewCount > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground">
              ({product.reviewCount})
            </span>
          )}
        </div>

        <div className="mt-auto flex items-baseline gap-1 pt-1">
          <span className="text-sm font-bold text-foreground sm:text-base">
            {formatPrice(currentPrice)}
          </span>
          {product.discountPrice && (
            <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <Button
            size="sm"
            className="min-w-0 flex-1 px-1.5 text-xs"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            {product.stock === 0 ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingCart className="mr-1 h-3 w-3 shrink-0" />
                Add
              </>
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 shrink-0"
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-3.5 w-3.5", inWishlist && "fill-red-500 text-red-500")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
