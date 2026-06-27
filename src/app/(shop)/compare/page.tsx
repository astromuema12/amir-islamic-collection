"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Plus, ShoppingCart, Heart, ArrowLeft, BarChart3, Star, Check, Minus } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CompareProduct {
  id: string
  name: string
  slug: string
  price: number
  discountPrice?: number
  rating: number
  reviewCount: number
  image: string
  brand: string
  sku: string
  specs: Record<string, string>
}

const sampleProducts: CompareProduct[] = [
  {
    id: "1",
    name: "Premium Velvet Prayer Mat",
    slug: "premium-velvet-prayer-mat",
    price: 15000,
    discountPrice: 12500,
    rating: 4.8,
    reviewCount: 124,
    image: "",
    brand: "Amir Collections",
    sku: "PM-001",
    specs: {
      Material: "Premium Velvet",
      Size: "115cm x 70cm",
      Weight: "0.8 kg",
      "Washable": "Yes (Hand Wash)",
      Thickness: "8mm",
      Design: "Mihrab Pattern",
    },
  },
  {
    id: "2",
    name: "Plush Microfiber Prayer Mat",
    slug: "plush-microfiber-prayer-mat",
    price: 12000,
    discountPrice: 9900,
    rating: 4.6,
    reviewCount: 89,
    image: "",
    brand: "Amir Collections",
    sku: "PM-002",
    specs: {
      Material: "Microfiber Plush",
      Size: "120cm x 75cm",
      Weight: "0.6 kg",
      "Washable": "Yes (Machine Wash)",
      Thickness: "6mm",
      Design: "Solid Color",
    },
  },
  {
    id: "3",
    name: "Travel Prayer Mat Set",
    slug: "travel-prayer-mat-set",
    price: 8500,
    rating: 4.4,
    reviewCount: 56,
    image: "",
    brand: "Journey Faith",
    sku: "PM-003",
    specs: {
      Material: "Polyester",
      Size: "90cm x 50cm (Folded)",
      Weight: "0.3 kg",
      "Washable": "Yes",
      "Includes": "Compass, Pouch",
      "Design": "Compact Foldable",
    },
  },
]

const allSpecKeys = Array.from(
  new Set(sampleProducts.flatMap((p) => Object.keys(p.specs)))
)

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>(sampleProducts)

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Compare Products" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Compare Products
              </h1>
              <p className="text-muted-foreground mt-1">
                Compare features and prices to make the best choice
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Products to Compare</h2>
            <p className="text-muted-foreground mb-6">
              Add products to compare by clicking the compare button on product
              pages.
            </p>
            <Link href="/">
              <Button variant="default" size="lg" className="gap-2">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div
                className="grid gap-4 min-w-[600px]"
                style={{
                  gridTemplateColumns: `200px repeat(${products.length}, minmax(240px, 1fr))`,
                }}
              >
                <div className="sticky left-0 bg-background z-10">
                  <div className="h-72" />
                </div>

                {products.map((product) => (
                  <div key={product.id} className="relative">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors z-10"
                      aria-label={`Remove ${product.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Card className="border-2 h-full">
                      <CardContent className="p-4 text-center">
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-premium/10 flex items-center justify-center mb-4">
                          <BarChart3 className="h-12 w-12 text-primary/30" />
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {product.brand}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-sm mb-3">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <div className="mb-3">
                          {product.discountPrice ? (
                            <div className="space-y-0.5">
                              <span className="text-2xl font-bold text-primary">
                                ₦{product.discountPrice.toLocaleString()}
                              </span>
                              <div>
                                <span className="text-sm text-muted-foreground line-through">
                                  ₦{product.price.toLocaleString()}
                                </span>
                                <Badge variant="success" className="ml-2 text-xs">
                                  Save {Math.round((1 - product.discountPrice / product.price) * 100)}%
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold">
                              ₦{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="gap-2 w-full">
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 w-full">
                            <Heart className="h-4 w-4" />
                            Wishlist
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {products.length < 4 && (
                  <div className="flex items-center justify-center">
                    <Card className="border-2 border-dashed h-full w-full">
                      <CardContent className="p-4 flex items-center justify-center h-full min-h-[400px]">
                        <div className="text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Add another product to compare
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {allSpecKeys.map((key) => (
                  <>
                    <div
                      key={`label-${key}`}
                      className="flex items-center text-sm font-medium text-muted-foreground bg-muted/30 rounded-lg px-3 py-2"
                    >
                      {key}
                    </div>
                    {products.map((product) => (
                      <div
                        key={`${product.id}-${key}`}
                        className="flex items-center justify-center text-sm text-center px-3 py-2 rounded-lg bg-muted/10"
                      >
                        {product.specs[key] ? (
                          <span className="flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-success shrink-0" />
                            {product.specs[key]}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Minus className="h-4 w-4" />
                            Not available
                          </span>
                        )}
                      </div>
                    ))}
                    {products.length < 4 && (
                      <div
                        key={`empty-${key}`}
                        className="rounded-lg bg-muted/5"
                      />
                    )}
                  </>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/">
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
