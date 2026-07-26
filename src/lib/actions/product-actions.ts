"use server";

import { productRepository } from "@/lib/repositories/product-repository";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { productSchema } from "@/lib/validations";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

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

    await productRepository.create({
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

    updateTag(CACHE_TAGS.products);
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

    const existing = await productRepository.getProductById(productId);
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

    await productRepository.update(productId, updates);

    updateTag(CACHE_TAGS.products);
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

    const existing = await productRepository.getProductById(productId);
    if (!existing) return { error: "Product not found" };
    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return { error: "Forbidden" };
    }

    await productRepository.delete(productId);

    updateTag(CACHE_TAGS.products);
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
  return productRepository.getProductsRaw(options);
}

export async function getProduct(slug: string) {
  return productRepository.getProductBySlugRaw(slug);
}

export async function getProductById(id: string) {
  return productRepository.getProductById(id);
}

export async function toggleFeatured(productId: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin");

    const result = await productRepository.toggleFeatured(productId);
    if (result === null) return { error: "Product not found" };

    updateTag(CACHE_TAGS.products);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle feature" };
  }
}

export async function uploadProductImages(productId: string, images: string[]) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const product = await productRepository.getProductById(productId);
    if (!product) return { error: "Product not found" };
    if (user.role !== "admin" && product.sellerId !== user.id) {
      return { error: "Forbidden" };
    }

    const updatedImages = await productRepository.updateImages(productId, images);
    if (!updatedImages) return { error: "Failed to upload images" };

    updateTag(CACHE_TAGS.products);
    return { success: true, images: updatedImages };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload images" };
  }
}
