import { z } from "zod";

export const MAX_CART_QUANTITY = 99;
export const MAX_CART_LINES = 100;

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(MAX_CART_QUANTITY),
  name: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
});

const cartItemsSchema = z.array(cartItemSchema).max(MAX_CART_LINES);

export type NormalizedCartItem = { productId: string; quantity: number };

function validationError(message: string): Error & { code: string } {
  return Object.assign(new Error(message), { code: "VALIDATION_ERROR" });
}

/**
 * Validates quantities and collapses duplicate product lines. This is used for
 * both client-supplied cart syncs and rows already stored in the database, so
 * a negative/fractional/duplicated quantity can never reach stock math.
 */
export function normalizeCartQuantities(
  items: unknown
): NormalizedCartItem[] {
  const parsed = cartItemsSchema.safeParse(items);
  if (!parsed.success) {
    throw validationError("Invalid cart items");
  }

  const quantities = new Map<string, number>();
  for (const item of parsed.data) {
    const total = (quantities.get(item.productId) ?? 0) + item.quantity;
    if (total > MAX_CART_QUANTITY) {
      throw validationError("Invalid cart items");
    }
    quantities.set(item.productId, total);
  }

  return Array.from(quantities, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}
