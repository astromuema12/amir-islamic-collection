"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Store, LogOut } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSidebar } from "./sidebar-context"

import {
  LayoutDashboard,
  BarChart3,
  Package,
  Grid3X3,
  TicketPercent,
  Star,
  ShoppingCart,
  Users,
  FileText,
  File,
  Image,
  Bell,
  Search,
  Shield,
  FileSpreadsheet,
  Settings,
} from "lucide-react"

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { icon: Package, label: "Products", href: "/admin/products" },
      { icon: Grid3X3, label: "Categories", href: "/admin/categories" },
      { icon: TicketPercent, label: "Coupons", href: "/admin/coupons" },
      { icon: Star, label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    label: "Sales",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
      { icon: Users, label: "Customers", href: "/admin/customers" },
      { icon: Store, label: "Sellers", href: "/admin/sellers" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: FileText, label: "Blogs", href: "/admin/blogs" },
      { icon: File, label: "Pages", href: "/admin/pages" },
      { icon: Image, label: "Media", href: "/admin/media" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Bell, label: "Notifications", href: "/admin/notifications" },
      { icon: Search, label: "SEO", href: "/admin/SEO" },
      { icon: Shield, label: "Roles", href: "/admin/roles" },
      { icon: FileSpreadsheet, label: "Logs", href: "/admin/logs" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
]

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  seller: "Seller",
  user: "User",
}

function AdminBrand() {
  return (
    <Link href="/admin" className="flex h-14 shrink-0 items-center gap-2.5 border-b px-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Store className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight">Amir Admin</p>
        <p className="text-[11px] text-muted-foreground">Store management</p>
      </div>
    </Link>
  )
}

function NavContent() {
  const pathname = usePathname()
  const { user, loading } = useCurrentUser()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(href)
  }

  const userName = user?.name ?? ""
  const userInitials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : ""
  const userRole = user?.role ? roleLabels[user.role] ?? user.role : ""

  return (
    <div className="flex h-full flex-col">
      <AdminBrand />
      <ScrollArea className="flex-1">
        <nav className="px-3 py-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-muted text-xs font-semibold">
              {loading ? "" : userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium">{loading ? "…" : userName || "Admin"}</p>
            <p className="truncate text-[11px] text-muted-foreground">{userRole}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        <NavContent />
      </aside>
    </>
  )
}
