"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
} from "lucide-react"
import { formatPrice, formatDateTime } from "@/lib/utils"

const order = {
  id: "ORD-003",
  date: "2026-06-15T10:30:00Z",
  updatedAt: "2026-06-16T14:20:00Z",
  status: "processing",
  payment: "completed",
  paymentMethod: "Card Payment",
  subtotal: 82000,
  shipping: 2500,
  discount: 0,
  tax: 4500,
  total: 89000,
  notes: "Please leave at the mosque entrance if I'm not home.",
  trackingNumber: "NG-1234-5678-90",
  items: [
    { id: "1", name: "Premium Silk Prayer Mat - Green", quantity: 2, price: 25000, image: "/placeholder.png" },
    { id: "2", name: "Tasbih - Amber Beads 33 Beads", quantity: 1, price: 8500, image: "/placeholder.png" },
    { id: "3", name: "Holy Qur'an - Leather Cover (Green)", quantity: 1, price: 15000, image: "/placeholder.png" },
    { id: "4", name: "Islamic Wall Art - Ayatul Kursi", quantity: 1, price: 8500, image: "/placeholder.png" },
  ],
  shippingAddress: {
    fullName: "Ahmad Abdullah",
    phone: "+2548012345678",
    street: "42 Suleiman Crescent",
    city: "Nairobi",
    state: "Nairobi",
    country: "Kenya",
    zipCode: "100271",
  },
  tracking: [
    { location: "Nairobi Sorting Center", date: "2026-06-17T08:00:00Z", description: "Package arrived at sorting facility" },
    { location: "Nairobi, Kenya", date: "2026-06-16T14:20:00Z", description: "Package picked up by courier" },
    { location: "Nairobi", date: "2026-06-15T16:00:00Z", description: "Order processed and ready" },
  ],
}

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "secondary"> = {
  delivered: "success",
  shipped: "success",
  processing: "warning",
  pending: "secondary",
  cancelled: "danger",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast.success("Order cancelled successfully")
      setCancelOpen(false)
    } catch {
      toast.error("Failed to cancel order")
    } finally {
      setCancelling(false)
    }
  }

  const handleDownloadInvoice = () => {
    toast.success("Invoice downloaded")
  }

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
              Order {params.id}
            </h2>
            <Badge variant={statusVariant[order.status]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Placed on {formatDateTime(order.date)}
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
              <CardContent>
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
                            <div className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-1.5 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1.5 text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {order.tracking.length > 0 && (
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
                <CardContent>
                  <div className="space-y-4">
                    {order.tracking.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-3 w-3 rounded-full bg-primary" />
                          {i < order.tracking.length - 1 && (
                            <div className="h-full w-0.5 bg-border" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">{event.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(event.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  createdAt={order.date}
                  updatedAt={order.updatedAt}
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
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.country} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
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
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusVariant[order.payment] || "default"}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{formatPrice(order.total)}</span>
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

            {order.status === "pending" || order.status === "processing" ? (
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
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
