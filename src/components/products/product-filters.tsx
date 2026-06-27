"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import type { Category } from "@/types"

interface ProductFiltersProps {
  categories: Category[]
  brands: { id: string; name: string; slug: string }[]
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) || []
  const selectedBrands = searchParams.get("brand")?.split(",").filter(Boolean) || []
  const selectedRating = searchParams.get("rating") || ""
  const minPrice = searchParams.get("minPrice") || ""
  const maxPrice = searchParams.get("maxPrice") || ""

  const [priceRange, setPriceRange] = useState([Number(minPrice) || 0, Number(maxPrice) || 200000])

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }
      params.delete("page")
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const toggleCategory = (slug: string) => {
    const current = new Set(selectedCategories)
    if (current.has(slug)) current.delete(slug)
    else current.add(slug)
    updateParams({ category: current.size > 0 ? Array.from(current).join(",") : undefined })
  }

  const toggleBrand = (id: string) => {
    const current = new Set(selectedBrands)
    if (current.has(id)) current.delete(id)
    else current.add(id)
    updateParams({ brand: current.size > 0 ? Array.from(current).join(",") : undefined })
  }

  const handleRatingChange = (rating: number) => {
    updateParams({ rating: selectedRating === String(rating) ? undefined : String(rating) })
  }

  const applyPriceRange = () => {
    updateParams({
      minPrice: priceRange[0] > 0 ? String(priceRange[0]) : undefined,
      maxPrice: priceRange[1] < 200000 ? String(priceRange[1]) : undefined,
    })
  }

  const clearAll = () => router.push("?")

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedBrands.length > 0 || !!selectedRating || !!minPrice || !!maxPrice

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto px-2 py-1 text-xs text-primary">
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Categories</h4>
        <div className="space-y-2">
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">No categories available</p>
          )}
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => toggleCategory(cat.slug)} />
              <span className="flex-1 text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Price Range</h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={applyPriceRange}
            min={0}
            max={200000}
            step={1000}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>KES {priceRange[0].toLocaleString()}</span>
            <span>KES {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Brands</h4>
        <div className="space-y-2">
          {brands.length === 0 && (
            <p className="text-xs text-muted-foreground">No brands available</p>
          )}
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedBrands.includes(brand.id)} onCheckedChange={() => toggleBrand(brand.id)} />
              <span className="text-foreground">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-medium text-foreground">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === String(rating)}
                onChange={() => handleRatingChange(rating)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-foreground">{rating}+ stars</span>
            </label>
          ))}
          {selectedRating && (
            <button
              onClick={() => updateParams({ rating: undefined })}
              className="text-xs text-primary hover:underline"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
