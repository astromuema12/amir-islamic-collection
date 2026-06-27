import "dotenv/config";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  users,
  categories,
  brands,
  products,
  reviews,
  coupons,
  sellerProfiles,
} from "@/lib/db/schema";

const db = getDb();

function log(message: string) {
  console.log(`[SEED] ${message}`);
}

async function seedUsers() {
  log("Seeding users...");

  const hashedPassword = await hash("Admin123!", 12);

  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@amirislamic.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      phone: "+2548011111111",
      bio: "Platform administrator",
    })
    .onConflictDoNothing()
    .returning();

  const [seller] = await db
    .insert(users)
    .values({
      name: "Seller User",
      email: "seller@amirislamic.com",
      password: hashedPassword,
      role: "seller",
      emailVerified: true,
      phone: "+2548022222222",
      bio: "Islamic products seller",
    })
    .onConflictDoNothing()
    .returning();

  const [user] = await db
    .insert(users)
    .values({
      name: "Regular User",
      email: "user@amirislamic.com",
      password: hashedPassword,
      role: "user",
      emailVerified: true,
      phone: "+2548033333333",
      bio: "Regular customer",
    })
    .onConflictDoNothing()
    .returning();

  log(`Created ${admin ? 1 : 0} admin, ${seller ? 1 : 0} seller, ${user ? 1 : 0} user`);
  return { admin, seller, user };
}

async function seedSellerProfile(sellerId: string) {
  log("Seeding seller profile...");

  const [profile] = await db
    .insert(sellerProfiles)
    .values({
      userId: sellerId,
      storeName: "Al-Misk Islamic Store",
      storeSlug: "al-misk-islamic-store",
      description:
        "Premium Islamic products sourced from around the world. Authentic, high-quality items for the Muslim ummah.",
      phone: "+2548022222222",
      address: "25 Kenyatta Avenue",
      city: "Nairobi",
      state: "Nairobi County",
      country: "Kenya",
      isVerified: true,
    })
    .onConflictDoNothing()
    .returning();

  log(`Seller profile ${profile ? "created" : "already exists"}`);
  return profile;
}

async function seedCategories() {
  log("Seeding categories...");

  const categoryData = [
    { name: "Prayer Mats", slug: "prayer-mats", description: "High-quality prayer mats and rugs for daily salah" },
    { name: "Holy Qur'an", slug: "holy-quran", description: "The Noble Qur'an in various translations and sizes" },
    { name: "Qur'an Stands", slug: "quran-stands", description: "Wooden and metal Qur'an stands (rehal)" },
    { name: "Tasbih", slug: "tasbih", description: "Islamic prayer beads for dhikr" },
    { name: "Abayas", slug: "abayas", description: "Elegant and modest abayas for women" },
    { name: "Hijabs", slug: "hijabs", description: "Premium hijabs in various fabrics and colors" },
    { name: "Niqabs", slug: "niqabs", description: "Face veils for complete modesty" },
    { name: "Thobes", slug: "thobes", description: "Traditional Islamic thobes for men" },
    { name: "Islamic Books", slug: "islamic-books", description: "Books on Islamic knowledge, history, and spirituality" },
    { name: "Islamic Clothing", slug: "islamic-clothing", description: "Modest Islamic clothing for men and women" },
    { name: "Perfumes", slug: "perfumes", description: "Alcohol-free attar and perfume oils" },
    { name: "Prayer Caps", slug: "prayer-caps", description: "Kufi caps and prayer hats for men" },
    { name: "Kids Collection", slug: "kids-collection", description: "Islamic products and clothing for children" },
    { name: "Wall Art", slug: "wall-art", description: "Islamic calligraphy and wall decorations" },
    { name: "Home Decor", slug: "home-decor", description: "Islamic home decor and furnishings" },
    { name: "Ramadan Collection", slug: "ramadan-collection", description: "Special products for the blessed month of Ramadan" },
    { name: "Eid Collection", slug: "eid-collection", description: "Celebratory items for Eid festivities" },
    { name: "Gift Boxes", slug: "gift-boxes", description: "Curated Islamic gift boxes for all occasions" },
    { name: "Digital Products", slug: "digital-products", description: "Digital Islamic content, courses, and downloads" },
    { name: "Accessories", slug: "accessories", description: "Islamic accessories including rings, watches, and more" },
    { name: "Charity Products", slug: "charity-products", description: "Products where proceeds go to charity" },
    { name: "Islamic Electronics", slug: "islamic-electronics", description: "Digital Qur'ans, prayer alarms, and smart tasbih" },
  ];

  let count = 0;
  for (const cat of categoryData) {
    const [inserted] = await db
      .insert(categories)
      .values({ ...cat, isActive: true })
      .onConflictDoNothing()
      .returning();
    if (inserted) count++;
  }

  log(`Created ${count} categories`);
  return db.select().from(categories);
}

