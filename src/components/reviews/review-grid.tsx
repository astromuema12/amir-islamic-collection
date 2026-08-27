import { ReviewCard } from "./review-card"
import type { Testimonial } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ReviewGridProps {
  reviews: Testimonial[]
  className?: string
}

export function ReviewGrid({ reviews, className }: ReviewGridProps) {
  if (reviews.length === 0) return null

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6",
        className
      )}
    >
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}