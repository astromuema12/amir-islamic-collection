import type { Metadata } from "next"
import { testimonials } from "@/lib/data"
import { ReviewCarousel } from "@/components/reviews/review-carousel"
import { ReviewGrid } from "@/components/reviews/review-grid"
import { ReviewSummary } from "@/components/reviews/review-summary"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: `Customer Reviews | ${APP_NAME}`,
  description:
    "Read customer reviews and experiences from Amir Islamic Collections shoppers.",
  alternates: {
    canonical: `${APP_URL}/reviews`,
  },
  openGraph: {
    title: `Customer Reviews | ${APP_NAME}`,
    description:
      "Read customer reviews and experiences from Amir Islamic Collections shoppers.",
    url: `${APP_URL}/reviews`,
  },
}

export default function ReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Customer Reviews" }]} />

      <div className="mt-6 text-center lg:mt-12">
        <h1 className="premium-heading text-3xl text-foreground sm:text-4xl lg:text-5xl">
          What Our Customers Say
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Hear from our community of satisfied customers across Kenya and beyond.
        </p>
        <div className="mt-8 flex justify-center lg:mt-10">
          <ReviewSummary reviews={testimonials} />
        </div>
      </div>

      <div className="mt-12 lg:mt-20">
        <ReviewCarousel reviews={testimonials} />
      </div>

      <div className="mt-12 lg:mt-20">
        <div className="mb-8 text-center">
          <h2 className="premium-heading text-2xl text-foreground sm:text-3xl">
            Customer Experiences
          </h2>
          <p className="mt-2 text-muted-foreground">
            Reviews from Amir Islamic Collections shoppers
          </p>
        </div>
        <ReviewGrid reviews={testimonials} />
      </div>
    </div>
  )
}