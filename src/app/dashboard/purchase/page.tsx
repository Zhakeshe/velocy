"use client";

import React from "react";
import { PlugZap, ShieldCheck, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  owner: string;
};

export default function PurchasePage() {
  const { t } = useLocale();
  const categories = t("purchase.filters") as string[];
  const tags = t("purchase.tags") as string[];
  const [items, setItems] = React.useState<CatalogItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const hasOffers = items.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("purchase.title") as string}</p>
        <h1 className="text-2xl font-semibold">{t("purchase.subtitle") as string}</h1>
        <p className="text-sm text-white/60">Подберите набор по вашим задачам</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-3">
        {categories.map((entry, idx) => (
          <button
            key={entry}
            className={`rounded-full border px-4 py-2 text-xs sm:text-sm transition ${idx === 0 ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-white/60 hover:text-white"}`}
          >
            {entry}
          </button>
        ))}
        <button className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
          <ShieldCheck className="size-4" />
          Anti DDOS
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-3">
        {tags.map((tag) => (
          <div key={tag} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
            <Sparkles className="size-4" />
            {tag}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">Обновляем каталог…</div>
      ) : hasOffers ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-white/5 to-transparent p-5 space-y-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">{item.category}</p>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">{item.owner}</span>
              </div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p className="flex items-center gap-2">
                  <PlugZap className="size-4 text-emerald-300" /> {t("purchase.call") as string}
                </p>
                <p className="text-white/50">Доступно после оплаты — добавьте в корзину через администратора.</p>
              </div>
              <button className="w-full rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
                Связаться для оформления
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center space-y-2">
          <p className="text-lg font-semibold">{t("purchase.emptyTitle") as string}</p>
          <p className="text-sm text-white/60">{t("purchase.emptyDescription") as string}</p>
        </div>
      )}
    </div>
  );
}
