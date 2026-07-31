import { getAdminCategories, getAdminBrands } from "@/lib/actions/admin-actions"
import { ProductForm } from "@/components/admin/products/product-form"

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getAdminCategories(), getAdminBrands()])

  return <ProductForm mode="create" categories={categories} brands={brands} />
}
