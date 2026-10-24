"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import type { Coupon } from "@/types";

export type CouponValidationResult =
  | { success: true; coupon: Coupon }
  | { error: string };

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidationResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { error: "Please enter a coupon code." };

  try {
    const [row] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, normalized))
      .limit(1);

    if (!row || !row.isActive) {
      return { error: "Invalid or expired coupon code." };
    }

    if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
      return { error: "This coupon has expired." };
    }

    if (row.usageLimit !== null && row.usedCount >= row.usageLimit) {
      return { error: "This coupon has reached its usage limit." };
    }

    const minOrderAmount = row.minOrderAmount
      ? Number(row.minOrderAmount)
      : undefined;

    if (minOrderAmount && subtotal < minOrderAmount) {
      return {
        error: `This coupon requires a minimum order of KES ${minOrderAmount.toLocaleString()}.`,
      };
    }

    return {
      success: true,
      coupon: {
        id: row.id,
        code: row.code,
        type: row.type,
        value: Number(row.value),
        minOrderAmount,
        maxDiscount: row.maxDiscount ? Number(row.maxDiscount) : undefined,
        usageLimit: row.usageLimit ?? undefined,
        usedCount: row.usedCount,
        expiresAt: row.expiresAt ?? undefined,
        isActive: row.isActive,
      },
    };
  } catch (error) {
    console.error("[validateCoupon] Failed to validate coupon:", error);
    return { error: "Failed to validate coupon. Please try again." };
  }
}
