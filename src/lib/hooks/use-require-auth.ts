"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import toast from "react-hot-toast";

export function useRequireAuth() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  const requireAuth = (action: () => void, message = "Please sign in to continue") => {
    if (loading) return;
    if (!user) {
      toast.error(message);
      router.push("/login");
      return;
    }
    action();
  };

  return { requireAuth, user, loading, isAuthenticated: !!user };
}
