"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store"
import { useWishlistStore } from "@/store"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, showCount: false },
  { href: "/categories", label: "Categories", icon: LayoutGrid, showCount: false },
  { href: "/cart", label: "Cart", icon: ShoppingBag, showCount: true },
  { href: "/wishlist", label: "Wishlist", icon: Heart, showCount: true },
  { href: "/account", label: "Account", icon: User, showCount: false },
] as const

export function BottomNavigation() {
  const pathname = usePathname()
  const cartItems = useCartStore((s) => s.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const hydrateWishlist = useWishlistStore((s) => s.hydrateFromServer)

  useEffect(() => {
    hydrateWishlist()
  }, [hydrateWishlist])

  const isProductPage = pathname.startsWith("/products/")
  const isAdmin = pathname.startsWith("/admin")
  const isVisible = !isAdmin && !isProductPage

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const getCount = (item: (typeof NAV_ITEMS)[number]) => {
    switch (item.href) {
      case "/cart":
        return cartCount
      case "/wishlist":
        return wishlistCount
      default:
        return 0
    }
  }

  return (
    <nav
      aria-label="Primary navigation"
      className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", !isVisible && "hidden")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="border-t bg-background/95 backdrop-blur-xl shadow-[0_-1px_0_rgba(0,0,0,0.05)]">
        <div className="grid h-16 grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const count = getCount(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className="group relative flex flex-col items-center justify-center gap-1"
              >
                <span className="relative">
                  <item.icon
                    className={cn(
                      "h-[22px] w-[22px] transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.showCount && count > 0 && (
                    <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
