import "dotenv/config";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema/categories";
import { brands } from "@/lib/db/schema/brands";
import { users } from "@/lib/db/schema/users";
import { products } from "@/lib/db/schema/products";
import { roles, permissions, rolePermissions, userRoles } from "@/lib/db/schema/roles_permissions";
import { addresses } from "@/lib/db/schema/addresses";
import { coupons } from "@/lib/db/schema/coupons";
import { settings } from "@/lib/db/schema/settings";
import { faqs } from "@/lib/db/schema/faqs";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const db = getDb();

function log(msg: string) {
  console.log(`[SEED] ${msg}`);
}

// ── Categories ────────────────────────────────────────────────
const CATEGORY_DATA = [
  { name: "Hijabs & Scarves", slug: "hijabs-scarves", description: "Premium hijabs and scarves for every occasion" },
  { name: "Abayas & Jilbabs", slug: "abayas-jilbabs", description: "Elegant abayas and jilbabs in modern and classic styles" },
  { name: "Thobes & Kanduras", slug: "thobes-kanduras", description: "Men's thobes and kanduras for prayer and daily wear" },
  { name: "Prayer Accessories", slug: "prayer-accessories", description: "Prayer mats, tasbih, miswak and more" },
  { name: "Kids Collection", slug: "kids-collection", description: "Islamic clothing and accessories for children" },
  { name: "Modest Fashion", slug: "modest-fashion", description: "Contemporary modest wear for the modern Muslim" },
  { name: "Quran & Books", slug: "quran-books", description: "Qurans, Islamic literature and educational books" },
  { name: "Home & Decor", slug: "home-decor", description: "Islamic home decoration, wall art and gifts" },
];

// ── Brands ────────────────────────────────────────────────────
const BRAND_DATA = [
  { name: "Amir Collections", slug: "amir-collections", description: "Our flagship brand" },
  { name: "Noor Threads", slug: "noor-threads", description: "Elegant modest fashion" },
  { name: "Sunnah Wear", slug: "sunnah-wear", description: "Authentic sunnah-inspired clothing" },
  { name: "Deen Style", slug: "deen-style", description: "Contemporary Islamic fashion" },
];

// ── Users ─────────────────────────────────────────────────────
const PASSWORD_HASH = bcrypt.hashSync("Password123!", 10);

const USER_DATA = [
  { name: "Admin User", email: "admin@example.com", role: "super_admin" as const, emailVerified: true, phone: "+254700000001" },
  { name: "Seller One", email: "seller@example.com", role: "seller" as const, emailVerified: true, phone: "+254700000002" },
  { name: "Jane Customer", email: "jane@example.com", role: "user" as const, emailVerified: true, phone: "+254700000003" },
  { name: "Omar Buyer", email: "omar@example.com", role: "user" as const, emailVerified: true, phone: "+254700000004" },
  { name: "Fatima Shopper", email: "fatima@example.com", role: "user" as const, emailVerified: false, phone: "+254700000005" },
];

