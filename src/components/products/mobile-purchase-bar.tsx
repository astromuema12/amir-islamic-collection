"use client"

import { Heart, ShoppingCart, Zap } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"
import type { Product } from "@/types"

export function MobilePurchaseBar({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) => s.isInWishlist(product.id))

  const inStock = product.stock > 0
  const price = product.discountPrice || product.price

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || "",
      price,
      quantity: 1,
      maxQuantity: product.stock,
    })
  }

  const handleBuyNow = () => {
    handleAdd()
    useCartStore.getState().openCart()
  }

  const handleWishlist = () => {
    toggleItem(product.id)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-background/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-1.5 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5">
        <div className="hidden min-w-0 flex-col pr-1 min-[300px]:flex">
          <span className="truncate text-xs font-bold text-foreground sm:text-sm">
            {formatPrice(price)}
          </span>
          {product.discountPrice && (
            <span className="truncate text-[10px] text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 min-[360px]:h-10 min-[360px]:w-10"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
        </Button>
        <Button
          className="h-10 min-w-0 flex-1 gap-1 px-1.5 text-[11px] min-[360px]:text-xs sm:gap-1.5 sm:px-4 sm:text-sm"
          onClick={handleAdd}
          disabled={!inStock}
        >
          <ShoppingCart className="hidden h-4 w-4 shrink-0 min-[400px]:block" />
          {inStock ? (
            <>
              <span className="min-[400px]:hidden">Add</span>
              <span className="hidden min-[400px]:inline">Add to Cart</span>
            </>
          ) : (
            "Sold Out"
          )}
        </Button>
        <Button
          className="h-10 min-w-0 flex-1 gap-1 px-1.5 text-[11px] min-[360px]:text-xs sm:gap-1.5 sm:px-4 sm:text-sm"
          variant="premium"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          <Zap className="hidden h-4 w-4 shrink-0 min-[400px]:block" />
          <span className="min-[400px]:hidden">Buy</span>
          <span className="hidden min-[400px]:inline">Buy Now</span>
        </Button>
      </div>
    </div>
  )
}
