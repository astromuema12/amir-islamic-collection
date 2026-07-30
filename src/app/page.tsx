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

export default async function Home() {
  const [featuredData, flashData, trendingData] = await Promise.all([
    getProducts({ featured: true, limit: 10 }),
    getProducts({ flashSale: true, limit: 4 }),
    getProducts({ sort: "popular", limit: 4 }),
  ])

  return (
    <>
      <HeroSection />
      <Separator className="max-w-7xl mx-auto" />
      <FeaturedCategories />
      <Separator className="max-w-7xl mx-auto" />
      <FlashSales products={flashData.products} />
      <Separator className="max-w-7xl mx-auto" />
      <FeaturedProducts products={featuredData.products} />
      <Separator className="max-w-7xl mx-auto" />
      <TrendingProducts products={trendingData.products} />
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
