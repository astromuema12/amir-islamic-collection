export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "user" | "seller" | "admin" | "super_admin";
  phone?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  images: string[];
  videos?: string[];
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  sellerId: string;
  seller?: SellerProfile;
  sku: string;
  weight?: number;
  dimensions?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEnds?: Date;
  tags: string[];
  specifications?: Record<string, string>;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
  createdAt: Date;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  productCount: number;
}

export interface SellerProfile {
  id: string;
  userId: string;
  user?: User;
  storeName: string;
  storeSlug: string;
  description?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isVerified: boolean;
  rating: number;
  productCount: number;
  totalSales: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  isApproved: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  isDefault: boolean;
  type: "shipping" | "billing" | "both";
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  authorId: string;
  author?: User;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isPublished: boolean;
}

export interface Analytics {
  id: string;
  date: string;
  visitors: number;
  pageViews: number;
  sales: number;
  revenue: number;
  newUsers: number;
  newSellers: number;
  orders: number;
}
