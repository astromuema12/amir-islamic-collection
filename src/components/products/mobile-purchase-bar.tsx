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
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex min-w-0 flex-col pr-1">
          <span className="text-sm font-bold text-foreground">
            {formatPrice(price)}
          </span>
          {product.discountPrice && (
            <span className="text-[10px] text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
        </Button>
        <Button
          className="h-10 flex-1 gap-1.5"
          onClick={handleAdd}
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {inStock ? "Add to Cart" : "Sold Out"}
        </Button>
        <Button
          className="h-10 flex-1 gap-1.5"
          variant="premium"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </Button>
      </div>
    </div>
  )
}
