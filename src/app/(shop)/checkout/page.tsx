"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Resolver } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Package,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrderSummary } from "@/components/cart/order-summary"
import { formatPrice } from "@/lib/utils"
import { addressSchema, type AddressInput } from "@/lib/validations"
import { useCartStore } from "@/store/cart-store"
import { FREE_SHIPPING_THRESHOLD, TAX_RATE, SHIPPING_METHODS } from "@/lib/constants"
import { createOrder, createCheckoutAddress } from "@/lib/actions/order-actions"
import { syncCartToDb } from "@/lib/actions/cart-actions"
import { useCurrentUser } from "@/hooks/use-current-user"
import toast from "react-hot-toast"

type CheckoutStep = "shipping" | "payment" | "review"

const steps = [
  { id: "shipping" as const, label: "Shipping", icon: MapPin },
  { id: "payment" as const, label: "Payment", icon: CreditCard },
  { id: "review" as const, label: "Review", icon: CheckCircle2 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, coupon, removeCoupon, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].name)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId] = useState(() => `AIC-${Date.now().toString(36).toUpperCase()}`)

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const selectedShipping = SHIPPING_METHODS.find((s) => s.name === shippingMethod)!
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : selectedShipping.price
  const discount = useMemo(() => {
    if (!coupon) return 0
    if (coupon.type === "fixed") return Math.min(coupon.value, subtotal)
    const percentOff = subtotal * (coupon.value / 100)
    return coupon.maxDiscount
      ? Math.min(percentOff, coupon.maxDiscount)
      : percentOff
  }, [coupon, subtotal])

  const tax = subtotal * TAX_RATE
  const total = Math.max(0, subtotal + shipping + tax - discount)

  const { user } = useCurrentUser()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema) as Resolver<z.input<typeof addressSchema>>,
    defaultValues: {
      type: "both" as const,
    },
  })

  function handleNext() {
    if (currentStep === "shipping") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("review")
  }

  function handleBack() {
    if (currentStep === "payment") setCurrentStep("shipping")
    else if (currentStep === "review") setCurrentStep("payment")
  }

  async function handlePlaceOrder() {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!user) {
      toast.error("Please sign in to place an order")
      return
    }

    const addressData = getValues()
    const requiredFields = ["fullName", "phone", "street", "city", "state", "country"] as const
    for (const field of requiredFields) {
      if (!addressData[field]?.trim()) {
        toast.error(`Please fill in the ${field === "fullName" ? "full name" : field} field`)
        return
      }
    }

    setIsPlacingOrder(true)
    try {
      const shippingResult = await createCheckoutAddress(user.id, {
        fullName: addressData.fullName,
        phone: addressData.phone,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode || undefined,
        type: "both",
      })

      if ("error" in shippingResult) {
        toast.error(shippingResult.error)
        return
      }

      const syncResult = await syncCartToDb(
        items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        }))
      )

      if ("error" in syncResult) {
        toast.error(syncResult.error ?? "Failed to sync cart")
        return
      }

      const formData = new FormData()
      formData.set("shippingAddressId", shippingResult.id)
      formData.set("billingAddressId", shippingResult.id)
      if (coupon?.code) formData.set("couponCode", coupon.code)

      const result = await createOrder(formData)

      if ("error" in result) {
        switch (result.code) {
          case "OUT_OF_STOCK":
            toast.error(result.error, { duration: 6000 })
            break
          case "INSUFFICIENT_STOCK":
            toast.error(result.error, { duration: 6000 })
            break
          case "CART_EMPTY":
            toast.error("Your cart is empty. Please add items before checking out.")
            break
          default:
            toast.error(result.error || "Failed to place order")
        }
        return
      }

      setOrderPlaced(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. You&apos;ll receive a confirmation email shortly.
          </p>
          <div className="mt-8 rounded-xl border bg-card p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">Order #AIC-{orderId}</span>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total paid</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>Paystack</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{shippingMethod}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/orders">
                View Orders
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto gap-2">
              <Link href="/categories">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 py-20">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add items to your cart before checking out</p>
        </div>
        <Button asChild className="gap-2 mt-2">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4" />
            Start Shopping
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your order in a few steps
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted =
              steps.findIndex((s) => s.id === currentStep) > index
            const Icon = step.icon

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 sm:mx-4 h-0.5 w-12 sm:w-20 transition-colors duration-300 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === "shipping" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Shipping Address</h2>
                    </div>

                    <div className="mb-6 flex items-center gap-2">
                      <Checkbox
                        id="guest"
                        checked={isGuest}
                        onCheckedChange={(checked) => setIsGuest(checked as boolean)}
                      />
                      <Label htmlFor="guest" className="text-sm font-normal cursor-pointer">
                        Checkout as guest (no account required)
                      </Label>
                    </div>

                    <form className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Full Name"
                          placeholder="Enter full name"
                          error={errors.fullName?.message}
                          {...register("fullName")}
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="+254 800 000 0000"
                          error={errors.phone?.message}
                          {...register("phone")}
                        />
                      </div>

                      <Input
                        label="Street Address"
                        placeholder="House number, street name"
                        error={errors.street?.message}
                        {...register("street")}
                      />

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Input
                          label="City"
                          placeholder="City"
                          error={errors.city?.message}
                          {...register("city")}
                        />
                        <Input
                          label="State"
                          placeholder="State"
                          error={errors.state?.message}
                          {...register("state")}
                        />
                        <Input
                          label="ZIP Code"
                          placeholder="ZIP code"
                          error={errors.zipCode?.message}
                          {...register("zipCode")}
                        />
                      </div>

                      <Input
                        label="Country"
                        placeholder="Country"
                        error={errors.country?.message}
                        {...register("country")}
                      />

                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id="same-billing"
                          checked={sameAsBilling}
                          onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                        />
                        <Label htmlFor="same-billing" className="text-sm font-normal cursor-pointer">
                          Billing address same as shipping
                        </Label>
                      </div>
                    </form>

                    <div className="mt-8">
                      <h3 className="text-sm font-semibold mb-3">Shipping Method</h3>
                      <div className="space-y-3">
                        {SHIPPING_METHODS.map((method) => (
                          <label
                            key={method.name}
                            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                              shippingMethod === method.name
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "hover:border-muted-foreground/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={method.name}
                              checked={shippingMethod === method.name}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="h-4 w-4 text-primary"
                            />
                            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                              <Truck
                                className={`h-5 w-5 ${
                                  shippingMethod === method.name
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{method.name}</p>
                                <p className="text-xs text-muted-foreground">{method.days}</p>
                              </div>
                              <span className="text-sm font-semibold">
                                {method.price === 0
                                  ? "Free"
                                  : formatPrice(method.price)}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "payment" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                          paymentMethod === "paystack"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:border-muted-foreground/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="paystack"
                          checked={paymentMethod === "paystack"}
                          onChange={() => setPaymentMethod("paystack")}
                          className="h-4 w-4 text-primary"
                        />
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Paystack</p>
                            <p className="text-xs text-muted-foreground">
                              Pay with card or bank transfer
                            </p>
                          </div>
                        </div>
                      </label>

                      <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="h-4 w-4 text-success" />
                          <span className="text-xs font-medium text-success">
                            Secure payment
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your payment information is processed securely via Paystack. We never
                          store your card details.
                        </p>
                      </div>
                    </div>

                    {paymentMethod === "paystack" && (
                      <div className="mt-6 space-y-4">
                        <Input
                          label="Card Number"
                          placeholder="0000 0000 0000 0000"
                          icon={<CreditCard className="h-4 w-4" />}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 16)
                            const formatted = val.replace(/(.{4})/g, "$1 ").trim()
                            e.target.value = formatted
                          }}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                              if (val.length > 2) {
                                e.target.value = val.slice(0, 2) + "/" + val.slice(2)
                              }
                            }}
                          />
                          <Input
                            label="CVC"
                            placeholder="123"
                            type="password"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4)
                            }}
                          />
                        </div>
                        <Input label="Cardholder Name" placeholder="Name on card" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {currentStep === "review" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Review Your Order</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Shipping Address
                          </h3>
                          <button
                            onClick={() => setCurrentStep("shipping")}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">Full Name</p>
                          <p>Street Address, City, State, ZIP</p>
                          <p>Phone: +254 800 000 0000</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            Shipping Method
                          </h3>
                          <button
                            onClick={() => setCurrentStep("shipping")}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3 text-sm">
                          <p className="font-medium text-foreground">{shippingMethod}</p>
                          <p className="text-muted-foreground">{selectedShipping.days}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            Payment
                          </h3>
                          <button
                            onClick={() => setCurrentStep("payment")}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="rounded-lg bg-muted/30 p-3 text-sm">
                          <p className="font-medium text-foreground capitalize">{paymentMethod}</p>
                          <p className="text-muted-foreground">Pay with card or bank transfer</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          Items ({items.length})
                        </h3>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.productId}
                              className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
                            >
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <OrderSummary
                          subtotal={subtotal}
                          shipping={shipping}
                          discount={discount}
                          couponCode={coupon?.code ?? null}
                          compact
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={currentStep === "shipping" ? () => router.push("/cart") : handleBack}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {currentStep === "shipping" ? "Back to Cart" : "Back"}
            </Button>

            {currentStep === "review" ? (
              <Button
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={isPlacingOrder}
                className="gap-2 w-full sm:w-auto sm:min-w-[180px]"
              >
                {isPlacingOrder ? (
                  "Placing Order..."
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button size="lg" onClick={handleNext} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              couponCode={coupon?.code ?? null}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  )
}
