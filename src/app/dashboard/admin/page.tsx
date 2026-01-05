"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  owner: string;
  createdAt: string;
};

export default function AdminPage() {
  const { t } = useLocale();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", owner: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", category: "", owner: "" });
    setSubmitting(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

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

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-4">
        <div className="md:col-span-4 text-sm text-white/60">{t("admin.createTitle") as string}</div>
        {["name", "category", "owner"].map((field) => (
          <div key={field} className="space-y-1">
            <label className="text-xs text-white/60">
              {t(`admin.${field}`) as string}
            </label>
            <input
              required
              value={(form as any)[field]}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        ))}
        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {t("admin.create") as string}
          </button>
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
              <div className="text-xs text-white/50 min-w-[120px]">{item.owner}</div>
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
    </div>
  );
}
