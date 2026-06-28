"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Heart,
  User,
  Package,
  ChevronRight,
  LogIn,
  UserPlus,
  Store,
  Phone,
  Info,
  HelpCircle,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User as UserType } from "@/types"
import { CATEGORIES, APP_NAME } from "@/lib/constants"

interface MobileNavProps {
  user?: UserType | null
  cartItemCount?: number
  wishlistItemCount?: number
  onLogin?: () => void
  onRegister?: () => void
}

export function MobileNav({
  user,
  cartItemCount = 0,
  wishlistItemCount = 0,
  onLogin,
  onRegister,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const mainLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/wishlist", label: "Wishlist", icon: Heart, count: wishlistItemCount },
    { href: "/account", label: "My Account", icon: User },
    { href: "/orders", label: "Orders", icon: Package },
  ]

  const accountLinks = user
    ? [
        { href: "/account", label: "My Account", icon: User },
        { href: "/account/orders", label: "Orders", icon: Package },
        { href: "/wishlist", label: "Wishlist", icon: Heart, count: wishlistItemCount },
        { href: "/account/settings", label: "Settings", icon: User },
      ]
    : [
        { href: "/login", label: "Login", icon: LogIn },
        { href: "/register", label: "Register", icon: UserPlus },
      ]

  const customerLinks = [
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
    { href: "/terms", label: "Terms & Conditions", icon: ShieldCheck },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                className="text-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-primary">{APP_NAME.split(" ")[0]}</span>{" "}
                <span className="text-premium">{APP_NAME.split(" ").slice(1).join(" ")}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-65px)]">
              <div className="p-4 space-y-6">
                {!user && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button className="flex-1 gap-2" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Link>
                    </Button>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Menu
                  </h3>
                  <ul className="space-y-1">
                    {mainLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-accent"
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                          {link.count != null && link.count > 0 && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                              {link.count}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    {CATEGORIES.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive(`/category/${category.slug}`)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-accent"
                          )}
                        >
                          <span className="text-base">{category.icon}</span>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Customer Service
                  </h3>
                  <ul className="space-y-1">
                    {customerLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                        >
                          <link.icon className="h-4 w-4 text-muted-foreground" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  )
}
