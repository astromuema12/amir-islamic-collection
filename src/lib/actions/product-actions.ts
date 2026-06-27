"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, and, like, desc, asc, sql, gte, lte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const raw = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      discountPrice: formData.get("discountPrice") ? Number(formData.get("discountPrice")) : undefined,
      categoryId: formData.get("categoryId") as string,
      brandId: formData.get("brandId") as string || undefined,
      stock: Number(formData.get("stock")),
      weight: formData.get("weight") ? Number(formData.get("weight")) : undefined,
      dimensions: formData.get("dimensions") as string || undefined,
      tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [],
      specifications: formData.get("specifications") ? JSON.parse(formData.get("specifications") as string) : undefined,
      isFeatured: formData.get("isFeatured") === "true",
      isFlashSale: formData.get("isFlashSale") === "true",
      flashSaleEnds: formData.get("flashSaleEnds") as string || undefined,
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const slug = slugify(parsed.data.name, { lower: true, strict: true }) + "-" + Date.now().toString(36);
    const id = uuidv4();

    await db.insert(products).values({
      id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price.toString(),
      discountPrice: parsed.data.discountPrice?.toString(),
      categoryId: parsed.data.categoryId,
      brandId: parsed.data.brandId,
      sellerId: user.id,
      sku: `${slugify(parsed.data.name, { lower: true, strict: true }).slice(0, 3).toUpperCase()}-${id.slice(-6).toUpperCase()}`,
      stock: parsed.data.stock,
      weight: parsed.data.weight?.toString(),
      dimensions: parsed.data.dimensions,
      tags: parsed.data.tags,
      specifications: parsed.data.specifications as Record<string, string> | undefined,
      isFeatured: parsed.data.isFeatured,
      isFlashSale: parsed.data.isFlashSale,
      flashSaleEnds: parsed.data.flashSaleEnds ? new Date(parsed.data.flashSaleEnds) : null,
    });

    revalidatePath("/products");
    revalidatePath("/seller/products");

    return { success: true, productId: id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create product" };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!existing) return { error: "Product not found" };
    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return { error: "Forbidden" };
    }

    const updates: Record<string, unknown> = {};

    const fields = ["name", "description", "price", "discountPrice", "categoryId", "brandId", "stock", "weight", "dimensions", "isFeatured", "isFlashSale", "flashSaleEnds"];
    for (const field of fields) {
      const val = formData.get(field);
      if (val !== null) {
        if (field === "price" || field === "discountPrice" || field === "weight") {
          updates[field] = val.toString();
        } else if (field === "stock") {
          updates[field] = Number(val);
        } else if (field === "isFeatured" || field === "isFlashSale") {
          updates[field] = val === "true";
        } else if (field === "flashSaleEnds") {
          updates[field] = val ? new Date(val as string) : null;
        } else {
          updates[field] = val;
        }
      }
    }

    const tags = formData.get("tags");
    if (tags) updates.tags = JSON.parse(tags as string);

    const specifications = formData.get("specifications");
    if (specifications) updates.specifications = JSON.parse(specifications as string);

    if (formData.get("name")) {
      updates.slug = slugify(formData.get("name") as string, { lower: true, strict: true }) + "-" + Date.now().toString(36);
    }

    updates.updatedAt = new Date();

    await db.update(products).set(updates as Partial<typeof products.$inferInsert>).where(eq(products.id, productId));

    revalidatePath("/products");
    revalidatePath(`/products/${existing.slug}`);
    revalidatePath("/seller/products");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!existing) return { error: "Product not found" };
    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return { error: "Forbidden" };
    }

    await db.delete(products).where(eq(products.id, productId));

    revalidatePath("/products");
    revalidatePath("/seller/products");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete product" };
  }
}

export async function getProducts(options?: {
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
  const conditions = [eq(products.isActive, true)];
  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const offset = (page - 1) * limit;

  if (options?.category) {
    conditions.push(eq(products.categoryId, options.category));
  }

  if (options?.sellerId) {
    conditions.push(eq(products.sellerId, options.sellerId));
  }

  if (options?.search) {
    conditions.push(like(products.name, `%${options.search}%`));
  }

  if (options?.minPrice !== undefined) {
    conditions.push(gte(sql`CAST(${products.price} AS numeric)`, options.minPrice));
  }

  if (options?.maxPrice !== undefined) {
    conditions.push(lte(sql`CAST(${products.price} AS numeric)`, options.maxPrice));
  }

  if (options?.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (options?.flashSale) {
    conditions.push(eq(products.isFlashSale, true));
  }

  let orderBy = desc(products.createdAt);
  if (options?.sort === "price-asc") orderBy = asc(products.price);
  else if (options?.sort === "price-desc") orderBy = desc(products.price);
  else if (options?.sort === "popular") orderBy = desc(products.salesCount);

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

  return {
    products: result,
    total: Number(countResult.count),
    page,
    totalPages: Math.ceil(Number(countResult.count) / limit),
  };
}

export async function getProduct(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  return product || null;
}

export async function getProductById(id: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return product || null;
}

export async function toggleFeatured(productId: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin");

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) return { error: "Product not found" };

    await db
      .update(products)
      .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
      .where(eq(products.id, productId));

    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle feature" };
  }
}

export async function uploadProductImages(productId: string, images: string[]) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) return { error: "Product not found" };
    if (user.role !== "admin" && product.sellerId !== user.id) {
      return { error: "Forbidden" };
    }

    const currentImages = product.images || [];
    const updatedImages = [...currentImages, ...images];

    await db
      .update(products)
      .set({ images: updatedImages, updatedAt: new Date() })
      .where(eq(products.id, productId));

    revalidatePath(`/products/${product.slug}`);
    return { success: true, images: updatedImages };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload images" };
  }
}
