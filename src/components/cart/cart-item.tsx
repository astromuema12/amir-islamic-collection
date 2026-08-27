"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Minus, Plus, Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPrice } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/store/cart-store"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onSaveForLater?: (productId: string) => void
  isSelected?: boolean
  onToggleSelect?: (productId: string) => void
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  isSelected,
  onToggleSelect,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  function handleRemove() {
    setIsRemoving(true)
    setTimeout(() => onRemove(item.productId), 300)
  }

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border bg-card p-4 transition-all duration-300 sm:gap-6 sm:p-5",
        isRemoving && "scale-95 opacity-0",
      )}
    >
      {onToggleSelect && (
        <div className="flex items-start pt-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(item.productId)}
          />
        </div>
      )}

      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-28 sm:w-28">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 112px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.productId}`}
              className="text-sm font-medium leading-tight hover:text-primary transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            <button
              onClick={handleRemove}
              className="shrink-0 rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-base font-bold text-primary">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-1 rounded-lg border p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="flex w-8 items-center justify-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(item.price * item.quantity)}
            </p>
            {onSaveForLater && (
              <button
                onClick={() => onSaveForLater(item.productId)}
                className="rounded-md p-1.5 text-muted-foreground/60 hover:text-primary transition-colors"
                aria-label="Save for later"
              >
                <Heart className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
