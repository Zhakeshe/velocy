"use client";

import React from "react";
import { PlugZap, ShieldCheck, Sparkles } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

const offers = [
  {
    id: "starter-kit",
    title: "Starter kit",
    price: "15 000 ₸ / мес",
    features: ["Онбординг команды", "Готовые шаблоны", "Стартовая аналитика"],
    badge: "new",
  },
  {
    id: "growth-care",
    title: "Growth care",
    price: "29 000 ₸ / мес",
    features: ["Чат с куратором", "Инциденты 24/7", "Дашборды KPI"],
    badge: "popular",
  },
  {
    id: "automation-suite",
    title: "Automation suite",
    price: "45 000 ₸ / мес",
    features: ["Интеграции", "Webhook + API", "Сценарии без кода"],
    badge: "pro",
  },
];

export default function PurchasePage() {
  const { t } = useLocale();
  const categories = t("purchase.filters") as string[];
  const tags = t("purchase.tags") as string[];

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-white/5 to-transparent p-5 space-y-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">{offer.title}</p>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">{offer.badge?.toUpperCase()}</span>
            </div>
            <h3 className="text-xl font-semibold">{offer.price}</h3>
            <div className="space-y-2 text-sm text-white/70">
              {offer.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2">
                  <PlugZap className="size-4 text-emerald-300" /> {feature}
                </p>
              ))}
            </div>
            <button className="w-full rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
              {t("purchase.call") as string}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
