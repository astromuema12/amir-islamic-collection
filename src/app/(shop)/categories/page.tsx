import type { Metadata } from "next"
import Link from "next/link"
import { getCategories } from "@/lib/queries"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: `All Categories - ${APP_NAME}`,
  description: `Browse all product categories at ${APP_NAME}. Find prayer mats, Qur'an, hijabs, perfumes, and more.`,
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-foreground">All Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our complete collection of {categories.length} categories
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="border-2 hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
