import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getCategoryBySlug, getProducts, getCategories, getBrands } from "@/lib/queries"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { ProductGrid } from "@/components/products/product-grid"
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { APP_NAME } from "@/lib/constants"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    sort?: string
    page?: string
    view?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Category Not Found" }

  return {
    title: `${category.name} - ${APP_NAME}`,
    description: category.description || `Browse our collection of ${category.name} at ${APP_NAME}`,
  }
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const sp = await searchParams

  const [category, categories, brands] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getBrands(),
  ])

  if (!category) notFound()

  const productsData = await getProducts({
    categorySlug: slug,
    sort: sp.sort || "newest",
    page: sp.page ? Number(sp.page) : 1,
    limit: 24,
  })

  const view = sp.view === "list" ? "list" : "grid"

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: category.name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {productsData.total} product{productsData.total !== 1 ? "s" : ""} in this category
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
                if (sp.sort) hrefParams.set("sort", sp.sort)
                if (pageNum > 1) hrefParams.set("page", String(pageNum))
                return (
                  <a
                    key={pageNum}
                    href={`/categories/${slug}?${hrefParams.toString()}`}
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

export default async function CategoryPage(props: CategoryPageProps) {
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
      <CategoryContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  )
}
