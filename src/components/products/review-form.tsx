"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createReview } from "@/lib/actions"

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating")
      return
    }
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set("productId", productId)
      formData.set("rating", String(rating))
      formData.set("title", title)
      formData.set("content", content)

      const result = await createReview(formData)
      if (result.error) {
        setError(typeof result.error === "string" ? result.error : "Failed to submit review")
      } else {
        setRating(0)
        setTitle("")
        setContent("")
        onSuccess?.()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Write a Review</h3>

      <div className="space-y-1.5">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const star = i + 1
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30",
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-title">Title</Label>
        <Input
          id="review-title"
          placeholder="Great product!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-content">Review</Label>
        <Textarea
          id="review-content"
          placeholder="Share your experience with this product..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" isLoading={isSubmitting}>
        Submit Review
      </Button>
    </form>
  )
}
