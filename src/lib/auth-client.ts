"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserRole } from "@/generated/prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

type MeResponse = { user: AuthUser | null };

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const payload = (await response.json()) as MeResponse;
      setUser(payload.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    setUser(null);
  }, []);

  return { user, loading, refresh, logout };
}
