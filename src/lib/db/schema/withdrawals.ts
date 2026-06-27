import { pgTable, uuid, text, varchar, decimal, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "approved", "rejected", "completed"]);

export type WithdrawalStatus = (typeof withdrawalStatusEnum.enumValues)[number];

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: withdrawalStatusEnum("status").default("pending").notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("withdrawals_seller_id_idx").on(table.sellerId),
  index("withdrawals_status_idx").on(table.status),
]);

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  seller: one(users, {
    fields: [withdrawals.sellerId],
    references: [users.id],
  }),
}));
