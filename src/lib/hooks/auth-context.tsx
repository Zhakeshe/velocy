"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type StoredUser = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

type AuthContextValue = {
  user: Pick<StoredUser, "name" | "email"> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  users: "ve_auth_users",
  sessionEmail: "ve_auth_session_email",
};

function readUsersFromStorage(): StoredUser[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEYS.users);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StoredUser[];
    return [];
  } catch (error) {
    console.error("Failed to parse stored users", error);
    return [];
  }
}

function writeUsersToStorage(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Pick<StoredUser, "name" | "email"> | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(readUsersFromStorage());

    if (typeof window !== "undefined") {
      const sessionEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
      if (sessionEmail) {
        const found = readUsersFromStorage().find((entry) => entry.email === sessionEmail);
        if (found) setUser({ name: found.name, email: found.email });
      }
    }

    setIsLoading(false);
  }, []);

  const persistUsers = useCallback((nextUsers: StoredUser[]) => {
    setUsers(nextUsers);
    writeUsersToStorage(nextUsers);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const existing = users.find((entry) => entry.email === email);
      if (!existing) throw new Error("Пользователь не найден");
      if (existing.password !== password) throw new Error("Неверный пароль");

      setUser({ name: existing.name, email: existing.email });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionEmail, email);
      }
    },
    [users],
  );

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const exists = users.some((entry) => entry.email === email);
      if (exists) throw new Error("Пользователь уже зарегистрирован");

      const nextUsers = [
        ...users,
        {
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        },
      ];

      persistUsers(nextUsers);
      setUser({ name, email });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.sessionEmail, email);
      }
    },
    [persistUsers, users],
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
