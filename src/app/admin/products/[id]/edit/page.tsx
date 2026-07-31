import { notFound } from "next/navigation"
import { getProductById } from "@/lib/actions/product-actions"
import { getAdminCategories, getAdminBrands } from "@/lib/actions/admin-actions"
import { ProductForm, type ProductFormInitial } from "@/components/admin/products/product-form"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  const [product, categories, brands] = await Promise.all([
    getProductById(id),
    getAdminCategories(),
    getAdminBrands(),
  ])

  if (!product) notFound()

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    discountPrice: product.discountPrice,
    categoryId: product.categoryId,
    brandId: product.brandId,
    stock: product.stock,
    weight: product.weight,
    dimensions: product.dimensions,
    tags: product.tags ?? [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isFlashSale: product.isFlashSale,
    flashSaleEnds: product.flashSaleEnds,
    images: product.images ?? [],
  }

  return <ProductForm mode="edit" initial={initial} categories={categories} brands={brands} />
}
