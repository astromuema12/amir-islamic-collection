import { pgTable, uuid, text, varchar, boolean, timestamp, json, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  image: text("image"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  published: boolean("published").default(false).notNull(),
  tags: json("tags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("blogs_slug_idx").on(table.slug),
  index("blogs_author_id_idx").on(table.authorId),
  index("blogs_published_idx").on(table.published),
  index("blogs_created_at_idx").on(table.createdAt),
]);

export const blogsRelations = relations(blogs, ({ one }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
}));
