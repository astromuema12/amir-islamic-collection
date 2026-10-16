import { FREE_SHIPPING_THRESHOLD, SHIPPING_METHODS, TAX_RATE } from "@/lib/constants"

export interface ShippingMethodConfig {
  name: string
  price: number
  days: string
}

export interface TaxConfig {
  /** Tax rate as a decimal, e.g. 0.075 for 7.5%. */
  rate: number
  /** Whether tax is also charged on the shipping fee. */
  appliesToShipping: boolean
}

export interface ShippingConfig {
  /** Order subtotal at or above which shipping is free. */
  freeThreshold: number
  methods: ShippingMethodConfig[]
}

export interface PricingConfig {
  tax: TaxConfig
  shipping: ShippingConfig
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const DEFAULT_TAX_RATE = readNumber(process.env.NEXT_PUBLIC_TAX_RATE, TAX_RATE)
const DEFAULT_FREE_THRESHOLD = readNumber(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD,
  FREE_SHIPPING_THRESHOLD,
)
const DEFAULT_TAX_ON_SHIPPING =
  (process.env.NEXT_PUBLIC_TAX_ON_SHIPPING ?? process.env.TAX_ON_SHIPPING) === "true"

/**
 * Configuration used when no database override is available, and as the base
 * that DB values are merged onto. Values fall back to `src/lib/constants.ts`.
 */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  tax: {
    rate: DEFAULT_TAX_RATE,
    appliesToShipping: DEFAULT_TAX_ON_SHIPPING,
  },
  shipping: {
    freeThreshold: DEFAULT_FREE_THRESHOLD,
    methods: SHIPPING_METHODS,
  },
}

export interface PricedItem {
  price: number
  quantity: number
}

export interface CouponLike {
  type: "percentage" | "fixed"
  value: number
  minOrderAmount?: number
  maxDiscount?: number
}

export function computeSubtotal(items: PricedItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function computeDiscount(
  subtotal: number,
  coupon?: CouponLike | null,
): number {
  if (!coupon) return 0
  if (coupon.type === "fixed") return Math.min(coupon.value, subtotal)

  const percentOff = subtotal * (coupon.value / 100)
  const capped = coupon.maxDiscount
    ? Math.min(percentOff, coupon.maxDiscount)
    : percentOff
  return Math.min(capped, subtotal)
}

export function findShippingMethod(
  config: ShippingConfig,
  methodName?: string,
): ShippingMethodConfig | undefined {
  if (methodName) {
    const found = config.methods.find((method) => method.name === methodName)
    if (found) return found
  }
  return config.methods[0]
}

export function computeShipping(
  subtotal: number,
  config: ShippingConfig,
  methodName?: string,
): number {
  if (subtotal >= config.freeThreshold) return 0
  return findShippingMethod(config, methodName)?.price ?? 0
}

export function computeTax(
  subtotal: number,
  shipping: number,
  discount: number,
  config: TaxConfig,
): number {
  const taxable = config.appliesToShipping
    ? Math.max(0, subtotal + shipping - discount)
    : Math.max(0, subtotal)
  return taxable * config.rate
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
}

/**
 * Single source of truth for order math. Used by the cart, checkout, order
 * summary, and the server-side order creation so every surface agrees.
 */
export function computeTotals(input: {
  items: PricedItem[]
  coupon?: CouponLike | null
  shippingMethod?: string
  config?: PricingConfig
}): OrderTotals {
  const config = input.config ?? DEFAULT_PRICING_CONFIG
  const subtotal = computeSubtotal(input.items)
  const discount = computeDiscount(subtotal, input.coupon)
  const shipping = computeShipping(subtotal, config.shipping, input.shippingMethod)
  const tax = computeTax(subtotal, shipping, discount, config.tax)
  const total = Math.max(0, subtotal + shipping + tax - discount)
  return { subtotal, shipping, discount, tax, total }
}
