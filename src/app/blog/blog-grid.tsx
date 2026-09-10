"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Clock, ArrowRight, Search, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
}

interface BlogGridProps {
  posts: BlogPost[]
  categories: string[]
}

export default function BlogGrid({ posts, categories }: BlogGridProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory
      const q = query.toLowerCase().trim()
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [posts, query, activeCategory])

  return (
    <>
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            data-active={activeCategory === cat}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:border-primary hover:text-primary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        <section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Try a different search term or category.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("")
              setActiveCategory("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </>
  )
}