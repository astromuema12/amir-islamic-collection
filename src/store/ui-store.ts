import { create } from "zustand";
import type { Product } from "@/types";

interface UIState {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;

  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isMobileMenuOpen: false,
  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isCompareOpen: false,
  openCompare: () => set({ isCompareOpen: true }),
  closeCompare: () => set({ isCompareOpen: false }),

  compareItems: [],
  addToCompare: (product) => {
    const items = get().compareItems;
    if (items.length >= 4) return;
    if (items.some((p) => p.id === product.id)) return;
    set({ compareItems: [...items, product] });
  },
  removeFromCompare: (productId) => {
    set({
      compareItems: get().compareItems.filter((p) => p.id !== productId),
    });
  },
  isInCompare: (productId) => get().compareItems.some((p) => p.id === productId),
  clearCompare: () => set({ compareItems: [] }),

  recentlyViewed: [],
  addToRecentlyViewed: (product) => {
    const items = get().recentlyViewed.filter((p) => p.id !== product.id);
    set({ recentlyViewed: [product, ...items].slice(0, 12) });
  },
}));
