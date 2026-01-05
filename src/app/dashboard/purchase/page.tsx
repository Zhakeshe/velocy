"use client";

import Link from "next/link";
import React from "react";
import { Cpu, HardDrive, Network, ShieldCheck, Sparkles } from "lucide-react";

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
};

const pills = ["Виртуальные серверы", "Облако", "Для бизнеса", "Защита"] as const;

function formatPrice(price: number, currency: string) {
  const amount = Number.isFinite(price) ? price : 0;
  return `${amount.toLocaleString()}${currency}`;
}

export default function PurchasePage() {
  const { t } = useLocale();
  const [items, setItems] = React.useState<CatalogItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activePill, setActivePill] = React.useState(pills[0]);

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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f1a] via-[#0a0c14] to-black p-6 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_70%_10%,rgba(168,85,247,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">{t("purchase.title") as string}</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{t("purchase.subtitle") as string}</h1>
            <p className="max-w-xl text-sm text-white/70">{t("purchase.lead") as string}</p>
            <div className="flex flex-wrap items-center gap-2">
              {pills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setActivePill(pill)}
                  className={`rounded-full border px-4 py-2 text-xs sm:text-sm transition ${
                    activePill === pill
                      ? "border-blue-400/60 bg-blue-500/10 text-white"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {pill}
                </button>
              ))}
              <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
                <ShieldCheck className="size-4" /> Anti DDoS L3-L4
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="size-5 text-blue-300" />
              {t("purchase.prompt") as string}
            </div>
            <p className="mt-2 text-xs text-white/60">{t("purchase.promptDetail") as string}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">{t("purchase.loading") as string}</div>
      ) : hasOffers ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-black/60 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] ring-1 ring-white/5"
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="uppercase tracking-[0.2em] text-white/50">{item.category}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-white">{item.region}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(item.price, item.currency)}</span>
                <span className="text-sm text-white/60">/ мес.</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold">{item.name}</h3>
              <p className="text-xs text-white/50">{item.owner}</p>

              <div className="mt-4 space-y-3 rounded-2xl border border-white/5 bg-black/30 p-4 text-sm text-white/80">
                <p className="flex items-center gap-2"><Cpu className="size-4 text-blue-300" /> {item.cpu}</p>
                <p className="flex items-center gap-2"><HardDrive className="size-4 text-purple-300" /> {item.ram}</p>
                <p className="flex items-center gap-2"><HardDrive className="size-4 text-amber-300" /> {item.storage}</p>
                <p className="flex items-center gap-2"><Network className="size-4 text-emerald-300" /> {item.bandwidth}</p>
                <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan-300" /> {item.ddos || "DDoS L3-L4"}</p>
              </div>

              <Link
                href={`/dashboard/purchase/${item.id}`}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                {t("purchase.call") as string}
              </Link>
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
