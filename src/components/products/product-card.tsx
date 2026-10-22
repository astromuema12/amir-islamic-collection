"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, GitCompare } from "lucide-react"
import { cn, formatPrice, calculateDiscount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"
import { useUIStore } from "@/store"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  view?: "grid" | "list"
}

const FALLBACK_IMAGE = "/placeholder.svg"
const LOW_STOCK_THRESHOLD = 10

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) => s.isInWishlist(product.id))
  const addToCompare = useUIStore((s) => s.addToCompare)
  const removeFromCompare = useUIStore((s) => s.removeFromCompare)
  const inCompare = useUIStore((s) => s.isInCompare(product.id))

  const [imgError, setImgError] = useState(false)

  const discount = useMemo(() => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return calculateDiscount(product.price, product.discountPrice)
    }
    return 0
  }, [product.price, product.discountPrice])

  const rawImageUrl = product.images?.[0]
  const hasValidImage = Boolean(rawImageUrl && rawImageUrl.trim().length > 0 && !imgError)
  const imageUrl = hasValidImage ? rawImageUrl : FALLBACK_IMAGE
  const currentPrice = product.discountPrice || product.price

  const hasDiscount = discount > 0
  const showFlashBadge = product.isFlashSale
  const showLimitedStockBadge =
    product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD && !showFlashBadge && !hasDiscount
  const hasGenuineRatings = typeof product.reviewCount === "number" && product.reviewCount > 0
  const isOutOfStock = product.stock === 0

  const stockLabel = isOutOfStock
    ? "Out of stock"
    : product.stock <= LOW_STOCK_THRESHOLD
      ? `Only ${product.stock} left in stock`
      : "In stock"
  const stockTone = isOutOfStock
    ? "text-rose-600 dark:text-rose-400"
    : product.stock <= LOW_STOCK_THRESHOLD
      ? "text-amber-700 dark:text-amber-400"
      : "text-muted-foreground"

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      image: hasValidImage ? rawImageUrl : FALLBACK_IMAGE,
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

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(product.id)
      toast.success("Removed from compare")
    } else {
      addToCompare(product)
      toast.success("Added to compare")
    }
  }

  if (view === "list") {
    return (
      <div className="group relative flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-[0_1px_1px_rgba(0,0,0,0.01),0_10px_30px_-22px_rgba(16,185,129,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-[0_14px_44px_-20px_rgba(16,185,129,0.6)] max-[359px]:gap-2.5 max-[359px]:p-2.5 sm:gap-4 sm:p-4">
        <Link
          href={`/products/${product.slug}`}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted ring-1 ring-inset ring-white/10 max-[359px]:h-20 max-[359px]:w-20 sm:h-36 sm:w-36"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 112px, 144px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setImgError(true)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent dark:from-black/45" />
          {hasDiscount && (
            <Badge className="absolute left-2 top-2 border border-rose-400/30 bg-gradient-to-r from-rose-500/90 to-red-500/90 text-white shadow-sm">
              -{discount}%
            </Badge>
          )}
          {showFlashBadge && (
            <Badge className="absolute left-2 top-2 border border-amber-300/40 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 text-amber-950 shadow-sm">
              Flash Sale
            </Badge>
          )}
          {showLimitedStockBadge && (
            <Badge className="absolute left-2 top-2 border border-orange-300/40 bg-gradient-to-r from-orange-400/90 to-amber-500/90 text-orange-950 shadow-sm">
              Limited Stock
            </Badge>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-emerald-400 sm:text-base">
                {product.name}
              </h3>
            </Link>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
            {hasGenuineRatings && (
              <div className="mt-1.5 flex items-center gap-1">
                <div
                  className="flex items-center gap-0.5"
                  role="img"
                  aria-label={`Rated ${product.averageRating.toFixed(1)} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < Math.round(product.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <span className={cn("mt-0.5 text-[11px] font-medium", stockTone)}>{stockLabel}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 max-[359px]:h-8 max-[359px]:w-8"
                onClick={handleToggleCompare}
                aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              >
                <GitCompare className={cn("h-4 w-4", inCompare && "text-emerald-400")} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400 max-[359px]:h-8 max-[359px]:w-8"
                onClick={handleToggleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-rose-500 text-rose-500")} />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-transparent bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_8px_20px_-12px_rgba(16,185,129,0.9)] transition-all hover:bg-transparent hover:from-emerald-400 hover:to-emerald-500 focus-visible:ring-emerald-400/60 active:scale-[0.98] disabled:opacity-50 max-[359px]:h-8 max-[359px]:w-8"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_1px_rgba(0,0,0,0.01),0_12px_40px_-26px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_22px_60px_-30px_rgba(16,185,129,0.75)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted ring-1 ring-inset ring-white/10">
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={product.name}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            onError={() => setImgError(true)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent dark:from-black/45" />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
            {hasDiscount && (
              <Badge
                variant="outline"
                className="border border-rose-400/30 bg-transparent bg-gradient-to-r from-rose-500/90 to-red-500/90 text-white shadow-sm"
              >
                -{discount}%
              </Badge>
            )}
            {showFlashBadge && (
              <Badge
                variant="outline"
                className="border border-amber-300/40 bg-transparent bg-gradient-to-r from-amber-400/90 to-yellow-500/90 text-amber-950 shadow-sm"
              >
                Flash Sale
              </Badge>
            )}
            {showLimitedStockBadge && (
              <Badge
                variant="outline"
                className="border border-orange-300/40 bg-transparent bg-gradient-to-r from-orange-400/90 to-amber-500/90 text-orange-950 shadow-sm"
              >
                Limited Stock
              </Badge>
            )}
          </div>
          {!hasValidImage && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
              <span className="rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-200/90 backdrop-blur-sm">
                Image coming soon
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={inWishlist}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-slate-950/45 text-white backdrop-blur-md transition-colors duration-200 hover:bg-slate-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            inWishlist && "border-rose-400/60 bg-rose-500/90 hover:bg-rose-500"
          )}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-emerald-400 sm:min-h-[2.75rem] sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {product.description}
          </p>
        )}

        {hasGenuineRatings && (
          <div className="flex items-center gap-1">
            <div
              className="flex items-center gap-0.5"
              role="img"
              aria-label={`Rated ${product.averageRating.toFixed(1)} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.round(product.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-foreground">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-auto flex flex-col pt-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through sm:text-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className={cn("mt-0.5 text-[11px] font-medium", stockTone)}>{stockLabel}</span>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <Button
            size="sm"
            className="h-10 min-w-0 flex-1 rounded-full bg-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 text-xs font-semibold text-white shadow-[0_10px_30px_-16px_rgba(16,185,129,0.95)] transition-all hover:bg-transparent hover:from-emerald-400 hover:to-emerald-500 hover:shadow-[0_12px_34px_-14px_rgba(16,185,129,1)] focus-visible:ring-emerald-400/70 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            {isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 shrink-0 rounded-full border-border/60 bg-transparent text-muted-foreground transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-400"
            onClick={handleToggleCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompare className={cn("h-4 w-4", inCompare && "text-emerald-400")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
