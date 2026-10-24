"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUserAction, type CurrentUser } from "@/lib/actions/auth-actions";
import { useWishlistStore } from "@/store/wishlist-store";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    getCurrentUserAction()
      .then((u) => {
        if (!cancelled) {
          setUser(u);
          if (u) {
            useWishlistStore.getState().hydrateFromServer();
          }
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return { user, loading, isGuest: !loading && user === null };
}
