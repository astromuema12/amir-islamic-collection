"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, X, Search } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { PageHeader } from "@/components/admin/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  getAdminOrders, getAdminOrderById, updateOrderStatus, updatePaymentStatus,
} from "@/lib/actions/admin-actions"

interface AdminOrder {
  id: string
  total: string
  subtotal: string
  shipping: string
  tax: string
  discount: string
  status: string
  paymentStatus: string
  paymentMethod: string | null
  couponCode: string | null
  trackingNumber: string | null
  createdAt: Date
  userId: string
  customerName: string | null
  customerEmail: string | null
  itemCount: number
}

interface OrderDetail {
  order: {
    id: string
    status: string
    total: string
    subtotal: string
    shipping: string
    tax: string
    discount: string
    paymentMethod: string | null
    paymentStatus: string
    couponCode: string | null
    notes: string | null
    trackingNumber: string | null
    createdAt: Date
  }
  user: { id: string; name: string | null; email: string; phone: string | null } | null
  items: { id: string; productName: string; productImage: string | null; quantity: number; price: string }[]
  shippingAddress: {
    id: string
    fullName: string
    phone: string
    street: string
    city: string
    state: string | null
    country: string
    zipCode: string | null
  } | null
  billingAddress: {
    id: string
    fullName: string
    phone: string
    street: string
    city: string
    state: string | null
    country: string
    zipCode: string | null
  } | null
}

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"]
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"]

