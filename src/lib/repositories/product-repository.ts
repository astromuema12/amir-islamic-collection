import { db } from "@/lib/db";
import { products, categories, brands, reviews, users } from "@/lib/db/schema";
import { eq, and, like, desc, asc, sql, gte, lte, inArray, ne } from "drizzle-orm";
import type { Product, Category, Review, CategoryTree } from "@/types";

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
    brand: p.brand as Product["brand"],
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

function buildProductConditions(options?: {
  search?: string;
  categories?: string[];
  categorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  featured?: boolean;
  flashSale?: boolean;
  sellerId?: string;
  category?: string;
}) {
  const conditions = [eq(products.isActive, true)];

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

  if (options?.category) {
    conditions.push(eq(products.categoryId, options.category));
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

  return conditions;
}

function resolveOrderBy(sort?: string) {
  switch (sort) {
    case "price-asc":
      return asc(products.price);
    case "price-desc":
      return desc(products.price);
    case "popular":
      return desc(products.salesCount);
    case "discount":
      return desc(products.discountPrice);
    default:
      return desc(products.createdAt);
  }
}

class ProductRepository {
  async getProducts(options?: {
    search?: string;
    categories?: string[];
    categorySlug?: string;
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sort?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
    flashSale?: boolean;
    sellerId?: string;
    category?: string;
  }) {
    const conditions = buildProductConditions(options);
    const page = options?.page || 1;
    const limit = options?.limit || 24;
    const offset = (page - 1) * limit;

    const result = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(resolveOrderBy(options?.sort))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    return {
      products: result.map(serializeProduct),
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  }

  async getProductsRaw(options?: {
    category?: string;
    sellerId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
    flashSale?: boolean;
  }) {
    const conditions = buildProductConditions(options);
    const page = options?.page || 1;
    const limit = options?.limit || 24;
    const offset = (page - 1) * limit;

    const result = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(resolveOrderBy(options?.sort))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    return {
      products: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  }

  async getProductBySlug(slug: string) {
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
      category: result.categories
        ? {
            id: result.categories.id,
            name: result.categories.name,
            slug: result.categories.slug,
            description: result.categories.description || undefined,
            image: result.categories.image || undefined,
            parentId: result.categories.parentId || undefined,
            productCount: 0,
            createdAt: result.categories.createdAt,
          }
        : undefined,
      brand: result.brands
        ? {
            id: result.brands.id,
            name: result.brands.name,
            slug: result.brands.slug,
            logo: result.brands.logo || undefined,
            description: result.brands.description || undefined,
            productCount: 0,
          }
        : undefined,
    };
  }

  async getProductBySlugRaw(slug: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    return product || null;
  }

  async getProductById(id: string) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return product || null;
  }

  async getRelatedProducts(categoryId: string, excludeProductId: string, limit = 10) {
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

  async getLowInventoryProducts(limit = 6) {
    return await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
        price: products.price,
        images: products.images,
      })
      .from(products)
      .where(lte(products.stock, 10))
      .orderBy(asc(products.stock))
      .limit(limit);
  }

  async getSellerProducts(sellerId: string) {
    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .orderBy(desc(products.createdAt));
  }

  async countBySeller(sellerId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    return Number(result.count);
  }

  async create(data: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
    discountPrice?: string;
    categoryId: string;
    brandId?: string;
    sellerId: string;
    sku: string;
    stock: number;
    weight?: string;
    dimensions?: string;
    tags: string[];
    specifications?: Record<string, string>;
    isFeatured: boolean;
    isFlashSale: boolean;
    flashSaleEnds?: Date | null;
    isActive?: boolean;
    images?: string[];
  }, client: typeof db = db) {
    await client.insert(products).values(data);
    return data.id;
  }

  async update(id: string, data: Record<string, unknown>, client: typeof db = db) {
    await client
      .update(products)
      .set({ ...data, updatedAt: new Date() } as typeof products.$inferInsert)
      .where(eq(products.id, id));
  }

  async delete(id: string, client: typeof db = db) {
    await client.delete(products).where(eq(products.id, id));
  }

  async toggleFeatured(id: string, client: typeof db = db) {
    const [product] = await client
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) return null;

    await client
      .update(products)
      .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
      .where(eq(products.id, id));

    return !product.isFeatured;
  }

  async updateImages(id: string, newImages: string[], client: typeof db = db) {
    const [product] = await client
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) return null;

    const updatedImages = [...(product.images || []), ...newImages];

    await client
      .update(products)
      .set({ images: updatedImages, updatedAt: new Date() })
      .where(eq(products.id, id));

    return updatedImages;
  }

  async recalculateRating(productId: string) {
    const [ratingResult] = await db
      .select({
        avg: sql<number>`AVG(rating)`.as("avg_rating"),
        count: sql<number>`COUNT(*)`.as("review_count"),
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.isApproved, true),
        ),
      );

    await db
      .update(products)
      .set({
        averageRating: ratingResult.avg?.toString() || "0",
        reviewCount: Number(ratingResult.count) || 0,
      })
      .where(eq(products.id, productId));
  }

  async getCategories() {
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

  async getCategoryBySlug(slug: string) {
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

  async getCategoryNavigation() {
    const [catRows, countRows] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.name)),
      db
        .select({
          categoryId: products.categoryId,
          count: sql<number>`count(*)`,
        })
        .from(products)
        .where(eq(products.isActive, true))
        .groupBy(products.categoryId),
    ]);

    const countMap = new Map(countRows.map((r) => [r.categoryId, Number(r.count)]));

    const nodes: CategoryTree[] = catRows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || undefined,
      image: c.image || undefined,
      parentId: c.parentId || undefined,
      productCount: countMap.get(c.id) || 0,
      createdAt: c.createdAt,
      children: [],
    }));

    const map = new Map(nodes.map((n) => [n.id, n]));
    const roots: CategoryTree[] = [];

    nodes.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async getBrands() {
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

  async getProductReviews(productId: string) {
    const result = await db
      .select()
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
      .orderBy(desc(reviews.createdAt));

    return result.map((r) =>
      serializeReview({
        ...r.reviews,
        user: r.users
          ? {
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
            }
          : undefined,
      }),
    );
  }
}

export const productRepository = new ProductRepository();
