"use server";

import { db } from "@/lib/db";
import { users, sellerProfiles, products, orders, orderItems, withdrawals, addresses } from "@/lib/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { sellerProfileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { productRepository } from "@/lib/repositories/product-repository";

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
  } catch (error) {
    console.error("[getSellerProfile] Failed to fetch seller profile:", error);
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

    const productCount = await productRepository.countBySeller(user.id);

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
        products: productCount,
        totalSales: Number(totalSales.total),
        pendingOrders: Number(pendingOrders.count),
        balance: Number(profile.balance),
      },
      recentOrders,
    };
  } catch (error) {
    console.error("[getSellerDashboard] Failed to load dashboard:", error);
    return null;
  }
}

export async function getSellerProducts() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    return productRepository.getSellerProducts(user.id);
  } catch (error) {
    console.error("[getSellerProducts] Failed to fetch products:", error);
    return [];
  }
}

export async function getSellerOrders() {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const orderRows = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        subtotal: orders.subtotal,
        shipping: orders.shipping,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        trackingNumber: orders.trackingNumber,
        notes: orders.notes,
        customerName: users.name,
        customerEmail: users.email,
        phone: addresses.phone,
        street: addresses.street,
        city: addresses.city,
        state: addresses.state,
        country: addresses.country,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(users, eq(users.id, orders.userId))
      .innerJoin(addresses, eq(addresses.id, orders.shippingAddressId))
      .where(eq(products.sellerId, user.id))
      .orderBy(desc(orders.createdAt));

    const uniqueOrders = [...new Map(orderRows.map((row) => [row.id, row])).values()];
    if (uniqueOrders.length === 0) return [];

    const orderIds = uniqueOrders.map((o) => o.id);
    const itemRows = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        name: orderItems.productName,
        image: orderItems.productImage,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(inArray(orderItems.orderId, orderIds), eq(products.sellerId, user.id)));

    const itemsByOrder = new Map<string, typeof itemRows>();
    for (const row of itemRows) {
      const list = itemsByOrder.get(row.orderId) ?? [];
      list.push(row);
      itemsByOrder.set(row.orderId, list);
    }

    return uniqueOrders.map((row) => ({
      id: row.id,
      customer: row.customerName,
      email: row.customerEmail,
      phone: row.phone,
      address: [row.street, row.city, row.state, row.country].filter(Boolean).join(", "),
      items: (itemsByOrder.get(row.id) ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image ?? undefined,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      total: Number(row.total),
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      status: row.status,
      paymentStatus: row.paymentStatus,
      date: row.createdAt,
      trackingNumber: row.trackingNumber ?? undefined,
      notes: row.notes ?? undefined,
    }));
  } catch (error) {
    console.error("[getSellerOrders] Failed to fetch orders:", error);
    return [];
  }
}

export async function updateSellerOrderStatus(orderId: string, status: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("seller");

    const { ORDER_STATUS } = await import("@/lib/constants");
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS])) {
      return { error: "Invalid status" };
    }

    // Verify the order actually contains one of this seller's products
    const [row] = await db
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(eq(products.sellerId, user.id), eq(orders.id, orderId)))
      .limit(1);

    if (!row) {
      return { error: "Order not found" };
    }

    await db
      .update(orders)
      .set({ status: status as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS], updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath("/seller/orders");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update order status" };
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
  } catch (error) {
    console.error("[getWithdrawals] Failed to fetch withdrawals:", error);
    return [];
  }
}
