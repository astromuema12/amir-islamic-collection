import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, Clock, ArrowRight, Search, BookOpen } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_URL } from "@/lib/constants"
import { db } from "@/lib/db"
import { blogs } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Blog - Amir Islamic Collections",
  description: "Discover articles about Islamic lifestyle, product guides, modest fashion tips, home decor ideas, and insights from the Muslim community.",
  openGraph: {
    title: "Blog - Amir Islamic Collections",
    description: "Islamic lifestyle articles, product guides, and community stories.",
    url: `${APP_URL}/blog`,
  },
}

const featuredPosts = [
  {
    slug: "ramadan-2026-preparation-guide",
    title: "Complete Ramadan 2026 Preparation Guide",
    excerpt: "Get ready for the blessed month with our comprehensive guide covering spiritual preparation, essential products, and daily planning tips.",
    image: null,
    category: "Ramadan",
    author: "Amir Islamic Team",
    date: "June 15, 2026",
    readTime: "8 min read",
  },
  {
    slug: "choosing-the-perfect-prayer-mat",
    title: "How to Choose the Perfect Prayer Mat",
    excerpt: "A detailed guide to selecting a prayer mat that combines comfort, durability, and beauty for your daily prayers.",
    image: null,
    category: "Product Guide",
    author: "Aisha Mohammed",
    date: "June 10, 2026",
    readTime: "6 min read",
  },
  {
    slug: "modest-fashion-trends-2026",
    title: "Modest Fashion Trends to Watch in 2026",
    excerpt: "Explore the latest modest fashion trends, from abayas to hijabs, that combine style with Islamic values.",
    image: null,
    category: "Fashion",
    author: "Fatima Hassan",
    date: "June 5, 2026",
    readTime: "5 min read",
  },
]

const recentPosts = [
  {
    slug: "benefits-of-reading-quran-daily",
    title: "The Spiritual and Mental Benefits of Reading Quran Daily",
    excerpt: "Discover how regular Quran recitation can transform your spiritual life, reduce stress, and bring peace to your heart.",
    category: "Spirituality",
    author: "Yusuf Ahmad",
    date: "June 1, 2026",
    readTime: "7 min read",
  },
  {
    slug: "eid-gift-guide-2026",
    title: "Eid al-Adha 2026 Gift Guide: Thoughtful Presents for Loved Ones",
    excerpt: "Find the perfect Eid gifts for family and friends with our curated collection of meaningful and beautiful presents.",
    category: "Gift Guide",
    author: "Amir Islamic Team",
    date: "May 28, 2026",
    readTime: "4 min read",
  },
  {
    slug: "halal-home-decor-ideas",
    title: "Halal Home Decor: Beautiful Your Space with Islamic Art",
    excerpt: "Transform your home with tasteful Islamic decor that reflects your faith and creates a peaceful environment for your family.",
    category: "Home & Decor",
    author: "Aisha Mohammed",
    date: "May 22, 2026",
    readTime: "6 min read",
  },
  {
    slug: "perfume-in-islam-sunnah-fragrances",
    title: "Perfume in Islam: A Guide to Sunnah Fragrances",
    excerpt: "Learn about the importance of fragrance in Islamic tradition and discover our collection of alcohol-free, Sunnah-inspired perfumes.",
    category: "Lifestyle",
    author: "Abdullahi Ibrahim",
    date: "May 18, 2026",
    readTime: "5 min read",
  },
  {
    slug: "teaching-kids-islamic-values",
    title: "10 Fun Ways to Teach Islamic Values to Children",
    excerpt: "Practical tips and product recommendations for parents who want to instill Islamic values in their children through play and daily activities.",
    category: "Parenting",
    author: "Fatima Hassan",
    date: "May 14, 2026",
    readTime: "8 min read",
  },
  {
    slug: "sustainable-fashion-in-islam",
    title: "Sustainable Fashion in Islam: Caring for the Earth",
    excerpt: "Explore how Islamic principles of environmental stewardship align with sustainable fashion choices.",
    category: "Fashion",
    author: "Yusuf Ahmad",
    date: "May 10, 2026",
    readTime: "5 min read",
  },
]

const categories = [
  "All",
  "Ramadan",
  "Product Guide",
  "Fashion",
  "Spirituality",
  "Gift Guide",
  "Home & Decor",
  "Lifestyle",
  "Parenting",
]

export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Blog" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Blog</h1>
              <p className="text-muted-foreground mt-1">
                Insights, guides, and stories for the modern Muslim family
              </p>
            </div>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-premium/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/40 group-hover:text-primary/60 transition-colors" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
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

        <Separator className="mb-12" />

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:border-primary hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:border-primary"
            >
              {cat}
            </button>
          ))}
        </div>

        <section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
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

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            Load More Articles
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
