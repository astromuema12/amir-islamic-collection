"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  MessageSquare,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks"
import { APP_NAME } from "@/lib/constants"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number | string
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/seller", icon: LayoutDashboard },
  { label: "Products", href: "/seller/products", icon: Package },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { label: "Revenue", href: "/seller/revenue", icon: DollarSign },
  { label: "Reviews", href: "/seller/reviews", icon: Star },
  { label: "Messages", href: "/seller/messages", icon: MessageSquare },
  { label: "Withdrawals", href: "/seller/withdrawals", icon: Wallet },
  { label: "Settings", href: "/seller/settings", icon: Settings },
]

interface SellerSidebarProps {
  storeName?: string
  storeLogo?: string
  isVerified?: boolean
  onLogout?: () => void
}

export function SellerSidebar({
  storeName = "My Store",
  storeLogo,
  isVerified,
  onLogout,
}: SellerSidebarProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
          <AvatarImage src={storeLogo} alt={storeName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {storeName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {storeName}
            </p>
            <p className="text-xs text-muted-foreground">
              {isVerified ? (
                <span className="flex items-center gap-1 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  Unverified
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.href === "/seller"
              ? pathname === "/seller"
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobileOpen && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-3 space-y-2">
        {!collapsed && (
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <Store className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">View Store</span>
          </Link>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>

      {!isMobile && (
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border bg-background p-1 shadow-sm hover:bg-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 rounded-lg border bg-background p-2 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar-background shadow-xl"
              >
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm font-semibold text-foreground">
                    {APP_NAME}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1 hover:bg-accent transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <aside
      className={cn(
        "relative hidden lg:flex flex-col border-r bg-sidebar-background transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  )
}
