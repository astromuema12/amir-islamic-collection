import type { Product } from "@/types"

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  location: string
  date?: string
  verified?: boolean
}

export interface FlashDeal extends Product {
  soldPercent: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  emoji: string
  author: string
  date: Date
  readTime: string
  category: string
  comments: number
  likes: number
}

const now = new Date()
const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

const baseProduct = {
  currency: "KES",
  images: [],
  categoryId: "cat-1",
  sellerId: "seller-1",
  isActive: true,
  tags: [],
  createdAt: now,
  updatedAt: now,
}

export const sampleProducts: Product[] = [
  {
    ...baseProduct,
    id: "prod-1",
    name: "Premium Silk Abaya",
    slug: "premium-silk-abaya",
    description: "Elegant premium silk abaya with delicate embroidery, perfect for special occasions.",
    price: 12500,
    discountPrice: 9999,
    sku: "AB-001",
    stock: 25,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.8,
    reviewCount: 124,
    salesCount: 340,
  },
  {
    ...baseProduct,
    id: "prod-2",
    name: "Embroidered Kaftan Dress",
    slug: "embroidered-kaftan-dress",
    description: "Beautifully embroidered kaftan dress with traditional African prints.",
    price: 8500,
    sku: "KF-002",
    stock: 18,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.6,
    reviewCount: 89,
    salesCount: 210,
  },
  {
    ...baseProduct,
    id: "prod-3",
    name: "Crystal Beaded Hijab",
    slug: "crystal-beaded-hijab",
    description: "Luxurious chiffon hijab adorned with hand-sewn crystal beads.",
    price: 4500,
    discountPrice: 3500,
    sku: "HJ-003",
    stock: 40,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.9,
    reviewCount: 203,
    salesCount: 560,
  },
  {
    ...baseProduct,
    id: "prod-4",
    name: "Modest Maxi Dress",
    slug: "modest-maxi-dress",
    description: "Flowy maxi dress with long sleeves and high neckline, available in multiple colors.",
    price: 6200,
    sku: "MD-004",
    stock: 30,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.5,
    reviewCount: 67,
    salesCount: 180,
  },
  {
    ...baseProduct,
    id: "prod-5",
    name: "Leather Prayer Mat Set",
    slug: "leather-prayer-mat-set",
    description: "Premium leather prayer mat with matching tasbih and storage pouch.",
    price: 3500,
    discountPrice: 2800,
    sku: "PM-005",
    stock: 50,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.7,
    reviewCount: 156,
    salesCount: 420,
  },
  {
    ...baseProduct,
    id: "prod-6",
    name: "Linen Islamic Thobe",
    slug: "linen-islamic-thobe",
    description: "Comfortable linen thobe with modern tailored fit, ideal for daily wear.",
    price: 7200,
    sku: "TH-006",
    stock: 22,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.4,
    reviewCount: 78,
    salesCount: 195,
  },
  {
    ...baseProduct,
    id: "prod-7",
    name: "Gold Plated Quran Bookmark",
    slug: "gold-plated-quran-bookmark",
    description: "Elegant gold-plated Quran bookmark with Arabic calligraphy and tassel.",
    price: 1800,
    sku: "BM-007",
    stock: 100,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.3,
    reviewCount: 45,
    salesCount: 310,
  },
  {
    ...baseProduct,
    id: "prod-8",
    name: "Organic Oud Perfume Oil",
    slug: "organic-oud-perfume-oil",
    description: "Pure organic oud perfume oil, long-lasting fragrance from the finest ingredients.",
    price: 2900,
    discountPrice: 2200,
    sku: "PF-008",
    stock: 65,
    isFeatured: true,
    isFlashSale: false,
    averageRating: 4.9,
    reviewCount: 287,
    salesCount: 890,
  },
]

export const productEmojis: Record<string, string> = {
  "prod-1": "👗",
  "prod-2": "👘",
  "prod-3": "🧕",
  "prod-4": "👗",
  "prod-5": "🕌",
  "prod-6": "👔",
  "prod-7": "📖",
  "prod-8": "🌸",
}

