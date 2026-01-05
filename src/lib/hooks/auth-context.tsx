"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserService = {
  id: string;
  name: string;
  area: string;
  plan: string;
  price: string;
  billing: string;
  nextInvoice: string;
  status: "active" | "pending" | "expired";
};

type StoredUser = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  services?: UserService[];
};

type AuthUser = Pick<StoredUser, "name" | "email"> & { services: UserService[] };

type AuthContextValue = {
  user: AuthUser | null;
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

function withServicesHydrated(users: StoredUser[]): StoredUser[] {
  return users.map((entry) => ({
    ...entry,
    services: (entry.services ?? []).map((service, idx) => ({
      area: service.area ?? "Подписки",
      ...service,
      id: service.id ?? `svc-${idx}`,
    })),
  }));
}

function readUsersFromStorage(): StoredUser[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEYS.users);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return withServicesHydrated(parsed as StoredUser[]);
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

function createDemoServices(ownerName: string): UserService[] {
  return [
    {
      id: "svc-1",
      name: "Client Desk",
      area: "Подписки",
      plan: "Workspace Pro",
      price: "15 000 ₸ / мес.",
      billing: "3 мес. / 42 600 ₸",
      nextInvoice: "с 22 July 2025",
      status: "active",
    },
    {
      id: "svc-2",
      name: "Analytics Hub",
      area: "Автоматизации",
      plan: "Data Flow",
      price: "4 000 ₸ / мес.",
      billing: "12 мес. / 48 000 ₸",
      nextInvoice: "с 3 July 2025",
      status: "active",
    },
  ].map((service, index) => ({ ...service, id: `${service.id}-${ownerName || "user"}-${index}` }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(readUsersFromStorage());

    if (typeof window !== "undefined") {
      const sessionEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
      if (sessionEmail) {
        const found = readUsersFromStorage().find((entry) => entry.email === sessionEmail);
        if (found) setUser({ name: found.name, email: found.email, services: found.services ?? [] });
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

      setUser({ name: existing.name, email: existing.email, services: existing.services ?? [] });

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

      const services = createDemoServices(name);

      const nextUsers = [
        ...users,
        {
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
          services,
        },
      ];

      persistUsers(nextUsers);
      setUser({ name, email, services });

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
