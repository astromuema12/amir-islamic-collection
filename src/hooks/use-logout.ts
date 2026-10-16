"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { csrfFetch } from "@/lib/csrf-client"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"

export function useLogout() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await csrfFetch("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignore network errors and clear the client state regardless.
    }

    // Drop any per-user client state so it does not leak to the next user on
    // this device. Set state directly to avoid the wishlist server sync.
    useWishlistStore.setState({ items: [] })
    useCartStore.setState({ items: [], coupon: null })

    router.push("/login")
    router.refresh()
  }

  return { logout, isLoggingOut }
}