// ── Products ──────────────────────────────────────────────────
const PRODUCT_DATA = [
  {
    name: "Classic Black Hijab", slug: "classic-black-hijab", description: "Soft chiffon hijab in classic black. Lightweight and breathable for all-day comfort.", price: "1200", stock: 150, isFeatured: true, tags: ["hijab", "black", "chiffon"], categorySlug: "hijabs-scarves", brandSlug: "amir-collections",
  },
  {
    name: "Pearl Embroidered Hijab", slug: "pearl-embroidered-hijab", description: "Elegant hijab with delicate pearl embroidery along the edges.", price: "2500", discountPrice: "2000", stock: 45, isFeatured: true, tags: ["hijab", "pearl", "embroidered"], categorySlug: "hijabs-scarves", brandSlug: "noor-threads",
  },
  {
    name: "Floral Satin Scarf", slug: "floral-satin-scarf", description: "Luxurious satin scarf with a subtle floral pattern.", price: "1800", stock: 80, tags: ["scarf", "satin", "floral"], categorySlug: "hijabs-scarves", brandSlug: "noor-threads",
  },
  {
    name: "Everyday Jersey Hijab", slug: "everyday-jersey-hijab", description: "Stretchy jersey hijab perfect for everyday wear. No pins needed.", price: "900", stock: 200, isFeatured: true, tags: ["hijab", "jersey", "everyday"], categorySlug: "hijabs-scarves", brandSlug: "amir-collections",
  },
  {
    name: "Black Abaya with Lace Trim", slug: "black-abaya-lace-trim", description: "Flowing black abaya with intricate lace detailing on sleeves and hem.", price: "4500", stock: 30, isFeatured: true, tags: ["abaya", "black", "lace"], categorySlug: "abayas-jilbabs", brandSlug: "amir-collections",
  },
  {
    name: "Embroidered Green Abaya", slug: "embroidered-green-abaya", description: "Rich emerald green abaya with gold embroidery.", price: "5500", discountPrice: "4800", stock: 20, tags: ["abaya", "green", "embroidered"], categorySlug: "abayas-jilbabs", brandSlug: "noor-threads",
  },
  {
    name: "Open-front Jilbab", slug: "open-front-jilbab", description: "Practical open-front jilbab with zipper closure. Ideal for travel.", price: "3800", stock: 35, tags: ["jilbab", "open-front"], categorySlug: "abayas-jilbabs", brandSlug: "sunnah-wear",
  },
  {
    name: "White Thobe - Classic", slug: "white-thobe-classic", description: "Crisp white thobe in breathable cotton. Classic collar design.", price: "3500", stock: 60, isFeatured: true, tags: ["thobe", "white", "cotton"], categorySlug: "thobes-kanduras", brandSlug: "sunnah-wear",
  },
  {
    name: "Bisht - Premium Gold", slug: "bisht-premium-gold", description: "Formal bisht in black with gold trim. Perfect for Eid and special occasions.", price: "8500", stock: 15, isFeatured: true, tags: ["bisht", "gold", "formal"], categorySlug: "thobes-kanduras", brandSlug: "amir-collections",
  },
  {
    name: "Navy Blue Thobe", slug: "navy-blue-thobe", description: "Modern navy blue thobe with mandarin collar.", price: "3200", stock: 45, tags: ["thobe", "navy", "modern"], categorySlug: "thobes-kanduras", brandSlug: "deen-style",
  },
  {
    name: "Tasbih - 33 Beads Sandalwood", slug: "tasbih-33-sandalwood", description: "Handcrafted sandalwood tasbih with 33 beads.", price: "800", stock: 100, tags: ["tasbih", "sandalwood", "prayer"], categorySlug: "prayer-accessories", brandSlug: "sunnah-wear",
  },
  {
    name: "Prayer Mat - Turkish Design", slug: "prayer-mat-turkish", description: "Plush velvet prayer mat with intricate Turkish motifs.", price: "2200", stock: 75, isFeatured: true, tags: ["prayer-mat", "turkish", "velvet"], categorySlug: "prayer-accessories", brandSlug: "amir-collections",
  },
  {
    name: "Miswak Set", slug: "miswak-set", description: "Natural siwak sticks with a carrying case. Sunnah tradition.", price: "450", stock: 200, tags: ["miswak", "sunnah", "natural"], categorySlug: "prayer-accessories", brandSlug: "sunnah-wear",
  },
  {
    name: "Kids Rainbow Hijab Set", slug: "kids-rainbow-hijab-set", description: "Set of 3 colorful hijabs for young girls ages 5-10.", price: "1500", stock: 50, tags: ["kids", "hijab", "colorful"], categorySlug: "kids-collection", brandSlug: "deen-style",
  },
  {
    name: "Boys Thobe - Mini", slug: "boys-thobe-mini", description: "Adorable mini thobe for boys ages 3-8. Same quality as adult versions.", price: "1800", stock: 40, tags: ["kids", "thobe", "boys"], categorySlug: "kids-collection", brandSlug: "sunnah-wear",
  },
  {
    name: "Modest Maxi Dress", slug: "modest-maxi-dress", description: "Flowing maxi dress with built-in sleeves. Contemporary modest fashion.", price: "3500", discountPrice: "2900", stock: 25, isFeatured: true, tags: ["modest", "dress", "maxi"], categorySlug: "modest-fashion", brandSlug: "noor-threads",
  },
  {
    name: "Linen Wide-Leg Pants", slug: "linen-wide-leg-pants", description: "Comfortable linen wide-leg trousers. Modest and stylish.", price: "2200", stock: 60, tags: ["modest", "pants", "linen"], categorySlug: "modest-fashion", brandSlug: "deen-style",
  },
  {
    name: "Quran - Arabic with English Translation", slug: "quran-arabic-english", description: "Beautifully bound Quran with side-by-side Arabic text and English translation.", price: "2500", stock: 50, isFeatured: true, tags: ["quran", "english", "translation"], categorySlug: "quran-books", brandSlug: "amir-collections",
  },
  {
    name: "Islamic Wall Art - Bismillah", slug: "islamic-wall-art-bismillah", description: "Elegant Bismillah calligraphy wall art in gold on black canvas.", price: "3000", stock: 30, isFeatured: true, tags: ["wall-art", "calligraphy", "bismillah"], categorySlug: "home-decor", brandSlug: "amir-collections",
  },
  {
    name: "Dates Gift Box - Premium", slug: "dates-gift-box-premium", description: "Assorted premium dates in an elegant gift box. Perfect for Ramadan.", price: "1800", stock: 100, tags: ["dates", "gift", "ramadan"], categorySlug: "home-decor", brandSlug: "amir-collections",
  },
];

