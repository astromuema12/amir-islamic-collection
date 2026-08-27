import { StarRating } from "./stars"
import type { Testimonial } from "@/lib/data"

interface ReviewSummaryProps {
  reviews: Testimonial[]
  className?: string
}

export function ReviewSummary({ reviews, className }: ReviewSummaryProps) {
  if (reviews.length === 0) return null

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const display = Math.round(average * 10) / 10

  return (
    <div
      role="group"
      aria-label="Customer rating summary"
      className={
        className ??
        "flex flex-col items-center gap-2 rounded-2xl border bg-card px-8 py-6 shadow-sm"
      }
    >
      <div className="flex items-baseline gap-1.5">
        <span className="premium-heading text-4xl text-foreground lg:text-5xl">
          {display}
        </span>
        <span className="text-lg font-medium text-muted-foreground">/ 5</span>
      </div>
      <StarRating rating={Math.round(average)} starClassName="h-5 w-5" />
      <p className="text-sm text-muted-foreground">
        Based on {reviews.length} customer review
        {reviews.length === 1 ? "" : "s"}
      </p>
    </div>
  )
}