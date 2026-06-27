import { pgTable, uuid, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

export const tokenTypeEnum = pgEnum("token_type", ["email_verification", "password_reset"]);

export type TokenType = (typeof tokenTypeEnum.enumValues)[number];

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  type: tokenTypeEnum("type").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("verification_tokens_token_idx").on(table.token),
  index("verification_tokens_email_idx").on(table.email),
  index("verification_tokens_expires_at_idx").on(table.expiresAt),
]);
