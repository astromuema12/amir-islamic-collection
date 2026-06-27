"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Eye, Download, X, Check, Truck, Clock, AlertTriangle,
  Search, Filter, FileText, Printer
} from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice, formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface Order {
  id: string
  customer: string
  email: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  discount: number
  status: string
  paymentStatus: string
  items: number
  date: Date
  trackingNumber?: string
  paymentMethod: string
}

const mockOrders: Order[] = Array.from({ length: 45 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, "0")}`,
  customer: ["Aisha Bello", "Fatima Usman", "Khadija Yusuf", "Muhammad Abubakar", "Zainab Abdullah"][i % 5],
  email: ["aisha@example.com", "fatima@example.com", "khadija@example.com", "muhammad@example.com", "zainab@example.com"][i % 5],
  total: Math.floor(Math.random() * 100000 + 5000),
  subtotal: 0,
  shipping: 2500,
  tax: 0,
  discount: 0,
  status: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"][Math.floor(Math.random() * 6)],
  paymentStatus: ["pending", "completed", "failed", "refunded"][Math.floor(Math.random() * 4)],
  items: Math.floor(Math.random() * 5 + 1),
  date: new Date(Date.now() - Math.random() * 10000000000),
  trackingNumber: Math.random() > 0.5 ? `TRK${Date.now().toString(36).toUpperCase()}` : undefined,
  paymentMethod: ["Paystack", "Flutterwave", "Bank Transfer", "Cash on Delivery"][Math.floor(Math.random() * 4)],
}))

const statusBadge = (status: string) => {
  const map: Record<string, "default" | "success" | "warning" | "danger" | "secondary" | "outline"> = {
    delivered: "success", shipped: "default", processing: "warning", confirmed: "secondary",
    pending: "danger", cancelled: "outline", refunded: "outline", completed: "success", failed: "danger",
  }
  return <Badge variant={map[status] || "default"}>{status}</Badge>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [updateStatus, setUpdateStatus] = useState<string>("")
  const [cancelReason, setCancelReason] = useState("")
  const [showCancel, setShowCancel] = useState(false)

  const filtered = orders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && o.status !== statusFilter) return false
    if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / 10)
  const paginated = filtered.slice((page - 1) * 10, page * 10)

  const handleStatusUpdate = () => {
    if (!viewOrder || !updateStatus) return
    setOrders(prev => prev.map(o => o.id === viewOrder.id ? { ...o, status: updateStatus } : o))
    setViewOrder(prev => prev ? { ...prev, status: updateStatus } : null)
    setUpdateStatus("")
    toast.success(`Order ${viewOrder.id} status updated to ${updateStatus}`)
  }

  const handleCancel = () => {
    if (!viewOrder) return
    setOrders(prev => prev.map(o => o.id === viewOrder.id ? { ...o, status: "cancelled" } : o))
    setShowCancel(false)
    setCancelReason("")
    toast.success(`Order ${viewOrder.id} cancelled`)
  }

  const handleInvoice = () => {
    toast.success("Invoice downloaded")
  }

  const columns: Column<Order>[] = [
    { key: "id", label: "Order", sortable: true,
      render: (o) => (
        <button onClick={() => setViewOrder(o)} className="font-medium text-primary hover:underline text-left">
          {o.id}
        </button>
      ),
    },
    { key: "customer", label: "Customer", sortable: true },
    { key: "total", label: "Total", sortable: true,
      render: (o) => <span className="font-medium">{formatPrice(o.total)}</span>,
      className: "text-right",
    },
    { key: "items", label: "Items", className: "text-center" },
    { key: "status", label: "Status", sortable: true, render: (o) => statusBadge(o.status) },
    { key: "paymentStatus", label: "Payment", render: (o) => statusBadge(o.paymentStatus) },
    { key: "paymentMethod", label: "Method", hidden: true },
    { key: "date", label: "Date", sortable: true,
      render: (o) => <span className="text-muted-foreground text-xs">{formatDateTime(o.date)}</span>,
    },
    { key: "actions", label: "Actions",
      render: (o) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewOrder(o)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleInvoice}>
            <FileText className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Orders</h1>
          <p className="text-muted-foreground">Manage all marketplace orders</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
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
        <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1) }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 w-[250px]"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchable={false}
        onExport={handleInvoice}
      />

      {/* Order Detail Sheet */}
      <Sheet open={!!viewOrder && !showCancel} onOpenChange={(o) => { if (!o) setViewOrder(null) }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {viewOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order {viewOrder.id}</SheetTitle>
                <SheetDescription>
                  Placed on {formatDateTime(viewOrder.date)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{viewOrder.customer}</p>
                    <p className="text-xs text-muted-foreground">{viewOrder.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    {statusBadge(viewOrder.status)}
                    <div className="mt-1">{statusBadge(viewOrder.paymentStatus)}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Order Summary</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(viewOrder.total - viewOrder.shipping - viewOrder.tax + viewOrder.discount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatPrice(viewOrder.shipping)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(viewOrder.tax)}</span></div>
                    {viewOrder.discount > 0 && (
                      <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(viewOrder.discount)}</span></div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(viewOrder.total)}</span></div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Payment</p>
                  <p className="text-sm text-muted-foreground">{viewOrder.paymentMethod}</p>
                  {viewOrder.trackingNumber && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Tracking</p>
                      <p className="text-sm text-muted-foreground">{viewOrder.trackingNumber}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Update Status</p>
                  <div className="flex gap-2">
                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleStatusUpdate} disabled={!updateStatus}>
                      <Check className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleInvoice}>
                    <Download className="h-4 w-4 mr-1" /> Invoice
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowCancel(true)}
                    disabled={viewOrder.status === "cancelled" || viewOrder.status === "delivered"}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancel Dialog */}
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order {viewOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Please provide a reason for cancellation:</p>
            <Textarea
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancel(false)}>Keep Order</Button>
            <Button variant="danger" onClick={handleCancel}>Cancel Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
