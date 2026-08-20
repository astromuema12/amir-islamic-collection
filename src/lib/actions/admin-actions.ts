"use server";

import { db, getRlsDb } from "@/lib/db";
import {
  users, products, orders, categories, brands, orderItems, addresses,
  sellerProfiles, coupons, blogs, reviews, analytics, settings,
  withdrawals, notifications, sessions, wishlists, cart,
  auditLogs, roles, permissions, rolePermissions, userRoles,
  type OrderStatus, type PaymentStatus,
} from "@/lib/db/schema";
import { eq, and, desc, asc, sql, gte, inArray, type SQL } from "drizzle-orm";
import { productRepository } from "@/lib/repositories/product-repository";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { unstable_cache, revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "@/lib/cache-tags";

async function requireAdmin() {
  const { requireRole } = await import("@/lib/auth");
  return requireRole("admin", "super_admin");
}

async function requireSuperAdmin() {
  const { requireRole } = await import("@/lib/auth");
  return requireRole("super_admin");
}

const fetchDashboardData = unstable_cache(
  async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      [userCount],
      [sellerCount],
      [productCount],
      [orderCount],
      [revenue],
      [pendingSellers],
      recentOrders,
      recentUsers,
      lowInventoryProducts,
      revenueChart,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),

      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`${users.role} IN ('seller', 'admin', 'super_admin')`),

      db.select({ count: sql<number>`count(*)` }).from(products),

      db.select({ count: sql<number>`count(*)` }).from(orders),

      db
        .select({
          total: sql<string>`COALESCE(SUM(CAST(${orders.total} AS numeric)), '0')`,
        })
        .from(orders)
        .where(eq(orders.status, "delivered")),

      db
        .select({ count: sql<number>`count(*)` })
        .from(sellerProfiles)
        .where(eq(sellerProfiles.isVerified, false)),

      db
        .select({
          id: orders.id,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
          userId: orders.userId,
          userName: users.name,
        })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .orderBy(desc(orders.createdAt))
        .limit(8),

      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(5),

      productRepository.getLowInventoryProducts(6),

      db
        .select({
          date: analytics.date,
          revenue: analytics.revenue,
          orders: analytics.orders,
          sales: analytics.sales,
        })
        .from(analytics)
        .where(gte(analytics.date, thirtyDaysAgo.toISOString().split("T")[0]))
        .orderBy(desc(analytics.date)),
    ]);

    return {
      stats: {
        totalUsers: Number(userCount.count),
        totalSellers: Number(sellerCount.count),
        totalProducts: Number(productCount.count),
        totalOrders: Number(orderCount.count),
        totalRevenue: Number(revenue.total),
        pendingSellers: Number(pendingSellers.count),
      },
      recentOrders,
      recentUsers,
      lowInventoryProducts,
      revenueChart: revenueChart.reverse(),
    };
  },
  ["admin-dashboard"],
  { tags: [CACHE_TAGS.dashboard], revalidate: CACHE_TTL.dashboard },
);

export async function getAdminDashboard() {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin", "super_admin");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "Unauthorized" || message === "Forbidden") {
      console.warn(`[admin-dashboard] Auth rejected: ${message}`);
      return { error: "auth", message } as const;
    }
    console.error("[admin-dashboard] Unexpected auth error:", error);
    return { error: "server", message: "Authentication check failed." } as const;
  }

  try {
    return await fetchDashboardData();
  } catch (error) {
    console.error("[admin-dashboard] Failed to load dashboard data:", error);
    return {
      error: "server",
      message:
        error instanceof Error ? error.message : "Failed to load dashboard data.",
    } as const;
  }
}

