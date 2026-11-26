export type CouponForOrder = {
  type: "percentage" | "fixed";
  value: string | number;
  maxDiscount: string | number | null;
  minOrderAmount: string | number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
};

function couponError(message: string): Error & { code: string } {
  return Object.assign(new Error(message), { code: "VALIDATION_ERROR" });
}

/**
 * Authoritative coupon check used inside the order transaction. The preview
 * action in coupon-actions.ts is only for the UI and must never be trusted on
 * its own.
 */
export function validateCouponForOrder(
  coupon: CouponForOrder,
  subtotal: number
): number {
  if (!coupon.isActive) {
    throw couponError("This coupon is not valid.");
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    throw couponError("This coupon has expired.");
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw couponError("This coupon has reached its usage limit.");
  }

  if (subtotal <= 0) {
    throw couponError("This coupon cannot be applied to an empty order.");
  }

  if (
    coupon.minOrderAmount &&
    subtotal < Number(coupon.minOrderAmount)
  ) {
    throw couponError(
      `This coupon requires a minimum order amount of ${Number(coupon.minOrderAmount)}.`
    );
  }

  const value = Number(coupon.value);
  const rawDiscount =
    coupon.type === "fixed" ? value : subtotal * (value / 100);
  const cappedDiscount = coupon.maxDiscount
    ? Math.min(rawDiscount, Number(coupon.maxDiscount))
    : rawDiscount;

  return Math.max(0, Math.min(cappedDiscount, subtotal));
}
