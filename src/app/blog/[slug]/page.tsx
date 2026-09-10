import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, BookOpen, Heart, Tag } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
    excerpt: "Get ready for the blessed month with our comprehensive guide covering spiritual preparation, essential products, and daily planning tips.",
    author: "Amir Islamic Team",
    date: "June 15, 2026",
    readTime: "8 min read",
    category: "Ramadan",
    tags: ["Ramadan", "Preparation", "Spirituality", "Islamic Living"],
    content: `## Spiritual Preparation

Ramadan is a month of spiritual renewal and self-discipline. Begin preparing your heart and mind weeks before the blessed month arrives.

### Increase acts of worship

Start by gradually increasing your daily prayers and Quran recitation. Setting a consistent routine before Ramadan helps ease into the increased ibadah during the month.

### Set intentions

Write down your spiritual goals for Ramadan. Whether it's completing the Quran, improving your prayer consistency, or increasing charity, clear intentions help maintain focus.

## Essential Products

Having the right items on hand makes your Ramadan smoother and more meaningful.

### Prayer essentials

- Quality prayer mat for comfort during long Taraweeh prayers
- Quran with translation for deeper understanding
- Tasbih counter for daily dhikr
- Prayer beads for additional remembrance

### Kitchen preparation

- Dates for iftar (the Prophet's sunnah)
- Quality cooking ingredients for nutritious meals
- Water bottles to stay hydrated
- Food containers for meal prep

## Daily Planning Tips

### Suhoor and Iftar schedule

Plan your meals in advance. Preparing suhoor and iftar menus for the week saves time and ensures balanced nutrition throughout the month.

### Time management

Balance work, family, and worship by creating a daily schedule. Allocate specific times for Quran recitation, family meals, and community activities.

## Community and Family

### Involve the whole family

Make Ramadan a family experience. Children learn best through participation in preparations, cooking, and prayers together.

### Community iftars

Consider hosting or attending community iftar gatherings. Sharing meals strengthens bonds and multiplies the reward of feeding others.

## Final Thoughts

Ramadan is a mercy and blessing from Allah SWT. Prepare well, worship sincerely, and make the most of every moment in this sacred month.`,
  },
  "choosing-the-perfect-prayer-mat": {
    title: "How to Choose the Perfect Prayer Mat",
    excerpt: "A detailed guide to selecting a prayer mat that combines comfort, durability, and beauty for your daily prayers.",
    author: "Aisha Mohammed",
    date: "June 10, 2026",
    readTime: "6 min read",
    category: "Product Guide",
    tags: ["Prayer Mat", "Product Guide", "Islamic Home", "Worship"],
    content: `## Why Your Prayer Mat Matters

A prayer mat is more than just a piece of fabric — it's your personal space for connecting with Allah SWT. The right mat enhances your comfort and helps you focus during salah.

## Material Considerations

### Cotton prayer mats

Cotton is the most popular choice for its breathability and softness. It's easy to wash and gets softer with each wash. Ideal for year-round use.

### Velvet and plush mats

These provide extra cushioning for joints, making them excellent for those who spend extended time in prostration. Perfect for winter months.

### Portable travel mats

Lightweight and foldable, travel mats are essential for maintaining your prayers while on the go. Look for quick-drying materials.

## Size and Thickness

### Standard size

Most prayer mats measure around 70cm x 110cm, which comfortably accommodates an adult during standing, bowing, and prostration.

### Extra thick mats

For those with knee or joint issues, a thicker mat (1cm+) provides important cushioning without being too bulky.

## Design and Aesthetics

Islamic geometric patterns, calligraphy, and nature-inspired designs make prayer mats beautiful additions to your home. Choose designs that inspire tranquility and reflection.

## Care and Maintenance

- Wash regularly to maintain cleanliness
- Air dry when possible to preserve the fabric
- Store in a dry place to prevent mildew
- Consider having separate mats for home and travel

## Our Recommendations

Browse our curated collection of premium prayer mats designed for daily use, travel, and special occasions. Each mat is crafted with quality materials and beautiful Islamic designs.`,
  },
  "modest-fashion-trends-2026": {
    title: "Modest Fashion Trends to Watch in 2026",
    excerpt: "Explore the latest modest fashion trends, from abayas to hijabs, that combine style with Islamic values.",
    author: "Fatima Hassan",
    date: "June 5, 2026",
    readTime: "5 min read",
    category: "Fashion",
    tags: ["Modest Fashion", "Hijab", "Abaya", "Islamic Fashion"],
    content: `## The Rise of Modest Fashion

Modest fashion continues to grow as a global movement, with designers and brands embracing elegant, covered styles that honor Islamic values.

## Key Trends for 2026

### Earth tones and natural palettes

Soft browns, sage greens, and warm beiges dominate the modest fashion scene. These versatile colors work beautifully across seasons.

### Structured abayas

Moving beyond simple black abayas, structured designs with subtle embroidery and architectural details are gaining popularity.

### Layered looks

Strategic layering allows for creative expression while maintaining modesty. Long cardigans over midi dresses and wide-leg trousers create effortlessly chic outfits.

### Sporty modest wear

Activewear designed for Muslim women continues to expand, with options for swimming, running, and gym workouts that provide full coverage without compromising performance.

## Hijab Styling

### Simple everyday wraps

Easy, secure hijab styles that work for work, school, and daily activities. Focus on comfort and practicality.

### Statement accessories

Brooches, pins, and undercaps that add personality to your hijab look while keeping everything in place throughout the day.

## Shopping Tips

- Invest in quality basics that mix and match easily
- Look for breathable fabrics, especially in warmer months
- Choose versatile pieces that transition from casual to formal
- Support Muslim-owned brands and designers

## Building Your Wardrobe

Start with neutral basics, then add statement pieces that reflect your personal style. A well-planned modest wardrobe gives you endless outfit possibilities while staying true to your values.`,
  },
  "benefits-of-reading-quran-daily": {
    title: "The Spiritual and Mental Benefits of Reading Quran Daily",
    excerpt: "Discover how regular Quran recitation can transform your spiritual life, reduce stress, and bring peace to your heart.",
    author: "Yusuf Ahmad",
    date: "June 1, 2026",
    readTime: "7 min read",
    category: "Spirituality",
    tags: ["Quran", "Spirituality", "Daily Practice", "Mental Health"],
    content: `## The Power of Daily Recitation

The Quran is not just a book of guidance — it is a source of healing, mercy, and tranquility. Establishing a daily recitation habit brings immense benefits to both spiritual and worldly life.

## Spiritual Benefits

### Connection with Allah

Daily Quran recitation strengthens your bond with Allah SWT. Each word is a form of worship, and consistent recitation opens the heart to divine guidance.

### Increased barakah

Homes where the Quran is regularly recited are filled with barakah (blessings). The angels descend upon such gatherings, bringing peace and mercy.

## Mental and Emotional Benefits

### Stress relief

Studies have shown that listening to and reciting Quran significantly reduces stress and anxiety. The rhythmic recitation calms the mind and soothes the soul.

### Improved focus

The concentration required for proper recitation trains the mind to focus — a skill that benefits all areas of life.

### Enhanced memory

Regular Quran memorization and recitation keeps the mind sharp and improves cognitive function at any age.

## Practical Tips for Daily Recitation

### Start small

Begin with just one page or a few verses after each prayer. Consistency matters more than quantity.

### Choose a fixed time

Early morning recitation (after Fajr) is particularly blessed. Find a time that works for your schedule and stick to it.

### Understand what you read

Use a translation or tafsir alongside your Arabic recitation to deepen your connection and understanding.

### Join a study circle

Learning Quran with others provides accountability, community, and deeper insights into the text.

## The Rewards Are Infinite

Allah SWT has promised immense rewards for those who recite His Book regularly. Make the Quran your companion in this life and your intercessor in the next.`,
  },
  "eid-gift-guide-2026": {
    title: "Eid al-Adha 2026 Gift Guide: Thoughtful Presents for Loved Ones",
    excerpt: "Find the perfect Eid gifts for family and friends with our curated collection of meaningful and beautiful presents.",
    author: "Amir Islamic Team",
    date: "May 28, 2026",
    readTime: "4 min read",
    category: "Gift Guide",
    tags: ["Eid", "Gift Guide", "Family", "Celebration"],
    content: `## The Joy of Giving on Eid

Eid al-Adha is a time of celebration, gratitude, and generosity. Sharing gifts with loved ones adds to the joy and strengthens family and community bonds.

## For Family Members

### For parents

Show your appreciation with quality prayer accessories, comfortable prayer mats, or a beautifully bound Quran. Personalized items like engraved prayer beads are especially meaningful.

### For children

Islamic storybooks, educational toys, and modest clothing make wonderful gifts. Consider a savings certificate or gold savings plan for a lasting gift.

### For siblings

Fragrances, quality clothing, or experience gifts like a family dinner create lasting memories together.

## For Friends and Neighbors

### Eid greeting cards

Send heartfelt Eid Mubarak wishes to friends and neighbors. A handwritten card shows thoughtfulness and care.

### Sweet treats

Boxes of dates, baklava, or traditional Eid sweets are always appreciated. Pair them with a small gift for extra thoughtfulness.

### Home decor

Islamic wall art, calligraphy pieces, or decorative items make lasting gifts that beautify any home.

## For Community Members

### Charitable gifts

Make a donation in someone's name to a cause they care about. This gift carries both worldly and spiritual benefits.

### Volunteer together

Organize a group activity like preparing Eid meals for those in need, or visit the elderly and sick in your community.

## Presentation Tips

- Use elegant gift wrapping with Islamic patterns
- Include a personal note with dua (prayer)
- Consider presentation boxes or baskets for multiple small gifts
- Add a small Quran verse card as a reminder of the blessings of Eid

## Remember the Essence

While gifts bring joy, remember that Eid is fundamentally about sacrifice, gratitude, and devotion to Allah SWT. Let your gifts reflect these values.`,
  },
  "halal-home-decor-ideas": {
    title: "Halal Home Decor: Beautiful Your Space with Islamic Art",
    excerpt: "Transform your home with tasteful Islamic decor that reflects your faith and creates a peaceful environment for your family.",
    author: "Aisha Mohammed",
    date: "May 22, 2026",
    readTime: "6 min read",
    category: "Home & Decor",
    tags: ["Home Decor", "Islamic Art", "Interior Design", "Muslim Home"],
    content: `## Creating an Islamic Home

Your home should be a sanctuary that reflects your faith and values. Islamic decor combines beauty, meaning, and functionality to create spaces that inspire tranquility and remembrance of Allah.

## Wall Art and Calligraphy

### Quranic calligraphy

Beautiful verses of the Quran displayed on walls serve as constant reminders of Allah's guidance. Choose verses that are meaningful to your family.

### Geometric patterns

Traditional Islamic geometric art adds sophistication and depth to any room. These mathematical patterns reflect the infinite nature of Allah's creation.

## Prayer Room Design

### Dedicated prayer space

Even in small homes, creating a designated prayer area helps maintain consistency in worship. Consider a corner with a quality prayer mat, Quran stand, and soft lighting.

### Ambiance elements

Soft colors, natural light, and subtle fragrances create a peaceful atmosphere conducive to worship and reflection.

## Functional Decor

### Islamic clocks

Prayer time clocks that show the five daily prayer times are both decorative and practical additions to any Muslim home.

### Bookshelves

A well-organized bookshelf displaying Quran, Islamic literature, and family photos creates a warm, intellectual atmosphere.

## Color Palettes

### Serene neutrals

Whites, creams, and soft grays provide a calming backdrop for Islamic decorative elements.

### Rich jewel tones

Deep emerald, sapphire, and gold accents add luxury and warmth, particularly in living spaces and dining areas.

## Tips for Balanced Decor

- Avoid overcrowding — quality pieces have more impact than quantity
- Mix traditional and contemporary styles for a fresh look
- Include natural elements like plants and wood
- Ensure decor items are halal-appropriate for your household
- Change seasonal accents while keeping core pieces timeless

## Shop Our Collection

Browse our curated selection of Islamic home decor items, from prayer accessories to wall art, designed to beautify your space and strengthen your connection to faith.`,
  },
  "perfume-in-islam-sunnah-fragrances": {
    title: "Perfume in Islam: A Guide to Sunnah Fragrances",
    excerpt: "Learn about the importance of fragrance in Islamic tradition and discover our collection of alcohol-free, Sunnah-inspired perfumes.",
    author: "Abdullahi Ibrahim",
    date: "May 18, 2026",
    readTime: "5 min read",
    category: "Lifestyle",
    tags: ["Perfume", "Sunnah", "Fragrance", "Islamic Lifestyle"],
    content: `## The Sunnah of Fragrance

The Prophet Muhammad (peace be upon him) loved good fragrance and encouraged Muslims to wear perfume. Using pleasant scents is a way of following the Sunnah and spreading goodness.

## Types of Halal Fragrances

### Perfume oils (attar)

Traditional perfume oils are alcohol-free and concentrated, lasting much longer than spray perfumes. These are the preferred form in Islamic tradition.

### Bakhoor and oud

Incense and oud chips have been used in Muslim households for centuries. They scent the home and clothing with rich, warm fragrances.

### Body mists

Light, alcohol-free body mists are perfect for daily use, providing a fresh scent without being overpowering.

## Recommended Sunnah Scents

### Oud (agarwood)

The king of fragrances, oud is mentioned in numerous hadith and is deeply rooted in Islamic culture. Its rich, woody scent is beloved worldwide.

### Musk

Traditional musk has a warm, animalic scent that blends beautifully with other fragrances. Many scholars consider it among the best of scents.

### Amber

Sweet and resinous, amber creates a warm, inviting atmosphere. It works well as both a personal fragrance and home scent.

### Rose

The scent of roses is associated with paradise in Islamic tradition. Rose-based fragrances are universally loved and appropriate for all occasions.

## Etiquette of Wearing Perfume

### For men and women

Both men and women are encouraged to wear good fragrance. The Prophet (peace be upon him) said: "Whoever can afford it, let him buy oud for himself."

### Moderation is key

Apply fragrance moderately — enough to be pleasant, not so much as to overwhelm others. The goal is to spread good scent, not create discomfort.

## Our Collection

Discover our range of alcohol-free, halal-certified fragrances inspired by traditional Sunnah scents. Each perfume is carefully crafted using quality ingredients.`,
  },
  "teaching-kids-islamic-values": {
    title: "10 Fun Ways to Teach Islamic Values to Children",
    excerpt: "Practical tips and product recommendations for parents who want to instill Islamic values in their children through play and daily activities.",
    author: "Fatima Hassan",
    date: "May 14, 2026",
    readTime: "8 min read",
    category: "Parenting",
    tags: ["Parenting", "Children", "Islamic Education", "Family"],
    content: `## Making Islamic Learning Fun

Teaching children about Islam doesn't have to be formal or boring. Through creative activities and daily routines, you can instill Islamic values naturally and joyfully.

## 1. Story Time with Prophetic Stories

Read age-appropriate stories about the prophets (peace be upon them all). Use colorful Islamic storybooks that bring these narratives to life for young minds.

## 2. Prayer Buddy System

Pray together as a family. Let children imitate your movements and gradually learn the words. Making salah a family activity builds lifelong habits.

## 3. Quran Learning Games

Use flashcards, apps, and interactive games to teach Arabic letters and Quranic verses. Short daily sessions are more effective than long, infrequent ones.

## 4. Charity Jar

Create a family charity jar where children can contribute their pocket money. Let them choose where the money goes, teaching generosity and compassion.

## 5. Islamic Art and Crafts

Encourage creativity through Islamic geometric art, calligraphy practice, and mosque models. These activities teach art while reinforcing Islamic concepts.

## 6. Nature Walks with Creator Awareness

Take nature walks and discuss how Allah SWT created everything. Point out flowers, animals, and stars as signs of Allah's greatness.

## 7. Cooking Together

Involve children in preparing halal meals, especially for special occasions like Ramadan and Eid. Cooking teaches patience, gratitude, and family bonding.

## 8. Ramadan Countdown Calendar

Create an advent-style calendar for Ramadan with daily activities, good deeds, and small gifts. This builds excitement and understanding of the blessed month.

## 9. Kindness Challenges

Set weekly kindness challenges for children: help a neighbor, share with siblings, say something nice to someone. Track their progress and celebrate achievements.

## 10. Islamic Bedroom Decor

Surround children with positive Islamic imagery — children's Quran posters, Islamic wall art, and books in their rooms create an environment of faith.

## Tips for Success

- Be patient — learning is a journey
- Lead by example — children learn from what they see
- Make dua for your children regularly
- Celebrate small achievements
- Keep the conversation about faith open and ongoing`,
  },
  "sustainable-fashion-in-islam": {
    title: "Sustainable Fashion in Islam: Caring for the Earth",
    excerpt: "Explore how Islamic principles of environmental stewardship align with sustainable fashion choices.",
    author: "Yusuf Ahmad",
    date: "May 10, 2026",
    readTime: "5 min read",
    category: "Fashion",
    tags: ["Sustainable Fashion", "Environmental", "Islamic Values", "Ethical Shopping"],
    content: `## Islam and Environmental Stewardship

Islam teaches that humans are khalifah (stewards) of the earth. Caring for the environment is not just a worldly concern — it's a religious obligation that extends to every aspect of our lives, including how we dress.

## The Problem with Fast Fashion

Fast fashion's environmental impact is enormous — from water pollution to textile waste. As Muslims, we must consider the ethical and environmental implications of our consumption habits.

## Islamic Principles for Sustainable Fashion

### Quality over quantity

The Prophet (peace be upon him) valued quality in clothing and possessions. Investing in well-made garments that last longer aligns with this principle.

### Avoiding excess (israf)

Islam discourages wastefulness and excess. A mindful approach to fashion — buying only what we need — reflects Islamic values of moderation.

### Kindness to creation

Choosing ethically produced clothing that doesn't exploit workers or harm the environment demonstrates compassion for all of Allah's creation.

## Practical Steps

### Buy less, choose well

Invest in quality pieces that last years rather than trendy items that fall apart after a few washes.

### Support ethical brands

Look for brands that use sustainable materials, fair labor practices, and environmentally responsible production methods.

### Care for your clothes

Proper washing, storage, and repair extends the life of your garments. Even small repairs can save perfectly good clothing from landfills.

### Swap and share

Organize clothing swaps with friends and family. Giving away clothes you no longer need is both charitable and sustainable.

### Choose natural fibers

Cotton, linen, wool, and bamboo are biodegradable alternatives to synthetic fabrics that shed microplastics.

## Building a Sustainable Wardrobe

Start with a capsule wardrobe of versatile, quality pieces in coordinating colors. This reduces decision fatigue and ensures every item gets worn.

## Our Commitment

At Amir Islamic Collections, we prioritize quality and durability in our clothing selections. We believe in offering pieces that combine modest fashion with sustainable practices.`,
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