const statusBadge = (status: string) => {
  const map: Record<string, "default" | "success" | "warning" | "danger" | "secondary" | "outline"> = {
    delivered: "success",
    shipped: "default",
    processing: "warning",
    confirmed: "secondary",
    pending: "warning",
    cancelled: "outline",
    returned: "danger",
    completed: "success",
    failed: "danger",
    refunded: "outline",
  }
  return <Badge variant={map[status] || "secondary"}>{status}</Badge>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [viewOrder, setViewOrder] = useState<OrderDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newPayment, setNewPayment] = useState("")
  const [tracking, setTracking] = useState("")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const result = await getAdminOrders({
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      payment: paymentFilter !== "all" ? paymentFilter : undefined,
      page,
      limit: 10,
    })
    setOrders(result.orders as AdminOrder[])
    setTotal(result.total)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [search, statusFilter, paymentFilter, page])

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(), search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchOrders, search])

  const openDetail = async (id: string) => {
    setDetailLoading(true)
    setViewOrder(null)
    const detail = await getAdminOrderById(id)
    if (detail) {
      setViewOrder(detail as OrderDetail)
      setNewStatus(detail.order.status)
      setNewPayment(detail.order.paymentStatus)
      setTracking(detail.order.trackingNumber ?? "")
    } else {
      toast.error("Failed to load order")
    }
    setDetailLoading(false)
  }

  const handleStatusUpdate = async () => {
    if (!viewOrder) return
    const res = await updateOrderStatus(viewOrder.order.id, newStatus, tracking || undefined)
    if ("error" in res) {
      toast.error(res.error)
      return
    }
    setViewOrder({ ...viewOrder, order: { ...viewOrder.order, status: newStatus, trackingNumber: tracking || null } })
    fetchOrders()
    toast.success("Order updated")
  }

  const handlePaymentUpdate = async () => {
    if (!viewOrder) return
    const res = await updatePaymentStatus(viewOrder.order.id, newPayment)
    if ("error" in res) {
      toast.error(res.error)
      return
    }
    setViewOrder({ ...viewOrder, order: { ...viewOrder.order, paymentStatus: newPayment } })
    fetchOrders()
    toast.success("Payment status updated")
  }

  const handleCancel = async () => {
    if (!viewOrder) return
    const res = await updateOrderStatus(viewOrder.order.id, "cancelled")
    if ("error" in res) {
      toast.error(res.error)
      return
    }
    setViewOrder({ ...viewOrder, order: { ...viewOrder.order, status: "cancelled" } })
    setNewStatus("cancelled")
    fetchOrders()
    toast.success("Order cancelled")
  }

  const columns: Column<AdminOrder>[] = [
    {
      key: "id",
      label: "Order",
      sortable: true,
      render: (o) => (
        <button
          onClick={() => openDetail(o.id)}
          className="text-left font-medium text-primary hover:underline"
        >
          #{o.id.slice(0, 8)}
        </button>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (o) => (
        <div>
          <p className="font-medium">{o.customerName ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      className: "text-center",
      render: (o) => <span>{o.itemCount}</span>,
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      className: "text-right",
      render: (o) => <span className="font-medium">{formatPrice(Number(o.total))}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (o) => statusBadge(o.status),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (o) => statusBadge(o.paymentStatus),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (o) => <span className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (o) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(o.id)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage all marketplace orders"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search order, customer, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-[260px] pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSort={(key, dir) => {
          setOrders((prev) =>
            [...prev].sort((a, b) => {
              const aVal = a[key as keyof AdminOrder]
              const bVal = b[key as keyof AdminOrder]
              if (typeof aVal === "string" && typeof bVal === "string") {
                return dir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
              }
              return dir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
            })
          )
        }}
        searchable={false}
        isLoading={loading}
        emptyMessage="No orders found"
      />

      <Sheet open={!!viewOrder || detailLoading} onOpenChange={(o) => { if (!o) { setViewOrder(null); setDetailLoading(false) } }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {detailLoading ? (
            <div className="space-y-4 pt-10">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : viewOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order #{viewOrder.order.id.slice(0, 8)}</SheetTitle>
                <SheetDescription>Placed on {formatDateTime(viewOrder.order.createdAt)}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{viewOrder.user?.name ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{viewOrder.user?.email}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <div>{statusBadge(viewOrder.order.status)}</div>
                    <div>{statusBadge(viewOrder.order.paymentStatus)}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium">Items</p>
                  <div className="divide-y">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2.5">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                          {item.productImage ? (
                            <img src={item.productImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs">{item.productName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium">Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(Number(viewOrder.order.subtotal))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatPrice(Number(viewOrder.order.shipping))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(Number(viewOrder.order.tax))}</span>
                    </div>
                    {Number(viewOrder.order.discount) > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Discount</span>
                        <span>-{formatPrice(Number(viewOrder.order.discount))}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(Number(viewOrder.order.total))}</span>
                    </div>
                  </div>
                </div>

                {viewOrder.shippingAddress && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-sm font-medium">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">
                        {viewOrder.shippingAddress.fullName}
                        <br />
                        {viewOrder.shippingAddress.street}, {viewOrder.shippingAddress.city}
                        <br />
                        {[viewOrder.shippingAddress.state, viewOrder.shippingAddress.zipCode].filter(Boolean).join(", ")}{" "}
                        {viewOrder.shippingAddress.country}
                        <br />
                        {viewOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium">Payment</p>
                  <p className="text-sm text-muted-foreground">
                    {viewOrder.order.paymentMethod ?? "Not set"}
                    {viewOrder.order.couponCode && ` · Coupon ${viewOrder.order.couponCode}`}
                  </p>
                  <div className="mt-2">
                    <label className="mb-1.5 block text-sm font-medium">Payment Status</label>
                    <div className="flex gap-2">
                      <Select value={newPayment} onValueChange={setNewPayment}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handlePaymentUpdate} disabled={newPayment === viewOrder.order.paymentStatus}>
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium">Update Status</p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleStatusUpdate} disabled={newStatus === viewOrder.order.status && tracking === (viewOrder.order.trackingNumber ?? "")}>
                        Save
                      </Button>
                    </div>
                    <Input
                      label="Tracking Number"
                      placeholder="e.g. 1Z999AA10123456784"
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleCancel}
                    disabled={viewOrder.order.status === "cancelled" || viewOrder.order.status === "delivered"}
                  >
                    <X className="h-4 w-4" />
                    Cancel Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
