"use server";

import { db } from "@/lib/db";
import {
  users, products, orders, categories, brands, orderItems, addresses,
  sellerProfiles, coupons, blogs, reviews, analytics, settings,
  withdrawals, notifications, sessions, wishlists,
  type OrderStatus, type PaymentStatus,
} from "@/lib/db/schema";
import { eq, and, desc, asc, sql, gte, type SQL } from "drizzle-orm";
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
    await requireAdmin();

    const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existing) return { error: "User not found" };

    const anonymizedEmail = `deleted-${userId}@anonymized.invalid`;
    const result = await db
      .update(users)
      .set({
        name: "Deleted Account",
        email: anonymizedEmail,
        phone: null,
        bio: null,
        image: null,
        password: null,
        emailVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    if (result.rowCount === 0) {
      return { error: "No rows affected — deletion failed" };
    }

    await db.delete(sessions).where(eq(sessions.userId, userId));
    await db.delete(notifications).where(eq(notifications.userId, userId));
    await db.delete(wishlists).where(eq(wishlists.userId, userId));

    revalidatePath("/admin/customers");
    return { success: true, deleted: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete user";
    if (msg.includes("foreign key constraint")) {
      return { error: "Cannot delete user — they have existing orders or products. Anonymize instead." };
    }
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

    const couponData = {
      code: code.toUpperCase(),
      type: type as "percentage" | "fixed",
      value: value.toString(),
      minOrderAmount: minOrderAmount?.toString() || null,
      maxDiscount: maxDiscount?.toString() || null,
      usageLimit,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
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

    if (Object.keys(updateData).length === 0) return { error: "No settings to update" };

    await db.update(settings).set(updateData).where(eq(settings.id, 1));

    revalidatePath("/admin/settings");
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
  } catch {
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
