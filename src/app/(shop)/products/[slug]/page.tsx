import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { Check, Truck, RotateCcw, Shield } from "lucide-react"
import { getProduct, getRelatedProducts, getProductReviews } from "@/lib/queries"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ImageGallery } from "@/components/products/image-gallery"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"
import { ProductInfo } from "@/components/products/product-info"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_URL } from "@/lib/constants"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Product Not Found" }

  return {
    title: `${product.name} - ${APP_NAME}`,
    description: product.description?.slice(0, 160) || `${product.name} at ${APP_NAME}`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  }
}

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [reviews, relatedProducts, nonce] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.categoryId, product.id),
    headers().then((h) => h.get("x-nonce") || undefined),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    sku: product.sku,
    brand: product.brand?.name ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      price: product.discountPrice || product.price,
      priceCurrency: product.currency,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: product.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <ImageGallery images={product.images || []} productName={product.name} />

          <div className="space-y-6">
            <ProductInfo product={product} />

            <Separator />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Delivery Info</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Free shipping on orders over KES 5,000. Delivery within 2-5 business days across Kenya.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Return Policy</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      7-day easy return. Items must be unused and in original packaging.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Secure Checkout</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-3 p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Authentic Products</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      100% authentic Islamic products sourced from trusted suppliers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.description}
            </div>
          </div>
        )}

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Specifications</h2>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr
                      key={key}
                      className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{key}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-12">
          <ProductReviews
            reviews={reviews}
            productId={product.id}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        </div>

        <div className="mt-12">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </>
  )
}
