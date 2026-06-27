"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductFilters } from "./product-filters"
import type { Category } from "@/types"

interface MobileFilterSheetProps {
  categories: Category[]
  brands: { id: string; name: string; slug: string }[]
}

export function MobileFilterSheet({ categories, brands }: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ProductFilters categories={categories} brands={brands} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