export const sampleFlashDeals: FlashDeal[] = [
  {
    ...baseProduct,
    id: "flash-1",
    name: "Designer Niqab Set",
    slug: "designer-niqab-set",
    description: "Premium niqab set with matching gloves, lightweight breathable fabric.",
    price: 3800,
    discountPrice: 2500,
    sku: "NQ-001",
    stock: 15,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnds: twoDaysFromNow,
    averageRating: 4.7,
    reviewCount: 92,
    salesCount: 180,
    soldPercent: 75,
  },
  {
    ...baseProduct,
    id: "flash-2",
    name: "Handwoven Bisht Cloak",
    slug: "handwoven-bisht-cloak",
    description: "Traditional handwoven bisht with gold thread embroidery, worn for Eid and weddings.",
    price: 18500,
    discountPrice: 12999,
    sku: "BT-002",
    stock: 8,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnds: twoDaysFromNow,
    averageRating: 5.0,
    reviewCount: 34,
    salesCount: 42,
    soldPercent: 60,
  },
  {
    ...baseProduct,
    id: "flash-3",
    name: "Scented Amber Candle Set",
    slug: "scented-amber-candle-set",
    description: "Set of 3 hand-poured amber and musk scented candles in elegant glass jars.",
    price: 2400,
    discountPrice: 1500,
    sku: "CD-003",
    stock: 40,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnds: twoDaysFromNow,
    averageRating: 4.4,
    reviewCount: 118,
    salesCount: 290,
    soldPercent: 82,
  },
  {
    ...baseProduct,
    id: "flash-4",
    name: "Digital Quran Pen",
    slug: "digital-quran-pen",
    description: "Quran reading pen with built-in speaker, multiple reciters, and translation support.",
    price: 5500,
    discountPrice: 3999,
    sku: "QP-004",
    stock: 20,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnds: twoDaysFromNow,
    averageRating: 4.6,
    reviewCount: 73,
    salesCount: 150,
    soldPercent: 55,
  },
]

export const flashDealEmojis: Record<string, string> = {
  "flash-1": "🧕",
  "flash-2": "🧥",
  "flash-3": "🕯️",
  "flash-4": "🖊️",
}

export const trendingProducts: Product[] = [
  sampleProducts[2],
  sampleProducts[0],
  sampleProducts[4],
  sampleProducts[7],
]

export const trendingEmojis: Record<string, string> = {
  "prod-3": "🧕",
  "prod-1": "👗",
  "prod-5": "🕌",
  "prod-8": "🌸",
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Amina Hassan",
    role: "Teacher",
    avatar: "",
    content: "I've been searching for quality Islamic wear that combines modesty with modern style. This store is a gem! The abaya I bought is absolutely stunning and the fabric is top-notch.",
    rating: 5,
    location: "Nairobi, Kenya",
  },
  {
    id: "test-2",
    name: "Fatima Ochieng",
    role: "Healthcare Professional",
    avatar: "",
    content: "The crystal beaded hijab is gorgeous! I wore it to my sister's wedding and received so many compliments. Fast delivery and beautiful packaging. Will definitely order again.",
    rating: 5,
    location: "Mombasa, Kenya",
  },
  {
    id: "test-3",
    name: "Hassan Ibrahim",
    role: "Business Owner",
    avatar: "",
    content: "Ordered the leather prayer mat set as a gift for my father. The quality exceeded my expectations. The embossed details and the included tasbih are beautiful. Barakallah!",
    rating: 5,
    location: "Kampala, Uganda",
  },
  {
    id: "test-4",
    name: "Zainab Ali",
    role: "University Student",
    avatar: "",
    content: "As a young Muslimah, finding trendy yet modest clothing is always a challenge. This store has perfect options! The maxi dress fits beautifully and the material is breathable for our climate.",
    rating: 4,
    location: "Dar es Salaam, Tanzania",
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Art of Modest Fashion: Styling Your Abaya for Every Occasion",
    slug: "art-of-modest-fashion",
    excerpt: "Discover how to style your abaya from casual daywear to elegant evening looks with these simple tips and accessory combinations.",
    emoji: "👗",
    author: "Aisha Mohammed",
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    readTime: "5 min read",
    category: "Fashion",
    comments: 12,
    likes: 89,
  },
  {
    id: "blog-2",
    title: "Preparing Your Heart and Home for Ramadan: A Complete Guide",
    slug: "preparing-for-ramadan-guide",
    excerpt: "A comprehensive guide to spiritual and practical preparations for the blessed month, including decor ideas, meal planning, and worship goals.",
    emoji: "🌙",
    author: "Omar Abdallah",
    date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    readTime: "8 min read",
    category: "Lifestyle",
    comments: 24,
    likes: 156,
  },
  {
    id: "blog-3",
    title: "The Healing Power of Oud: Why This Ancient Fragrance Endures",
    slug: "healing-power-of-oud",
    excerpt: "Explore the rich history, health benefits, and spiritual significance of oud perfume in Islamic tradition and modern wellness.",
    emoji: "🌸",
    author: "Khadija Hassan",
    date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    readTime: "6 min read",
    category: "Wellness",
    comments: 18,
    likes: 112,
  },
]
