"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser } from "@/hooks/use-current-user"
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
  Menu,
  X,
  ChevronLeft,
  Package,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge?: number
}

const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/account", label: "Profile", icon: User },
  { href: "/addresses", label: "Addresses", icon: MapPin },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
]

interface DashboardSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function DashboardSidebar({
  isCollapsed = false,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, loading } = useCurrentUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  const userName = user?.name ?? ""
  const userEmail = user?.email ?? ""
  const userInitials = userName ? userName.split(" ").map(n => n[0]).join("") : ""

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-background shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar-background transition-all duration-300 lg:static lg:z-auto",
          isCollapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-premium shadow-sm">
            <Package className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-serif text-lg font-bold text-foreground">
              Dashboard
            </span>
          )}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className={cn("p-4", isCollapsed && "p-3")}>
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <Avatar className="h-9 w-9 ring-2 ring-primary/20">
              <AvatarImage src={user?.image} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {loading ? "" : userInitials}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                {loading ? (
                  <>
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                    <div className="mt-1 h-3 w-28 rounded bg-muted animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {userName || "Guest"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {userEmail || "Not signed in"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isCollapsed && "justify-center px-2",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isCollapsed && "h-5 w-5")} />
                {!isCollapsed && <span>{item.label}</span>}
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[11px] font-semibold text-primary",
                      isCollapsed && "absolute -right-1 -top-1"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-sidebar-primary/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <Separator />

        <div className="p-3">
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="hidden border-t p-3 lg:flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </aside>
    </>
  )
}
