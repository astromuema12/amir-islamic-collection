"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import toast from "react-hot-toast"

const SAMPLE_WISHLIST = [
  {
    id: "1",
    productId: "p1",
    name: "Premium Velvet Prayer Mat",
    image: "",
    price: 15000,
    discountPrice: 12000,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
  },
  {
    id: "2",
    productId: "p2",
    name: "Golden Arabic Tasbih – 99 Beads",
    image: "",
    price: 8500,
    discountPrice: undefined,
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "3",
    productId: "p3",
    name: "Luxury Silk Hijab – Emerald Green",
    image: "",
    price: 12000,
    discountPrice: 9500,
    rating: 4.7,
    reviewCount: 56,
    inStock: false,
  },
  {
    id: "4",
    productId: "p4",
    name: "Leather Quran Case with Gold Embossing",
    image: "",
    price: 25000,
    discountPrice: undefined,
    rating: 5.0,
    reviewCount: 32,
    inStock: true,
  },
  {
    id: "5",
    productId: "p5",
    name: "Oud Al Amir Premium Perfume Oil",
    image: "",
    price: 18000,
    discountPrice: 15000,
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
  },
  {
    id: "6",
    productId: "p6",
    name: "Islamic Wall Art – Ayat-ul-Kursi Calligraphy",
    image: "",
    price: 22000,
    discountPrice: undefined,
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
  },
]

interface WishlistItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  discountPrice?: number
  rating: number
  reviewCount: number
  inStock: boolean
}

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const wishlistItems = SAMPLE_WISHLIST

  function handleRemove(productId: string) {
    setRemovingId(productId)
    setTimeout(() => {
      removeItem(productId)
      setRemovingId(null)
      toast.success("Removed from wishlist")
    }, 300)
  }

  function handleAddToCart(item: WishlistItem) {
    if (!item.inStock) {
      toast.error("This item is currently out of stock")
      return
    }
    setAddingToCart(item.productId)
    setTimeout(() => {
      addItem({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: 1,
        maxQuantity: 10,
      })
      setAddingToCart(null)
      toast.success("Added to cart!")
    }, 500)
  }

  if (wishlistItems.length === 0) {
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
          <Link href="/categories">
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
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-sm"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <Link href={`/product/${item.productId}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                        <ShoppingBag className="h-12 w-12" />
                        <span className="text-xs">{item.name}</span>
                      </div>
                    </div>

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
                    <Link href={`/product/${item.productId}`}>
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
