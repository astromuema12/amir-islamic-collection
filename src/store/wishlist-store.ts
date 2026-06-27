import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (get().items.includes(productId)) return;
        set({ items: [...get().items, productId] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      isInWishlist: (productId) => get().items.includes(productId),

      toggleItem: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "amir-wishlist",
    },
  ),
);
