import { pgTable, uuid, integer, decimal, date, uniqueIndex } from "drizzle-orm/pg-core";

export const analytics = pgTable("analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull(),
  visitors: integer("visitors").default(0).notNull(),
  pageViews: integer("page_views").default(0).notNull(),
  sales: integer("sales").default(0).notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0").notNull(),
  newUsers: integer("new_users").default(0).notNull(),
  newSellers: integer("new_sellers").default(0).notNull(),
  orders: integer("orders").default(0).notNull(),
}, (table) => [
  uniqueIndex("analytics_date_unique").on(table.date),
]);