// ── Roles & Permissions ───────────────────────────────────────
const ROLE_DATA = [
  { name: "super_admin", description: "Full system access" },
  { name: "admin", description: "Admin access" },
  { name: "seller", description: "Seller access" },
  { name: "user", description: "Regular user" },
];

const PERMISSION_DATA = [
  { name: "products:read", description: "View products" },
  { name: "products:write", description: "Create/edit products" },
  { name: "products:delete", description: "Delete products" },
  { name: "orders:read", description: "View orders" },
  { name: "orders:write", description: "Manage orders" },
  { name: "users:read", description: "View users" },
  { name: "users:write", description: "Manage users" },
  { name: "users:delete", description: "Delete users" },
  { name: "categories:read", description: "View categories" },
  { name: "categories:write", description: "Manage categories" },
  { name: "settings:read", description: "View settings" },
  { name: "settings:write", description: "Manage settings" },
  { name: "sellers:read", description: "View sellers" },
  { name: "sellers:write", description: "Manage sellers" },
  { name: "reviews:read", description: "View reviews" },
  { name: "reviews:delete", description: "Delete reviews" },
  { name: "reports:read", description: "View reports" },
  { name: "blogs:write", description: "Manage blog posts" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    "products:read", "products:write", "products:delete",
    "orders:read", "orders:write",
    "users:read", "users:write", "users:delete",
    "categories:read", "categories:write",
    "settings:read", "settings:write",
    "sellers:read", "sellers:write",
    "reviews:read", "reviews:delete",
    "reports:read", "blogs:write",
  ],
  admin: [
    "products:read", "products:write",
    "orders:read", "orders:write",
    "users:read", "users:write",
    "categories:read", "categories:write",
    "sellers:read", "sellers:write",
    "reviews:read", "reviews:delete",
    "reports:read", "blogs:write",
  ],
  seller: [
    "products:read", "products:write",
    "orders:read",
    "reviews:read",
  ],
  user: [
    "products:read",
    "reviews:read",
  ],
};

// ── Addresses ─────────────────────────────────────────────────
const ADDRESS_DATA = [
  { fullName: "Jane Customer", phone: "+254700000003", street: "123 Kenyatta Avenue", city: "Nairobi", state: "Nairobi", country: "Kenya", zipCode: "00100", type: "both" as const },
  { fullName: "Omar Buyer", phone: "+254700000004", street: "45 Moi Avenue", city: "Mombasa", state: "Coast", country: "Kenya", zipCode: "80100", type: "shipping" as const },
  { fullName: "Admin User", phone: "+254700000001", street: "78 Westlands Road", city: "Nairobi", state: "Nairobi", country: "Kenya", zipCode: "00800", type: "both" as const },
];

