"use client"

import Link from "next/link"
import Image from "next/image"
import { CATEGORIES } from "@/lib/constants"

export function CategoryScroller() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
      {CATEGORIES.slice(0, 12).map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="group flex min-w-[84px] max-w-[84px] flex-col items-center gap-1.5 sm:min-w-[96px] sm:max-w-[96px] rounded-xl p-2 transition-all hover:bg-primary/5"
        >
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted group-hover:bg-primary/10 sm:h-16 sm:w-16 transition-colors">
            {category.icon?.startsWith("http") ? (
              <Image
                src={category.icon}
                alt={category.name}
                width={40}
                height={40}
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover"
              />
            ) : (
              <span className="text-xl sm:text-2xl">{category.icon || "📦"}</span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-center leading-tight text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
