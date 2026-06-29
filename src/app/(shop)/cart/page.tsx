"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Heart,
  Clock,
  Trash2,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CartItem } from "@/components/cart/cart-item"
import { CouponInput } from "@/components/cart/coupon-input"
import { OrderSummary } from "@/components/cart/order-summary"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"
import { useUIStore } from "@/store/ui-store"
import { FREE_SHIPPING_THRESHOLD, TAX_RATE } from "@/lib/constants"
import toast from "react-hot-toast"

export default function CartPage() {
  const {
    items,
    coupon,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore()

  const { recentlyViewed } = useUIStore()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [savedForLater, setSavedForLater] = useState<string[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const discount = useMemo(() => {
    if (!coupon) return 0
    if (coupon.type === "fixed") return Math.min(coupon.value, subtotal)
    const percentOff = subtotal * (coupon.value / 100)
    return coupon.maxDiscount
      ? Math.min(percentOff, coupon.maxDiscount)
      : percentOff
  }, [coupon, subtotal])

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 1500
  const tax = subtotal * TAX_RATE
  const total = Math.max(0, subtotal + shipping + tax - discount)

  function toggleSelectAll() {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map((i) => i.productId)))
    }
  }

  function toggleSelectItem(productId: string) {
    const next = new Set(selectedItems)
    if (next.has(productId)) {
      next.delete(productId)
    } else {
      next.add(productId)
    }
    setSelectedItems(next)
  }

  async function handleApplyCoupon(code: string): Promise<boolean> {
    const couponData = {
      id: code,
      code,
      type: "percentage" as const,
      value: 10,
      minOrderAmount: 0,
      maxDiscount: 5000,
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
    }
    applyCoupon(couponData)
    return true
  }

  function handleRemoveCoupon() {
    removeCoupon()
    toast.success("Coupon removed")
  }

  function handleSaveForLater(productId: string) {
    setSavedForLater((prev) => [...prev, productId])
    removeItem(productId)
    toast.success("Saved for later")
  }

  function handleCheckout() {
    setIsCheckingOut(true)
    window.location.href = "/checkout"
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
            <ShoppingBag className="h-12 w-12 text-emerald-500/60" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              Looks like you haven&apos;t added anything yet. Start exploring our collection!
            </p>
          </div>
          <Link href="/categories">
            <Button size="lg" className="gap-2 mt-2">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 w-full max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Recently viewed</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recentlyViewed.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group rounded-xl border bg-card p-3 transition-all hover:shadow-md"
                >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <h4 className="text-xs font-medium line-clamp-2">{product.name}</h4>
                  <p className="mt-1 text-sm font-bold text-primary">
                    {formatPrice(product.discountPrice || product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearCart()
            toast.success("Cart cleared")
          }}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Clear
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {freeShippingRemaining > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-4"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(freeShippingRemaining)} away
                </span>
              </div>
              <div className="h-2 rounded-full bg-emerald-200/50 dark:bg-emerald-800/50 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.size === items.length && items.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              Select all ({items.length} items)
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    onSaveForLater={handleSaveForLater}
                    isSelected={selectedItems.has(item.productId)}
                    onToggleSelect={toggleSelectItem}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Coupon Code</h3>
            <CouponInput
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              appliedCode={coupon?.code ?? null}
              discount={discount}
            />
          </div>

          {savedForLater.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Saved for later ({savedForLater.length})
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Items saved for later will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              couponCode={coupon?.code ?? null}
              isLoading={isCheckingOut}
              onCheckout={handleCheckout}
              checkoutLabel="Proceed to Checkout"
            />

            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Recently viewed</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recentlyViewed.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-xl border bg-card p-3 transition-all hover:shadow-md"
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 16vw"
                    />
                  )}
                </div>
                <h4 className="text-xs font-medium line-clamp-2">{product.name}</h4>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatPrice(product.discountPrice || product.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