// ── Coupons ───────────────────────────────────────────────────
const COUPON_DATA = [
  { code: "WELCOME10", type: "percentage" as const, value: "10", minOrderAmount: "1000", usageLimit: 100, isActive: true },
  { code: "EID500", type: "fixed" as const, value: "500", minOrderAmount: "3000", usageLimit: 50, isActive: true },
  { code: "RAMADAN15", type: "percentage" as const, value: "15", minOrderAmount: "2000", maxDiscount: "1000", usageLimit: 200, isActive: true },
];

// ── FAQs ──────────────────────────────────────────────────────
const FAQ_DATA = [
  { question: "How long does shipping take?", answer: "Standard shipping within Kenya takes 2-5 business days. Express shipping is available for next-day delivery in Nairobi.", category: "Shipping", order: 1 },
  { question: "Do you offer international shipping?", answer: "Yes, we ship to most countries. International orders typically arrive within 7-14 business days.", category: "Shipping", order: 2 },
  { question: "What payment methods do you accept?", answer: "We accept M-Pesa, Visa, Mastercard, and bank transfers via our secure Paystack integration.", category: "Payments", order: 3 },
  { question: "Can I return or exchange an item?", answer: "We accept returns within 14 days of delivery for unworn items in original packaging. Contact support for return authorization.", category: "Returns", order: 4 },
  { question: "How do I track my order?", answer: "Once your order ships, you will receive an SMS and email with a tracking number you can use on our website.", category: "Orders", order: 5 },
];

