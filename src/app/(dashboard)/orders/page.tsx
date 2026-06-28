"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  ShoppingBag,
  Search,
  Eye,
  Package,
  ArrowRight,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

type OrderStatus = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"

const statusTabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
]

const orders = [
  { id: "ORD-001", date: "2026-06-20", items: 3, total: 45000, status: "delivered" as const, payment: "completed" as const },
  { id: "ORD-002", date: "2026-06-18", items: 1, total: 12500, status: "shipped" as const, payment: "completed" as const },
  { id: "ORD-003", date: "2026-06-15", items: 5, total: 89000, status: "processing" as const, payment: "completed" as const },
  { id: "ORD-004", date: "2026-06-12", items: 2, total: 23000, status: "pending" as const, payment: "pending" as const },
  { id: "ORD-005", date: "2026-06-10", items: 1, total: 8500, status: "cancelled" as const, payment: "refunded" as const },
  { id: "ORD-006", date: "2026-06-08", items: 4, total: 67000, status: "delivered" as const, payment: "completed" as const },
  { id: "ORD-007", date: "2026-06-05", items: 2, total: 34000, status: "delivered" as const, payment: "completed" as const },
  { id: "ORD-008", date: "2026-06-01", items: 1, total: 15000, status: "cancelled" as const, payment: "refunded" as const },
]

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "secondary"> = {
  delivered: "success",
  shipped: "success",
  processing: "warning",
  pending: "secondary",
  cancelled: "danger",
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        formatPrice(order.total).includes(search)
      return matchesTab && matchesSearch
    })
  }, [activeTab, search])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          My Orders
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="mb-0"
            className="pl-9"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-0">
            {filtered.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.date)}
                      </TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={order.payment === "completed" ? "success" : order.payment === "refunded" ? "danger" : "warning"}
                        >
                          {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No orders found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {search
                    ? "No orders match your search criteria"
                    : "You haven't placed any orders yet"}
                </p>
                {!search && (
                  <Link href="/products">
                    <Button className="mt-4 gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Start Shopping
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
