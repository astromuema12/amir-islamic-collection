"use server";

import { db } from "@/lib/db";
import { cart, cartItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function syncCartToDb(items: { productId: string; name: string; image: string; price: number; quantity: number }[]) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    const [existingCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, user.id))
      .limit(1);

    let cartId: string;

    if (existingCart) {
      cartId = existingCart.id;
      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    } else {
      cartId = uuidv4();
      await db.insert(cart).values({
        id: cartId,
        userId: user.id,
      });
    }

    if (items.length > 0) {
      await db.insert(cartItems).values(
        items.map((item) => ({
          id: uuidv4(),
          cartId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        }))
      );
    }

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to sync cart" };
  }
}
