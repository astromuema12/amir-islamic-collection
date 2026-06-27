import { pgTable, uuid, text, varchar, decimal, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const sellerProfiles = pgTable("seller_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  storeSlug: varchar("store_slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: text("logo"),
  banner: text("banner"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
  productCount: integer("product_count").default(0).notNull(),
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).default("0").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("seller_profiles_user_id_idx").on(table.userId),
  index("seller_profiles_store_slug_idx").on(table.storeSlug),
]);

export const sellerProfilesRelations = relations(sellerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [sellerProfiles.userId],
    references: [users.id],
  }),
}));


