import crypto from "crypto";
import { describe, expect, it } from "vitest";
import {
  paystackAmountMatchesTotal,
  verifyPaystackSignature,
} from "@/lib/payment-security";
import { normalizeCartQuantities } from "@/lib/cart-validation";
import { validateCouponForOrder } from "@/lib/coupon-validation";

const SECRET = "test_paystack_secret";

function signedBody(body: string, secret = SECRET) {
  return crypto.createHmac("sha512", secret).update(body).digest("hex");
}

describe("Paystack webhook verification", () => {
  it("accepts a correct signature in constant time", () => {
    const body = '{"event":"charge.success"}';
    expect(verifyPaystackSignature(body, signedBody(body), SECRET)).toBe(true);
  });

  it("rejects wrong, missing and malformed signatures", () => {
    const body = '{"event":"charge.success"}';
    expect(verifyPaystackSignature(body, signedBody(body, "other"), SECRET)).toBe(false);
    expect(verifyPaystackSignature(body, null, SECRET)).toBe(false);
    expect(verifyPaystackSignature(body, "abc", SECRET)).toBe(false);
    expect(verifyPaystackSignature(body, "z".repeat(128), SECRET)).toBe(false);
  });

  it("matches Paystack minor units against the database total", () => {
    expect(paystackAmountMatchesTotal(15000, "150.00")).toBe(true);
    expect(paystackAmountMatchesTotal(10000, "150.00")).toBe(false);
    expect(paystackAmountMatchesTotal(-1, "150.00")).toBe(false);
  });
});

describe("cart quantity validation", () => {
  it("collapses duplicate product lines", () => {
    const productId = crypto.randomUUID();
    const result = normalizeCartQuantities([
      { productId, quantity: 2 },
      { productId, quantity: 1 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
  });

  it("rejects negative, fractional and zero quantities", () => {
    const productId = crypto.randomUUID();
    expect(() =>
      normalizeCartQuantities([{ productId, quantity: -1 }])
    ).toThrow();
    expect(() =>
      normalizeCartQuantities([{ productId, quantity: 1.5 }])
    ).toThrow();
    expect(() =>
      normalizeCartQuantities([{ productId, quantity: 0 }])
    ).toThrow();
  });

  it("rejects duplicates that exceed the per-product cap", () => {
    const productId = crypto.randomUUID();
    expect(() =>
      normalizeCartQuantities([
        { productId, quantity: 60 },
        { productId, quantity: 60 },
      ])
    ).toThrow();
  });
});

describe("coupon validation at order creation", () => {
  const base = {
    type: "percentage" as const,
    value: "10",
    maxDiscount: null,
    minOrderAmount: null,
    usedCount: 0,
    expiresAt: null,
    isActive: true,
    usageLimit: null,
  };

  it("applies a percentage discount", () => {
    expect(validateCouponForOrder(base, 200)).toBe(20);
  });

  it("honours maximum discount and rejects an empty order", () => {
    expect(
      validateCouponForOrder({ ...base, maxDiscount: "15" }, 200)
    ).toBe(15);
    expect(() => validateCouponForOrder(base, 0)).toThrow();
  });

  it("rejects coupons that reached their usage limit", () => {
    expect(() =>
      validateCouponForOrder({ ...base, usageLimit: 1, usedCount: 1 }, 200)
    ).toThrow(/usage limit/);
  });

  it("rejects inactive and expired coupons", () => {
    expect(() =>
      validateCouponForOrder({ ...base, isActive: false }, 200)
    ).toThrow();
    expect(() =>
      validateCouponForOrder(
        { ...base, expiresAt: new Date(Date.now() - 1000) },
        200
      )
    ).toThrow();
  });
});
