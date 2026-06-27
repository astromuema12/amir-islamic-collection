"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingBag,
  Heart,
  Search,
  Phone,
  ChevronDown,
  Moon,
  Sun,
  Package,
  Percent,
  ShieldCheck,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { APP_NAME, FREE_SHIPPING_THRESHOLD } from "@/lib/constants"
import { User as UserType } from "@/types"
import { SearchBar } from "./search-bar"
import { UserMenu } from "./user-menu"
import { CartSidebar } from "./cart-sidebar"
import { MobileNav } from "./mobile-nav"
import { CategoryNav } from "./category-nav"
import { CartItem } from "@/types"

interface HeaderProps {
  user?: UserType | null
  cartItems?: CartItem[]
  wishlistCount?: number
  className?: string
}

const ANNOUNCEMENTS = [
  "Free shipping on orders over ₦50,000",
  "New arrivals: Ramadan Collection 2025",
  "Eid gifts: Shop our curated gift boxes",
]

export function Header({
  user,
  cartItems = [],
  wishlistCount = 0,
  className,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b"
          : "bg-background border-b border-transparent",
        className
      )}
    >
      {showAnnouncement && (
        <div className="relative bg-gradient-to-r from-primary via-primary/90 to-premium/90 dark:from-primary dark:to-premium/80">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4">
            <p className="text-xs font-medium text-primary-foreground animate-fade-in">
              {ANNOUNCEMENTS[announcementIndex]}
            </p>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <MobileNav
            user={user}
            cartItemCount={cartItemCount}
            wishlistItemCount={wishlistCount}
          />

          <Link href="/" className="flex-shrink-0 group">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-primary group-hover:text-primary/80 transition-colors">
                Amir
              </span>{" "}
              <span className="text-premium group-hover:text-premium/80 transition-colors">
                Islamic
              </span>
              <span className="text-foreground hidden sm:inline">
                {" "}
                Collections
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Link
                href="/wishlist"
                className="relative hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent transition-colors"
              >
                <Heart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="premium"
                    className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Link>
            </div>

            <UserMenu user={user} />

            <CartSidebar
              items={cartItems}
              isOpen={isCartOpen}
              onOpenChange={setIsCartOpen}
            >
              <button
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </button>
            </CartSidebar>
          </div>
        </div>
      </div>

      <div className="hidden lg:block border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <CategoryNav />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <Phone className="h-3 w-3" />
                +234 800 AMIR
              </span>
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <Package className="h-3 w-3" />
                Track Order
              </span>
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <Percent className="h-3 w-3" />
                Deals
              </span>
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <ShieldCheck className="h-3 w-3" />
                Sell with us
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden border-t px-4 py-2">
        <SearchBar />
      </div>
    </header>
  )
}
