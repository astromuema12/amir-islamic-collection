import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, BookOpen, Heart, Tag } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { APP_NAME, APP_URL } from "@/lib/constants"
import { db } from "@/lib/db"
import { blogs } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const blogPosts: Record<string, {
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
}> = {
  "ramadan-2026-preparation-guide": {
    title: "Complete Ramadan 2026 Preparation Guide",
    excerpt: "Get ready for the blessed month with our comprehensive guide.",
    content: `Ramadan is a sacred month of fasting, prayer, reflection, and community. Preparing adequately can help you maximize the spiritual benefits of this blessed time.

## 1. Spiritual Preparation

Begin by renewing your intentions (niyyah) and making sincere repentance (tawbah). Increase your voluntary prayers, Quran recitation, and dhikr in the weeks leading up to Ramadan. This spiritual warm-up helps ease the transition into the rigorous worship schedule of Ramadan.

## 2. Physical Preparation

Gradually adjust your sleep schedule and eating habits. Start waking up for suhoor earlier and reduce caffeine intake to minimize withdrawal headaches during fasting days. Light exercise like walking can help maintain energy levels.

## 3. Home & Kitchen Preparation

Stock your pantry with essentials for nutritious suhoor and iftar meals. Whole grains, dates, nuts, and legumes provide sustained energy. Organize your prayer space and ensure you have a comfortable prayer mat, Quran, and tasbih.

## 4. Community & Family

Plan community iftars and family gatherings in advance. Ramadan is a time for strengthening family bonds and community ties. Arrange Quran study circles and taraweeh prayer schedules with family members.

## 5. Charity Planning

Plan your Zakat and Sadaqah for Ramadan, when rewards are multiplied. Many people choose to pay Zakat during this blessed month to maximize blessings.

May Allah accept our fasts, prayers, and good deeds during this Ramadan. Ameen.`,
    author: "Amir Islamic Team",
    date: "June 15, 2026",
    readTime: "8 min read",
    category: "Ramadan",
    tags: ["Ramadan", "Spirituality", "Preparation", "Fasting"],
  },
  "choosing-the-perfect-prayer-mat": {
    title: "How to Choose the Perfect Prayer Mat",
    excerpt: "A detailed guide to selecting a prayer mat.",
    content: `Your prayer mat (sajjadah) is an important companion in your daily worship. Choosing the right one enhances your prayer experience and comfort.

## 1. Material Quality

The most common materials are velvet, plush microfiber, silk, cotton, and jacquard. Velvet mats offer a soft, luxurious feel. Microfiber is durable and easy to clean. Cotton is breathable and natural. Consider your climate and comfort preferences.

## 2. Size Considerations

Standard prayer mats measure approximately 115cm x 70cm. Travel mats are smaller and foldable. Extra-large mats are available for taller individuals or those who prefer more space during prostration.

## 3. Design & Aesthetics

From simple solid colors to intricate mosque patterns, choose a design that inspires khushu (focus) in your prayer. Many mats feature mihrab (prayer niche) designs that help orient you towards the Qibla.

## 4. Portability

If you pray at the office, university, or while traveling, consider a lightweight, foldable mat with a carrying case. Some mats come with built-in compasses for Qibla direction.

## 5. Durability & Maintenance

Look for mats with reinforced edges that won't fray. Machine-washable mats are convenient. Darker colors hide dirt better. Quality prayer mats can last for years with proper care.

Invest in a quality prayer mat that brings you comfort and joy in your daily prayers.`,
    author: "Aisha Mohammed",
    date: "June 10, 2026",
    readTime: "6 min read",
    category: "Product Guide",
    tags: ["Prayer Mats", "Product Guide", "Worship", "Home"],
  },
  "modest-fashion-trends-2026": {
    title: "Modest Fashion Trends to Watch in 2026",
    excerpt: "Explore the latest modest fashion trends.",
    content: `The modest fashion industry continues to grow and evolve, offering Muslim women more choices than ever before. Here are the top trends for 2026.

## 1. Sustainable Modest Fashion

Eco-friendly fabrics and ethical production are increasingly important. Look for brands using organic cotton, bamboo fibers, and recycled materials. The trend towards sustainability aligns perfectly with Islamic principles of caring for the Earth (khalifah).

## 2. Bold Colors & Patterns

While neutrals remain classics, 2026 is seeing a surge in jewel tones — emerald green, sapphire blue, and deep burgundy. Geometric patterns and abstract prints add visual interest to abayas and hijabs.

## 3. Versatile Layering Pieces

Kimono-style abayas, open-front cardigans, and wrap dresses offer versatility. These pieces can be styled multiple ways, making them excellent investments for a modest wardrobe.

## 4. Premium Hijab Fabrics

Chiffon, silk, and modal hijabs remain popular for their drape and comfort. Jersey hijabs are favored for their wrinkle-resistance and ease of wear. Expect to see more innovative fabric blends.

## 5. Modest Activewear

The demand for modest sportswear continues to grow. Breathable, stretchy fabrics in longer cuts allow Muslim women to stay active while maintaining modesty.

Express your personal style while honoring your faith with these beautiful modest fashion choices.`,
    author: "Fatima Hassan",
    date: "June 5, 2026",
    readTime: "5 min read",
    category: "Fashion",
    tags: ["Fashion", "Hijab", "Abaya", "Modest Fashion", "Trends"],
  },
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <article>
        <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
              className="mb-6"
            />
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-premium/10 border flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-sm sm:prose-base max-w-none">
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                    {line.replace("### ", "")}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="text-muted-foreground ml-6">
                    {line.replace("- ", "")}
                  </li>
                )
              }
              if (line.startsWith("• ")) {
                return (
                  <li key={i} className="text-muted-foreground ml-6">
                    {line.replace("• ", "")}
                  </li>
                )
              }
              if (line.trim() === "") {
                return <div key={i} className="h-4" />
              }
              return (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {line}
                </p>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-10" />

          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Separator className="my-10" />

          <section>
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .filter(([key]) => key !== slug)
                .slice(0, 2)
                .map(([key, related]) => (
                  <Link key={key} href={`/blog/${key}`} className="group">
                    <Card className="border-2 hover:border-primary/50 transition-all duration-300 h-full">
                      <CardContent className="p-5">
                        <Badge variant="secondary" className="mb-2">
                          {related.category}
                        </Badge>
                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
