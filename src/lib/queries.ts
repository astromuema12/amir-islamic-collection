import { db } from "@/lib/db";
import { products, categories, brands, reviews, users } from "@/lib/db/schema";
import { eq, and, like, desc, asc, sql, gte, lte, inArray, ne } from "drizzle-orm";
import type { Product, Category, Review } from "@/types";

function serializeProduct(p: typeof products.$inferSelect & { category?: unknown; brand?: unknown }): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || "",
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    currency: p.currency,
    images: p.images || [],
    videos: p.videos || undefined,
    categoryId: p.categoryId,
    category: p.category as Category | undefined,
    brandId: p.brandId || undefined,
    brand: p.brand as { id: string; name: string; slug: string; logo?: string; description?: string; productCount: number } | undefined,
    sellerId: p.sellerId,
    sku: p.sku,
    weight: p.weight ? Number(p.weight) : undefined,
    dimensions: p.dimensions || undefined,
    stock: p.stock,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    isFlashSale: p.isFlashSale,
    flashSaleEnds: p.flashSaleEnds || undefined,
    tags: p.tags || [],
    specifications: p.specifications || undefined,
    averageRating: Number(p.averageRating),
    reviewCount: p.reviewCount,
    salesCount: p.salesCount,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function serializeReview(r: typeof reviews.$inferSelect & { user?: unknown }): Review {
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    user: r.user as Review["user"],
    rating: r.rating,
    title: r.title || undefined,
    content: r.content || undefined,
    images: r.images || undefined,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
  };
}

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
  const conditions = [eq(products.isActive, true)];
  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const offset = (page - 1) * limit;

  if (options?.search) {
    conditions.push(like(products.name, `%${options.search}%`));
  }

  if (options?.categorySlug) {
    const sub = db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, options.categorySlug));
    conditions.push(inArray(products.categoryId, sub));
  }

  if (options?.categories && options.categories.length > 0) {
    const sub = db
      .select({ id: categories.id })
      .from(categories)
      .where(inArray(categories.slug, options.categories));
    conditions.push(inArray(products.categoryId, sub));
  }

  if (options?.brands && options.brands.length > 0) {
    conditions.push(inArray(products.brandId, options.brands));
  }

  if (options?.minPrice !== undefined) {
    conditions.push(gte(sql`CAST(${products.price} AS numeric)`, options.minPrice));
  }

  if (options?.maxPrice !== undefined) {
    conditions.push(lte(sql`CAST(${products.price} AS numeric)`, options.maxPrice));
  }

  if (options?.rating !== undefined) {
    conditions.push(gte(sql`CAST(${products.averageRating} AS numeric)`, options.rating));
  }

  if (options?.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (options?.flashSale) {
    conditions.push(eq(products.isFlashSale, true));
  }

  if (options?.sellerId) {
    conditions.push(eq(products.sellerId, options.sellerId));
  }

  let orderBy = desc(products.createdAt);
  switch (options?.sort) {
    case "price-asc":
      orderBy = asc(products.price);
      break;
    case "price-desc":
      orderBy = desc(products.price);
      break;
    case "popular":
      orderBy = desc(products.salesCount);
      break;
    case "discount":
      orderBy = desc(products.discountPrice);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const result = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(...conditions));

  const serialized = result.map(serializeProduct);

  return {
    products: serialized,
    total: Number(countResult.count),
    page,
    totalPages: Math.ceil(Number(countResult.count) / limit),
  };
}

export async function getProduct(slug: string) {
  const [result] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .limit(1);

  if (!result) return null;

  const p = result.products;
  return {
    ...serializeProduct(p),
    category: result.categories ? {
      id: result.categories.id,
      name: result.categories.name,
      slug: result.categories.slug,
      description: result.categories.description || undefined,
      image: result.categories.image || undefined,
      parentId: result.categories.parentId || undefined,
      productCount: 0,
      createdAt: result.categories.createdAt,
    } : undefined,
    brand: result.brands ? {
      id: result.brands.id,
      name: result.brands.name,
      slug: result.brands.slug,
      logo: result.brands.logo || undefined,
      description: result.brands.description || undefined,
      productCount: 0,
    } : undefined,
  };
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 10) {
  const result = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        eq(products.categoryId, categoryId),
        ne(products.id, excludeProductId),
      ),
    )
    .orderBy(desc(products.salesCount))
    .limit(limit);

  return result.map(serializeProduct);
}

export async function getCategories() {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true));

  return result.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || undefined,
    image: c.image || undefined,
    parentId: c.parentId || undefined,
    productCount: 0,
    createdAt: c.createdAt,
  })) satisfies Category[];
}

export async function getCategoryBySlug(slug: string) {
  const [result] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    slug: result.slug,
    description: result.description || undefined,
    image: result.image || undefined,
    parentId: result.parentId || undefined,
    productCount: 0,
    createdAt: result.createdAt,
  } satisfies Category;
}

export async function getBrands() {
  const result = await db
    .select()
    .from(brands)
    .where(eq(brands.isActive, true));

  return result.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo || undefined,
    description: b.description || undefined,
    productCount: 0,
  }));
}

export async function getProductReviews(productId: string) {
  const result = await db
    .select()
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));

  return result.map((r) =>
    serializeReview({
      ...r.reviews,
      user: r.users ? {
        id: r.users.id,
        name: r.users.name || "Anonymous",
        email: r.users.email,
        image: r.users.image || undefined,
        emailVerified: r.users.emailVerified,
        role: r.users.role as "user" | "seller" | "admin" | "super_admin",
        phone: r.users.phone || undefined,
        bio: r.users.bio || undefined,
        createdAt: r.users.createdAt,
        updatedAt: r.users.updatedAt,
      } : undefined,
    }),
  );
}
