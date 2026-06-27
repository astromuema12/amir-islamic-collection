"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CartItem } from "@/types"
import { formatPrice } from "@/lib/utils"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants"

interface CartSidebarProps {
  items?: CartItem[]
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
  onCheckout?: () => void
  className?: string
  children?: React.ReactNode
}

export function CartSidebar({
  items = [],
  isOpen,
  onOpenChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className,
  children,
}: CartSidebarProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  )

  const totalSavings = items.reduce((sum, item) => {
    if (item.product?.discountPrice && item.product?.price) {
      return sum + (item.product.price - item.product.discountPrice) * item.quantity
    }
    return sum
  }, 0)

  const handleQuantityChange = useCallback(
    (itemId: string, delta: number) => {
      const item = items.find((i) => i.id === itemId)
      if (!item || !onUpdateQuantity) return
      const newQuantity = item.quantity + delta
      if (newQuantity < 1) return
      onUpdateQuantity(itemId, newQuantity)
    },
    [items, onUpdateQuantity]
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="rounded-full bg-muted p-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start shopping and add items to your cart
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] h-10 px-4 py-2 gap-2"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {freeShippingRemaining > 0 && (
              <div className="mx-6 mb-4 rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">
                    Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </span>
                  <span className="font-medium text-primary">
                    {formatPrice(freeShippingRemaining)} away
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 rounded-lg border bg-muted overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/product/${item.product?.slug || item.productId}`}
                          className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                        >
                          {item.product?.name || "Product"}
                        </Link>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveItem?.(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-6 space-y-4">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">You save</span>
                  <span className="font-medium text-success">
                    -{formatPrice(totalSavings)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Subtotal</span>
                <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={onCheckout}
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.97] h-10 px-4 py-2 gap-2 w-full"
              >
                View Cart
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure checkout
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
