"use client";

import { useState, useEffect } from "react";
import { getCurrentUserAction, type CurrentUser } from "@/lib/actions/auth-actions";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUserAction()
      .then((u) => {
        if (!cancelled) setUser(u);
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
  }, []);

  return { user, loading, isGuest: !loading && user === null };
}
