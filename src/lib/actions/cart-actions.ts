"use server";

import { getRlsDb } from "@/lib/db";
import { cart, cartItems, products } from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { normalizeCartQuantities } from "@/lib/cart-validation";

type CartItemInput = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export async function syncCartToDb(items: CartItemInput[]) {
  try {
    const { requireAuth } = await import("@/lib/auth");
    const user = await requireAuth();

    // Quantities and duplicate lines are validated before any write. Prices
    // are deliberately ignored — the order total is recomputed server-side.
    const validItems = normalizeCartQuantities(items);
    const rlsDb = getRlsDb();

    await rlsDb.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT set_config('app.current_user_id', ${user.id}::text, true)`
      );
      await tx.execute(
        sql`SELECT set_config('app.current_user_role', ${user.role}::text, true)`
      );

      const [existingCart] = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, user.id))
        .limit(1);

      let cartId: string;
      if (existingCart) {
        cartId = existingCart.id;
        await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
      } else {
        cartId = uuidv4();
        await tx.insert(cart).values({ id: cartId, userId: user.id });
      }

      if (validItems.length === 0) return;

      const productRows = await tx
        .select({
          id: products.id,
          price: products.price,
          discountPrice: products.discountPrice,
        })
        .from(products)
        .where(
          inArray(
            products.id,
            validItems.map((item) => item.productId)
          )
        );

      const productMap = new Map(productRows.map((row) => [row.id, row]));
      const rowsToInsert = validItems.flatMap((item) => {
        const product = productMap.get(item.productId);
        if (!product) return [];

        const unitPrice = product.discountPrice
          ? Number(product.discountPrice)
          : Number(product.price);

        return [
          {
            id: uuidv4(),
            cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: unitPrice.toString(),
          },
        ];
      });

      if (rowsToInsert.length > 0) {
        await tx.insert(cartItems).values(rowsToInsert);
      }
    });

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to sync cart" };
  }
}
