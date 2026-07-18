import type { Product } from "@/types"

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  location: string
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

export const sampleProducts: Product[] = []

export const productEmojis: Record<string, string> = {}

export const sampleFlashDeals: FlashDeal[] = []

export const flashDealEmojis: Record<string, string> = {}

export const trendingProducts: Product[] = []

export const trendingEmojis: Record<string, string> = {}

export const testimonials: Testimonial[] = []

export const blogPosts: BlogPost[] = []
