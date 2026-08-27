"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { CategoryTree } from "@/types"
import { SearchBar } from "@/components/layout/search-bar"
import { Button } from "@/components/ui/button"
import { getCategoryIcon } from "@/lib/category-icons"
import { cn } from "@/lib/utils"

interface CategoryBrowserProps {
  categories: CategoryTree[]
}

function CategoryVisual({
  category,
  className,
  emojiClassName,
  sizes,
}: {
  category: CategoryTree
  className?: string
  emojiClassName?: string
  sizes: string
}) {
  const icon = getCategoryIcon(category)
  if (icon.kind === "image") {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image
          src={icon.value}
          alt={category.name}
          fill
          sizes={sizes}
          loading="lazy"
          className="object-cover"
        />
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center bg-primary/5", className)}
    >
      <span className={emojiClassName}>{icon.value}</span>
    </div>
  )
}

function SubcategoryCard({ category }: { category: CategoryTree }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      aria-label={`${category.name} products`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:rounded-xl"
    >
      <CategoryVisual
        category={category}
        sizes="(max-width: 480px) 32vw, (max-width: 1024px) 18vw, 12vw"
        className="aspect-square w-full"
        emojiClassName="text-3xl lg:text-4xl"
      />
      <div className="flex flex-1 items-center justify-center p-1.5 text-center lg:p-3">
        <span className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground transition-colors group-hover:text-primary lg:text-sm">
          {category.name}
        </span>
      </div>
    </Link>
  )
}

export function CategoryBrowser({ categories }: CategoryBrowserProps) {
  const defaultSlug = useMemo(() => {
    const withChildren = categories.find((c) => c.children.length > 0)
    return (withChildren ?? categories[0])?.slug ?? ""
  }, [categories])

  const [activeSlug, setActiveSlug] = useState(defaultSlug)
  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0]

  if (categories.length === 0) {
    return (
      <div>
        <SearchBar className="mb-4" />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-4 py-16 text-center">
          <span aria-hidden="true" className="text-4xl">
            🕌
          </span>
          <h2 className="mt-4 text-base font-semibold text-foreground">No categories yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories will appear here once they are added.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-6">
            <Link href="/products">Browse all products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const activeChildren = active?.children ?? []

  return (
    <div>
      <SearchBar className="mb-3 lg:mb-6" />

      <div className="flex items-stretch gap-2 lg:gap-6">
        <aside className="w-[30%] max-w-[7.5rem] shrink-0 lg:w-64 lg:max-w-none">
          <nav
            aria-label="Main categories"
            className="sticky top-[120px] flex max-h-[calc(100dvh-200px)] flex-col overflow-y-auto rounded-xl border bg-card p-1.5 shadow-sm scrollbar-thin lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:rounded-2xl lg:p-2"
          >
            {categories.map((category) => {
              const isActive = category.slug === active?.slug
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveSlug(category.slug)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative flex items-center gap-1 rounded-md px-2 py-2 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:gap-2.5 lg:rounded-lg lg:px-3 lg:py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <CategoryVisual
                    category={category}
                    sizes="48px"
                    className="hidden h-8 w-8 shrink-0 rounded-md lg:flex"
                    emojiClassName="text-base"
                  />
                  <span
                    className={cn(
                      "min-w-0 break-words text-[11px] leading-tight",
                      isActive ? "font-semibold text-primary" : "font-medium"
                    )}
                  >
                    {category.name}
                  </span>
                </button>
              )
            })}
          </nav>
        </aside>

        <section
          aria-label={active ? `${active.name} subcategories` : "Subcategories"}
          className="min-w-0 flex-1"
        >
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-border/70 pb-2 lg:mb-4 lg:pb-3">
              <h2 className="premium-heading line-clamp-1 min-w-0 text-base text-foreground lg:text-2xl">
                {active.name}
              </h2>
              {active.productCount > 0 && (
                <Link
                  href={`/categories/${active.slug}`}
                  aria-label={`See all products in ${active.name}`}
                  className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80 lg:gap-1 lg:text-sm"
                >
                  See All
                  <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                </Link>
              )}
            </div>

            {activeChildren.length > 0 ? (
              <div
                aria-live="polite"
                className="grid grid-cols-2 gap-2 min-[390px]:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5"
              >
                {activeChildren.map((sub) => (
                  <SubcategoryCard key={sub.id} category={sub} />
                ))}
              </div>
            ) : active.productCount > 0 ? (
              <div className="rounded-xl border border-dashed bg-card px-4 py-8 text-center lg:rounded-2xl lg:p-12">
                <span aria-hidden="true" className="text-3xl lg:text-4xl">
                  🛍️
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground lg:text-base">
                  No subcategories yet
                </h3>
                <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                  {active.productCount} product
                  {active.productCount === 1 ? "" : "s"} in this category
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:mt-6">
                  <Button asChild size="sm" variant="primary">
                    <Link href={`/categories/${active.slug}`}>
                      Browse {active.productCount} product
                      {active.productCount === 1 ? "" : "s"}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/products">Browse all products</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-card px-4 py-8 text-center lg:rounded-2xl lg:p-12">
                <span aria-hidden="true" className="text-3xl lg:text-4xl">
                  🕌
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground lg:text-base">
                  Nothing in this category yet
                </h3>
                <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                  New products will appear here soon.
                </p>
                <div className="mt-4 lg:mt-6">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/products">Browse all products</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  )
}