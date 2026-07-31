"use server";

import { db } from "@/lib/db";
import { wishlists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getWishlistProductIds(): Promise<string[] | null> {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const rows = await db
      .select({ productId: wishlists.productId })
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));

    return rows.map((row) => row.productId);
  } catch {
    return null;
  }
}

export async function syncWishlistToDb(productIds: string[]) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const ids = [...new Set(productIds)];

    await db.delete(wishlists).where(eq(wishlists.userId, user.id));

    if (ids.length > 0) {
      await db.insert(wishlists).values(
        ids.map((productId) => ({
          id: uuidv4(),
          userId: user.id,
          productId,
        })),
      );
    }

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to sync wishlist" };
  }
}
