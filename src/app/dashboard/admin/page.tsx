"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Ban, CheckCircle2, Loader2, ShieldCheck, Trash2, Users } from "lucide-react";

import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  owner: string;
  price: number;
  currency: string;
  region: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  ddos: string;
  createdAt: string;
};

type AdminUser = {
  id: number;
  name: string;
  email: string;
  balance: number;
  notifyEmail: number;
  notifyBrowser: number;
  twoFactorEnabled: number;
  emailVerified: number;
  isAdmin: number;
  isBanned: number;
  createdAt: string;
};

const CATEGORY_OPTIONS = ["Web Hosting", "Game Server", "VPS", "VDS"];

export default function AdminPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [form, setForm] = useState({
    name: "Ultra Low",
    category: "VPS",
    owner: "DE",
    price: 990,
    currency: "₸",
    region: "DE",
    cpu: "1 vCPU AMD Ryzen 9 5950X",
    ram: "1 GB DDR4",
    storage: "20 GB NVMe SSD",
    bandwidth: "100 Mbit/s",
    ddos: "L3-L4 DDoS shield",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services", {
      headers: { "x-admin-email": user?.email ?? "" },
    });
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const res = await fetch("/api/admin/users", {
      headers: { "x-admin-email": user?.email ?? "" },
    });
    const data = await res.json();
    setUsers(data.users ?? []);
    setUsersLoading(false);
  };

  useEffect(() => {
    if (user?.isAdmin) {
      load();
      loadUsers();
    }
  }, [user?.isAdmin]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-email": user?.email ?? "" },
      body: JSON.stringify(form),
    });
    setForm((prev) => ({ ...prev, name: "", category: "", owner: "", price: 0 }));
    setSubmitting(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-email": user?.email ?? "" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const handleToggleBan = async (email: string, isBanned: boolean) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-email": user?.email ?? "" },
      body: JSON.stringify({ email, isBanned }),
    });
    loadUsers();
  };

  const previewPrice = useMemo(() => `${Number(form.price || 0).toLocaleString()}${form.currency} / мес.`, [form]);
  const stats = useMemo(
    () => ({
      products: items.length,
      users: users.length,
      banned: users.filter((item) => item.isBanned).length,
    }),
    [items.length, users],
  );

  if (!user?.isAdmin) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        Доступ к админ панели открыт только администраторам, назначенным в базе данных.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
          <ShieldCheck className="size-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("nav.admin") as string}</p>
          <h1 className="text-2xl font-semibold leading-tight">{t("admin.title") as string}</h1>
          <p className="text-sm text-white/60">{t("admin.subtitle") as string}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Категорий в каталоге", value: stats.products, icon: <BadgeCheck className="size-5" /> },
          { label: "Пользователей", value: stats.users, icon: <Users className="size-5" /> },
          { label: "Заблокированы", value: stats.banned, icon: <Ban className="size-5" /> },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <div className="rounded-xl bg-white/5 p-2">{card.icon}</div>
              <div>
                <p className="text-xs text-white/50">{card.label}</p>
                <p className="text-2xl font-semibold text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="text-sm text-white/60">{t("admin.createTitle") as string}</div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: "name", label: "Название", placeholder: "Ultra Low" },
              { key: "owner", label: "Отображаемый тег", placeholder: "DE" },
              { key: "region", label: "Локация", placeholder: "DE" },
              { key: "currency", label: "Валюта", placeholder: "₸" },
              { key: "price", label: "Цена", placeholder: "990" },
              { key: "cpu", label: "CPU", placeholder: "1 vCPU AMD Ryzen 9 5950X" },
              { key: "ram", label: "RAM", placeholder: "1 GB DDR4" },
              { key: "storage", label: "Диск", placeholder: "20 GB NVMe SSD" },
              { key: "bandwidth", label: "Скорость", placeholder: "100 Mbit/s" },
              { key: "ddos", label: "DDoS", placeholder: "L3-L4" },
            ].map((field) => (
              <label key={field.key} className="space-y-1 text-sm text-white/80">
                <span className="text-xs text-white/50">{field.label}</span>
                <input
                  required={field.key !== "ddos"}
                  value={(form as any)[field.key]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: field.key === "price" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm focus:outline-none"
                />
              </label>
            ))}
            <label className="space-y-1 text-sm text-white/80">
              <span className="text-xs text-white/50">Категория</span>
              <select
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {t("admin.create") as string}
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/5 p-2">
              <BadgeCheck className="size-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Превью карточки</p>
              <p className="text-xs text-white/50">Так увидит клиент в каталоге</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-4 text-sm text-white/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="uppercase tracking-[0.2em]">{form.category || "VPS"}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{form.region || "DE"}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{previewPrice}</span>
              <span className="text-xs text-white/50">в мес.</span>
            </div>
            <p className="mt-1 text-lg font-semibold">{form.name || "Тариф"}</p>
            <p className="text-xs text-white/50">{form.owner || "DE"}</p>
            <div className="mt-3 space-y-2 text-xs text-white/70">
              <p>CPU: {form.cpu}</p>
              <p>RAM: {form.ram}</p>
              <p>Disk: {form.storage}</p>
              <p>Speed: {form.bandwidth}</p>
              <p>DDoS: {form.ddos}</p>
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/60">
          <span>{t("admin.tableTitle") as string}</span>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        </div>
        <div className="divide-y divide-white/10">
          {items.length === 0 && !loading ? (
            <div className="px-4 py-6 text-sm text-white/60">{t("admin.empty") as string}</div>
          ) : null}
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <div className="flex-1 min-w-[160px]">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/50">{item.category}</p>
              </div>
              <div className="text-xs text-white/50 min-w-[120px]">{`${item.price}${item.currency}`}</div>
              <div className="text-xs text-white/40 min-w-[80px] uppercase">{item.region}</div>
              <div className="text-xs text-white/40 min-w-[140px]">{new Date(item.createdAt).toLocaleString()}</div>
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white"
              >
                <Trash2 className="size-4" />
                {t("admin.delete") as string}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/60">
          <span>Пользователи</span>
          {usersLoading ? <Loader2 className="size-4 animate-spin" /> : null}
        </div>
        <div className="divide-y divide-white/10">
          {users.length === 0 && !usersLoading ? (
            <div className="px-4 py-6 text-sm text-white/60">Пользователи не найдены.</div>
          ) : null}
          {users.map((item) => (
            <div key={item.email} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/50">{item.email}</p>
              </div>
              <div className="text-xs text-white/50 min-w-[100px]">
                Баланс: {item.balance.toLocaleString()} ₸
              </div>
              <div className="text-xs text-white/50 min-w-[120px]">
                {item.emailVerified ? "Email подтвержден" : "Email не подтвержден"}
              </div>
              <div className="text-xs text-white/50 min-w-[80px]">{item.isAdmin ? "Админ" : "Пользователь"}</div>
              <div className="text-xs text-white/40 min-w-[140px]">{new Date(item.createdAt).toLocaleString()}</div>
              <button
                onClick={() => handleToggleBan(item.email, !item.isBanned)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white"
              >
                {item.isBanned ? <CheckCircle2 className="size-4" /> : <Ban className="size-4" />}
                {item.isBanned ? "Разблокировать" : "Заблокировать"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
