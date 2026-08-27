import { Suspense } from "react"
import { PromoCarousel } from "@/components/home/promo-carousel"
import { CategoryScroller } from "@/components/home/category-scroller"
import { ProductSection } from "@/components/home/product-section"
import { FlashSales } from "@/components/home/flash-sales"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"
import { ConnectWithUs } from "@/components/home/connect-with-us"
import { BlogPreview } from "@/components/home/blog-preview"
import { FAQPreview } from "@/components/home/faq-preview"
import { getProducts } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"

function ProductGridLoader() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function RecommendedSection() {
  const { products } = await getProducts({ featured: true, limit: 10 })
  if (products.length === 0) return null
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ProductSection
        title="Recommended For You"
        description="Handpicked premium products for you"
        products={products}
        href="/products"
      />
    </div>
  )
}

async function FlashSalesSection() {
  const { products } = await getProducts({ flashSale: true, limit: 4 })
  return <FlashSales products={products} />
}

async function TrendingSection() {
  const { products } = await getProducts({ sort: "popular", limit: 5 })
  if (products.length === 0) return null
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ProductSection
        title="Popular Products"
        description="Most sought after items"
        products={products.slice(0, 5)}
        href="/products?sort=popular"
      />
    </div>
  )
}

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
        <PromoCarousel />
      </div>

      <section className="mt-4 sm:mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryScroller />
        </div>
      </section>

      <main className="pb-20 lg:pb-10">
        <Suspense fallback={<ProductGridLoader />}>
          <RecommendedSection />
        </Suspense>

        <div className="mx-auto max-w-7xl">
          <Suspense
            fallback={
              <div className="animate-pulse p-4">
                <Skeleton className="h-8 w-48" />
              </div>
            }
          >
            <FlashSalesSection />
          </Suspense>
        </div>

        <Suspense fallback={<ProductGridLoader />}>
          <TrendingSection />
        </Suspense>

        <Testimonials />
        <Newsletter />
        <ConnectWithUs />
        <BlogPreview />
        <FAQPreview />
      </main>
    </>
  )
}
