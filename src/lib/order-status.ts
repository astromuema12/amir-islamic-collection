/**
 * Order-level status changes a seller is allowed to make. These mirror the
 * seller UI's next-step buttons; terminal states and admin/customer actions
 * (returned, arbitrary jumps) are deliberately excluded.
 */
const SELLER_TRANSITIONS: Record<string, readonly string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
  returned: [],
};

export function canSellerTransition(from: string, to: string): boolean {
  return SELLER_TRANSITIONS[from]?.includes(to) ?? false;
}
