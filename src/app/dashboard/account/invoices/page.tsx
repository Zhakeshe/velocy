"use client";

import React from "react";
import { CreditCard } from "lucide-react";

const invoices = Array.from({ length: 12 }).map((_, index) => ({
  id: `Реквизиты #${87328 + index}`,
  amount: index % 2 === 0 ? "+340₽" : "+320₽",
  time: "2 месяца назад",
}));

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Счета</p>
        <h1 className="text-2xl font-semibold">Ваша история пополнений баланса</h1>
        <p className="text-sm text-white/60">Все транзакции аккаунта собраны здесь</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">{invoice.time}</span>
              <CreditCard className="size-4 text-white/60" />
            </div>
            <p className="text-sm font-semibold">Пополнение баланса #{invoice.id}</p>
            <p className="text-emerald-300 font-semibold">{invoice.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
