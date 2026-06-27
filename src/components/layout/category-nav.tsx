"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/constants"
import { Category } from "@/types"

interface CategoryNavProps {
  className?: string
  categories?: Category[]
}

const MEGA_MENU_GROUPS = [
  {
    title: "Clothing",
    categories: ["Abayas", "Hijabs", "Niqabs", "Thobes", "Islamic Clothing", "Prayer Caps", "Kids Collection"],
  },
  {
    title: "Worship",
    categories: ["Prayer Mats", "Holy Qur'an", "Qur'an Stands", "Tasbih"],
  },
  {
    title: "Lifestyle",
    categories: ["Perfumes", "Wall Art", "Home Decor", "Islamic Electronics", "Accessories"],
  },
  {
    title: "Special",
    categories: ["Ramadan Collection", "Eid Collection", "Gift Boxes", "Islamic Books", "Digital Islamic Products", "Charity Products"],
  },
]

function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function CategoryNav({ className }: CategoryNavProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const topLevelCategories = CATEGORIES.slice(0, 8)

  return (
    <nav
      className={cn("relative", className)}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <ul className="flex items-center gap-1">
        {topLevelCategories.map((category) => {
          const isActive = pathname?.includes(category.slug)
          const hasChildren = MEGA_MENU_GROUPS.some((group) =>
            group.categories.includes(category.name)
          )

          return (
            <li
              key={category.slug}
              className="relative"
              onMouseEnter={() => hasChildren && setActiveMenu(category.slug)}
            >
              <Link
                href={`/category/${category.slug}`}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:text-primary hover:bg-primary/5",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                {category.name}
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      activeMenu === category.slug && "rotate-180"
                    )}
                  />
                )}
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            href="/categories"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5"
          >
            All Categories
          </Link>
        </li>
      </ul>

      {activeMenu && (
        <div
          className="absolute left-0 top-full z-50 w-screen max-w-4xl rounded-2xl border bg-popover p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
        >
          <div className="grid grid-cols-4 gap-8">
            {MEGA_MENU_GROUPS.map((group) => {
              const groupCategories = group.categories
                .map((name) => CATEGORIES.find((c) => c.name === name))
                .filter(Boolean)

              if (groupCategories.length === 0) return null

              return (
                <div key={group.title}>
                  <h3 className="font-semibold text-sm text-foreground mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {groupCategories.map((cat) =>
                      cat ? (
                        <li key={cat.slug}>
                          <Link
                            href={`/category/${cat.slug}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {cat.icon} {cat.name}
                          </Link>
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Browse our complete collection
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none text-primary underline-offset-4 hover:underline h-9 px-3 gap-1.5"
            >
              View All Categories &rarr;
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
