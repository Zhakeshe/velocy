"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Loader2, ShieldCheck, Trash2 } from "lucide-react";

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

export default function AdminPage() {
  const { t } = useLocale();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    setForm((prev) => ({ ...prev, name: "", category: "", owner: "", price: 0 }));
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

  const previewPrice = useMemo(() => `${Number(form.price || 0).toLocaleString()}${form.currency} / мес.`, [form]);

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

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="text-sm text-white/60">{t("admin.createTitle") as string}</div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: "name", label: "Название", placeholder: "Ultra Low" },
              { key: "category", label: "Категория", placeholder: "VPS" },
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
    </div>
  );
}
