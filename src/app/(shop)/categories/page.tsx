import type { Metadata } from "next"
import { getCategoryNavigation } from "@/lib/queries"
import { CategoryBrowser } from "@/components/categories/category-browser"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `All Categories - ${APP_NAME}`,
  description: `Browse all product categories at ${APP_NAME}. Find prayer mats, Qur'an, hijabs, perfumes, and more.`,
}

export default async function CategoriesPage() {
  const categories = await getCategoryNavigation()

  return (
    <div className="container mx-auto px-3 py-3 sm:px-4 lg:px-6 lg:py-6">
      <div className="hidden lg:block">
        <Breadcrumbs items={[{ label: "Categories" }]} />
      </div>
      <h1 className="sr-only">All Categories</h1>
      <CategoryBrowser categories={categories} />
    </div>
  )
}