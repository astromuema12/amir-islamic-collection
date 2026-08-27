import { MetadataRoute } from "next";

const baseUrl = "https://amirislamic.com";

const staticPages: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
  { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  { url: `${baseUrl}/sellers`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
];

const blogSlugs = [
  "ramadan-2026-preparation-guide",
  "choosing-the-perfect-prayer-mat",
  "modest-fashion-trends-2026",
  "benefits-of-reading-quran-daily",
  "eid-gift-guide-2026",
  "halal-home-decor-ideas",
  "perfume-in-islam-sunnah-fragrances",
  "teaching-kids-islamic-values",
  "sustainable-fashion-in-islam",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages];
}
