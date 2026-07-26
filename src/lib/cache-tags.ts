export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  dashboard: "dashboard",
} as const;

export const CACHE_TTL = {
  products: 3600,
  categories: 86400,
  dashboard: 30,
} as const;
