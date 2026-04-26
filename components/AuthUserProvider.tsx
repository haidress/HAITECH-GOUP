"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  role: "admin" | "client" | "etudiant" | "technicien";
  nom: string;
  prenom: string | null;
  email: string;
} | null;

type AuthUserContextValue = {
  user: AuthUser;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthUserContext = createContext<AuthUserContextValue | null>(null);

async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
    headers: { "Cache-Control": "no-store" }
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { user?: AuthUser };
  return data.user ?? null;
}

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await fetchCurrentUser();
      setUser(nextUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Ne pas re-déclencher sur chaque pathname : chaque navigation refaisait un GET /api/auth/me + hit DB, très pénalisant. */
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    function onAuthChanged() {
      refreshUser();
    }
    window.addEventListener("haitech-auth-changed", onAuthChanged);
    return () => window.removeEventListener("haitech-auth-changed", onAuthChanged);
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser
    }),
    [user, loading, refreshUser]
  );

  return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser doit être utilisé dans AuthUserProvider");
  }
  return context;
}