export async function getUsers(options?: { search?: string; role?: string; page?: number; limit?: number }) {
  try {
    await requireAdmin();

    const conditions: ReturnType<typeof eq>[] = [];
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    if (options?.search) {
      conditions.push(sql`(${users.name} ILIKE ${`%${options.search}%`} OR ${users.email} ILIKE ${`%${options.search}%`})`);
    }

    if (options?.role) {
      conditions.push(eq(users.role, options.role as "user" | "seller" | "admin" | "super_admin"));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(where);

    return {
      users: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getUsers failed:", error);
    return { users: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requireSuperAdmin();

    const validRoles = ["user", "seller", "admin", "super_admin"];
    if (!validRoles.includes(role)) return { error: "Invalid role" };

    await db
      .update(users)
      .set({ role: role as typeof users.$inferSelect.role, updatedAt: new Date() })
      .where(eq(users.id, userId));

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update user role" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const admin = await requireAdmin();

    const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existing) return { error: "User not found" };

    if (existing.id === admin.id) {
      return { error: "You cannot delete your own account" };
    }
    if (existing.role === "super_admin" && admin.role !== "super_admin") {
      return { error: "Only a super admin can delete another super admin" };
    }
    if (existing.role === "super_admin") {
      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, "super_admin"));
      if (Number(countResult.count) <= 1) {
        return { error: "Cannot delete the last super admin" };
      }
    }

    const rlsDb = getRlsDb();
    await rlsDb.transaction(async (tx) => {
      const sellerProducts = await tx
        .select({ id: products.id })
        .from(products)
        .where(eq(products.sellerId, userId));

      if (sellerProducts.length > 0) {
        await tx.delete(orderItems).where(inArray(orderItems.productId, sellerProducts.map((p) => p.id)));
      }

      await tx.delete(orders).where(eq(orders.userId, userId));
      await tx.delete(withdrawals).where(eq(withdrawals.sellerId, userId));
      await tx.delete(blogs).where(eq(blogs.authorId, userId));
      await tx.delete(products).where(eq(products.sellerId, userId));
      await tx.delete(cart).where(eq(cart.userId, userId));
      await tx.delete(addresses).where(eq(addresses.userId, userId));
      await tx.delete(reviews).where(eq(reviews.userId, userId));
      await tx.delete(sellerProfiles).where(eq(sellerProfiles.userId, userId));
      await tx.delete(sessions).where(eq(sessions.userId, userId));
      await tx.delete(notifications).where(eq(notifications.userId, userId));
      await tx.delete(wishlists).where(eq(wishlists.userId, userId));
      await tx.delete(userRoles).where(eq(userRoles.userId, userId));
      await tx.delete(auditLogs).where(eq(auditLogs.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });

    updateTag(CACHE_TAGS.dashboard);
    revalidatePath("/admin/customers");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/admin/sellers");
    revalidatePath("/admin/dashboard");
    return { success: true, deleted: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete user";
    return { error: msg };
  }
}

export async function verifySeller(sellerId: string, verified: boolean) {
  try {
    await requireAdmin();

    await db
      .update(sellerProfiles)
      .set({ isVerified: verified })
      .where(eq(sellerProfiles.id, sellerId));

    revalidatePath("/admin/sellers");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to verify seller" };
  }
}

export async function getSellers(options?: {
  search?: string;
  verified?: "verified" | "pending";
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(
        sql`(${sellerProfiles.storeName} ILIKE ${`%${options.search}%`} OR ${users.name} ILIKE ${`%${options.search}%`} OR ${users.email} ILIKE ${`%${options.search}%`})`
      );
    }
    if (options?.verified === "verified") {
      conditions.push(eq(sellerProfiles.isVerified, true));
    }
    if (options?.verified === "pending") {
      conditions.push(eq(sellerProfiles.isVerified, false));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: sellerProfiles.id,
        userId: sellerProfiles.userId,
        storeName: sellerProfiles.storeName,
        storeSlug: sellerProfiles.storeSlug,
        description: sellerProfiles.description,
        logo: sellerProfiles.logo,
        banner: sellerProfiles.banner,
        phone: sellerProfiles.phone,
        address: sellerProfiles.address,
        city: sellerProfiles.city,
        state: sellerProfiles.state,
        country: sellerProfiles.country,
        isVerified: sellerProfiles.isVerified,
        rating: sellerProfiles.rating,
        totalSales: sellerProfiles.totalSales,
        balance: sellerProfiles.balance,
        createdAt: sellerProfiles.createdAt,
        ownerName: users.name,
        ownerEmail: users.email,
        productCount: sql<number>`(
          SELECT COUNT(*) FROM ${products}
          WHERE ${products.sellerId} = ${sellerProfiles.userId}
        )`,
      })
      .from(sellerProfiles)
      .innerJoin(users, eq(sellerProfiles.userId, users.id))
      .where(where)
      .orderBy(desc(sellerProfiles.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(sellerProfiles)
      .where(where);

    return {
      sellers: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getSellers failed:", error);
    return { sellers: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function manageCategory(formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const parentId = formData.get("parentId") as string;
    const isActive = formData.get("isActive") !== "false";

    if (!name) return { error: "Category name is required" };

    if (id) {
      await db
        .update(categories)
        .set({
          name,
          slug: slugify(name, { lower: true, strict: true }),
          description: description || null,
          image: image || null,
          parentId: parentId || null,
          isActive,
        })
        .where(eq(categories.id, id));
    } else {
      await db.insert(categories).values({
        id: uuidv4(),
        name,
        slug: slugify(name, { lower: true, strict: true }) + "-" + Date.now().toString(36),
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        isActive,
      });
    }

    updateTag(CACHE_TAGS.categories);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to manage category" };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await requireAdmin();

    await db.delete(categories).where(eq(categories.id, categoryId));
    updateTag(CACHE_TAGS.categories);
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete category" };
  }
}

export async function manageCoupon(formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get("id") as string;
    const code = formData.get("code") as string;
    const type = formData.get("type") as string;
    const value = Number(formData.get("value"));
    const minOrderAmount = formData.get("minOrderAmount") ? Number(formData.get("minOrderAmount")) : null;
    const maxDiscount = formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : null;
    const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;
    const expiresAt = formData.get("expiresAt") as string;

    if (!code || !type || !value) return { error: "Code, type, and value are required" };
    if (!["percentage", "fixed"].includes(type)) return { error: "Invalid coupon type" };

    const isActive = formData.get("isActive") !== "false";

    const couponData = {
      code: code.toUpperCase(),
      type: type as "percentage" | "fixed",
      value: value.toString(),
      minOrderAmount: minOrderAmount?.toString() || null,
      maxDiscount: maxDiscount?.toString() || null,
      usageLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive,
    };

    if (id) {
      await db.update(coupons).set(couponData).where(eq(coupons.id, id));
    } else {
      await db.insert(coupons).values({ id: uuidv4(), ...couponData });
    }

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to manage coupon" };
  }
}

export async function deleteCoupon(couponId: string) {
  try {
    await requireAdmin();

    await db.delete(coupons).where(eq(coupons.id, couponId));
    revalidatePath("/admin/coupons");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete coupon" };
  }
}

export async function manageBlog(formData: FormData) {
  try {
    const user = await requireAdmin();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [];
    const published = formData.get("published") === "true";
    const image = formData.get("image") as string;

    if (!title || !content) return { error: "Title and content are required" };

    if (id) {
      await db
        .update(blogs)
        .set({
          title,
          slug: slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString(36),
          content,
          excerpt: excerpt || null,
          image: image || null,
          tags,
          published,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, id));
    } else {
      await db.insert(blogs).values({
        id: uuidv4(),
        title,
        slug: slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString(36),
        content,
        excerpt: excerpt || null,
        image: image || null,
        authorId: user.id,
        tags,
        published,
      });
    }

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to manage blog" };
  }
}

export async function deleteBlog(blogId: string) {
  try {
    await requireAdmin();

    await db.delete(blogs).where(eq(blogs.id, blogId));
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete blog" };
  }
}

export async function getAllOrders(options?: { status?: string; page?: number; limit?: number }) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof eq>[] = [];
    if (options?.status) {
      conditions.push(eq(orders.status, options.status as typeof orders.$inferSelect.status));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(where);

    return {
      orders: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getAllOrders failed:", error);
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getPendingReviews() {
  try {
    await requireAdmin();

    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.isApproved, false))
      .orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error("[admin-actions] getPendingReviews failed:", error);
    return [];
  }
}

export async function getWithdrawalRequests() {
  try {
    await requireAdmin();

    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"))
      .orderBy(desc(withdrawals.createdAt));
  } catch (error) {
    console.error("[admin-actions] getWithdrawalRequests failed:", error);
    return [];
  }
}

export async function updateWithdrawalStatus(withdrawalId: string, status: string) {
  try {
    await requireAdmin();

    const validStatuses = ["approved", "rejected", "completed"];
    if (!validStatuses.includes(status)) return { error: "Invalid status" };

    await db
      .update(withdrawals)
      .set({ status: status as "approved" | "rejected" | "completed" })
      .where(eq(withdrawals.id, withdrawalId));

    revalidatePath("/admin/withdrawals");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update withdrawal status" };
  }
}

export async function updateSettings(formData: FormData) {
  try {
    await requireSuperAdmin();

    const siteName = formData.get("siteName") as string;
    const siteDescription = formData.get("siteDescription") as string;
    const logo = formData.get("logo") as string;
    const favicon = formData.get("favicon") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const supportEmail = formData.get("supportEmail") as string;
    const supportPhone = formData.get("supportPhone") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;

    const [existing] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);

    const socialLinks = { ...(existing?.socialLinks || {}) };
    if (formData.has("facebook")) socialLinks.facebook = formData.get("facebook") as string || undefined;
    if (formData.has("twitter")) socialLinks.twitter = formData.get("twitter") as string || undefined;
    if (formData.has("instagram")) socialLinks.instagram = formData.get("instagram") as string || undefined;
    if (formData.has("youtube")) socialLinks.youtube = formData.get("youtube") as string || undefined;
    if (formData.has("whatsapp")) socialLinks.whatsapp = formData.get("whatsapp") as string || undefined;

    const paymentProviders = { ...(existing?.paymentProviders || {}) };
    if (formData.has("paystackPublicKey") || formData.has("paystackSecretKey")) {
      paymentProviders.paystack = {
        publicKey: (formData.get("paystackPublicKey") as string) || "",
        secretKey: (formData.get("paystackSecretKey") as string) || "",
      };
    }
    if (formData.has("flutterwavePublicKey") || formData.has("flutterwaveSecretKey")) {
      paymentProviders.flutterwave = {
        publicKey: (formData.get("flutterwavePublicKey") as string) || "",
        secretKey: (formData.get("flutterwaveSecretKey") as string) || "",
      };
    }

    const shippingSettings = { ...(existing?.shippingSettings || {}) };
    if (formData.has("freeShippingThreshold")) {
      shippingSettings.freeShippingThreshold = Number(formData.get("freeShippingThreshold")) || undefined;
    }
    if (formData.has("standardRate")) {
      shippingSettings.standardRate = Number(formData.get("standardRate")) || undefined;
    }
    if (formData.has("expressRate")) {
      shippingSettings.expressRate = Number(formData.get("expressRate")) || undefined;
    }

    const emailSettings = { ...(existing?.emailSettings || {}) };
    if (formData.has("fromEmail")) emailSettings.fromEmail = formData.get("fromEmail") as string || undefined;
    if (formData.has("fromName")) emailSettings.fromName = formData.get("fromName") as string || undefined;
    if (formData.has("smtpHost")) emailSettings.smtpHost = formData.get("smtpHost") as string || undefined;

    const updateData: Record<string, unknown> = {};
    if (siteName) updateData.siteName = siteName;
    if (siteDescription) updateData.siteDescription = siteDescription;
    if (logo) updateData.logo = logo;
    if (favicon) updateData.favicon = favicon;
    if (primaryColor) updateData.primaryColor = primaryColor;
    if (supportEmail) updateData.supportEmail = supportEmail;
    if (supportPhone) updateData.supportPhone = supportPhone;
    if (seoTitle) updateData.seoTitle = seoTitle;
    if (seoDescription) updateData.seoDescription = seoDescription;
    updateData.socialLinks = socialLinks;
    updateData.paymentProviders = paymentProviders;
    updateData.shippingSettings = shippingSettings;
    updateData.emailSettings = emailSettings;

    if (Object.keys(updateData).length === 0) return { error: "No settings to update" };

    await db.update(settings).set({ ...updateData, updatedAt: new Date() }).where(eq(settings.id, 1));

    revalidatePath("/admin/settings");
    revalidatePath("/admin/SEO");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update settings" };
  }
}

export async function getAnalyticsData(period: "daily" | "weekly" | "monthly" = "monthly") {
  try {
    await requireAdmin();

    const now = new Date();
    let startDate: Date;
    if (period === "daily") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === "weekly") {
      startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
    }

    const result = await db
      .select()
      .from(analytics)
      .where(gte(analytics.date, startDate.toISOString().split("T")[0]))
      .orderBy(desc(analytics.date))
      .limit(30);

    return result;
  } catch (error) {
    console.error("[getAnalyticsData] Failed to fetch analytics:", error);
    return [];
  }
}

export async function sendNotification(userId: string, title: string, message: string, type = "admin") {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin", "super_admin");

    await db.insert(notifications).values({
      id: uuidv4(),
      userId,
      title,
      message,
      type,
    });

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to send notification" };
  }
}

export async function getAdminProducts(options?: {
  search?: string;
  categoryId?: string;
  status?: "active" | "inactive";
  featured?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(
        sql`(${products.name} ILIKE ${`%${options.search}%`} OR ${products.sku} ILIKE ${`%${options.search}%`})`
      );
    }
    if (options?.categoryId) {
      conditions.push(eq(products.categoryId, options.categoryId));
    }
    if (options?.status === "active") {
      conditions.push(eq(products.isActive, true));
    }
    if (options?.status === "inactive") {
      conditions.push(eq(products.isActive, false));
    }
    if (options?.featured !== undefined) {
      conditions.push(eq(products.isFeatured, options.featured));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        price: products.price,
        discountPrice: products.discountPrice,
        stock: products.stock,
        images: products.images,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        salesCount: products.salesCount,
        averageRating: products.averageRating,
        categoryId: products.categoryId,
        categoryName: categories.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(where);

    return {
      products: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getAdminProducts failed:", error);
    return { products: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getAdminCategories() {
  try {
    await requireAdmin();

    return await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parentId,
        isActive: categories.isActive,
      })
      .from(categories)
      .orderBy(asc(categories.name));
  } catch (error) {
    console.error("[admin-actions] getAdminCategories failed:", error);
    return [];
  }
}

export async function getAdminBrands() {
  try {
    await requireAdmin();

    return await db
      .select({ id: brands.id, name: brands.name, slug: brands.slug })
      .from(brands)
      .orderBy(asc(brands.name));
  } catch (error) {
    console.error("[admin-actions] getAdminBrands failed:", error);
    return [];
  }
}

export async function getAdminOrders(options?: {
  status?: string;
  payment?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.status) {
      conditions.push(eq(orders.status, options.status as OrderStatus));
    }
    if (options?.payment) {
      conditions.push(eq(orders.paymentStatus, options.payment as PaymentStatus));
    }
    if (options?.search) {
      conditions.push(
        sql`(${orders.id}::text ILIKE ${`%${options.search}%`} OR ${users.name} ILIKE ${`%${options.search}%`} OR ${users.email} ILIKE ${`%${options.search}%`})`
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: orders.id,
        total: orders.total,
        subtotal: orders.subtotal,
        shipping: orders.shipping,
        tax: orders.tax,
        discount: orders.discount,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        couponCode: orders.couponCode,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        userId: orders.userId,
        customerName: users.name,
        customerEmail: users.email,
        itemCount: sql<number>`(
          SELECT COALESCE(SUM(${orderItems.quantity}), 0)
          FROM ${orderItems}
          WHERE ${orderItems.orderId} = ${orders.id}
        )`,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(where);

    return {
      orders: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getAdminOrders failed:", error);
    return { orders: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getAdminOrderById(orderId: string) {
  try {
    await requireAdmin();

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return null;

    const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .orderBy(asc(orderItems.createdAt));

    const [shippingAddress] = order.shippingAddressId
      ? await db.select().from(addresses).where(eq(addresses.id, order.shippingAddressId)).limit(1)
      : [null];
    const [billingAddress] = order.billingAddressId
      ? await db.select().from(addresses).where(eq(addresses.id, order.billingAddressId)).limit(1)
      : [null];

    return { order, user, items, shippingAddress, billingAddress };
  } catch (error) {
    console.error("[admin-actions] getAdminOrderById failed:", error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
  try {
    await requireAdmin();

    const valid = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];
    if (!valid.includes(status)) return { error: "Invalid status" };

    await db
      .update(orders)
      .set({
        status: status as OrderStatus,
        trackingNumber: trackingNumber === undefined ? undefined : trackingNumber,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update order status" };
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  try {
    await requireAdmin();

    const valid = ["pending", "completed", "failed", "refunded"];
    if (!valid.includes(paymentStatus)) return { error: "Invalid payment status" };

    await db
      .update(orders)
      .set({
        paymentStatus: paymentStatus as PaymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update payment status" };
  }
}

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  productCount: number;
  children: CategoryNode[];
}

export async function getCategoryTree() {
  try {
    await requireAdmin();

    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        parentId: categories.parentId,
        isActive: categories.isActive,
        productCount: sql<number>`(
          SELECT COUNT(*) FROM ${products}
          WHERE ${products.categoryId} = ${categories.id}
        )`,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    const map = new Map<string, CategoryNode>();
    rows.forEach((row) =>
      map.set(row.id, { ...row, productCount: Number(row.productCount), children: [] })
    );

    const roots: CategoryNode[] = [];
    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  } catch (error) {
    console.error("[admin-actions] getCategoryTree failed:", error);
    return [];
  }
}

export async function toggleCategoryActive(categoryId: string, isActive: boolean) {
  try {
    await requireAdmin();

    await db
      .update(categories)
      .set({ isActive })
      .where(eq(categories.id, categoryId));

    updateTag(CACHE_TAGS.categories);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle category" };
  }
}

export async function getCoupons(options?: { search?: string; page?: number; limit?: number }) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(sql`${coupons.code} ILIKE ${`%${options.search}%`}`);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(coupons)
      .where(where)
      .orderBy(desc(coupons.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons)
      .where(where);

    return {
      coupons: result.map((c) => ({
        ...c,
        value: Number(c.value),
        minOrderAmount: c.minOrderAmount === null ? null : Number(c.minOrderAmount),
        maxDiscount: c.maxDiscount === null ? null : Number(c.maxDiscount),
      })),
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getCoupons failed:", error);
    return { coupons: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function toggleCouponActive(couponId: string, isActive: boolean) {
  try {
    await requireAdmin();

    await db
      .update(coupons)
      .set({ isActive })
      .where(eq(coupons.id, couponId));

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle coupon" };
  }
}

export async function getBlogs(options?: { search?: string; page?: number; limit?: number }) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(sql`${blogs.title} ILIKE ${`%${options.search}%`}`);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        content: blogs.content,
        image: blogs.image,
        published: blogs.published,
        tags: blogs.tags,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        authorId: blogs.authorId,
        authorName: users.name,
      })
      .from(blogs)
      .innerJoin(users, eq(blogs.authorId, users.id))
      .where(where)
      .orderBy(desc(blogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogs)
      .where(where);

    return {
      posts: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getBlogs failed:", error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function toggleBlogPublished(blogId: string, published: boolean) {
  try {
    await requireAdmin();

    await db
      .update(blogs)
      .set({ published, updatedAt: new Date() })
      .where(eq(blogs.id, blogId));

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to toggle blog" };
  }
}

export async function getReviews(options?: {
  search?: string;
  status?: "approved" | "pending";
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(
        sql`(${reviews.content} ILIKE ${`%${options.search}%`} OR ${products.name} ILIKE ${`%${options.search}%`} OR ${users.name} ILIKE ${`%${options.search}%`})`
      );
    }
    if (options?.status === "approved") {
      conditions.push(eq(reviews.isApproved, true));
    }
    if (options?.status === "pending") {
      conditions.push(eq(reviews.isApproved, false));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        isApproved: reviews.isApproved,
        createdAt: reviews.createdAt,
        productId: reviews.productId,
        productName: products.name,
        userId: reviews.userId,
        userName: users.name,
        userImage: users.image,
      })
      .from(reviews)
      .innerJoin(products, eq(reviews.productId, products.id))
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(where)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(where);

    return {
      reviews: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getReviews failed:", error);
    return { reviews: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getSettings() {
  try {
    await requireAdmin();

    const [row] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    return row ?? null;
  } catch (error) {
    console.error("[admin-actions] getSettings failed:", error);
    return null;
  }
}

export async function sendBulkNotification(
  target: "all" | "users" | "sellers" | "specific",
  title: string,
  message: string,
  userId?: string
) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin", "super_admin");

    if (!title || !message) return { error: "Title and message are required" };

    let userIds: string[] = [];
    if (target === "specific") {
      if (!userId) return { error: "Select a user" };
      userIds = [userId];
    } else if (target === "sellers") {
      const rows = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`${users.role} IN ('seller', 'admin', 'super_admin')`);
      userIds = rows.map((r) => r.id);
    } else if (target === "users") {
      const rows = await db.select({ id: users.id }).from(users).where(eq(users.role, "user"));
      userIds = rows.map((r) => r.id);
    } else {
      const rows = await db.select({ id: users.id }).from(users);
      userIds = rows.map((r) => r.id);
    }

    if (userIds.length === 0) return { error: "No recipients found" };

    await db.insert(notifications).values(
      userIds.map((id) => ({ id: uuidv4(), userId: id, title, message, type: "admin" }))
    );

    return { success: true, count: userIds.length };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to send notification" };
  }
}

export async function getNotifications(options?: { page?: number; limit?: number }) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        createdAt: notifications.createdAt,
        userId: notifications.userId,
        userName: users.name,
      })
      .from(notifications)
      .innerJoin(users, eq(notifications.userId, users.id))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications);

    return {
      notifications: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getNotifications failed:", error);
    return { notifications: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getAuditLogs(options?: {
  search?: string;
  action?: string;
  entity?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const page = options?.page || 1;
    const limit = options?.limit || 15;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (options?.search) {
      conditions.push(
        sql`(${users.name} ILIKE ${`%${options.search}%`} OR ${auditLogs.entityId} ILIKE ${`%${options.search}%`} OR ${auditLogs.action} ILIKE ${`%${options.search}%`})`
      );
    }
    if (options?.action && options.action !== "all") {
      conditions.push(eq(auditLogs.action, options.action));
    }
    if (options?.entity && options.entity !== "all") {
      conditions.push(eq(auditLogs.entity, options.entity));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        userId: auditLogs.userId,
        userName: users.name,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(where);

    return {
      logs: result,
      total: Number(countResult.count),
      page,
      totalPages: Math.ceil(Number(countResult.count) / limit),
    };
  } catch (error) {
    console.error("[admin-actions] getAuditLogs failed:", error);
    return { logs: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getRolesWithPermissions() {
  try {
    await requireAdmin();

    const roleRows = await db.select().from(roles).orderBy(asc(roles.name));

    const permRows = await db
      .select({
        roleId: rolePermissions.roleId,
        name: permissions.name,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

    const countRows = await db
      .select({
        roleId: userRoles.roleId,
        count: sql<number>`count(*)`,
      })
      .from(userRoles)
      .groupBy(userRoles.roleId);

    return roleRows.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      userCount: Number(countRows.find((c) => c.roleId === role.id)?.count || 0),
      permissions: permRows.filter((p) => p.roleId === role.id).map((p) => p.name),
    }));
  } catch (error) {
    console.error("[admin-actions] getRolesWithPermissions failed:", error);
    return [];
  }
}

export async function getAllPermissions() {
  try {
    await requireAdmin();

    return await db.select().from(permissions).orderBy(asc(permissions.name));
  } catch (error) {
    console.error("[admin-actions] getAllPermissions failed:", error);
    return [];
  }
}

export async function manageRole(formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    let perms: string[] = [];
    const rawPerms = formData.get("permissions") as string;
    if (rawPerms) {
      try {
        perms = JSON.parse(rawPerms);
      } catch {
        return { error: "Invalid permissions payload" };
      }
    }

    if (!name) return { error: "Role name is required" };

    let roleId = id;
    if (id) {
      await db
        .update(roles)
        .set({ name, description: description || null })
        .where(eq(roles.id, id));
    } else {
      const [inserted] = await db
        .insert(roles)
        .values({ id: uuidv4(), name, description: description || null })
        .returning();
      roleId = inserted.id;
    }

    const permIds: string[] = [];
    for (const permName of perms) {
      const [existing] = await db
        .select()
        .from(permissions)
        .where(eq(permissions.name, permName))
        .limit(1);
      if (existing) {
        permIds.push(existing.id);
      } else {
        const [created] = await db
          .insert(permissions)
          .values({ id: uuidv4(), name: permName })
          .returning();
        permIds.push(created.id);
      }
    }

    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    if (permIds.length > 0) {
      await db.insert(rolePermissions).values(
        permIds.map((permissionId) => ({ id: uuidv4(), roleId, permissionId }))
      );
    }

    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to manage role" };
  }
}

export async function deleteRole(roleId: string) {
  try {
    await requireAdmin();

    await db.delete(roles).where(eq(roles.id, roleId));

    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete role" };
  }
}

export async function getUserRoleAssignments() {
  try {
    await requireAdmin();

    return await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        assignedRoleId: userRoles.roleId,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .orderBy(asc(users.name))
      .limit(100);
  } catch (error) {
    console.error("[admin-actions] getUserRoleAssignments failed:", error);
    return [];
  }
}

export async function assignUserRole(userId: string, roleId: string | null) {
  try {
    await requireAdmin();

    await db.delete(userRoles).where(eq(userRoles.userId, userId));
    if (roleId) {
      await db
        .insert(userRoles)
        .values({ id: uuidv4(), userId, roleId });
    }

    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to assign role" };
  }
}
