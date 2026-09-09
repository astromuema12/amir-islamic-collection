"use client"

import Link from "next/link"
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  User,
  MessageCircle,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/ui/reveal"
import { formatDate } from "@/lib/utils"
import { blogPosts } from "@/lib/data"

export function BlogPreview() {
  if (blogPosts.length === 0) return null

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal
          y={20}
          margin="-100px"
          className="flex items-end justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading">
                From Our Blog
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Islamic insights, guides, and inspiration
              </p>
            </div>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            View All Posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Reveal
              key={post.id}
              y={30}
              delay={index * 0.1}
              margin="-50px"
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full rounded-2xl border border-border/50 bg-card overflow-hidden card-hover flex flex-col">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                      {post.emoji}
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-sm border-0 text-xs"
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[100px] sm:max-w-[180px]">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal y={10} delay={0.3} className="mt-8 text-center md:hidden">
          <Link href="/blog">
            <Button variant="outline" className="gap-2 rounded-xl">
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