async function seedBrands() {
  log("Seeding brands...");

  const brandData = [
    { name: "Al-Misk", slug: "al-misk", description: "Premium Islamic lifestyle brand offering authentic products", website: "https://almisk.com" },
    { name: "Noor Islamic", slug: "noor-islamic", description: "Illuminating lives with quality Islamic goods", website: "https://noorislamic.com" },
    { name: "Qalam & Ink", slug: "qalam-ink", description: "Islamic books, calligraphy, and stationery", website: "https://qalamink.com" },
    { name: "Iman Fashion", slug: "iman-fashion", description: "Modern modest fashion for the Muslim woman", website: "https://imanfashion.com" },
    { name: "Tayyib Treasures", slug: "tayyib-treasures", description: "Pure and wholesome Islamic gifts and essentials", website: "https://tayyibtreasures.com" },
  ];

  let count = 0;
  for (const b of brandData) {
    const [inserted] = await db
      .insert(brands)
      .values({ ...b, isActive: true })
      .onConflictDoNothing()
      .returning();
    if (inserted) count++;
  }

  log(`Created ${count} brands`);
  return db.select().from(brands);
}

async function seedProducts(
  allCategories: { id: string; slug: string }[],
  allBrands: { id: string; slug: string }[],
  sellerId: string
) {
  log("Seeding products...");

  const catMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));
  const brandMap = Object.fromEntries(allBrands.map((b) => [b.slug, b.id]));

  const productData = [
    {
      name: "Premium Velvet Prayer Mat - Green",
      slug: "premium-velvet-prayer-mat-green",
      description: "Luxurious velvet prayer mat with intricate golden embroidery. Soft touch, non-slip backing, and comes with a matching carrying bag. Perfect for daily salah.",
      price: "15.99",
      discountPrice: "12.99",
      categorySlug: "prayer-mats",
      brandSlug: "al-misk",
      sku: "PMT-001",
      stock: 150,
      isFeatured: true,
      tags: ["prayer", "velvet", "embroidered", "gift"],
      weight: "0.50",
      dimensions: "115x70cm",
    },
    {
      name: "Travel Prayer Mat with Compass",
      slug: "travel-prayer-mat-compass",
      description: "Compact travel prayer mat with built-in Qibla compass. Lightweight, foldable, and water-resistant. Ideal for travel and outdoor prayers.",
      price: "9.99",
      categorySlug: "prayer-mats",
      brandSlug: "noor-islamic",
      sku: "PMT-002",
      stock: 200,
      isFlashSale: true,
      tags: ["travel", "compass", "portable"],
      weight: "0.30",
      dimensions: "80x50cm (folded)",
    },
    {
      name: "Children's Educational Prayer Mat",
      slug: "childrens-educational-prayer-mat",
      description: "Interactive prayer mat designed for children. Features illustrated steps of wudu and salah positions with Arabic/English text.",
      price: "18.99",
      categorySlug: "prayer-mats",
      brandSlug: "al-misk",
      sku: "PMT-003",
      stock: 80,
      tags: ["children", "educational", "interactive"],
      weight: "0.45",
      dimensions: "100x60cm",
    },
    {
      name: "Satin Silk Hijab - Navy Blue",
      slug: "satin-silk-hijab-navy-blue",
      description: "Luxurious satin silk hijab in deep navy blue. Smooth, breathable fabric with a beautiful drape. Measures 180x70cm.",
      price: "8.99",
      discountPrice: "6.99",
      categorySlug: "hijabs",
      brandSlug: "iman-fashion",
      sku: "HIJ-001",
      stock: 300,
      isFeatured: true,
      tags: ["satin", "silk", "navy", "luxury"],
      weight: "0.10",
    },
    {
      name: "Chiffon Hijab Set - Pastel Collection",
      slug: "chiffon-hijab-set-pastel",
      description: "Set of 3 premium chiffon hijabs in pastel shades. Lightweight, non-slip, and perfect for daily wear. Each measures 180x70cm.",
      price: "19.99",
      discountPrice: "15.99",
      categorySlug: "hijabs",
      brandSlug: "iman-fashion",
      sku: "HIJ-002",
      stock: 120,
      isFeatured: true,
      tags: ["chiffon", "set", "pastel", "daily-wear"],
      weight: "0.20",
    },
    {
      name: "Jersey Hijab - Everyday Essential",
      slug: "jersey-hijab-everyday-essential",
      description: "Ultra-comfortable jersey hijab, no-slip fabric that stays in place all day. Available in 10 colors. One size fits all.",
      price: "5.99",
      categorySlug: "hijabs",
      brandSlug: "iman-fashion",
      sku: "HIJ-003",
      stock: 500,
      tags: ["jersey", "everyday", "comfort", "basic"],
      weight: "0.08",
    },
    {
      name: "Premium Black Abaya - Embroidered",
      slug: "premium-black-abaya-embroidered",
      description: "Elegant black abaya with subtle gold embroidery on cuffs and neckline. Made from premium crepe fabric. Flowing, modest, and stylish.",
      price: "49.99",
      discountPrice: "39.99",
      categorySlug: "abayas",
      brandSlug: "iman-fashion",
      sku: "ABA-001",
      stock: 50,
      isFeatured: true,
      tags: ["black", "embroidered", "premium", "crepe"],
      weight: "0.60",
    },
    {
      name: "Open Front Abaya - Beige",
      slug: "open-front-abaya-beige",
      description: "Modern open-front abaya in soft beige. Lightweight fabric with wide sleeves. Perfect for layering over dresses.",
      price: "35.99",
      categorySlug: "abayas",
      brandSlug: "iman-fashion",
      sku: "ABA-002",
      stock: 45,
      tags: ["open-front", "beige", "modern", "lightweight"],
      weight: "0.50",
    },
    {
      name: "Saudi Style Thobe - White",
      slug: "saudi-style-thobe-white",
      description: "Authentic Saudi-style white thobe made from high-quality cotton-polyester blend. Comfortable, crisp, and perfect for daily wear or Jumu'ah.",
      price: "29.99",
      categorySlug: "thobes",
      brandSlug: "iman-fashion",
      sku: "THB-001",
      stock: 100,
      isFeatured: true,
      tags: ["saudi", "white", "cotton", "jumuah"],
      weight: "0.55",
    },
    {
      name: "Embroidered Kufi Cap - Set of 4",
      slug: "embroidered-kufi-cap-set-4",
      description: "Set of 4 embroidered kufi caps in assorted colors. Intricate geometric patterns. One size fits most.",
      price: "12.99",
      categorySlug: "prayer-caps",
      brandSlug: "al-misk",
      sku: "CAP-001",
      stock: 200,
      tags: ["kufi", "embroidered", "set", "geometric"],
      weight: "0.15",
    },
    {
      name: "Tajweed Qur'an - Medium Size",
      slug: "tajweed-quran-medium-size",
      description: "Medium-sized Tajweed Qur'an with color-coded rules of recitation. Arabic text with English translation. Leather-bound cover with gold detailing.",
      price: "24.99",
      categorySlug: "holy-quran",
      brandSlug: "qalam-ink",
      sku: "QRN-001",
      stock: 75,
      isFeatured: true,
      tags: ["tajweed", "quran", "medium", "leather", "color-coded"],
      weight: "0.80",
    },
    {
      name: "Qur'an with Tafsir - Large Print",
      slug: "quran-with-tafsir-large-print",
      description: "Large print Qur'an with comprehensive Tafsir (interpretation) in English. Ideal for seniors and those who prefer larger text. Hardcover.",
      price: "34.99",
      categorySlug: "holy-quran",
      brandSlug: "qalam-ink",
      sku: "QRN-002",
      stock: 40,
      tags: ["large-print", "tafsir", "hardcover", "english"],
      weight: "1.20",
    },
    {
      name: "Mini Qur'an - Pocket Size",
      slug: "mini-quran-pocket-size",
      description: "Pocket-sized Qur'an with genuine leather cover. Arabic text only. Perfect companion for daily carry. Includes gift box.",
      price: "9.99",
      categorySlug: "holy-quran",
      brandSlug: "al-misk",
      sku: "QRN-003",
      stock: 300,
      isFlashSale: true,
      tags: ["mini", "pocket", "leather", "gift-box"],
      weight: "0.10",
    },
    {
      name: "Wooden Qur'an Stand (Rehal) - Handcrafted",
      slug: "wooden-quran-stand-rehal",
      description: "Handcrafted wooden Qur'an stand with intricate Islamic motifs. Folds flat for storage. Suitable for all standard Qur'an sizes.",
      price: "22.99",
      discountPrice: "18.99",
      categorySlug: "quran-stands",
      brandSlug: "al-misk",
      sku: "STD-001",
      stock: 60,
      isFeatured: true,
      tags: ["wooden", "handcrafted", "folding", "rehal"],
      weight: "0.80",
    },
    {
      name: "Mother of Pearl Tasbih - 99 Beads",
      slug: "mother-of-pearl-tasbih-99-beads",
      description: "Elegant 99-bead tasbih made from genuine mother of pearl. Silk tassel included. Comes in a velvet pouch.",
      price: "16.99",
      categorySlug: "tasbih",
      brandSlug: "al-misk",
      sku: "TSB-001",
      stock: 100,
      isFeatured: true,
      tags: ["mother-of-pearl", "99-beads", "tassel", "velvet-pouch"],
      weight: "0.08",
    },
    {
      name: "Sandalwood Tasbih - 33 Beads",
      slug: "sandalwood-tasbih-33-beads",
      description: "Classic 33-bead sandalwood tasbih with natural fragrance. Smooth finish with wooden divider and tassel.",
      price: "6.99",
      categorySlug: "tasbih",
      brandSlug: "tayyib-treasures",
      sku: "TSB-002",
      stock: 250,
      tags: ["sandalwood", "33-beads", "fragrant", "classic"],
      weight: "0.04",
    },
    {
      name: "Oud Al-Misk Premium Perfume Oil - 12ml",
      slug: "oud-al-misk-premium-perfume-oil-12ml",
      description: "Premium alcohol-free Oud perfume oil. Rich, woody scent with notes of agarwood, musk, and amber. Long-lasting. Comes in a glass roll-on bottle.",
      price: "29.99",
      discountPrice: "24.99",
      categorySlug: "perfumes",
      brandSlug: "al-misk",
      sku: "PRF-001",
      stock: 80,
      isFeatured: true,
      tags: ["oud", "musk", "amber", "alcohol-free", "roll-on"],
      weight: "0.03",
    },
    {
      name: "Rose & Musk Attar - 6ml Set",
      slug: "rose-musk-attar-6ml-set",
      description: "Set of 3 alcohol-free attar oils: Rose, Musk, and Amber. Traditional Middle Eastern perfumery. Concentrated and long-lasting.",
      price: "19.99",
      categorySlug: "perfumes",
      brandSlug: "tayyib-treasures",
      sku: "PRF-002",
      stock: 120,
      tags: ["rose", "musk", "amber", "attar", "set"],
      weight: "0.05",
    },
    {
      name: "Islamic Wall Art - Ayatul Kursi Frame",
      slug: "islamic-wall-art-ayatul-kursi",
      description: "Beautifully framed Ayatul Kursi calligraphy print. Gold and black design on premium paper. Modern Islamic wall decor. Size 40x50cm.",
      price: "27.99",
      categorySlug: "wall-art",
      brandSlug: "qalam-ink",
      sku: "ART-001",
      stock: 40,
      isFeatured: true,
      tags: ["ayatul-kursi", "calligraphy", "framed", "wall-decor"],
      weight: "1.00",
      dimensions: "40x50cm",
    },
    {
      name: "99 Names of Allah Canvas Poster",
      slug: "99-names-of-allah-canvas-poster",
      description: "Large canvas poster featuring the 99 Beautiful Names of Allah in elegant Arabic calligraphy with English transliteration. Size 60x90cm.",
      price: "22.99",
      categorySlug: "wall-art",
      brandSlug: "qalam-ink",
      sku: "ART-002",
      stock: 55,
      tags: ["99-names", "canvas", "poster", "allah"],
      weight: "0.40",
      dimensions: "60x90cm",
    },
    {
      name: "Islamic Gift Box - Premium Set",
      slug: "islamic-gift-box-premium-set",
      description: "Curated premium gift box containing: Tasbih, perfume oil, mini Qur'an, and prayer cap. Beautifully packaged in a wooden box. Perfect for gifting.",
      price: "39.99",
      categorySlug: "gift-boxes",
      brandSlug: "tayyib-treasures",
      sku: "GFT-001",
      stock: 30,
      isFeatured: true,
      tags: ["gift-box", "premium", "wooden-box", "set"],
      weight: "0.80",
    },
    {
      name: "Eid Gift Hamper - Kids",
      slug: "eid-gift-hamper-kids",
      description: "Delightful Eid gift hamper for children containing: small Qur'an, tasbih, Islamic coloring book, stickers, and sweets. Beautiful wicker basket.",
      price: "14.99",
      categorySlug: "eid-collection",
      brandSlug: "tayyib-treasures",
      sku: "GFT-002",
      stock: 50,
      tags: ["eid", "kids", "hamper", "gift"],
      weight: "0.50",
    },
    {
      name: "Ramadan Lantern - LED Decorative",
      slug: "ramadan-lantern-led-decorative",
      description: "Traditional Moroccan-style LED lantern. Warm amber glow. Battery-operated with timer function. Perfect for Ramadan home decor.",
      price: "18.99",
      categorySlug: "ramadan-collection",
      brandSlug: "noor-islamic",
      sku: "RAM-001",
      stock: 65,
      isFeatured: true,
      tags: ["ramadan", "lantern", "led", "decorative"],
      weight: "0.35",
    },
    {
      name: "Ramadan Planner & Journal",
      slug: "ramadan-planner-journal-2026",
      description: "Comprehensive 30-day Ramadan planner. Includes daily duas, prayer tracker, gratitude journal, and meal planner. Spiral-bound, 120 pages.",
      price: "12.99",
      categorySlug: "ramadan-collection",
      brandSlug: "qalam-ink",
      sku: "RAM-002",
      stock: 200,
      isFlashSale: true,
      tags: ["ramadan", "planner", "journal", "dua-tracker"],
      weight: "0.25",
    },
    {
      name: "Fortress of the Muslim (Hisnul Muslim) Book",
      slug: "fortress-of-the-muslim-hisnul-muslim",
      description: "Pocket-sized Hisnul Muslim - Fortress of the Muslim. Collection of authentic duas and remembrances. Arabic with English translation and transliteration.",
      price: "5.99",
      categorySlug: "islamic-books",
      brandSlug: "qalam-ink",
      sku: "BOK-001",
      stock: 500,
      isFeatured: true,
      tags: ["hisnul-muslim", "dua", "pocket", "remembrances"],
      weight: "0.08",
    },
    {
      name: "Stories of the Prophets - Ibn Kathir",
      slug: "stories-of-the-prophets-ibn-kathir",
      description: "Abridged version of Ibn Kathir's classic 'Stories of the Prophets'. Covers from Adam (AS) to Isa (AS). Hardcover, 450 pages.",
      price: "18.99",
      categorySlug: "islamic-books",
      brandSlug: "qalam-ink",
      sku: "BOK-002",
      stock: 80,
      tags: ["prophets", "ibn-kathir", "hardcover", "islamic-history"],
      weight: "0.60",
    },
    {
      name: "Digital Qur'an Pen Reader",
      slug: "digital-quran-pen-reader",
      description: "Digital Qur'an pen that reads verses aloud. Includes a complete Mushaf. Features multiple reciters and translation languages. USB rechargeable.",
      price: "45.99",
      discountPrice: "39.99",
      categorySlug: "islamic-electronics",
      brandSlug: "noor-islamic",
      sku: "ELC-001",
      stock: 35,
      isFeatured: true,
      tags: ["digital", "quran-pen", "reader", "rechargeable"],
      weight: "0.40",
    },
    {
      name: "Smart Tasbih Counter - Digital Ring",
      slug: "smart-tasbih-counter-digital-ring",
      description: "Wearable digital tasbih counter ring. Silently count dhikr with a touch. LED display. Rechargeable battery lasts 30 days.",
      price: "14.99",
      categorySlug: "islamic-electronics",
      brandSlug: "noor-islamic",
      sku: "ELC-002",
      stock: 150,
      tags: ["smart", "tasbih", "digital", "ring", "wearable"],
      weight: "0.02",
    },
    {
      name: "Islamic Coloring Book for Kids",
      slug: "islamic-coloring-book-kids",
      description: "50 pages of Islamic-themed coloring activities including masjids, Arabic letters, and Islamic patterns. Educational fun for ages 4-10.",
      price: "4.99",
      categorySlug: "kids-collection",
      brandSlug: "qalam-ink",
      sku: "KID-001",
      stock: 400,
      tags: ["coloring", "kids", "educational", "activity"],
      weight: "0.15",
    },
    {
      name: "Islamic Kids Storybook Set - 5 Books",
      slug: "islamic-kids-storybook-set-5-books",
      description: "Set of 5 beautifully illustrated Islamic storybooks for children. Covers stories of the Prophets, good manners, and Islamic values.",
      price: "24.99",
      categorySlug: "kids-collection",
      brandSlug: "qalam-ink",
      sku: "KID-002",
      stock: 60,
      isFeatured: true,
      tags: ["storybook", "set", "illustrated", "children"],
      weight: "0.70",
    },
    {
      name: "Sadaqah Jar - Charity Box",
      slug: "sadaqah-jar-charity-box",
      description: "Beautiful ceramic sadaqah jar with Arabic calligraphy. Encourages regular charity giving. Comes with a booklet on the virtues of sadaqah. 100% of proceeds go to charity.",
      price: "7.99",
      categorySlug: "charity-products",
      brandSlug: "tayyib-treasures",
      sku: "CHR-001",
      stock: 100,
      tags: ["sadaqah", "charity", "jar", "ceramic"],
      weight: "0.30",
    },
    {
      name: "Silver Islamic Ring - Ayatul Kursi Engraving",
      slug: "silver-islamic-ring-ayatul-kursi",
      description: "Sterling silver ring with Ayatul Kursi engraving. Adjustable size. Comes in a velvet gift box. Unisex design.",
      price: "34.99",
      categorySlug: "accessories",
      brandSlug: "al-misk",
      sku: "ACC-001",
      stock: 45,
      isFeatured: true,
      tags: ["silver", "ring", "ayatul-kursi", "adjustable"],
      weight: "0.02",
    },
    {
      name: "Islamic Hijri Calendar 2026",
      slug: "islamic-hijri-calendar-2026",
      description: "Wall calendar showing both Hijri and Gregorian dates. Features important Islamic dates, prayer times, and beautiful photography of masjids worldwide.",
      price: "8.99",
      categorySlug: "home-decor",
      brandSlug: "noor-islamic",
      sku: "HOM-001",
      stock: 120,
      tags: ["calendar", "hijri", "2026", "wall"],
      weight: "0.20",
    },
    {
      name: "Musk & Amber Home Fragrance Set",
      slug: "musk-amber-home-fragrance-set",
      description: "Set of 3 home fragrance oils: Musk, Amber, and Rose. Alcohol-free. Perfect for scenting homes, especially before Jumu'ah and during Ramadan.",
      price: "15.99",
      categorySlug: "home-decor",
      brandSlug: "tayyib-treasures",
      sku: "HOM-002",
      stock: 90,
      tags: ["home-fragrance", "musk", "amber", "oil"],
      weight: "0.10",
    },
    {
      name: "Digital Islamic Course - Essentials of Islam",
      slug: "digital-course-essentials-of-islam",
      description: "Comprehensive online course covering the essentials of Islam: Aqeedah, Fiqh, Seerah, and Quranic studies. 20+ hours of video content with downloadable PDFs. Lifetime access.",
      price: "49.99",
      discountPrice: "29.99",
      categorySlug: "digital-products",
      brandSlug: "qalam-ink",
      sku: "DGT-001",
      stock: 9999,
      isFeatured: true,
      isFlashSale: true,
      tags: ["digital", "course", "video", "lifetime-access"],
      weight: "0.00",
    },
  ];

  let insertedCount = 0;
  for (const p of productData) {
    const { categorySlug, brandSlug, ...productValues } = p;
    const [inserted] = await db
      .insert(products)
      .values({
        ...productValues,
        categoryId: catMap[categorySlug],
        brandId: brandMap[brandSlug] || null,
        sellerId,
        currency: "KES",
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) insertedCount++;
  }

  log(`Created ${insertedCount} products`);
  return db.select().from(products);
}

