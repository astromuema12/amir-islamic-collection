import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, BookOpen, Heart, Tag } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"
import { db } from "@/lib/db"
import { blogs } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const blogPosts: Record<string, {
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
}> = {}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <article>
        <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
              className="mb-6"
            />
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-premium/10 border flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-sm sm:prose-base max-w-none">
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                    {line.replace("### ", "")}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="text-muted-foreground ml-6">
                    {line.replace("- ", "")}
                  </li>
                )
              }
              if (line.startsWith("• ")) {
                return (
                  <li key={i} className="text-muted-foreground ml-6">
                    {line.replace("• ", "")}
                  </li>
                )
              }
              if (line.trim() === "") {
                return <div key={i} className="h-4" />
              }
              return (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {line}
                </p>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-10" />

          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Separator className="my-10" />

          <section>
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .filter(([key]) => key !== slug)
                .slice(0, 2)
                .map(([key, related]) => (
                  <Link key={key} href={`/blog/${key}`} className="group">
                    <Card className="border-2 hover:border-primary/50 transition-all duration-300 h-full">
                      <CardContent className="p-5">
                        <Badge variant="secondary" className="mb-2">
                          {related.category}
                        </Badge>
                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
