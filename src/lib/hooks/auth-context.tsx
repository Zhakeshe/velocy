"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { AuthUser } from "@/lib/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (payload: {
    name?: string;
    newEmail?: string;
    currentPassword?: string;
    newPassword?: string;
    notifyEmail?: boolean;
    notifyBrowser?: boolean;
    twoFactorEnabled?: boolean;
  }) => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  sessionEmail: "ve_auth_session_email",
  sessionUser: "ve_auth_session_user",
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

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.sessionEmail);
      window.localStorage.removeItem(STORAGE_KEYS.sessionUser);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
    const cachedUser = window.localStorage.getItem(STORAGE_KEYS.sessionUser);

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) { }
    }

    if (!sessionEmail) {
      setIsLoading(false);
      return;
    }

    // Hydrate user data from server
    fetchUser(sessionEmail)
      .then((sessionUser) => {
        if (sessionUser) {
          setUser(sessionUser);
          window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(sessionUser));
        } else {
          // If fetchUser returns null, it's a 4xx or 5xx error.
          // For now, only logout if we are sure (this is a bit simpler since fetchUser abstracts it)
          // logout(); 
        }
      })
      .catch((err) => {
        console.error("Auth hydration error:", err);
      })
      .finally(() => setIsLoading(false));
  }, [logout]);

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
        window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(data.user));
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
        window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(data.user));
      }
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    const sessionEmail =
      user?.email || (typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEYS.sessionEmail) : null);
    if (!sessionEmail) return;
    const nextUser = await fetchUser(sessionEmail);
    if (nextUser) {
      setUser(nextUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(nextUser));
      }
    }
  }, [user?.email]);

  const updateProfile = useCallback(
    async (payload: {
      name?: string;
      newEmail?: string;
      currentPassword?: string;
      newPassword?: string;
      notifyEmail?: boolean;
      notifyBrowser?: boolean;
      twoFactorEnabled?: boolean;
    }) => {
      if (!user?.email) return null;

      const res = await fetch("/api/account/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentEmail: user.email, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Не удалось обновить данные");
      }

      const nextUser = data.user as AuthUser;
      setUser(nextUser);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionEmail, nextUser.email);
        window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(nextUser));
      }

      return nextUser;
    },
    [user?.email],
  );

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser, updateProfile }),
    [isLoading, login, logout, refreshUser, register, updateProfile, user],
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
