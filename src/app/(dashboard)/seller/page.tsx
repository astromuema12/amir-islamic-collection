"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Plus,
  Share2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Box,
  Wallet,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"

const revenueData: { date: string; revenue: number; orders: number }[] = []

const recentOrders: { id: string; customer: string; product: string; total: number; status: string; date: Date }[] = []

const lowStockProducts: { name: string; stock: number; threshold: number }[] = []

const statusColor: Record<string, "warning" | "default" | "success" | "danger" | "secondary"> = {
  pending: "warning",
  processing: "default",
  shipped: "secondary",
  delivered: "success",
  cancelled: "danger",
}

export default function SellerOverviewPage() {
  const [timeframe] = useState<"7d" | "30d" | "90d">("30d")

  const stats = useMemo(
    () => [
      {
        title: "Total Products",
        value: "0",
        change: undefined,
        trend: undefined,
        icon: Package,
        color: "text-primary bg-primary/10",
      },
      {
        title: "Active Listings",
        value: "0",
        change: undefined,
        trend: undefined,
        icon: Box,
        color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
      },
      {
        title: "Total Orders",
        value: "0",
        sub: {
          pending: 0,
          completed: 0,
          cancelled: 0,
        },
        icon: ShoppingCart,
        color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10",
      },
      {
        title: "Revenue",
        value: "KES 0",
        sub: {
          pending: "KES 0",
          withdrawn: "KES 0",
        },
        change: undefined,
        trend: undefined,
        icon: DollarSign,
        color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s your store performance overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Store
          </Link>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-premium-foreground px-4 py-2 text-sm font-medium hover:from-amber-600 hover:via-yellow-600 hover:to-amber-500 shadow-md shadow-amber-500/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("rounded-lg p-2", stat.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-success" : "text-destructive"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>from last month</span>
                  </p>
                )}
                {stat.sub && "pending" in stat.sub && (
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    {stat.sub.pending !== undefined && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-warning" />
                        {stat.sub.pending} pending
                      </span>
                    )}
                    {stat.sub.completed !== undefined && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        {stat.sub.completed} completed
                      </span>
                    )}
                    {stat.sub.cancelled !== undefined && (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-destructive" />
                        {stat.sub.cancelled} cancelled
                      </span>
                    )}
                    {stat.sub.withdrawn !== undefined && (
                      <span className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.sub.withdrawn} withdrawn
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <div className="flex items-center gap-1 rounded-lg border p-0.5">
              {["7d", "30d", "90d"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    timeframe === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: unknown) => `KES ${(Number(v) / 1000).toFixed(0)}k`}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value: unknown) => formatPrice(Number(value))}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/seller/products/new"
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full justify-start"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full justify-start"
            >
              <Eye className="h-4 w-4" />
              View Your Store
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full justify-start"
              onClick={() => navigator.clipboard.writeText(window.location.origin)}
            >
              <Share2 className="h-4 w-4" />
              Share Store Link
            </button>
            <Link
              href="/seller/withdrawals"
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors w-full justify-start"
            >
              <Wallet className="h-4 w-4" />
              Withdraw Funds
            </Link>
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.length > 0 && lowStockProducts.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {item.threshold}
                  </p>
                </div>
                <Badge variant="danger">{item.stock} left</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link
            href="/seller/orders"
            className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.product}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColor[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
