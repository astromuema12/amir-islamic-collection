"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  DollarSign, ShoppingBag, Package, Users, Store,
  Plus, Eye, FileBarChart, ArrowRight, CreditCard,
  PackageX,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { AreaChartCard } from "@/components/admin/chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatPrice } from "@/lib/utils"

type DashboardData = {
  stats: {
    totalUsers: number
    totalSellers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    pendingSellers: number
  }
  recentOrders: {
    id: string
    total: string
    status: string
    createdAt: Date
    userId: string
    userName: string
  }[]
  recentUsers: {
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
  }[]
  lowInventoryProducts: {
    id: string
    name: string
    stock: number
    price: string
    images: string[] | null
  }[]
  revenueChart: {
    date: string
    revenue: string
    orders: number
    sales: number
  }[]
}

const statusBadge = (status: string) => {
  const variants: Record<string, "default" | "success" | "warning" | "danger"> = {
    delivered: "success",
    shipped: "default",
    processing: "warning",
    pending: "danger",
    confirmed: "default",
    cancelled: "danger",
  }
  return <Badge variant={variants[status] || "default"}>{status}</Badge>
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminDashboardClient({ data }: { data: DashboardData }) {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const { stats, recentOrders, recentUsers, lowInventoryProducts, revenueChart } = data

  const chartData = revenueChart.map((d) => ({
    name: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Number(d.revenue),
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Welcome */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground">
            {dateTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            —{" "}
            {dateTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-1 h-4 w-4" />
              Create Product
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">Manage Orders</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/analytics">
              <FileBarChart className="mr-1 h-4 w-4" />
              Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          description="From delivered orders"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Sellers"
          value={stats.totalSellers.toLocaleString()}
          icon={<Store className="h-5 w-5" />}
          description={
            stats.pendingSellers > 0
              ? `${stats.pendingSellers} pending approval`
              : undefined
          }
        />
        <StatsCard
          title="Low Stock Items"
          value={lowInventoryProducts.length}
          icon={<PackageX className="h-5 w-5" />}
          description="Products with ≤10 in stock"
          trend={
            lowInventoryProducts.length > 0
              ? { value: lowInventoryProducts.length, positive: false }
              : undefined
          }
        />
      </div>

      {/* Charts & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Revenue Overview (Last 30 Days)"
            data={chartData.length > 0 ? chartData : [{ name: "No data", revenue: 0 }]}
            dataKey="revenue"
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4 text-emerald-500" />
                  Create New Product
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/orders">
                  <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                  View All Orders
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/sellers">
                  <Store className="mr-2 h-4 w-4 text-emerald-500" />
                  Approve Sellers
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/coupons">
                  <CreditCard className="mr-2 h-4 w-4 text-emerald-500" />
                  Manage Coupons
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/analytics">
                  <FileBarChart className="mr-2 h-4 w-4 text-emerald-500" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders & Recent Users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {getInitials(order.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {order.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(Number(order.total))}
                      </p>
                      {statusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/customers">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No users yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        user.role === "seller" || user.role === "admin"
                          ? "premium"
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Inventory Products */}
      {lowInventoryProducts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Low Inventory Alert</CardTitle>
              <Badge variant="danger" className="ml-1">
                {lowInventoryProducts.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                Manage Stock <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowInventoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(Number(product.price))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        product.stock === 0
                          ? "danger"
                          : product.stock <= 3
                            ? "warning"
                            : "default"
                      }
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} left`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
