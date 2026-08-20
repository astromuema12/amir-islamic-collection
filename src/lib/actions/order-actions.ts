"use server";

import { getRlsDb } from "@/lib/db";
import { orders, orderItems, products, cart, cartItems, addresses } from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath, updateTag } from "next/cache";
import { checkoutSchema } from "@/lib/validations";
import { sendOrderConfirmation } from "@/lib/resend";
import { ORDER_STATUS, PAYMENT_STATUS, FREE_SHIPPING_THRESHOLD, TAX_RATE, SHIPPING_METHODS } from "@/lib/constants";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type CheckoutError = {
  error: string;
  code: "INSUFFICIENT_STOCK" | "OUT_OF_STOCK" | "PRODUCT_NOT_FOUND" | "CART_EMPTY" | "VALIDATION_ERROR";
  details?: Record<string, string[]>;
};

export type CheckoutSuccess = {
  success: true;
  orderId: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransactionClient = any;

async function logInventoryConflict(
  tx: TransactionClient,
  params: {
    productId: string;
    productName: string;
    requestedQuantity: number;
    availableStock: number;
    userId: string;
  }
) {
  try {
    const { auditLogs } = await import("@/lib/db/schema");
    await tx.insert(auditLogs).values({
      userId: params.userId,
      action: "inventory_conflict",
      entity: "product",
      entityId: params.productId,
      metadata: {
        productName: params.productName,
        requestedQuantity: params.requestedQuantity,
        availableStock: params.availableStock,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    console.error("[INVENTORY_CONFLICT]", JSON.stringify(params));
  }
}

export async function createOrder(formData: FormData): Promise<CheckoutSuccess | CheckoutError> {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const raw = {
      shippingAddressId: formData.get("shippingAddressId") as string,
      billingAddressId: formData.get("billingAddressId") as string,
      notes: (formData.get("notes") as string) || undefined,
      couponCode: (formData.get("couponCode") as string) || undefined,
    };

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        error: "Invalid checkout data",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const rlsDb = getRlsDb();
    const orderId = uuidv4();

    await rlsDb.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT set_config('app.current_user_id', ${user.id}::text, true)`
      );
      await tx.execute(
        sql`SELECT set_config('app.current_user_role', ${user.role}::text, true)`
      );

      const [userCart] = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, user.id))
        .limit(1);

      if (!userCart) {
        throw Object.assign(new Error("Cart is empty"), { code: "CART_EMPTY" });
      }

      const items = await tx
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, userCart.id));

      if (items.length === 0) {
        throw Object.assign(new Error("Cart is empty"), { code: "CART_EMPTY" });
      }

      const productIds = items.map((i) => i.productId);

      const lockedProducts = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds))
        .for("update");

      const productMap = new Map(lockedProducts.map((p) => [p.id, p]));

      let subtotal = 0;

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw Object.assign(
            new Error(`Product not found: ${item.productId}`),
            { code: "PRODUCT_NOT_FOUND" }
          );
        }
        if (product.stock < item.quantity) {
          await logInventoryConflict(tx, {
            productId: product.id,
            productName: product.name,
            requestedQuantity: item.quantity,
            availableStock: product.stock,
            userId: user.id,
          });

          if (product.stock === 0) {
            throw Object.assign(
              new Error(`Sorry, "${product.name}" has just sold out.`),
              { code: "OUT_OF_STOCK" }
            );
          }

          throw Object.assign(
            new Error(
              `Sorry, only ${product.stock} unit${product.stock === 1 ? "" : "s"} of "${product.name}" remain. You requested ${item.quantity}.`
            ),
            { code: "INSUFFICIENT_STOCK" }
          );
        }

        subtotal += Number(item.price) * item.quantity;
      }

      for (const item of items) {
        const product = productMap.get(item.productId)!;
        const newStock = product.stock - item.quantity;

        await tx
          .update(products)
          .set({
            stock: newStock,
            salesCount: (product.salesCount || 0) + item.quantity,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(products.id, item.productId),
              sql`${products.stock} >= ${item.quantity}`
            )
          );
      }

      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_METHODS[0].price;
      const tax = subtotal * TAX_RATE;
      const discount = 0;
      const total = subtotal + shipping + tax - discount;

      await tx.insert(orders).values({
        id: orderId,
        userId: user.id,
        status: "pending",
        total: total.toString(),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        tax: tax.toString(),
        discount: discount.toString(),
        couponCode: parsed.data.couponCode,
        shippingAddressId: parsed.data.shippingAddressId,
        billingAddressId: parsed.data.billingAddressId,
        paymentStatus: "pending",
        notes: parsed.data.notes,
      });

      for (const item of items) {
        const product = productMap.get(item.productId)!;
        await tx.insert(orderItems).values({
          id: uuidv4(),
          orderId,
          productId: item.productId,
          productName: product.name,
          productImage: product.images?.[0] || null,
          quantity: item.quantity,
          price: item.price,
        });
      }

      await tx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

      return { subtotal, shipping, tax, total };
    });

    await sendOrderConfirmation(user.email, orderId);
    updateTag(CACHE_TAGS.products);
    updateTag(CACHE_TAGS.dashboard);

    return { success: true, orderId };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "CART_EMPTY" || err.code === "OUT_OF_STOCK" || err.code === "INSUFFICIENT_STOCK" || err.code === "PRODUCT_NOT_FOUND") {
      return { error: err.message!, code: err.code as CheckoutError["code"] };
    }
    console.error("[createOrder] Unexpected error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create order",
      code: "VALIDATION_ERROR",
    };
  }
}

export async function createCheckoutAddress(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    type?: "shipping" | "billing" | "both";
  }
): Promise<{ id: string } | { error: string }> {
  try {
    const rlsDb = getRlsDb();
    const [existing] = await rlsDb
      .select()
      .from(addresses)
      .where(
        and(
          eq(addresses.userId, userId),
          eq(addresses.street, data.street),
          eq(addresses.city, data.city)
        )
      )
      .limit(1);

    if (existing) return { id: existing.id };

    const id = uuidv4();
    await rlsDb.insert(addresses).values({
      id,
      userId,
      fullName: data.fullName,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      type: data.type || "both",
      isDefault: false,
    });

    return { id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to save address" };
  }
}

export async function getOrders(userId?: string) {
  try {
    const { getRlsDb: getDb } = await import("@/lib/db");
    const dbInstance = getDb();

    if (userId) {
      return await dbInstance
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt);
    }

    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    return await dbInstance
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(orders.createdAt);
  } catch (error) {
    console.error("[getOrders] Failed to fetch orders:", error);
    return [];
  }
}

export async function getOrder(orderId: string) {
  const { requireAuth } = await import("@/lib/auth");
  const user = await requireAuth();

  const { getRlsDb: getDb } = await import("@/lib/db");
  const dbInstance = getDb();

  const [order] = await dbInstance
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;
  if (order.userId !== user.id && user.role === "user") return null;

  const items = await dbInstance
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin", "seller");

    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS])) {
      return { error: "Invalid status" };
    }

    const { getRlsDb: getDb } = await import("@/lib/db");
    const dbInstance = getDb();

    const [order] = await dbInstance
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };

    await dbInstance
      .update(orders)
      .set({
        status: status as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS],
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/seller/orders");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update order status" };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const { getRlsDb: getDb } = await import("@/lib/db");
    const dbInstance = getDb();

    const [order] = await dbInstance
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };
    if (order.userId !== user.id) return { error: "Forbidden" };
    if (!["pending", "confirmed"].includes(order.status)) {
      return { error: "Order cannot be cancelled at this stage" };
    }

    await dbInstance
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    const items = await dbInstance
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      await dbInstance
        .update(products)
        .set({ stock: sql`stock + ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    updateTag(CACHE_TAGS.products);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to cancel order" };
  }
}

export async function confirmDelivery(orderId: string) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const { getRlsDb: getDb } = await import("@/lib/db");
    const dbInstance = getDb();

    const [order] = await dbInstance
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };
    if (order.userId !== user.id) return { error: "Forbidden" };
    if (order.status !== "shipped") return { error: "Order has not been shipped yet" };

    await dbInstance
      .update(orders)
      .set({ status: "delivered", updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to confirm delivery" };
  }
}

export async function updatePaymentStatus(orderId: string, status: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    await requireRole("admin");

    const validStatuses = Object.values(PAYMENT_STATUS);
    if (!validStatuses.includes(status as (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS])) {
      return { error: "Invalid payment status" };
    }

    const { getRlsDb: getDb } = await import("@/lib/db");
    const dbInstance = getDb();

    await dbInstance
      .update(orders)
      .set({
        paymentStatus: status as (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS],
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update payment status" };
  }
}