// ── Helpers ───────────────────────────────────────────────────
async function seedTable<T extends Record<string, unknown>>(
  tableName: string,
  data: T[],
  insertFn: (row: T) => Promise<boolean>,
) {
  let inserted = 0;
  for (const row of data) {
    try {
      const didInsert = await insertFn(row);
      if (didInsert) inserted++;
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
        // skip silently
      } else {
        throw err;
      }
    }
  }
  log(`  ${tableName}: ${inserted} inserted, ${data.length - inserted} skipped (already exist)`);
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  log("Starting seed...\n");

  // 1. Categories
  log("Seeding categories...");
  await seedTable("categories", CATEGORY_DATA, async (row) => {
    const existing = await db.select().from(categories).where(eq(categories.slug, row.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(categories).values(row);
      return true;
    }
    return false;
  });

  // 2. Brands
  log("Seeding brands...");
  await seedTable("brands", BRAND_DATA, async (row) => {
    const existing = await db.select().from(brands).where(eq(brands.slug, row.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(brands).values(row);
      return true;
    }
    return false;
  });

  // 3. Users
  log("Seeding users...");
  await seedTable("users", USER_DATA, async (row) => {
    const existing = await db.select().from(users).where(eq(users.email, row.email)).limit(1);
    if (existing.length === 0) {
      await db.insert(users).values({ ...row, password: PASSWORD_HASH });
      return true;
    }
    return false;
  });

  // 4. Products
  log("Seeding products...");
  // Fetch category, brand, and seller IDs
  const allUsers = await db.select().from(users);
  const allCategories = await db.select().from(categories);
  const allBrands = await db.select().from(brands);
  const catMap = new Map(allCategories.map((c) => [c.slug, c.id]));
  const brandMap = new Map(allBrands.map((b) => [b.slug, b.id]));
  const sellerUser = allUsers.find((u) => u.role === "seller");
  if (!sellerUser) {
    log("  WARNING: No seller user found, skipping products");
  } else {
    let skuCounter = 1;
    await seedTable("products", PRODUCT_DATA, async (row) => {
      const existing = await db.select().from(products).where(eq(products.slug, row.slug)).limit(1);
      if (existing.length === 0) {
        const { categorySlug, brandSlug, ...rest } = row;
        await db.insert(products).values({
          ...rest,
          categoryId: catMap.get(categorySlug)!,
          brandId: brandMap.get(brandSlug) ?? null,
          sellerId: sellerUser.id,
          sku: `AC-${String(skuCounter++).padStart(4, "0")}`,
          images: [],
          specifications: {},
          averageRating: "0",
          reviewCount: 0,
        });
        return true;
      }
      return false;
    });
  }

  // 5. Roles & Permissions
  log("Seeding roles & permissions...");
  await seedTable("roles", ROLE_DATA, async (row) => {
    const existing = await db.select().from(roles).where(eq(roles.name, row.name)).limit(1);
    if (existing.length === 0) {
      await db.insert(roles).values(row);
      return true;
    }
    return false;
  });

  await seedTable("permissions", PERMISSION_DATA, async (row) => {
    const existing = await db.select().from(permissions).where(eq(permissions.name, row.name)).limit(1);
    if (existing.length === 0) {
      await db.insert(permissions).values(row);
      return true;
    }
    return false;
  });

  // Role-permission mappings
  log("  Mapping role-permissions...");
  const allRoles = await db.select().from(roles);
  const allPerms = await db.select().from(permissions);
  const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));
  const permMap = new Map(allPerms.map((p) => [p.name, p.id]));

  let rpInserted = 0;
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;
    for (const permName of permNames) {
      const permId = permMap.get(permName);
      if (!permId) continue;
      const existing = await db.select().from(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId))
        .limit(100);
      if (!existing.some((rp) => rp.permissionId === permId)) {
        await db.insert(rolePermissions).values({ roleId, permissionId: permId });
        rpInserted++;
      }
    }
  }
  log(`  role-permissions: ${rpInserted} inserted`);

  // 6. User-role mappings
  log("  Mapping user-roles...");
  const userRoleMap: Record<string, string> = { super_admin: "super_admin", seller: "seller", user: "user" };
  let urInserted = 0;
  for (const user of allUsers) {
    const roleName = userRoleMap[user.role] ?? "user";
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;
    const existing = await db.select().from(userRoles).where(eq(userRoles.userId, user.id)).limit(10);
    if (existing.length === 0) {
      await db.insert(userRoles).values({ userId: user.id, roleId });
      urInserted++;
    }
  }
  log(`  user-roles: ${urInserted} inserted`);

  // 7. Addresses
  log("Seeding addresses...");
  const janeUser = allUsers.find((u) => u.email === "jane@example.com");
  const omarUser = allUsers.find((u) => u.email === "omar@example.com");
  const adminUser = allUsers.find((u) => u.email === "admin@example.com");
  const addressUsers = [janeUser, omarUser, adminUser];

  for (let i = 0; i < ADDRESS_DATA.length; i++) {
    const user = addressUsers[i];
    if (!user) continue;
    const addr = ADDRESS_DATA[i];
    const existing = await db.select().from(addresses).where(eq(addresses.userId, user.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(addresses).values({ ...addr, userId: user.id });
    }
  }
  log("  addresses: done");

  // 8. Coupons
  log("Seeding coupons...");
  await seedTable("coupons", COUPON_DATA, async (row) => {
    const existing = await db.select().from(coupons).where(eq(coupons.code, row.code)).limit(1);
    if (existing.length === 0) {
      await db.insert(coupons).values(row);
      return true;
    }
    return false;
  });

  // 9. Settings
  log("Seeding settings...");
  const existingSettings = await db.select().from(settings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      siteName: "Amir Islamic Collections",
      siteDescription: "Premium Islamic clothing and accessories for the modern Muslim family.",
      primaryColor: "#1a5632",
      supportEmail: "support@amircollections.co.ke",
      supportPhone: "+254700000000",
      socialLinks: { whatsapp: "https://wa.me/254700000000", instagram: "https://instagram.com/amircollections" },
      seoTitle: "Amir Islamic Collections - Premium Islamic Fashion Kenya",
      seoDescription: "Shop premium hijabs, abayas, thobes, prayer accessories and more. Free delivery in Nairobi.",
      shippingSettings: { freeShippingThreshold: 5000, standardRate: 300, expressRate: 600 },
    });
    log("  settings: 1 inserted");
  } else {
    log("  settings: skipped (already exists)");
  }

  // 10. FAQs
  log("Seeding FAQs...");
  await seedTable("faqs", FAQ_DATA, async (row) => {
    const existing = await db.select().from(faqs).where(eq(faqs.question, row.question)).limit(1);
    if (existing.length === 0) {
      await db.insert(faqs).values(row);
      return true;
    }
    return false;
  });

  log("\nSeed completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("[SEED] Error:", err);
  process.exit(1);
});
