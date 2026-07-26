import { productRepository } from "@/lib/repositories/product-repository";

export async function getProducts(options?: {
  search?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  categorySlug?: string;
  featured?: boolean;
  flashSale?: boolean;
  sellerId?: string;
}) {
  return productRepository.getProducts(options);
}

export async function getProduct(slug: string) {
  return productRepository.getProductBySlug(slug);
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 10) {
  return productRepository.getRelatedProducts(categoryId, excludeProductId, limit);
}

export async function getCategories() {
  return productRepository.getCategories();
}

export async function getCategoryBySlug(slug: string) {
  return productRepository.getCategoryBySlug(slug);
}

export async function getBrands() {
  return productRepository.getBrands();
}

export async function getProductReviews(productId: string) {
  return productRepository.getProductReviews(productId);
}