async function seedReviews(allProducts: { id: string }[], userId: string) {
  log("Seeding reviews...");

  const reviewTexts = [
    { rating: 5, title: "Absolutely beautiful!", content: "Exceeded my expectations. The quality is outstanding and delivery was fast. Will definitely buy again." },
    { rating: 4, title: "Great product, minor issue", content: "Love the quality and design. Only minor issue was the packaging could be better. Otherwise excellent." },
    { rating: 5, title: "Perfect gift", content: "Bought this as a gift and the recipient absolutely loved it. Excellent craftsmanship." },
    { rating: 4, title: "Good value for money", content: "Very good quality for the price. Would recommend to friends and family." },
    { rating: 5, title: "Alhamdulillah, amazing", content: "Alhamdulillah! This product is amazing. High quality and exactly as described. Barakallah." },
    { rating: 3, title: "Decent product", content: "It's okay for the price. Not the best quality but does the job. Shipping took longer than expected." },
    { rating: 5, title: "Excellent quality", content: "Top notch quality. The material feels premium and the design is beautiful. Very happy with my purchase." },
    { rating: 4, title: "Very nice", content: "Very nice product. Looks exactly like the pictures. Fast shipping too." },
    { rating: 5, title: "Best purchase this year", content: "This is one of the best things I've bought. The quality is superb and it came beautifully packaged." },
    { rating: 4, title: "Highly recommended", content: "Great product from a great store. Highly recommended for all Muslims looking for quality items." },
  ];

  let count = 0;
  for (let i = 0; i < allProducts.length && i < 20; i++) {
    const product = allProducts[i];
    const review = reviewTexts[i % reviewTexts.length];
    const [inserted] = await db
      .insert(reviews)
      .values({
        productId: product.id,
        userId,
        rating: review.rating,
        title: review.title,
        content: review.content,
        isApproved: true,
      })
      .onConflictDoNothing()
      .returning();
    if (inserted) count++;
  }

  log(`Created ${count} reviews`);
}

