import { pgTable, uuid, text, varchar, integer, boolean, timestamp, json, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { products } from "./products";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  images: json("images").$type<string[]>(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("reviews_user_product_unique").on(table.userId, table.productId),
  index("reviews_product_id_idx").on(table.productId),
  index("reviews_user_id_idx").on(table.userId),
  index("reviews_rating_idx").on(table.rating),
]);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
