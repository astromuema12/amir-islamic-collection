"use client"

import Link from "next/link"
import {
  DollarSign, ShoppingBag, Package, Users, Store,
  Plus, ArrowRight, PackageX, FileBarChart, ShoppingCart,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { AreaChartCard } from "@/components/admin/chart"
import { PageHeader } from "@/components/admin/page-layout"
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
  const variants: Record<string, "default" | "secondary" | "success" | "warning" | "danger"> = {
    delivered: "success",
    shipped: "default",
    processing: "warning",
    pending: "warning",
    confirmed: "secondary",
    cancelled: "danger",
    returned: "danger",
  }
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
}

const roleBadge = (role: string) => {
  const variants: Record<string, "default" | "secondary" | "success"> = {
    admin: "default",
    seller: "success",
    user: "secondary",
  }
  return <Badge variant={variants[role] || "secondary"}>{role}</Badge>
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
  const { stats, recentOrders, recentUsers, lowInventoryProducts, revenueChart } = data

  const chartData = revenueChart.map((d) => ({
    name: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Number(d.revenue),
  }))

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={today}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/analytics">
                <FileBarChart className="h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4" />
                New Product
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          description="From delivered orders"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatsCard
          title="Products"
          value={stats.totalProducts.toLocaleString()}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Customers"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Sellers"
          value={stats.totalSellers.toLocaleString()}
          icon={<Store className="h-4 w-4" />}
          description={stats.pendingSellers > 0 ? `${stats.pendingSellers} pending approval` : undefined}
        />
        <StatsCard
          title="Low Stock"
          value={lowInventoryProducts.length}
          icon={<PackageX className="h-4 w-4" />}
          description="Items with ≤10 in stock"
        />
      </div>

      <AreaChartCard
        title="Revenue (Last 30 Days)"
        data={chartData.length > 0 ? chartData : [{ name: "No data", revenue: 0 }]}
        dataKey="revenue"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">{getInitials(order.userName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{order.userName}</p>
                        <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatPrice(Number(order.total))}</span>
                      {statusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">New Customers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/customers">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Users className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No customers yet.</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {roleBadge(user.role)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {lowInventoryProducts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Low Inventory</CardTitle>
              <Badge variant="danger">{lowInventoryProducts.length}</Badge>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                Manage stock <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {lowInventoryProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(Number(product.price))}</p>
                    </div>
                  </div>
                  <Badge variant={product.stock === 0 ? "danger" : product.stock <= 3 ? "warning" : "default"}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
