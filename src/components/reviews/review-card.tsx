import { BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "./stars"
import type { Testimonial } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  review: Testimonial
  variant?: "grid" | "featured"
  className?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ReviewCard({ review, variant = "grid", className }: ReviewCardProps) {
  const centered = variant === "featured"

  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md lg:rounded-2xl lg:p-6",
        centered && "items-center text-center",
        className
      )}
    >
      <div className={cn("flex items-center gap-2", centered && "justify-center")}>
        <StarRating rating={review.rating} starClassName="h-4 w-4 lg:h-5 lg:w-5" />
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <BadgeCheck className="h-4 w-4" />
            Verified Purchase
          </span>
        )}
      </div>

      <blockquote
        className={cn(
          "mt-4 flex-1 leading-relaxed text-foreground/90",
          centered ? "text-base italic lg:text-lg" : "text-sm lg:text-[15px]"
        )}
      >
        &ldquo;{review.content}&rdquo;
      </blockquote>

      <figcaption
        className={cn(
          "mt-5 flex items-center gap-3",
          centered && "flex-col gap-2"
        )}
      >
        <Avatar className="h-11 w-11 ring-2 ring-primary/10">
          {review.avatar ? (
            <AvatarImage src={review.avatar} alt={review.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(review.name)}
          </AvatarFallback>
        </Avatar>
        <div className={cn("min-w-0", centered && "text-center")}>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">
            {review.role} &middot; {review.location}
          </p>
          {review.date && (
            <p className="text-[11px] text-muted-foreground/70">{review.date}</p>
          )}
        </div>
      </figcaption>
    </figure>
  )
}