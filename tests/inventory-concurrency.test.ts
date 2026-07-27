import { describe, it, expect, beforeEach } from "vitest";

/**
 * Concurrency-safe inventory management tests.
 *
 * These tests verify the core invariant: given a product with stock=1,
 * two simultaneous checkout attempts must result in exactly one success
 * and one failure — never two successes (overselling) or two failures.
 *
 * The tests simulate the atomic UPDATE ... WHERE stock >= qty pattern
 * that the production code uses, backed by a mock database that enforces
 * PostgreSQL-like row-level atomicity.
 */

interface MockProduct {
  id: string;
  name: string;
  stock: number;
  salesCount: number;
}

interface MockCartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface MockOrder {
  id: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
}

class MockInventoryDB {
  private products: Map<string, MockProduct>;
  private orders: MockOrder[] = [];
  private auditLogs: Array<{
    action: string;
    productId: string;
    metadata: Record<string, unknown>;
  }> = [];

  constructor(products: MockProduct[]) {
    this.products = new Map(products.map((p) => [p.id, { ...p }]));
  }

  getProduct(id: string): MockProduct | undefined {
    const p = this.products.get(id);
    return p ? { ...p } : undefined;
  }

  getOrders(): MockOrder[] {
    return [...this.orders];
  }

  getAuditLogs() {
    return [...this.auditLogs];
  }

  /**
   * Simulates PostgreSQL's atomic UPDATE ... WHERE stock >= quantity.
   * Returns true if the deduction succeeded, false if stock was insufficient.
   */
  atomicStockDeduction(
    productId: string,
    quantity: number
  ): { success: boolean; remainingStock: number } {
    const product = this.products.get(productId);
    if (!product) {
      return { success: false, remainingStock: 0 };
    }

    if (product.stock < quantity) {
      this.auditLogs.push({
        action: "inventory_conflict",
        productId,
        metadata: {
          requested: quantity,
          available: product.stock,
          timestamp: new Date().toISOString(),
        },
      });
      return { success: false, remainingStock: product.stock };
    }

    product.stock -= quantity;
    product.salesCount += quantity;
    return { success: true, remainingStock: product.stock };
  }

  rollbackDeduction(productId: string, quantity: number): void {
    const product = this.products.get(productId);
    if (product) {
      product.stock += quantity;
      product.salesCount -= quantity;
    }
  }

  createOrder(order: MockOrder): void {
    this.orders.push(order);
  }

  logInventoryConflict(
    productId: string,
    requested: number,
    available: number
  ): void {
    this.auditLogs.push({
      action: "inventory_conflict",
      productId,
      metadata: { requested, available, timestamp: new Date().toISOString() },
    });
  }
}

/**
 * Simulates the createOrder checkout flow with proper concurrency-safe
 * inventory management (atomic conditional UPDATE pattern).
 *
 * Matches production behavior: deductions are rolled back if any item
 * in the cart fails the stock check (transaction rollback).
 */
