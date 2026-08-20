import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  productSchema,
  addressSchema,
  reviewSchema,
  searchSchema,
  checkoutSchema,
  sellerProfileSchema,
  blogSchema,
  couponSchema,
  profileSchema,
} from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password456",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  it("accepts valid product data", () => {
    const result = productSchema.safeParse({
      name: "Prayer Mat",
      description: "A beautiful prayer mat for daily use",
      price: 2500,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      stock: 50,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative price", () => {
    const result = productSchema.safeParse({
      name: "Prayer Mat",
      description: "A beautiful prayer mat",
      price: -100,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      stock: 50,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative stock", () => {
    const result = productSchema.safeParse({
      name: "Prayer Mat",
      description: "A beautiful prayer mat",
      price: 2500,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      stock: -5,
    });
    expect(result.success).toBe(false);
  });

  it("applies defaults for optional fields", () => {
    const result = productSchema.safeParse({
      name: "Prayer Mat",
      description: "A beautiful prayer mat",
      price: 2500,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
      stock: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isFeatured).toBe(false);
      expect(result.data.isFlashSale).toBe(false);
      expect(result.data.tags).toEqual([]);
    }
  });
});

describe("addressSchema", () => {
  it("accepts valid address", () => {
    const result = addressSchema.safeParse({
      fullName: "John Doe",
      phone: "+254712345678",
      street: "123 Moi Avenue",
      city: "Nairobi",
      state: "Nairobi",
      country: "Kenya",
    });
    expect(result.success).toBe(true);
  });

  it("defaults type to 'both'", () => {
    const result = addressSchema.safeParse({
      fullName: "John Doe",
      phone: "+254712345678",
      street: "123 Moi Avenue",
      city: "Nairobi",
      state: "Nairobi",
      country: "Kenya",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe("both");
    }
  });

  it("rejects missing required fields", () => {
    const result = addressSchema.safeParse({
      fullName: "John Doe",
    });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts valid review", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      content: "This product is amazing and high quality!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = reviewSchema.safeParse({
      rating: 0,
      content: "This product is amazing!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = reviewSchema.safeParse({
      rating: 6,
      content: "This product is amazing!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short content", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      content: "Short",
    });
    expect(result.success).toBe(false);
  });
});

describe("checkoutSchema", () => {
  it("accepts valid checkout", () => {
    const result = checkoutSchema.safeParse({
      shippingAddressId: "550e8400-e29b-41d4-a716-446655440000",
      billingAddressId: "550e8400-e29b-41d4-a716-446655440001",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = checkoutSchema.safeParse({
      shippingAddressId: "not-a-uuid",
      billingAddressId: "550e8400-e29b-41d4-a716-446655440001",
    });
    expect(result.success).toBe(false);
  });
});

describe("couponSchema", () => {
  it("accepts percentage coupon", () => {
    const result = couponSchema.safeParse({
      code: "SAVE10",
      type: "percentage",
      value: 10,
    });
    expect(result.success).toBe(true);
  });

  it("accepts fixed coupon with constraints", () => {
    const result = couponSchema.safeParse({
      code: "FLAT500",
      type: "fixed",
      value: 500,
      minOrderAmount: 5000,
      maxDiscount: 1000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative value", () => {
    const result = couponSchema.safeParse({
      code: "BAD",
      type: "percentage",
      value: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects short code", () => {
    const result = couponSchema.safeParse({
      code: "AB",
      type: "percentage",
      value: 10,
    });
    expect(result.success).toBe(false);
  });
});

describe("searchSchema", () => {
  it("applies defaults", () => {
    const result = searchSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
    }
  });

  it("accepts valid sort options", () => {
    for (const sort of ["newest", "price-asc", "price-desc", "popular", "discount"]) {
      const result = searchSchema.safeParse({ sort });
      expect(result.success).toBe(true);
    }
  });
});

describe("sellerProfileSchema", () => {
  it("accepts valid profile", () => {
    const result = sellerProfileSchema.safeParse({
      storeName: "Islamic Treasures",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short store name", () => {
    const result = sellerProfileSchema.safeParse({
      storeName: "AB",
    });
    expect(result.success).toBe(false);
  });
});

describe("blogSchema", () => {
  it("accepts valid blog post", () => {
    const result = blogSchema.safeParse({
      title: "The Importance of Prayer",
      content: "Prayer is one of the five pillars of Islam and is considered a direct link between the worshipper and Allah.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short title", () => {
    const result = blogSchema.safeParse({
      title: "Blog",
      content: "This is a blog post about Islamic topics and their importance in our daily lives.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short content", () => {
    const result = blogSchema.safeParse({
      title: "The Importance of Prayer",
      content: "Short",
    });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("accepts valid profile", () => {
    const result = profileSchema.safeParse({
      name: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = profileSchema.safeParse({
      name: "J",
    });
    expect(result.success).toBe(false);
  });
});
