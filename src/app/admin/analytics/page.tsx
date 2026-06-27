"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp, DollarSign, ShoppingBag, Users, Download,
  Calendar, Globe, Star, Package
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { AreaChartCard, BarChartCard, LineChartCard } from "@/components/admin/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

const visitorsData = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  visitors: Math.floor(Math.random() * 5000 + 1000),
  pageViews: Math.floor(Math.random() * 20000 + 5000),
}))

const salesData = Array.from({ length: 12 }, (_, i) => ({
  name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  sales: Math.floor(Math.random() * 500 + 100),
}))

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  revenue: Math.floor(Math.random() * 5000000 + 500000),
  expenses: Math.floor(Math.random() * 3000000 + 200000),
}))

const userGrowthData = Array.from({ length: 12 }, (_, i) => ({
  name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  users: Math.floor(Math.random() * 2000 + 500),
  sellers: Math.floor(Math.random() * 100 + 20),
}))

const topProducts = [
  { name: "Premium Prayer Mat - Velvet", sales: 1567, revenue: 38900000, rating: 4.9 },
  { name: "Holy Qur'an - Leather Bound", sales: 1234, revenue: 24680000, rating: 4.8 },
  { name: "Oud Perfume Oil Set", sales: 987, revenue: 19740000, rating: 4.7 },
  { name: "Embroidered Hijab - Silk", sales: 876, revenue: 8760000, rating: 4.6 },
  { name: "Tasbih - 99 Beads", sales: 765, revenue: 2295000, rating: 4.5 },
]

const topCategories = [
  { name: "Prayer Mats", revenue: 45200000, percentage: 28 },
  { name: "Holy Qur'an", revenue: 32100000, percentage: 20 },
  { name: "Islamic Clothing", revenue: 28400000, percentage: 18 },
  { name: "Perfumes", revenue: 21300000, percentage: 13 },
  { name: "Home Decor", revenue: 12600000, percentage: 8 },
]

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30days")

  const handleExport = () => {
    toast.success("Report downloaded")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight premium-heading">Analytics</h1>
          <p className="text-muted-foreground">Detailed platform analytics and reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value="KES 128,475,000" icon={<DollarSign className="h-5 w-5" />} trend={{ value: 15.3, positive: true }} />
        <StatsCard title="Total Sales" value="12,847" icon={<ShoppingBag className="h-5 w-5" />} trend={{ value: 8.7, positive: true }} />
        <StatsCard title="Total Visitors" value="284,156" icon={<TrendingUp className="h-5 w-5" />} trend={{ value: 22.4, positive: true }} />
        <StatsCard title="Conversion Rate" value="4.52%" icon={<Users className="h-5 w-5" />} trend={{ value: 1.2, positive: true }} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LineChartCard
          title="Visitors & Page Views"
          data={visitorsData}
          lines={[
            { dataKey: "visitors", color: "#059669", name: "Visitors" },
            { dataKey: "pageViews", color: "#F59E0B", name: "Page Views" },
          ]}
        />
        <BarChartCard title="Monthly Sales" data={salesData} dataKey="sales" color="#059669" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AreaChartCard title="Revenue vs Expenses" data={revenueData} dataKey="revenue" color="#059669" />
        <LineChartCard
          title="User Growth"
          data={userGrowthData}
          lines={[
            { dataKey: "users", color: "#059669", name: "Users" },
            { dataKey: "sellers", color: "#B8860B", name: "Sellers" },
          ]}
        />
      </div>

      {/* Top Products & Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.sales} sales</span>
                        <span>•</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(product.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatPrice(cat.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{cat.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { country: "Kenya", visitors: 154200, percentage: 52 },
              { country: "Egypt", visitors: 32100, percentage: 11 },
              { country: "Saudi Arabia", visitors: 28400, percentage: 10 },
              { country: "Indonesia", visitors: 25600, percentage: 9 },
              { country: "Malaysia", visitors: 18700, percentage: 6 },
              { country: "United Kingdom", visitors: 12400, percentage: 4 },
              { country: "Other", visitors: 22756, percentage: 8 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm w-32">{item.country}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-20 text-right">{item.percentage}%</span>
                <span className="text-xs font-medium w-24 text-right">{item.visitors.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