function simulateCheckout(
  db: MockInventoryDB,
  cartItems: MockCartItem[],
  orderId: string
): { success: boolean; error?: string; orderId?: string } {
  const deductions: Array<{ productId: string; quantity: number }> = [];

  try {
    for (const item of cartItems) {
      const result = db.atomicStockDeduction(item.productId, item.quantity);

      if (!result.success) {
        if (result.remainingStock === 0) {
          const product = db.getProduct(item.productId);
          throw new Error(
            `Sorry, "${product?.name ?? item.productId}" has just sold out.`
          );
        }
        throw new Error(
          `Insufficient stock: requested ${item.quantity}, available ${result.remainingStock}`
        );
      }

      deductions.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    db.createOrder({
      id: orderId,
      items: cartItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
    });

    return { success: true, orderId };
  } catch (error) {
    for (const d of deductions) {
      db.rollbackDeduction(d.productId, d.quantity);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

describe("Inventory Concurrency Safety", () => {
  const PRODUCT_ID = "product-1";

  beforeEach(() => {
    // Reset between tests
  });

  describe("Single product, stock=1, two concurrent buyers", () => {
    it("should allow exactly one order and reject the other", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Classic Black Hijab", stock: 1, salesCount: 0 },
      ]);

      const cartA: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1200 },
      ];
      const cartB: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1200 },
      ];

      const resultA = simulateCheckout(db, cartA, "order-A");
      const resultB = simulateCheckout(db, cartB, "order-B");

      const successCount = [resultA, resultB].filter((r) => r.success).length;
      const failCount = [resultA, resultB].filter((r) => !r.success).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(1);

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBe(0);

      expect(db.getOrders()).toHaveLength(1);
    });

    it("should show sold-out message when stock is 0", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Classic Black Hijab", stock: 1, salesCount: 0 },
      ]);

      const cartA: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1200 },
      ];
      const cartB: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1200 },
      ];

      const resultA = simulateCheckout(db, cartA, "order-A");
      const resultB = simulateCheckout(db, cartB, "order-B");

      const failedResult = !resultA.success ? resultA : resultB;
      expect(failedResult.error).toContain("sold out");
    });
  });

  describe("Single product, stock=2, two buyers each want 2", () => {
    it("should allow exactly one order (stock insufficient for both)", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Floral Satin Scarf", stock: 2, salesCount: 0 },
      ]);

      const cartA: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 2, price: 1800 },
      ];
      const cartB: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 2, price: 1800 },
      ];

      const resultA = simulateCheckout(db, cartA, "order-A");
      const resultB = simulateCheckout(db, cartB, "order-B");

      const successCount = [resultA, resultB].filter((r) => r.success).length;
      expect(successCount).toBe(1);

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBe(0);
    });
  });

  describe("Single product, stock=3, buyer wants 2 and buyer wants 1", () => {
    it("should allow both orders to succeed", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Embroidered Green Abaya", stock: 3, salesCount: 0 },
      ]);

      const cartA: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 2, price: 4800 },
      ];
      const cartB: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 4800 },
      ];

      const resultA = simulateCheckout(db, cartA, "order-A");
      const resultB = simulateCheckout(db, cartB, "order-B");

      expect(resultA.success).toBe(true);
      expect(resultB.success).toBe(true);

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBe(0);
      expect(product?.salesCount).toBe(3);
      expect(db.getOrders()).toHaveLength(2);
    });
  });

  describe("Single product, stock=0", () => {
    it("should reject both orders", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Sold Out Item", stock: 0, salesCount: 50 },
      ]);

      const cartA: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1000 },
      ];
      const cartB: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 1, price: 1000 },
      ];

      const resultA = simulateCheckout(db, cartA, "order-A");
      const resultB = simulateCheckout(db, cartB, "order-B");

      expect(resultA.success).toBe(false);
      expect(resultB.success).toBe(false);

      expect(resultA.error).toContain("sold out");
      expect(resultB.error).toContain("sold out");
    });
  });

  describe("Multiple products in cart", () => {
    it("should reject order when any single product is out of stock", () => {
      const PRODUCT_A = "product-a";
      const PRODUCT_B = "product-b";

      const db = new MockInventoryDB([
        { id: PRODUCT_A, name: "Thobe", stock: 5, salesCount: 0 },
        { id: PRODUCT_B, name: "Tasbih", stock: 0, salesCount: 100 },
      ]);

      const cart: MockCartItem[] = [
        { productId: PRODUCT_A, quantity: 1, price: 3500 },
        { productId: PRODUCT_B, quantity: 1, price: 800 },
      ];

      const result = simulateCheckout(db, cart, "order-fail");

      expect(result.success).toBe(false);
      expect(result.error).toContain("sold out");

      const productA = db.getProduct(PRODUCT_A);
      expect(productA?.stock).toBe(5);
    });

    it("should deduct stock for all products when order succeeds", () => {
      const PRODUCT_A = "product-a";
      const PRODUCT_B = "product-b";

      const db = new MockInventoryDB([
        { id: PRODUCT_A, name: "Thobe", stock: 10, salesCount: 0 },
        { id: PRODUCT_B, name: "Tasbih", stock: 50, salesCount: 0 },
      ]);

      const cart: MockCartItem[] = [
        { productId: PRODUCT_A, quantity: 2, price: 3500 },
        { productId: PRODUCT_B, quantity: 3, price: 800 },
      ];

      const result = simulateCheckout(db, cart, "order-success");

      expect(result.success).toBe(true);

      const productA = db.getProduct(PRODUCT_A);
      const productB = db.getProduct(PRODUCT_B);
      expect(productA?.stock).toBe(8);
      expect(productA?.salesCount).toBe(2);
      expect(productB?.stock).toBe(47);
      expect(productB?.salesCount).toBe(3);
    });
  });

  describe("Requesting more than available stock", () => {
    it("should reject when quantity exceeds stock", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Prayer Mat", stock: 3, salesCount: 0 },
      ]);

      const cart: MockCartItem[] = [
        { productId: PRODUCT_ID, quantity: 5, price: 2500 },
      ];

      const result = simulateCheckout(db, cart, "order-too-many");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient stock");
      expect(result.error).toContain("requested 5");
      expect(result.error).toContain("available 3");

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBe(3);
    });
  });

  describe("Stock never becomes negative", () => {
    it("should maintain stock >= 0 across all operations", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Item", stock: 1, salesCount: 0 },
      ]);

      for (let i = 0; i < 10; i++) {
        simulateCheckout(
          db,
          [{ productId: PRODUCT_ID, quantity: 1, price: 100 }],
          `order-${i}`
        );
      }

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBeGreaterThanOrEqual(0);
      expect(db.getOrders()).toHaveLength(1);
    });
  });

  describe("Inventory conflict logging", () => {
    it("should log when a checkout fails due to insufficient stock", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Limited Item", stock: 1, salesCount: 0 },
      ]);

      simulateCheckout(
        db,
        [{ productId: PRODUCT_ID, quantity: 1, price: 100 }],
        "order-1"
      );
      simulateCheckout(
        db,
        [{ productId: PRODUCT_ID, quantity: 1, price: 100 }],
        "order-2"
      );

      const logs = db.getAuditLogs();
      expect(logs.length).toBeGreaterThanOrEqual(1);
      expect(logs[0].action).toBe("inventory_conflict");
      expect(logs[0].productId).toBe(PRODUCT_ID);
      expect(logs[0].metadata).toHaveProperty("requested", 1);
      expect(logs[0].metadata).toHaveProperty("available", 0);
    });
  });

  describe("Rapid-fire same product (simulated high concurrency)", () => {
    it("should process 50 concurrent requests against stock=10 and sell exactly 10", () => {
      const db = new MockInventoryDB([
        { id: PRODUCT_ID, name: "Popular Item", stock: 10, salesCount: 0 },
      ]);

      const results = Array.from({ length: 50 }, (_, i) =>
        simulateCheckout(
          db,
          [{ productId: PRODUCT_ID, quantity: 1, price: 500 }],
          `rapid-order-${i}`
        )
      );

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      expect(successCount).toBe(10);
      expect(failCount).toBe(40);

      const product = db.getProduct(PRODUCT_ID);
      expect(product?.stock).toBe(0);
      expect(product?.salesCount).toBe(10);
      expect(db.getOrders()).toHaveLength(10);
    });
  });

  describe("Mixed product concurrency", () => {
    it("should handle concurrent orders for different products independently", () => {
      const PRODUCT_A = "product-a";
      const PRODUCT_B = "product-b";

      const db = new MockInventoryDB([
        { id: PRODUCT_A, name: "Product A", stock: 2, salesCount: 0 },
        { id: PRODUCT_B, name: "Product B", stock: 2, salesCount: 0 },
      ]);

      const resultA = simulateCheckout(
        db,
        [{ productId: PRODUCT_A, quantity: 2, price: 1000 }],
        "order-a-full"
      );
      const resultB = simulateCheckout(
        db,
        [{ productId: PRODUCT_B, quantity: 2, price: 2000 }],
        "order-b-full"
      );
      const resultC = simulateCheckout(
        db,
        [{ productId: PRODUCT_A, quantity: 1, price: 1000 }],
        "order-c-should-fail"
      );

      expect(resultA.success).toBe(true);
      expect(resultB.success).toBe(true);
      expect(resultC.success).toBe(false);

      const productA = db.getProduct(PRODUCT_A);
      const productB = db.getProduct(PRODUCT_B);
      expect(productA?.stock).toBe(0);
      expect(productB?.stock).toBe(0);
    });
  });
});
