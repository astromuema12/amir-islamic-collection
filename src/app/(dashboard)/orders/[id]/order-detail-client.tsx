"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { OrderTimeline } from "@/components/dashboard/order-timeline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Download,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  Truck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { formatPrice, formatDateTime } from "@/lib/utils"
import {
  cancelOrder,
  confirmDelivery,
  type getOrder,
} from "@/lib/actions/order-actions"

type OrderDetail = NonNullable<Awaited<ReturnType<typeof getOrder>>>

const statusVariant: Record<
  string,
  "success" | "warning" | "default" | "danger" | "secondary"
> = {
  delivered: "success",
  shipped: "success",
  confirmed: "default",
  processing: "warning",
  pending: "secondary",
  cancelled: "danger",
  returned: "danger",
}

const paymentVariant: Record<
  string,
  "success" | "warning" | "default" | "danger" | "secondary"
> = {
  completed: "success",
  pending: "warning",
  refunded: "danger",
  failed: "danger",
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function OrderDetailClient({ order }: { order: OrderDetail }) {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const orderRef = `#${order.id.slice(0, 8).toUpperCase()}`
  const address = order.shippingAddress

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      const result = await cancelOrder(order.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Order cancelled successfully")
      setCancelOpen(false)
      router.refresh()
    } catch {
      toast.error("Failed to cancel order")
    } finally {
      setCancelling(false)
    }
  }

  const handleConfirmDelivery = async () => {
    setConfirming(true)
    try {
      const result = await confirmDelivery(order.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Delivery confirmed. Thank you!")
      router.refresh()
    } catch {
      toast.error("Failed to confirm delivery")
    } finally {
      setConfirming(false)
    }
  }

  const handleDownloadInvoice = () => {
    const rows = order.items
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.productName)}</td>
            <td style="text-align:center">${item.quantity}</td>
            <td style="text-align:right">${escapeHtml(formatPrice(Number(item.price)))}</td>
            <td style="text-align:right">${escapeHtml(formatPrice(Number(item.price) * item.quantity))}</td>
          </tr>`
      )
      .join("")

    const discountRow =
      Number(order.discount) > 0
        ? `<tr><td colspan="3" style="text-align:right">Discount</td><td style="text-align:right">-${escapeHtml(formatPrice(Number(order.discount)))}</td></tr>`
        : ""

    const addressHtml = address
      ? `<p>${escapeHtml(address.fullName)}</p>
         <p>${escapeHtml(address.street)}</p>
         <p>${escapeHtml(address.city)}, ${escapeHtml(address.state)}</p>
         <p>${escapeHtml(address.country)}${address.zipCode ? ` - ${escapeHtml(address.zipCode)}` : ""}</p>
         <p>${escapeHtml(address.phone)}</p>`
      : "<p>No shipping address on file</p>"

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice ${escapeHtml(orderRef)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 40px; }
  h1 { color: #166534; margin-bottom: 4px; }
  .muted { color: #6b7280; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  th { text-align: left; background: #f9fafb; }
  .totals td { border: none; padding: 4px 10px; }
  .grand td { font-weight: bold; border-top: 1px solid #d1d5db; font-size: 16px; }
  .grid { display: flex; justify-content: space-between; gap: 40px; margin-top: 24px; }
</style>
</head>
<body>
  <h1>Amir Islamic Collection</h1>
  <p class="muted">Invoice ${escapeHtml(orderRef)}</p>
  <p class="muted">Placed on ${escapeHtml(formatDateTime(order.createdAt))}</p>
  <div class="grid">
    <div>
      <strong>Ship To</strong>
      ${addressHtml}
    </div>
    <div>
      <strong>Payment</strong>
      <p>Method: ${escapeHtml(order.paymentMethod ?? "—")}</p>
      <p>Status: ${escapeHtml(capitalize(order.paymentStatus))}</p>
      ${order.trackingNumber ? `<p>Tracking: ${escapeHtml(order.trackingNumber)}</p>` : ""}
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <table class="totals">
    <tr><td colspan="3" style="text-align:right">Subtotal</td><td style="text-align:right">${escapeHtml(formatPrice(Number(order.subtotal)))}</td></tr>
    <tr><td colspan="3" style="text-align:right">Shipping</td><td style="text-align:right">${escapeHtml(formatPrice(Number(order.shipping)))}</td></tr>
    <tr><td colspan="3" style="text-align:right">Tax</td><td style="text-align:right">${escapeHtml(formatPrice(Number(order.tax)))}</td></tr>
    ${discountRow}
    <tr class="grand"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">${escapeHtml(formatPrice(Number(order.total)))}</td></tr>
  </table>
  <p class="muted" style="margin-top:32px">Thank you for shopping with Amir Islamic Collection.</p>
</body>
</html>`

    const win = window.open("", "_blank", "width=820,height=920")
    if (!win) {
      toast.error("Please allow pop-ups to download the invoice")
      return
    }
    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
  }

  const canCancel = ["pending", "confirmed"].includes(order.status)
  const canConfirm = order.status === "shipped"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/orders")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Order {orderRef}
            </h2>
            <Badge variant={statusVariant[order.status] ?? "secondary"}>
              {capitalize(order.status)}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Items Ordered
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                              {item.productImage ? (
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <span className="font-medium">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatPrice(Number(item.price))}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-1.5 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(Number(order.shipping))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(Number(order.tax))}</span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                      <span>-{formatPrice(Number(order.discount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1.5 text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {order.trackingNumber && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Tracking Information
                  </CardTitle>
                  <CardDescription>
                    Tracking number: {order.trackingNumber}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          )}

          {order.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline
                  currentStatus={order.status}
                  createdAt={new Date(order.createdAt).toISOString()}
                  updatedAt={new Date(order.updatedAt).toISOString()}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {address ? (
                  <>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-muted-foreground">{address.street}</p>
                    <p className="text-muted-foreground">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-muted-foreground">
                      {address.country}
                      {address.zipCode ? ` - ${address.zipCode}` : ""}
                    </p>
                    <p className="text-muted-foreground">{address.phone}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No shipping address on file.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">
                    {order.paymentMethod ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={paymentVariant[order.paymentStatus] ?? "secondary"}>
                    {capitalize(order.paymentStatus)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-3"
          >
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleDownloadInvoice}
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>

            {canConfirm && (
              <Button
                className="w-full gap-2"
                isLoading={confirming}
                onClick={handleConfirmDelivery}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Delivery
              </Button>
            )}

            {canCancel && (
              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogTrigger asChild>
                  <Button variant="danger" className="w-full gap-2">
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Cancel Order
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this order? This action
                      cannot be undone. A refund will be processed according to
                      our refund policy.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCancelOpen(false)}
                    >
                      Keep Order
                    </Button>
                    <Button
                      variant="danger"
                      isLoading={cancelling}
                      onClick={handleCancelOrder}
                    >
                      Yes, Cancel Order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
