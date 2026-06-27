"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  DollarSign, ShoppingBag, Package, Users, Store, Activity,
  TrendingUp, TrendingDown, Plus, Eye, FileBarChart,
  ArrowRight, Clock, Star, CreditCard
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { AreaChartCard } from "@/components/admin/chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice, formatDateTime } from "@/lib/utils"

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 500000 + 100000),
  orders: Math.floor(Math.random() * 50 + 10),
}))

const recentOrders = [
  { id: "ORD-001", customer: "Aisha Bello", amount: 24800, status: "delivered", items: 3, date: new Date() },
  { id: "ORD-002", customer: "Fatima Usman", amount: 12500, status: "processing", items: 1, date: new Date() },
  { id: "ORD-003", customer: "Khadija Yusuf", amount: 36200, status: "shipped", items: 4, date: new Date() },
  { id: "ORD-004", customer: "Muhammad Abubakar", amount: 8900, status: "pending", items: 2, date: new Date() },
  { id: "ORD-005", customer: "Zainab Abdullah", amount: 45300, status: "delivered", items: 5, date: new Date() },
]

const recentRegistrations = [
  { name: "Aisha Bello", email: "aisha@example.com", role: "seller", date: new Date() },
  { name: "Fatima Usman", email: "fatima@example.com", role: "user", date: new Date() },
  { name: "Khadija Yusuf", email: "khadija@example.com", role: "seller", date: new Date() },
  { name: "Muhammad Abubakar", email: "muhammad@example.com", role: "user", date: new Date() },
  { name: "Zainab Abdullah", email: "zainab@example.com", role: "user", date: new Date() },
]

const topProducts = [
  { name: "Premium Prayer Mat", sales: 234, revenue: 1872000, rating: 4.8 },
  { name: "Holy Qur'an - Leather Bound", sales: 189, revenue: 1417500, rating: 4.9 },
  { name: "Miswak Toothbrush Pack", sales: 156, revenue: 468000, rating: 4.7 },
  { name: "Islamic Wall Art - Ayatul Kursi", sales: 142, revenue: 852000, rating: 4.6 },
  { name: "Oud Perfume Oil Set", sales: 128, revenue: 1024000, rating: 4.8 },
]

const statusBadge = (status: string) => {
  const variants: Record<string, "default" | "success" | "warning" | "danger"> = {
    delivered: "success", shipped: "default", processing: "warning", pending: "danger",
  }
  return <Badge variant={variants[status] || "default"}>{status}</Badge>
}

export default function AdminDashboard() {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

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
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })} — {dateTime.toLocaleTimeString("en-US", {
              hour: "numeric", minute: "2-digit"
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
            <Link href="/admin/orders">
              Manage Orders
            </Link>
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
          value="₦12,847,500"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12.5, positive: true }}
          description="Last 30 days"
        />
        <StatsCard
          title="Total Orders"
          value="1,284"
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: 8.2, positive: true }}
          description="+48 this week"
        />
        <StatsCard
          title="Total Products"
          value="3,521"
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 3.1, positive: true }}
          description="24 new this month"
        />
        <StatsCard
          title="Total Users"
          value="12,847"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 15.3, positive: true }}
          description="356 new this week"
        />
        <StatsCard
          title="Total Sellers"
          value="847"
          icon={<Store className="h-5 w-5" />}
          trend={{ value: 5.7, positive: true }}
          description="12 pending verification"
        />
        <StatsCard
          title="Active Now"
          value="128"
          icon={<Activity className="h-5 w-5" />}
          description="42 on store, 86 in admin"
        />
      </div>

      {/* Charts & Widgets */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Revenue Overview (Last 30 Days)"
            data={revenueData}
            dataKey="revenue"
          />
        </div>

        {/* Quick Actions */}
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
                <Link href="/admin/coupons/new">
                  <CreditCard className="mr-2 h-4 w-4 text-emerald-500" />
                  Create Coupon
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

      {/* Recent Orders & Registrations */}
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
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {order.customer.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.id} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
                    {statusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {recentRegistrations.map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === "seller" ? "premium" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.sales} sales</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
