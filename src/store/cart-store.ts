import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coupon } from "@/types";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
}

interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
}

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  get totalItems(): number;
  get subtotal(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        if (existing) {
          const newQty = Math.min(
            existing.quantity + (item.quantity || 1),
            existing.maxQuantity,
          );
          set({
            items: items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i,
            ),
          });
        } else {
          const newItem: CartItem = {
            id: item.id ?? crypto.randomUUID(),
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: Math.min(item.quantity || 1, item.maxQuantity),
            maxQuantity: item.maxQuantity,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
              : i,
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => {
        set({
          coupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minOrderAmount: coupon.minOrderAmount,
            maxDiscount: coupon.maxDiscount,
          },
        });
      },

      removeCoupon: () => set({ coupon: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    {
      name: "amir-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    },
  ),
);
