"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Share2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import toast from "react-hot-toast"

interface WishlistItem {
  productId: string
  name: string
  image: string
  price: number
  discountPrice?: number
  rating: number
  reviewCount: number
  stock: number
  inStock: boolean
}

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items)
  const removeItem = useWishlistStore((s) => s.removeItem)
  const addItem = useCartStore((s) => s.addItem)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [wishlistProducts, setWishlistProducts] = useState<Record<string, WishlistItem>>({})
  const [loading, setLoading] = useState(true)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchWishlistProducts() {
      if (items.length === 0) {
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/products/by-ids?ids=${items.join(",")}`)
        if (response.ok && !cancelled) {
          const data = await response.json()
          const productMap: Record<string, WishlistItem> = {}
          for (const p of data.products || []) {
            productMap[p.id] = {
              productId: p.id,
              name: p.name,
              image: p.images?.[0] || "",
              price: Number(p.price),
              discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
              rating: Number(p.averageRating) || 0,
              reviewCount: p.reviewCount || 0,
              stock: Number(p.stock) || 0,
              inStock: Number(p.stock) > 0,
            }
          }
          setWishlistProducts(productMap)

          const missing = items.filter((id) => !productMap[id])
          if (missing.length > 0) {
            for (const id of missing) {
              useWishlistStore.getState().removeItem(id)
            }
          }
        }
      } catch {
        // silently fail, user sees empty state
      }
      if (!cancelled) setLoading(false)
    }
    fetchWishlistProducts()
    return () => {
      cancelled = true
    }
  }, [items])

  const wishlistItems = items
    .map((id) => wishlistProducts[id])
    .filter((p): p is WishlistItem => p !== undefined)

  function handleRemove(productId: string) {
    setRemovingId(productId)
    timersRef.current.push(
      window.setTimeout(() => {
        removeItem(productId)
        setRemovingId(null)
        toast.success("Removed from wishlist")
      }, 300),
    )
  }

  function handleAddToCart(item: WishlistItem) {
    if (!item.inStock) {
      toast.error("This item is currently out of stock")
      return
    }
    setAddingToCart(item.productId)
    timersRef.current.push(
      window.setTimeout(() => {
        addItem({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.discountPrice || item.price,
          quantity: 1,
          maxQuantity: item.stock,
        })
        setAddingToCart(null)
        toast.success("Added to cart!")
      }, 500),
    )
  }

  async function handleShare(productId: string) {
    const url = `${window.location.origin}/products/${productId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(productId)
      toast.success("Link copied to clipboard")
      timersRef.current.push(
        window.setTimeout(() => setCopied(null), 2000),
      )
    } catch {
      toast.error("Could not copy link")
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (items.length === 0 || wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-800/20">
            <Heart className="h-12 w-12 text-rose-500/60" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              Save your favorite items here and come back to them later.
            </p>
          </div>
          <Link href="/products">
            <Button size="lg" className="gap-2 mt-2">
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            useWishlistStore.getState().clearWishlist()
            toast.success("Wishlist cleared")
          }}
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {wishlistItems.map((item, index) => {
            const discount = item.discountPrice
              ? calculateDiscount(item.price, item.discountPrice)
              : 0

            return (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: removingId === item.productId ? 0 : 1,
                  scale: removingId === item.productId ? 0.9 : 1,
                  y: removingId === item.productId ? -10 : 0,
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare(item.productId)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="Copy product link"
                  >
                    {copied === item.productId ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <Link href={`/products/${item.productId}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                          <ShoppingBag className="h-12 w-12" />
                          <span className="text-xs">{item.name}</span>
                        </div>
                      </div>
                    )}

                    {discount > 0 && (
                      <Badge
                        variant="premium"
                        className="absolute top-3 left-3"
                      >
                        -{discount}%
                      </Badge>
                    )}

                    {!item.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                        <Badge variant="secondary" className="text-sm px-4 py-1.5">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <div>
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="text-sm font-medium leading-snug line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs font-medium">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({item.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(item.discountPrice)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-foreground">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full gap-2"
                    size="sm"
                    disabled={!item.inStock || addingToCart === item.productId}
                    isLoading={addingToCart === item.productId}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {item.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
