import type { Metadata } from "next"
import { BookOpen } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { APP_URL } from "@/lib/constants"
import BlogGrid from "./blog-grid"

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
  const allPosts = [...featuredPosts, ...recentPosts]

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
          <BlogGrid posts={allPosts} categories={categories} />
        </div>
      </div>
    </div>
  )
}
