"use server";

import { db } from "@/lib/db";
import { users, sellerProfiles, products, orders, orderItems, withdrawals } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { sellerProfileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createSellerProfile(formData: FormData) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    if (user.role === "seller") {
      return { error: "You are already a seller" };
    }

    const raw = {
      storeName: formData.get("storeName") as string,
      description: formData.get("description") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      city: formData.get("city") as string || undefined,
      state: formData.get("state") as string || undefined,
      country: formData.get("country") as string || undefined,
    };

    const parsed = sellerProfileSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const storeSlug = slugify(parsed.data.storeName, { lower: true, strict: true }) + "-" + Date.now().toString(36);

    await db.insert(sellerProfiles).values({
      id: uuidv4(),
      userId: user.id,
      storeName: parsed.data.storeName,
      storeSlug,
      description: parsed.data.description,
      phone: parsed.data.phone,
      city: parsed.data.city,
      state: parsed.data.state,
      country: parsed.data.country,
    });

    await db
      .update(users)
      .set({ role: "seller", updatedAt: new Date() })
      .where(eq(users.id, user.id));

    revalidatePath("/seller");
    revalidatePath("/profile");

    return { success: true, storeSlug };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create seller profile" };
  }
}

export async function updateSellerProfile(formData: FormData) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const updates: Record<string, unknown> = {};

    const fields = ["storeName", "description", "phone", "city", "state", "country"];
    for (const field of fields) {
      const val = formData.get(field);
      if (val !== null) {
        updates[field] = val;
      }
    }

    const logo = formData.get("logo") as string;
    if (logo) updates.logo = logo;

    const banner = formData.get("banner") as string;
    if (banner) updates.banner = banner;

    if (formData.get("storeName")) {
      updates.storeSlug = slugify(formData.get("storeName") as string, { lower: true, strict: true }) + "-" + Date.now().toString(36);
    }

    updates.updatedAt = new Date();

    await db
      .update(sellerProfiles)
      .set(updates)
      .where(eq(sellerProfiles.userId, user.id));

    revalidatePath("/seller");
    revalidatePath("/seller/settings");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update seller profile" };
  }
}

export async function getSellerProfile() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, user.id))
      .limit(1);

    return profile || null;
  } catch {
    return null;
  }
}

export async function getSellerProfileBySlug(slug: string) {
  const [profile] = await db
    .select()
    .from(sellerProfiles)
    .where(eq(sellerProfiles.storeSlug, slug))
    .limit(1);

  if (!profile) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, profile.userId))
    .limit(1);

  return { ...profile, user };
}

export async function getSellerDashboard() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, user.id))
      .limit(1);

    if (!profile) return null;

    const [productCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.sellerId, user.id));

    const [totalSales] = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(${orders.total} AS numeric)), '0')`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(products.sellerId, user.id),
          eq(orders.status, "delivered")
        )
      );

    const [pendingOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(products.sellerId, user.id),
          eq(orders.status, "pending")
        )
      );

    const recentOrders = await db
      .select()
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.sellerId, user.id))
      .orderBy(desc(orders.createdAt))
      .limit(10);

    return {
      profile,
      stats: {
        products: Number(productCount.count),
        totalSales: Number(totalSales.total),
        pendingOrders: Number(pendingOrders.count),
        balance: Number(profile.balance),
      },
      recentOrders,
    };
  } catch {
    return null;
  }
}

export async function getSellerProducts() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, user.id))
      .orderBy(desc(products.createdAt));
  } catch {
    return [];
  }
}

export async function getSellerOrders() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const result = await db
      .select()
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.sellerId, user.id))
      .orderBy(desc(orders.createdAt));

    return result;
  } catch {
    return [];
  }
}

export async function initiateWithdrawal(formData: FormData) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, user.id))
      .limit(1);

    if (!profile) return { error: "Seller profile not found" };

    const amount = Number(formData.get("amount"));
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountName = formData.get("accountName") as string;

    if (!amount || amount <= 0) return { error: "Invalid amount" };
    if (amount > Number(profile.balance)) return { error: "Insufficient balance" };
    if (!bankName || !accountNumber || !accountName) {
      return { error: "Bank details are required" };
    }

    await db.insert(withdrawals).values({
      id: uuidv4(),
      sellerId: user.id,
      amount: amount.toString(),
      bankName,
      accountNumber,
      accountName,
    });

    await db
      .update(sellerProfiles)
      .set({
        balance: (Number(profile.balance) - amount).toString(),
      })
      .where(eq(sellerProfiles.id, profile.id));

    revalidatePath("/seller/withdrawals");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to initiate withdrawal" };
  }
}

export async function getWithdrawals() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.sellerId, user.id))
      .orderBy(desc(withdrawals.createdAt));
  } catch {
    return [];
  }
}
