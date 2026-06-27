import { pgTable, uuid, text, varchar, decimal, boolean, timestamp, json, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { brands } from "./brands";
import { users } from "./users";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("KES").notNull(),
  images: json("images").$type<string[]>().default([]).notNull(),
  videos: json("videos").$type<string[]>(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
  sellerId: uuid("seller_id").references(() => users.id).notNull(),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: varchar("dimensions", { length: 100 }),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isFlashSale: boolean("is_flash_sale").default(false).notNull(),
  flashSaleEnds: timestamp("flash_sale_ends", { withTimezone: true }),
  tags: json("tags").$type<string[]>().default([]).notNull(),
  specifications: json("specifications").$type<Record<string, string>>(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  salesCount: integer("sales_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("products_slug_idx").on(table.slug),
  index("products_category_id_idx").on(table.categoryId),
  index("products_seller_id_idx").on(table.sellerId),
  index("products_is_featured_idx").on(table.isFeatured),
  index("products_is_active_idx").on(table.isActive),
  index("products_is_flash_sale_idx").on(table.isFlashSale),
]);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));