async function seedCoupon() {
  log("Seeding coupon...");

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const [coupon] = await db
    .insert(coupons)
    .values({
      code: "WELCOME10",
      type: "percentage",
      value: "10",
      minOrderAmount: "20",
      maxDiscount: "50",
      usageLimit: 100,
      usedCount: 0,
      expiresAt,
      isActive: true,
    })
    .onConflictDoNothing()
    .returning();

  log(`Coupon ${coupon ? "created" : "already exists"}`);
}

async function main() {
  log("Starting seed...\n");

  const { admin, seller, user } = await seedUsers();
  if (!admin || !seller || !user) {
    log("Some users already exist, continuing with existing data...");
  }

  const sellerId = seller?.id || (await db.select({ id: users.id }).from(users).where(eq(users.email, "seller@amirislamic.com")).limit(1))[0]?.id;
  const userId = user?.id || (await db.select({ id: users.id }).from(users).where(eq(users.email, "user@amirislamic.com")).limit(1))[0]?.id;

  if (sellerId) await seedSellerProfile(sellerId);

  const allCategories = await seedCategories();
  const allBrands = await seedBrands();
  const allProducts = await seedProducts(allCategories, allBrands, sellerId);

  if (userId && allProducts.length > 0) {
    await seedReviews(allProducts, userId);
  }

  await seedCoupon();

  log("\nSeed completed successfully!");
  log("---");
  log("Admin: admin@amirislamic.com / Admin123!");
  log("Seller: seller@amirislamic.com / Seller123!");
  log("User: user@amirislamic.com / User123!");
  log("Coupon: WELCOME10 (10% off)");
  log("---");

  process.exit(0);
}

main().catch((err) => {
  console.error("[SEED] Error:", err);
  process.exit(1);
});
