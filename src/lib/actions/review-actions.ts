"use server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath, updateTag } from "next/cache";
import { productRepository } from "@/lib/repositories/product-repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function createReview(formData: FormData) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const raw = {
      rating: Number(formData.get("rating")),
      title: formData.get("title") as string || undefined,
      content: formData.get("content") as string,
    };

    const parsed = reviewSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const productId = formData.get("productId") as string;
    if (!productId) return { error: "Product ID is required" };

    const product = await productRepository.getProductById(productId);
    if (!product) return { error: "Product not found" };

    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, user.id),
          eq(reviews.productId, productId)
        )
      )
      .limit(1);

    if (existingReview) {
      return { error: "You have already reviewed this product" };
    }

    const reviewId = uuidv4();
    await db.insert(reviews).values({
      id: reviewId,
      productId,
      userId: user.id,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      content: parsed.data.content,
      isApproved: false,
    });

    await productRepository.recalculateRating(productId);

    updateTag(CACHE_TAGS.products);

    return { success: true, reviewId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to submit review" };
  }
}

export async function getProductReviews(productId: string) {
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}

export async function approveReview(reviewId: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin");

    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!review) return { error: "Review not found" };

    await db
      .update(reviews)
      .set({ isApproved: !review.isApproved })
      .where(eq(reviews.id, reviewId));

    await productRepository.recalculateRating(review.productId);

    updateTag(CACHE_TAGS.products);
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to approve review" };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "user");

    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!review) return { error: "Review not found" };
    if (user.role !== "admin" && review.userId !== user.id) {
      return { error: "Forbidden" };
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    await productRepository.recalculateRating(review.productId);

    updateTag(CACHE_TAGS.products);
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete review" };
  }
}
