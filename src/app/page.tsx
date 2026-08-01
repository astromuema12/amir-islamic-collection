import { Suspense } from "react"
import { Separator } from "@/components/ui/separator"
import {
  HeroSection,
  FeaturedCategories,
  FlashSales,
  FeaturedProducts,
  TrendingProducts,
  Testimonials,
  Newsletter,
  ConnectWithUs,
  BlogPreview,
  FAQPreview,
} from "@/components/home"
import { getProducts } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"

function HomeSectionSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  )
}

async function FlashSalesSection() {
  const { products } = await getProducts({ flashSale: true, limit: 4 })
  return <FlashSales products={products} />
}

async function FeaturedProductsSection() {
  const { products } = await getProducts({ featured: true, limit: 10 })
  return <FeaturedProducts products={products} />
}

async function TrendingProductsSection() {
  const { products } = await getProducts({ sort: "popular", limit: 4 })
  return <TrendingProducts products={products} />
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <Separator className="max-w-7xl mx-auto" />
      <FeaturedCategories />
      <Separator className="max-w-7xl mx-auto" />
      <Suspense fallback={<HomeSectionSkeleton />}>
        <FlashSalesSection />
      </Suspense>
      <Separator className="max-w-7xl mx-auto" />
      <Suspense fallback={<HomeSectionSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>
      <Separator className="max-w-7xl mx-auto" />
      <Suspense fallback={<HomeSectionSkeleton />}>
        <TrendingProductsSection />
      </Suspense>
      <Separator className="max-w-7xl mx-auto" />
      <Testimonials />
      <Newsletter />
      <ConnectWithUs />
      <Separator className="max-w-7xl mx-auto" />
      <BlogPreview />
      <Separator className="max-w-7xl mx-auto" />
      <FAQPreview />
    </>
  )
}
