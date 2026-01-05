"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { AuthUser, UserService } from "@/lib/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  sessionEmail: "ve_auth_session_email",
};

async function fetchUser(email: string): Promise<AuthUser | null> {
  const res = await fetch(`/api/auth/user?email=${encodeURIComponent(email)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.user as AuthUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
    if (!sessionEmail) {
      setIsLoading(false);
      return;
    }

    fetchUser(sessionEmail)
      .then((sessionUser) => {
        if (sessionUser) setUser(sessionUser);
        else window.localStorage.removeItem(STORAGE_KEYS.sessionEmail);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Не удалось войти");
      }

      setUser(data.user as AuthUser);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionEmail, email);
      }
    },
    [],
  );

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Не удалось зарегистрироваться");
      }

      setUser(data.user as AuthUser);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionEmail, email);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.sessionEmail);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [isLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
