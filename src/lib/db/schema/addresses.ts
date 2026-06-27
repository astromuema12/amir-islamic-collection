import { pgTable, uuid, text, varchar, boolean, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing", "both"]);

export type AddressType = (typeof addressTypeEnum.enumValues)[number];

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  street: text("street").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }),
  isDefault: boolean("is_default").default(false).notNull(),
  type: addressTypeEnum("type").default("both").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("addresses_user_id_idx").on(table.userId),
]);

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));
