"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShoppingBag, Search, Eye, Package } from "lucide-react"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import type { getOrders } from "@/lib/actions/order-actions"

type OrderListItem = Awaited<ReturnType<typeof getOrders>>[number]

type OrderStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"

const statusTabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
]

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

export function OrdersClient({ orders }: { orders: OrderListItem[] }) {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status === activeTab
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        formatPrice(Number(order.total)).includes(search)
      return matchesTab && matchesSearch
    })
  }, [orders, activeTab, search])

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
          <CardContent className="p-0 overflow-x-auto">
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
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>{order.itemCount}</TableCell>
                      <TableCell>{formatPrice(Number(order.total))}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status] ?? "secondary"}>
                          {capitalize(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={paymentVariant[order.paymentStatus] ?? "secondary"}
                        >
                          {capitalize(order.paymentStatus)}
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
