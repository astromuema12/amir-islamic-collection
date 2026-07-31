"use client"

import { useState, useMemo } from "react"
import { Star, Heart, Share2, Check, Minus, Plus, Copy, CheckCheck } from "lucide-react"
import { cn, formatPrice, calculateDiscount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"
import toast from "react-hot-toast"
import type { Product } from "@/types"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) => s.isInWishlist(product.id))

  const discount = useMemo(() => {
    if (product.discountPrice && product.discountPrice < product.price) {
      return calculateDiscount(product.price, product.discountPrice)
    }
    return 0
  }, [product.price, product.discountPrice])

  const inStock = product.stock > 0
  const lowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || "/placeholder.svg",
      price: product.discountPrice || product.price,
      quantity,
      maxQuantity: product.stock,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    useCartStore.getState().openCart()
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>
          {product.brand && (
            <p className="mt-1 text-sm text-muted-foreground">
              Brand: <span className="text-foreground">{product.brand.name}</span>
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const inWishlistBefore = useWishlistStore.getState().isInWishlist(product.id)
            toggleItem(product.id)
            toast.success(inWishlistBefore ? "Removed from wishlist" : "Added to wishlist")
          }}
          className="shrink-0"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.round(product.averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground">{product.salesCount} sold</span>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(product.discountPrice || product.price)}
        </span>
        {product.discountPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
            <Badge variant="danger">-{discount}% OFF</Badge>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {inStock ? (
          lowStock ? (
            <Badge variant="warning" className="gap-1">
              <Minus className="h-3 w-3" />
              Only {product.stock} left
            </Badge>
          ) : (
            <Badge variant="success" className="gap-1">
              <Check className="h-3 w-3" />
              In Stock
            </Badge>
          )
        ) : (
          <Badge variant="danger">Out of Stock</Badge>
        )}
        {product.isFlashSale && (
          <Badge variant="warning">Flash Sale</Badge>
        )}
        {product.isFeatured && (
          <Badge variant="premium">Featured</Badge>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-10 w-14 items-center justify-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="premium"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          Buy Now
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
          {copied ? (
            <>
              <CheckCheck className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </a>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>
          SKU: <span className="text-foreground">{product.sku}</span>
        </span>
        {product.weight && (
          <span>
            Weight: <span className="text-foreground">{product.weight} kg</span>
          </span>
        )}
        {product.dimensions && (
          <span>
            Dimensions: <span className="text-foreground">{product.dimensions}</span>
          </span>
        )}
      </div>
    </div>
  )
}
