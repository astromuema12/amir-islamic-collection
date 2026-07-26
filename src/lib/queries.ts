import { unstable_cache } from "next/cache";
import { productRepository } from "@/lib/repositories/product-repository";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache-tags";

const _getProducts = unstable_cache(
  productRepository.getProducts.bind(productRepository),
  ["products-list"],
  { tags: [CACHE_TAGS.products], revalidate: CACHE_TTL.products },
);

const _getProduct = unstable_cache(
  productRepository.getProductBySlug.bind(productRepository),
  ["product-by-slug"],
  { tags: [CACHE_TAGS.products], revalidate: CACHE_TTL.products },
);

const _getRelatedProducts = unstable_cache(
  productRepository.getRelatedProducts.bind(productRepository),
  ["related-products"],
  { tags: [CACHE_TAGS.products], revalidate: CACHE_TTL.products },
);

const _getCategories = unstable_cache(
  productRepository.getCategories.bind(productRepository),
  ["categories"],
  { tags: [CACHE_TAGS.categories], revalidate: CACHE_TTL.categories },
);

const _getCategoryBySlug = unstable_cache(
  productRepository.getCategoryBySlug.bind(productRepository),
  ["category-by-slug"],
  { tags: [CACHE_TAGS.categories], revalidate: CACHE_TTL.categories },
);

const _getBrands = unstable_cache(
  productRepository.getBrands.bind(productRepository),
  ["brands"],
  { tags: [CACHE_TAGS.categories], revalidate: CACHE_TTL.categories },
);

const _getProductReviews = unstable_cache(
  productRepository.getProductReviews.bind(productRepository),
  ["product-reviews"],
  { tags: [CACHE_TAGS.products], revalidate: CACHE_TTL.products },
);

export function getProducts(options?: Parameters<typeof productRepository.getProducts>[0]) {
  return _getProducts(options);
}

export function getProduct(slug: string) {
  return _getProduct(slug);
}

export function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 10) {
  return _getRelatedProducts(categoryId, excludeProductId, limit);
}

export function getCategories() {
  return _getCategories();
}

export function getCategoryBySlug(slug: string) {
  return _getCategoryBySlug(slug);
}

export function getBrands() {
  return _getBrands();
}

export function getProductReviews(productId: string) {
  return _getProductReviews(productId);
}
