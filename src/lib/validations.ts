import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  discountPrice: z.coerce.number().positive().optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  weight: z.coerce.number().positive().optional(),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isFlashSale: z.boolean().default(false),
  flashSaleEnds: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(5, "Phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false),
  type: z.enum(["shipping", "billing", "both"]).default("both"),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().optional(),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "popular", "discount"]).optional(),
  page: z.coerce.number().default(1),
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const sellerProfileSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  description: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be positive"),
  minOrderAmount: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
  expiresAt: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type SellerProfileInput = z.infer<typeof sellerProfileSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
