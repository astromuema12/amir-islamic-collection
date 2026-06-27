"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice, formatDate, formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface OrderItem {
  id: string
  name: string
  image?: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  email: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  status: string
  paymentStatus: string
  date: Date
  trackingNumber?: string
  notes?: string
}

const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => ({
  id: `ORD-${String(1000 + i).padStart(4, "0")}`,
  customer: ["Aisha J.", "Fatima S.", "Zainab M.", "Khadija R.", "Mariam I.", "Aminah B.", "Safiya K.", "Halima D."][i % 8],
  email: `customer${i + 1}@email.com`,
  phone: "+254 800 000 000" + i,
  address: "123 Moi Avenue, Nairobi, Kenya",
  items: [
    {
      id: `item-${i}-1`,
      name: ["Premium Prayer Mat", "Silk Hijab Set", "Oud Perfume", "Qur'an with Stand", "Islamic Wall Art", "Tasbih", "Abaya", "Thobe"][i % 8],
      quantity: Math.floor(Math.random() * 3) + 1,
      price: [15000, 8500, 12000, 25000, 9500, 3500, 18000, 14000][i % 8],
    },
  ],
  total: [15000, 8500, 12000, 25000, 9500, 3500, 18000, 14000][i % 8] * (Math.floor(Math.random() * 3) + 1),
  subtotal: [15000, 8500, 12000, 25000, 9500, 3500, 18000, 14000][i % 8] * (Math.floor(Math.random() * 3) + 1),
  shipping: 1500,
  status: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"][i % 6],
  paymentStatus: ["completed", "pending", "completed", "completed", "completed", "failed"][i % 6],
  date: new Date(Date.now() - i * 86400000 + i * 3600000),
  trackingNumber: i % 3 === 0 ? `TRK-${String(80000 + i).padStart(6, "0")}` : undefined,
  notes: i % 4 === 0 ? "Customer requested gift wrapping" : undefined,
}))

const statusColor: Record<string, "warning" | "default" | "secondary" | "success" | "danger"> = {
  pending: "warning",
  confirmed: "default",
  processing: "secondary",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
}

const nextStatus: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
}

export default function SellerOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const perPage = 8

  const filtered = useMemo(() => {
    let result = [...mockOrders]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter)
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const updateStatus = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage incoming orders and update their status
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or customer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((order) => (
                  <>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedId(
                          expandedId === order.id ? null : order.id
                        )
                      }
                    >
                      <TableCell>
                        {expandedId === order.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColor[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.paymentStatus === "completed"
                              ? "success"
                              : order.paymentStatus === "failed"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(order.date)}
                      </TableCell>
                    </TableRow>
                    {expandedId === order.id && (
                      <TableRow key={`${order.id}-details`}>
                        <TableCell colSpan={8} className="bg-muted/30 p-4">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                Order Items
                              </h4>
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} ×{" "}
                                      {formatPrice(item.price)}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                              <Separator />
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Shipping</span>
                                  <span>{formatPrice(order.shipping)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Shipping Details
                              </h4>
                              <div className="rounded-lg border bg-card p-3 space-y-2 text-sm">
                                <p className="font-medium">{order.customer}</p>
                                <p className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5" />
                                  {order.phone}
                                </p>
                                <p className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5" />
                                  {order.email}
                                </p>
                                <p className="flex items-start gap-2 text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                  {order.address}
                                </p>
                              </div>
                              {order.trackingNumber && (
                                <div className="rounded-lg border bg-card p-3 text-sm">
                                  <p className="text-muted-foreground">
                                    Tracking:
                                  </p>
                                  <p className="font-medium">
                                    {order.trackingNumber}
                                  </p>
                                </div>
                              )}
                              {order.notes && (
                                <div className="rounded-lg border bg-card p-3 text-sm">
                                  <p className="text-muted-foreground">Notes:</p>
                                  <p>{order.notes}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Update Status
                              </h4>
                              <div className="rounded-lg border bg-card p-3 space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Current: <Badge variant={statusColor[order.status]}>{order.status}</Badge>
                                </p>
                                <Separator />
                                <p className="text-xs font-medium mb-2">
                                  Change to:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {nextStatus[order.status]?.length > 0 ? (
                                    nextStatus[order.status].map((s) => (
                                      <Button
                                        key={s}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateStatus(order.id, s)}
                                      >
                                        {s}
                                      </Button>
                                    ))
                                  ) : (
                                    <p className="text-xs text-muted-foreground">
                                      No further status changes available
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <p className="text-sm text-muted-foreground">
                        No orders found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * perPage + 1}-
                {Math.min(page * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
