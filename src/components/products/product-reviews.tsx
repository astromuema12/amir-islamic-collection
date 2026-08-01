"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ReviewForm } from "./review-form"
import type { Review } from "@/types"

interface ProductReviewsProps {
  reviews: Review[]
  productId: string
  averageRating: number
  reviewCount: number
}

export function ProductReviews({ reviews, productId, averageRating, reviewCount }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest")

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "highest") return b.rating - a.rating
    return a.rating - b.rating
  })

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const count = reviews.filter((r) => r.rating === i + 1).length
    return { stars: i + 1, count, percentage: reviewCount > 0 ? (count / reviewCount) * 100 : 0 }
  }).reverse()

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div className="text-center">
            <span className="text-4xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground"> / 5</span>
          </div>
          <div className="flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">{reviewCount} reviews</p>
          <Separator />
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right text-muted-foreground">{stars}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((review) => (
                <div key={review.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {review.user?.name?.charAt(0) || "U"}
                        </div>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {review.title && <h4 className="mt-2 font-medium text-foreground">{review.title}</h4>}
                  {review.content && <p className="mt-1 text-sm text-muted-foreground">{review.content}</p>}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {review.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Review image ${i + 1}`}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                      <Flag className="h-3.5 w-3.5" />
                      Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showReviewForm && (
            <div className="rounded-xl border bg-card p-6">
              <ReviewForm productId={productId} onSuccess={() => setShowReviewForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
