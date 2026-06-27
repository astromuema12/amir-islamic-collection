"use server";

import { db } from "@/lib/db";
import { reviews, products } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { reviewSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

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

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

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

    const [ratingResult] = await db
      .select({
        avg: sql<number>`AVG(rating)`.as("avg_rating"),
        count: sql<number>`COUNT(*)`.as("review_count"),
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.isApproved, true)
        )
      );

    await db
      .update(products)
      .set({
        averageRating: ratingResult.avg?.toString() || "0",
        reviewCount: Number(ratingResult.count) || 0,
      })
      .where(eq(products.id, productId));

    revalidatePath(`/products/${product.slug}`);
    revalidatePath(`/products/${productId}`);

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

    const [ratingResult] = await db
      .select({
        avg: sql<number>`AVG(rating)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, review.productId),
          eq(reviews.isApproved, true)
        )
      );

    await db
      .update(products)
      .set({
        averageRating: ratingResult.avg?.toString() || "0",
        reviewCount: Number(ratingResult.count) || 0,
      })
      .where(eq(products.id, review.productId));

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.productId}`);

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

    const [ratingResult] = await db
      .select({
        avg: sql<number>`AVG(rating)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, review.productId),
          eq(reviews.isApproved, true)
        )
      );

    await db
      .update(products)
      .set({
        averageRating: ratingResult.avg?.toString() || "0",
        reviewCount: Number(ratingResult.count) || 0,
      })
      .where(eq(products.id, review.productId));

    revalidatePath("/admin/reviews");
    revalidatePath(`/products/${review.productId}`);

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete review" };
  }
}
