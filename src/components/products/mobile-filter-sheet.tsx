"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ProductFilters } from "./product-filters"
import type { Category } from "@/types"
import { Separator } from "@/components/ui/separator"

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
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ProductFilters categories={categories} brands={brands} />
        </div>
        <Separator />
        <SheetFooter className="px-5 py-4">
          <SheetClose asChild>
            <Button className="w-full">
              View Results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
