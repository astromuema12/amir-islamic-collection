"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Bell,
  ShoppingBag,
  Package,
  Truck,
  Heart,
  Percent,
  ShieldCheck,
  Star,
  Trash2,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: "order" | "shipping" | "wishlist" | "promo" | "security" | "review" | "system"
  isRead: boolean
  createdAt: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order ORD-003 has been confirmed and is being processed.",
    type: "order",
    isRead: false,
    createdAt: "2026-06-16T10:30:00Z",
  },
  {
    id: "2",
    title: "Package Shipped",
    message: "Your order ORD-002 has been shipped and is on its way!",
    type: "shipping",
    isRead: false,
    createdAt: "2026-06-15T14:20:00Z",
  },
  {
    id: "3",
    title: "Price Drop Alert",
    message: "Premium Silk Prayer Mat is now 15% off! Don't miss out.",
    type: "promo",
    isRead: false,
    createdAt: "2026-06-14T09:00:00Z",
  },
  {
    id: "4",
    title: "Wishlist Item Back in Stock",
    message: "The Islamic Wall Art you saved is now back in stock.",
    type: "wishlist",
    isRead: true,
    createdAt: "2026-06-13T16:45:00Z",
  },
  {
    id: "5",
    title: "Order Delivered",
    message: "Your order ORD-001 has been delivered successfully. Please rate your experience.",
    type: "review",
    isRead: true,
    createdAt: "2026-06-12T11:30:00Z",
  },
  {
    id: "6",
    title: "Security Update",
    message: "Your account password was changed successfully.",
    type: "security",
    isRead: true,
    createdAt: "2026-06-10T08:00:00Z",
  },
  {
    id: "7",
    title: "Ramadan Sale Starts Soon!",
    message: "Get ready for amazing deals this Ramadan season.",
    type: "promo",
    isRead: true,
    createdAt: "2026-06-08T12:00:00Z",
  },
]

const typeConfig = {
  order: { icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
  shipping: { icon: Truck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  wishlist: { icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  promo: { icon: Percent, color: "text-amber-500", bg: "bg-amber-500/10" },
  security: { icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  review: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  system: { icon: Info, color: "text-sky-500", bg: "bg-sky-500/10" },
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success("All notifications marked as read")
  }

  const clearAll = () => {
    setNotifications([])
    toast.success("Notifications cleared")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive"
              onClick={clearAll}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => {
                const config = typeConfig[notification.type] || typeConfig.system
                const Icon = config.icon

                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex cursor-pointer items-start gap-4 border-b px-6 py-4 transition-colors last:border-0 hover:bg-muted/50",
                      !notification.isRead && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        config.bg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              !notification.isRead && "text-foreground"
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {timeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;re all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
