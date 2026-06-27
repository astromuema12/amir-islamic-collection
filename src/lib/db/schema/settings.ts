import { pgTable, text, varchar, integer, json, timestamp } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  siteName: varchar("site_name", { length: 255 }).notNull(),
  siteDescription: text("site_description"),
  logo: text("logo"),
  favicon: text("favicon"),
  primaryColor: varchar("primary_color", { length: 7 }),
  supportEmail: varchar("support_email", { length: 255 }),
  supportPhone: varchar("support_phone", { length: 20 }),
  socialLinks: json("social_links").$type<{
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  }>().default({}),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  paymentProviders: json("payment_providers").$type<{
    paystack?: { publicKey: string; secretKey: string };
    flutterwave?: { publicKey: string; secretKey: string };
  }>().default({}),
  shippingSettings: json("shipping_settings").$type<{
    freeShippingThreshold?: number;
    standardRate?: number;
    expressRate?: number;
  }>().default({}),
  emailSettings: json("email_settings").$type<{
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    fromEmail?: string;
    fromName?: string;
  }>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
