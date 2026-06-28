"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Package,
  Heart,
  MapPin,
  ArrowRight,
  Clock,
  User,
  CreditCard,
  ShieldCheck,
  Gift,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"

const stats = [
  {
    href: "/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Total Orders",
    value: 12,
    trend: { value: 8, positive: true },
    iconClassName: "bg-emerald-500/10 text-emerald-500",
  },
  {
    href: "/orders",
    icon: <Package className="h-5 w-5" />,
    label: "Active Orders",
    value: 3,
    trend: { value: 2, positive: false },
    iconClassName: "bg-amber-500/10 text-amber-500",
  },
  {
    href: "/wishlist",
    icon: <Heart className="h-5 w-5" />,
    label: "Wishlist Items",
    value: 8,
    description: "2 items on sale",
    iconClassName: "bg-rose-500/10 text-rose-500",
  },
  {
    href: "/addresses",
    icon: <MapPin className="h-5 w-5" />,
    label: "Saved Addresses",
    value: 2,
    iconClassName: "bg-blue-500/10 text-blue-500",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    date: "2026-06-20",
    items: 3,
    total: 45000,
    status: "delivered",
    payment: "completed",
  },
  {
    id: "ORD-002",
    date: "2026-06-18",
    items: 1,
    total: 12500,
    status: "shipped",
    payment: "completed",
  },
  {
    id: "ORD-003",
    date: "2026-06-15",
    items: 5,
    total: 89000,
    status: "processing",
    payment: "completed",
  },
  {
    id: "ORD-004",
    date: "2026-06-12",
    items: 2,
    total: 23000,
    status: "pending",
    payment: "pending",
  },
  {
    id: "ORD-005",
    date: "2026-06-10",
    items: 1,
    total: 8500,
    status: "cancelled",
    payment: "refunded",
  },
]

const statusVariant: Record<string, "success" | "warning" | "default" | "danger" | "secondary"> = {
  delivered: "success",
  shipped: "success",
  processing: "warning",
  pending: "secondary",
  cancelled: "danger",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Welcome back, Ahmad
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="block">
            <StatsCard {...stat} />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest 5 orders</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="outline" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
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
                      <Badge
                        variant={statusVariant[order.status] || "default"}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/orders">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" />
                  Track Orders
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/addresses">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MapPin className="h-4 w-4" />
                  Manage Addresses
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Heart className="h-4 w-4" />
                  View Wishlist
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">January 2026</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total spent</span>
                <span className="font-medium">{formatPrice(178000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Orders placed</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reviews written</span>
                <span className="font-medium">4</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                Verified account
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Separator() {
  return <div className="h-px bg-border" />
}
