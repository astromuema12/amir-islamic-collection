"use client"

import { useState } from "react"
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Flag,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { cn, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

interface Review {
  id: string
  product: string
  productImage?: string
  user: string
  userAvatar?: string
  rating: number
  title?: string
  content: string
  images?: string[]
  isApproved: boolean
  createdAt: Date
  response?: string
}

const mockReviews: Review[] = []

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "fill-muted text-muted"
        )}
      />
    ))}
  </div>
)

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")

  const approvedReviews = reviews.filter((r) => r.isApproved)
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
      : 0

  const handleRespond = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error("Please write a response")
      return
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, response: responseText } : r
      )
    )
    setResponseText("")
    setExpandedId(null)
    toast.success("Response posted successfully!")
  }

  const handleApprove = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r
      )
    )
    toast.success("Review status updated")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer reviews and respond to feedback
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(averageRating)} size="md" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {reviews.filter((r) => r.isApproved).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {reviews.filter((r) => !r.isApproved).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.user}</p>
                      <Badge variant="outline" className="text-xs">
                        {review.product}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.title && (
                      <p className="mt-2 font-medium">{review.title}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.content}
                    </p>

                    {review.response && (
                      <div className="mt-3 rounded-lg bg-primary/5 p-3 border border-primary/10">
                        <p className="text-xs font-semibold text-primary flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Your Response
                        </p>
                        <p className="mt-1 text-sm">{review.response}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                  >
                    {review.isApproved ? (
                      <Flag className="h-4 w-4 text-warning" />
                    ) : (
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(
                        expandedId === review.id ? null : review.id
                      )
                    }
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedId === review.id && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <p className="text-sm font-medium">Write a response</p>
                  <Textarea
                    placeholder="Reply to this review..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setExpandedId(null)
                        setResponseText("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRespond(review.id)}
                    >
                      Post Response
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
