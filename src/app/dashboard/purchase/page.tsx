"use client";

import React from "react";
import { Cpu, Flame, Server, ShieldCheck, ToggleLeft } from "lucide-react";

const categories = [
  "Виртуальные серверы",
  "Игровые сервера",
  "HI-LOAD",
  "STORAGE",
  "AMD RYZEN",
  "INTEL",
  "LOW-COST",
];

const offers = [
  {
    id: "de-promo",
    title: "DE-PROMO",
    price: "190₽ / месяц",
    cpu: "1 core",
    ram: "1 GB RAM",
    storage: "20 GB NVME",
    location: "🇩🇪",
  },
  {
    id: "de-1",
    title: "DE-1",
    price: "340₽ / месяц",
    cpu: "2 core",
    ram: "2 GB RAM",
    storage: "35 GB NVME",
    location: "🇩🇪",
  },
  {
    id: "de-2",
    title: "DE-2",
    price: "560₽ / месяц",
    cpu: "4 core",
    ram: "4 GB RAM",
    storage: "60 GB NVME",
    location: "🇩🇪",
  },
];

export default function PurchasePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Приобретение услуги</p>
        <h1 className="text-2xl font-semibold">Выберите нужный тариф для покупки</h1>
        <p className="text-sm text-white/60">Фильтруйте по типу услуг и городам</p>
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
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <Server className="size-4" />
          VDS CLOUD
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <Flame className="size-4" />
          Индивидуальные VPS
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <Cpu className="size-4" />
          AMD RYZEN
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <ToggleLeft className="size-4" />
          Intel
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-white/5 to-transparent p-5 space-y-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">{offer.location}</p>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">🔥 ПРОМО</span>
            </div>
            <h3 className="text-xl font-semibold">{offer.title}</h3>
            <p className="text-sm text-white/60">{offer.price}</p>
            <div className="space-y-2 text-sm text-white/70">
              <p>{offer.cpu}</p>
              <p>{offer.ram}</p>
              <p>{offer.storage}</p>
            </div>
            <button className="w-full rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
              Перейти к оплате
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
