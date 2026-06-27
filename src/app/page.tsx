import { Separator } from "@/components/ui/separator"
import {
  HeroSection,
  FeaturedCategories,
  FlashSales,
  FeaturedProducts,
  TrendingProducts,
  Testimonials,
  Newsletter,
  BlogPreview,
  FAQPreview,
} from "@/components/home"

export default function Home() {
  return (
    <>
      <HeroSection />
      <Separator className="max-w-7xl mx-auto" />
      <FeaturedCategories />
      <Separator className="max-w-7xl mx-auto" />
      <FlashSales />
      <Separator className="max-w-7xl mx-auto" />
      <FeaturedProducts />
      <Separator className="max-w-7xl mx-auto" />
      <TrendingProducts />
      <Separator className="max-w-7xl mx-auto" />
      <Testimonials />
      <Newsletter />
      <Separator className="max-w-7xl mx-auto" />
      <BlogPreview />
      <Separator className="max-w-7xl mx-auto" />
      <FAQPreview />
    </>
  )
}
