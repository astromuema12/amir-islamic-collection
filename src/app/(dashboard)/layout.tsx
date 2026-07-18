"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Package,
} from "lucide-react"

const mobileLinks = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/account", label: "Profile", icon: User },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/notifications", label: "Alerts", icon: Bell },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              My Account
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-sm text-muted-foreground">
              Assalamu Alaikum
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-premium flex items-center justify-center text-white text-sm font-semibold">
              AU
            </div>
          </div>
        </header>

        <nav className="flex lg:hidden overflow-x-auto border-b bg-background scrollbar-hide">
          <div className="flex gap-1 p-2 px-4">
            {mobileLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
