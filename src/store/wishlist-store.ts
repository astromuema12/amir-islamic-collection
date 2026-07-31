import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;
  hydrateFromServer: () => Promise<void>;
}

let signedIn: boolean | null = null;

async function syncToServer(items: string[]) {
  if (signedIn === false) return;
  try {
    const { syncWishlistToDb } = await import("@/lib/actions/wishlist-actions");
    await syncWishlistToDb(items);
  } catch {
    // Ignore sync failures (offline, network errors, etc.)
  }
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (get().items.includes(productId)) return;
        const items = [...get().items, productId];
        set({ items });
        syncToServer(items);
      },

      removeItem: (productId) => {
        const items = get().items.filter((id) => id !== productId);
        set({ items });
        syncToServer(items);
      },

      isInWishlist: (productId) => get().items.includes(productId),

      toggleItem: (productId) => {
        const current = get().items;
        const items = current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId];
        set({ items });
        syncToServer(items);
      },

      clearWishlist: () => {
        set({ items: [] });
        syncToServer([]);
      },

      hydrateFromServer: async () => {
        try {
          const { getWishlistProductIds } = await import(
            "@/lib/actions/wishlist-actions"
          );
          const remote = await getWishlistProductIds();

          if (remote === null) {
            signedIn = false;
            return;
          }

          signedIn = true;

          const local = get().items;
          const merged = Array.from(new Set([...local, ...remote]));

          if (merged.length !== local.length) {
            set({ items: merged });
          }

          if (merged.length !== remote.length) {
            syncToServer(merged);
          }
        } catch {
          // Ignore hydration failures
        }
      },
    }),
    {
      name: "amir-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
