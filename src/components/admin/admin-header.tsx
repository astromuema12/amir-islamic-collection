"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, Bell, ExternalLink, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSidebar } from "./sidebar-context"

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  sellers: "Sellers",
  coupons: "Coupons",
  reviews: "Reviews",
  blogs: "Blogs",
  pages: "Pages",
  media: "Media",
  notifications: "Notifications",
  settings: "Settings",
  roles: "Roles",
  logs: "Logs",
  SEO: "SEO",
  analytics: "Analytics",
}

function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1 || segments[0] !== "admin") {
    return [{ label: "Dashboard", href: "/admin", current: true }]
  }

  const crumbs = segments.slice(1).map((segment, i) => {
    const label = SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
    return {
      label,
      href: "/" + segments.slice(0, i + 2).join("/"),
      current: i === segments.length - 2,
    }
  })
  return crumbs
}

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

function UserChip() {
  const { user, loading } = useCurrentUser()
  const userName = user?.name ?? ""
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : ""

  return (
    <Link href="/admin/settings" className="hidden items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted sm:flex">
      <Avatar className="h-7 w-7">
        <AvatarImage src={user?.image} />
        <AvatarFallback className="bg-muted text-[10px] font-semibold">
          {loading ? "" : initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-[13px] font-medium">{loading ? "…" : userName || "Admin"}</span>
    </Link>
  )
}

export function AdminHeader() {
  const { setMobileOpen } = useSidebar()
  const crumbs = useBreadcrumbs()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <nav className="flex min-w-0 items-center gap-1 text-sm" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            {crumb.current ? (
              <span className="truncate font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild aria-label="View site">
          <Link href="/">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild aria-label="Notifications">
          <Link href="/admin/notifications">
            <Bell className="h-4 w-4" />
          </Link>
        </Button>
        <ThemeToggle />
        <UserChip />
      </div>
    </header>
  )
}
