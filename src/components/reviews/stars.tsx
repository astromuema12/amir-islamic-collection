import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  className?: string
  starClassName?: string
  label?: string
}

export function StarRating({ rating, className, starClassName, label }: StarRatingProps) {
  return (
    <div
      role="img"
      aria-label={label ?? `Rated ${rating} out of 5 stars`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-foreground/30",
            starClassName
          )}
        />
      ))}
    </div>
  )
}