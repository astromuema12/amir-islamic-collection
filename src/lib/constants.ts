export const APP_NAME = "Amir Islamic Collections";
export const APP_DESCRIPTION = "Premium Islamic products marketplace - Prayer mats, Qur'an, hijabs, perfumes, and more.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "Prayer Mats", slug: "prayer-mats", icon: "🕌" },
  { name: "Holy Qur'an", slug: "holy-quran", icon: "📖" },
  { name: "Qur'an Stands", slug: "quran-stands", icon: "🪵" },
  { name: "Tasbih", slug: "tasbih", icon: "📿" },
  { name: "Abayas", slug: "abayas", icon: "👗" },
  { name: "Hijabs", slug: "hijabs", icon: "🧕" },
  { name: "Niqabs", slug: "niqabs", icon: "https://imgproxy.attic.sh/insecure/f:webp/q:80/w:64/plain/https://attic.sh/naf9keh1uqt570fjgx3k7xj2n6wf" },
  { name: "Thobes", slug: "thobes", icon: "👔" },
  { name: "Islamic Books", slug: "islamic-books", icon: "📚" },
  { name: "Islamic Clothing", slug: "islamic-clothing", icon: "👕" },
  { name: "Perfumes", slug: "perfumes", icon: "🧴" },
  { name: "Prayer Caps", slug: "prayer-caps", icon: "🧢" },
  { name: "Kids Collection", slug: "kids-collection", icon: "👶" },
  { name: "Wall Art", slug: "wall-art", icon: "🖼️" },
  { name: "Home Decor", slug: "home-decor", icon: "🏠" },
  { name: "Ramadan Collection", slug: "ramadan-collection", icon: "🌙" },
  { name: "Eid Collection", slug: "eid-collection", icon: "🎉" },
  { name: "Gift Boxes", slug: "gift-boxes", icon: "🎁" },
  { name: "Digital Islamic Products", slug: "digital-products", icon: "💻" },
  { name: "Accessories", slug: "accessories", icon: "⌚" },
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

export const SHIPPING_METHODS = [
  { name: "Standard Shipping", price: 1500, days: "5-7 business days" },
  { name: "Express Shipping", price: 3500, days: "2-3 business days" },
  { name: "Next Day Delivery", price: 5000, days: "1 business day" },
];

export const TAX_RATE = 0.075;
export const FREE_SHIPPING_THRESHOLD = 50000;

export const PRODUCTS_PER_PAGE = 24;
export const SELLERS_PER_PAGE = 12;
