"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products, cart } from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validations";
import { sendOrderConfirmation } from "@/lib/resend";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";

export async function createOrder(formData: FormData) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const raw = {
      shippingAddressId: formData.get("shippingAddressId") as string,
      billingAddressId: formData.get("billingAddressId") as string,
      notes: formData.get("notes") as string || undefined,
      couponCode: formData.get("couponCode") as string || undefined,
    };

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const [userCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, user.id))
      .limit(1);

    if (!userCart) return { error: "Cart is empty" };

    const { cartItems } = await import("@/lib/db/schema");
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, userCart.id));

    if (items.length === 0) return { error: "Cart is empty" };

    const productIds = items.map((i) => i.productId);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) return { error: `Product ${item.productId} not found` };
      if (product.stock < item.quantity) {
        return { error: `Insufficient stock for ${product.name}` };
      }
      subtotal += Number(item.price) * item.quantity;
    }

    const shipping = subtotal >= 50000 ? 0 : 1500;
    const tax = subtotal * 0.075;
    const discount = 0;
    const total = subtotal + shipping + tax - discount;

    const orderId = uuidv4();

    await db.transaction(async (tx) => {
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

        await tx
          .update(products)
          .set({
            stock: product.stock - item.quantity,
            salesCount: (product.salesCount || 0) + item.quantity,
          })
          .where(eq(products.id, item.productId));
      }

      await tx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
    });

    await sendOrderConfirmation(user.email, orderId);
    revalidatePath("/orders");
    revalidatePath("/");

    return { success: true, orderId };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create order" };
  }
}

export async function getOrders(userId?: string) {
  try {
    if (userId) {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt);
    }

    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(orders.createdAt);
  } catch {
    return [];
  }
}

export async function getOrder(orderId: string) {
  const { requireAuth } = await import("@/lib/auth");
  const user = await requireAuth();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;
  if (order.userId !== user.id && user.role === "user") return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { requireRole } = await import("@/lib/auth");
    const user = await requireRole("admin", "seller");

    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status as typeof ORDER_STATUS[keyof typeof ORDER_STATUS])) {
      return { error: "Invalid status" };
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };

    await db
      .update(orders)
      .set({ status: status as typeof ORDER_STATUS[keyof typeof ORDER_STATUS], updatedAt: new Date() })
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

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };
    if (order.userId !== user.id) return { error: "Forbidden" };
    if (!["pending", "confirmed"].includes(order.status)) {
      return { error: "Order cannot be cancelled at this stage" };
    }

    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      await db
        .update(products)
        .set({ stock: sql`stock + ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

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

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return { error: "Order not found" };
    if (order.userId !== user.id) return { error: "Forbidden" };
    if (order.status !== "shipped") return { error: "Order has not been shipped yet" };

    await db
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
    if (!validStatuses.includes(status as typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS])) {
      return { error: "Invalid payment status" };
    }

    await db
      .update(orders)
      .set({ paymentStatus: status as typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS], updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update payment status" };
  }
}
