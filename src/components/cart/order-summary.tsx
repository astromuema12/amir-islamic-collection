"use client"

import { Truck, ShieldCheck, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { FREE_SHIPPING_THRESHOLD, TAX_RATE } from "@/lib/constants"

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  discount: number
  couponCode?: string | null
  isLoading?: boolean
  onCheckout?: () => void
  checkoutLabel?: string
  compact?: boolean
  className?: string
}

export function OrderSummary({
  subtotal,
  shipping,
  discount,
  couponCode,
  isLoading,
  onCheckout,
  checkoutLabel = "Proceed to Checkout",
  compact,
  className,
}: OrderSummaryProps) {
  const tax = subtotal * TAX_RATE
  const total = Math.max(0, subtotal + shipping + tax - discount)
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const rows = [
    { label: "Subtotal", value: formatPrice(subtotal) },
    {
      label: "Shipping",
      value: shipping === 0 ? "Free" : formatPrice(shipping),
      valueClassName: shipping === 0 ? "text-success" : undefined,
    },
    {
      label: "Tax",
      value: formatPrice(tax),
      hint: `Est. ${TAX_RATE * 100}% VAT`,
    },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {freeShippingRemaining > 0 && !compact && (
        <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-3">
          <div className="flex items-center gap-2 text-xs mb-2">
            <Truck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">
              {freeShippingRemaining > 0
                ? `Add ${formatPrice(freeShippingRemaining)} for free shipping`
                : "You've earned free shipping!"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-emerald-200/50 dark:bg-emerald-800/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className={cn("rounded-xl border bg-card", !compact && "p-5")}>
        <h3 className={cn("font-semibold", compact ? "text-sm" : "text-base mb-4")}>
          Order Summary
        </h3>

        <div className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                {row.label}
                {row.hint && (
                  <span className="relative group">
                    <Info className="h-3 w-3" />
                  </span>
                )}
              </span>
              <span className={cn("font-medium", row.valueClassName)}>
                {row.value}
              </span>
            </div>
          ))}

          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-success">Discount</span>
              <span className="font-medium text-success">
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          {couponCode && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Coupon</span>
              <span className="font-medium text-primary">{couponCode}</span>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(total)}
          </span>
        </div>

        {compact && (
          <p className="mt-1 text-xs text-muted-foreground">
            Including {formatPrice(tax)} tax
          </p>
        )}

        {onCheckout && (
          <Button
            className="mt-4 w-full gap-2"
            size="lg"
            onClick={onCheckout}
            isLoading={isLoading}
          >
            {checkoutLabel}
          </Button>
        )}

        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure checkout
        </div>
      </div>
    </div>
  )
}
