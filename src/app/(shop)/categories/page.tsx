import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/lib/queries"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { APP_NAME } from "@/lib/constants"
import { CATEGORIES } from "@/lib/constants"

export const metadata: Metadata = {
  title: `All Categories - ${APP_NAME}`,
  description: `Browse all product categories at ${APP_NAME}. Find prayer mats, Qur'an, hijabs, perfumes, and more.`,
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const iconMap = new Map(CATEGORIES.map((c) => [c.slug, c.icon]))

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <div className="mt-5">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">All Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {categories.length} categories of premium Islamic products
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => {
          const icon = iconMap.get(category.slug)
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center transition-all hover:border-primary/40 hover:shadow-md sm:p-5"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted sm:h-16 sm:w-16">
                {icon && icon.startsWith("http") ? (
                  <Image
                    src={icon}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl">{icon || "📦"}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-medium leading-tight text-foreground group-hover:text-primary transition-colors sm:text-sm">
                  {category.name}
                </h3>
                {category.productCount > 0 && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {category.productCount} items
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        Browse all products
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
