import type { Metadata } from "next"
import { Suspense } from "react"
import { getProducts, getCategories, getBrands } from "@/lib/queries"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { ProductGrid } from "@/components/products/product-grid"
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Products - ${APP_NAME}`,
  description: `Browse our collection of premium Islamic products including prayer mats, Qur'an, hijabs, perfumes, and more.`,
}

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    sort?: string
    page?: string
    view?: string
  }>
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const categorySlugs = params.category?.split(",").filter(Boolean) || []
  const brandIds = params.brand?.split(",").filter(Boolean) || []

  const [productsData, categories, brands] = await Promise.all([
    getProducts({
      search: params.q,
      categories: categorySlugs,
      brands: brandIds,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      rating: params.rating ? Number(params.rating) : undefined,
      sort: params.sort || "newest",
      page: params.page ? Number(params.page) : 1,
      limit: 24,
    }),
    getCategories(),
    getBrands(),
  ])

  const view = params.view === "list" ? "list" : "grid"

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Products" }]} />

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {productsData.products.length} of {productsData.total} results
        </p>
      </div>

      <div className="mt-6 flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-4">
            <ProductFilters categories={categories} brands={brands} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <MobileFilterSheet categories={categories} brands={brands} />
            </div>
            <div className="ml-auto">
              <ProductSort />
            </div>
          </div>

          <div className="mt-4">
            <ProductGrid products={productsData.products} view={view} />
          </div>

          {productsData.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === productsData.page
                const hrefParams = new URLSearchParams()
                if (params.q) hrefParams.set("q", params.q)
                if (params.category) hrefParams.set("category", params.category)
                if (params.brand) hrefParams.set("brand", params.brand)
                if (params.minPrice) hrefParams.set("minPrice", params.minPrice)
                if (params.maxPrice) hrefParams.set("maxPrice", params.maxPrice)
                if (params.rating) hrefParams.set("rating", params.rating)
                if (params.sort) hrefParams.set("sort", params.sort)
                if (pageNum > 1) hrefParams.set("page", String(pageNum))
                return (
                  <a
                    key={pageNum}
                    href={`?${hrefParams.toString()}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-72" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent searchParams={props.searchParams} />
    </Suspense>
  )
}
