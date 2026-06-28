"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  LogOut,
  Settings,
  Package,
  Heart,
  Store,
  ShieldCheck,
  LayoutDashboard,
  ChevronDown,
  LogIn,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User as UserType } from "@/types"

interface UserMenuProps {
  user?: UserType | null
  onLogin?: () => void
  onRegister?: () => void
  onLogout?: () => void
  className?: string
}

export function UserMenu({
  user,
  onLogin,
  onRegister,
  onLogout,
  className,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </Button>
        <Button size="sm" asChild className="gap-2">
          <Link href="/register">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Register</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("relative gap-2 px-2", className)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
            {user.name}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              My Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wishlist" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {(user.role === "seller" || user.role === "admin" || user.role === "super_admin") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.role === "seller" && (
                <DropdownMenuItem asChild>
                  <Link href="/seller" className="cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    Seller Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              {(user.role === "admin" || user.role === "super_admin") && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
