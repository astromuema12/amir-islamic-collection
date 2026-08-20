import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_DESCRIPTION,
  CATEGORIES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  SHIPPING_METHODS,
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  PRODUCTS_PER_PAGE,
  SELLERS_PER_PAGE,
} from "@/lib/constants";

describe("constants", () => {
  describe("APP constants", () => {
    it("has valid app name", () => {
      expect(typeof APP_NAME).toBe("string");
      expect(APP_NAME.length).toBeGreaterThan(0);
    });

    it("has valid description", () => {
      expect(typeof APP_DESCRIPTION).toBe("string");
      expect(APP_DESCRIPTION.length).toBeGreaterThan(10);
    });
  });

  describe("CATEGORIES", () => {
    it("has categories", () => {
      expect(CATEGORIES.length).toBeGreaterThan(0);
    });

    it("each category has required fields", () => {
      for (const cat of CATEGORIES) {
        expect(typeof cat.name).toBe("string");
        expect(typeof cat.slug).toBe("string");
        expect(typeof cat.icon).toBe("string");
        expect(cat.name.length).toBeGreaterThan(0);
        expect(cat.slug.length).toBeGreaterThan(0);
      }
    });

    it("has unique slugs", () => {
      const slugs = CATEGORIES.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("includes expected categories", () => {
      const names = CATEGORIES.map((c) => c.name);
      expect(names).toContain("Prayer Mats");
      expect(names).toContain("Holy Qur'an");
      expect(names).toContain("Hijabs");
      expect(names).toContain("Perfumes");
    });
  });

  describe("ORDER_STATUS", () => {
    it("has all required statuses", () => {
      expect(ORDER_STATUS.PENDING).toBe("pending");
      expect(ORDER_STATUS.CONFIRMED).toBe("confirmed");
      expect(ORDER_STATUS.PROCESSING).toBe("processing");
      expect(ORDER_STATUS.SHIPPED).toBe("shipped");
      expect(ORDER_STATUS.DELIVERED).toBe("delivered");
      expect(ORDER_STATUS.CANCELLED).toBe("cancelled");
      expect(ORDER_STATUS.RETURNED).toBe("returned");
    });
  });

  describe("PAYMENT_STATUS", () => {
    it("has all required statuses", () => {
      expect(PAYMENT_STATUS.PENDING).toBe("pending");
      expect(PAYMENT_STATUS.COMPLETED).toBe("completed");
      expect(PAYMENT_STATUS.FAILED).toBe("failed");
      expect(PAYMENT_STATUS.REFUNDED).toBe("refunded");
    });
  });

  describe("USER_ROLES", () => {
    it("has all roles", () => {
      expect(USER_ROLES.USER).toBe("user");
      expect(USER_ROLES.SELLER).toBe("seller");
      expect(USER_ROLES.ADMIN).toBe("admin");
      expect(USER_ROLES.SUPER_ADMIN).toBe("super_admin");
    });
  });

  describe("SHIPPING_METHODS", () => {
    it("has at least one shipping method", () => {
      expect(SHIPPING_METHODS.length).toBeGreaterThan(0);
    });

    it("each method has name, price, and days", () => {
      for (const method of SHIPPING_METHODS) {
        expect(typeof method.name).toBe("string");
        expect(typeof method.price).toBe("number");
        expect(method.price).toBeGreaterThan(0);
        expect(typeof method.days).toBe("string");
      }
    });

    it("is sorted by price ascending", () => {
      for (let i = 1; i < SHIPPING_METHODS.length; i++) {
        expect(SHIPPING_METHODS[i].price).toBeGreaterThanOrEqual(
          SHIPPING_METHODS[i - 1].price
        );
      }
    });
  });

  describe("numeric constants", () => {
    it("TAX_RATE is between 0 and 1", () => {
      expect(TAX_RATE).toBeGreaterThan(0);
      expect(TAX_RATE).toBeLessThan(1);
    });

    it("FREE_SHIPPING_THRESHOLD is positive", () => {
      expect(FREE_SHIPPING_THRESHOLD).toBeGreaterThan(0);
    });

    it("PRODUCTS_PER_PAGE is positive", () => {
      expect(PRODUCTS_PER_PAGE).toBeGreaterThan(0);
    });

    it("SELLERS_PER_PAGE is positive", () => {
      expect(SELLERS_PER_PAGE).toBeGreaterThan(0);
    });
  });
});
