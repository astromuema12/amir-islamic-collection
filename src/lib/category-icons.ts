import { CATEGORIES } from "@/lib/constants"
import type { Category } from "@/types"

export interface CategoryIcon {
  kind: "image" | "emoji"
  value: string
}

type IconSource = Pick<Category, "name" | "slug" | "image">

const KEYWORD_ICONS: Array<[RegExp, string]> = [
  [/prayer|prayer mat|masjid|sajdah|sujud|sejadah/, "🕌"],
  [/qur.?an|quran|mushaf/, "📖"],
  [/book|literature|lecture/, "📚"],
  [/hijab|khimar|scarf|niqab|veil|headscarf/, "🧕"],
  [/abaya|jilbab|modest|dress/, "👗"],
  [/thobe|kandura|kufi|tea cup|galabia/, "👔"],
  [/perfume|attar|oud|musk|bakhoor|fragrance|it.?r|oils/, "🧴"],
  [/tasbih|misbaha|bead/, "📿"],
  [/kid|child|baby|toddler/, "👶"],
  [/home|decor|decoration|wall|art|furniture|interior/, "🏠"],
  [/ramadan|iftar|tarawih|dates/, "🌙"],
  [/eid|festive|celebration/, "🎉"],
  [/gift|box|hamper|basket/, "🎁"],
  [/digital|download|software|education/, "💻"],
  [/electroni|gadget|device/, "📱"],
  [/accessor|watch|jewellery|jewelry/, "⌚"],
  [/charity|sadaqah|zakat|donate|sadqah/, "🤲"],
  [/cloth|fashion|wear|garment|apparel/, "👕"],
]

/**
 * Resolves a category to an image URL (when the category has real imagery)
 * or a tasteful branded emoji placeholder. Falls back to category icons defined
 * in constants, then keyword matching, then the Amir default.
 */
export function getCategoryIcon(category: IconSource): CategoryIcon {
  if (category.image) return { kind: "image", value: category.image }

  const name = category.name.toLowerCase()

  for (const c of CATEGORIES) {
    if (
      (c.slug && c.slug === category.slug) ||
      (c.name && c.name.toLowerCase() === name)
    ) {
      return c.icon?.startsWith("http")
        ? { kind: "image", value: c.icon }
        : { kind: "emoji", value: c.icon || "🕌" }
    }
  }

  const combined = `${category.name} ${category.slug}`.toLowerCase()
  for (const [pattern, emoji] of KEYWORD_ICONS) {
    if (pattern.test(combined)) return { kind: "emoji", value: emoji }
  }

  return { kind: "emoji", value: "🕌" }
}