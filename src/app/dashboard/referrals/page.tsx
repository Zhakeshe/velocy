"use client";

import React from "react";
import { Gift, Link2 } from "lucide-react";

const steps = [
  "0-25 рефералов — 5% от суммы пополнения",
  "25-50 рефералов — 7% от суммы пополнения",
  "50-100 рефералов — 10% от суммы пополнения",
  "100 и более рефералов — 12% от суммы пополнения",
];

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Реферальная система</p>
        <h1 className="text-2xl font-semibold">Поделитесь ссылкой и получайте бонусы</h1>
        <p className="text-sm text-white/60">Зарабатывайте вместе с друзьями</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Gift className="size-5 text-white/70" />
          <div>
            <p className="text-sm font-semibold">Ваша награда</p>
            <p className="text-xs text-white/50">Получайте процент от пополнений приглашенных пользователей</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-white/80">
          {steps.map((step) => (
            <li key={step} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-300" />
              <span>{step}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center justify-between text-sm">
          <div>
            <p className="text-white/70">Ваша реферальная ссылка</p>
            <p className="text-xs text-white/40">https://play.cloudhost.kz/akgY4wJOowik</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow">
            <Link2 className="size-4" />
            Скопировать
          </button>
        </div>
      </div>
    </div>
  );
}
