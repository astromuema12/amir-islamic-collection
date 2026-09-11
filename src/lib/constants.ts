export const APP_NAME = "Amir Islamic Collections";
export const APP_DESCRIPTION = "Premium Islamic products marketplace - Prayer mats, Qur'an, hijabs, perfumes, and more.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "Prayer Mats", slug: "prayer-mats", icon: "/categories/prayer-mats.jpeg" },
  { name: "Holy Qur'an", slug: "holy-quran", icon: "/categories/quran.jpeg" },
  { name: "Qur'an Stands", slug: "quran-stands", icon: "/categories/quran-stands.jpeg" },
  { name: "Tasbih", slug: "tasbih", icon: "📿" },
  { name: "Abayas", slug: "abayas", icon: "/categories/abayas.jpeg" },
  { name: "Hijabs", slug: "hijabs", icon: "/categories/hijabs.jpeg" },
  { name: "Niqabs", slug: "niqabs", icon: "/categories/niqab.jpeg" },
  { name: "Thobes", slug: "thobes", icon: "/categories/thobes.jpeg" },
  { name: "Islamic Books", slug: "islamic-books", icon: "/categories/islamic-books.jpeg" },
  { name: "Islamic Clothing", slug: "islamic-clothing", icon: "/categories/islamic-clothing.jpeg" },
  { name: "Perfumes", slug: "perfumes", icon: "/categories/perfumes.jpeg" },
  { name: "Prayer Caps", slug: "prayer-caps", icon: "/categories/prayer-caps.jpeg" },
  { name: "Kids Collection", slug: "kids-collection", icon: "/categories/kids-collection.jpeg" },
  { name: "Wall Art", slug: "wall-art", icon: "/categories/wall-art.jpeg" },
  { name: "Home Decor", slug: "home-decor", icon: "/categories/home-decor.jpeg" },
  { name: "Ramadan Collection", slug: "ramadan-collection", icon: "/categories/ramadhan-collection.jpeg" },
  { name: "Eid Collection", slug: "eid-collection", icon: "/categories/eid-collection.jpeg" },
  { name: "Gift Boxes", slug: "gift-boxes", icon: "🎁" },
  { name: "Digital Islamic Products", slug: "digital-products", icon: "/categories/digital-products.jpeg" },
  { name: "Accessories", slug: "accessories", icon: "/categories/accessories.jpeg" },
  { name: "Charity Products", slug: "charity-products", icon: "🤲" },
  { name: "Islamic Electronics", slug: "islamic-electronics", icon: "📱" },
];

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const USER_ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

const ADMIN_EMAILS = new Set([
  "amirislamiccollections@gmail.com",
  "musauedwin2004@gmail.com",
]);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}

export const SHIPPING_METHODS = [
  { name: "Standard Shipping", price: 1500, days: "5-7 business days" },
  { name: "Express Shipping", price: 3500, days: "2-3 business days" },
  { name: "Next Day Delivery", price: 5000, days: "1 business day" },
];

export const TAX_RATE = 0.075;
export const FREE_SHIPPING_THRESHOLD = 50000;

export const PRODUCTS_PER_PAGE = 24;
export const SELLERS_PER_PAGE = 12;
