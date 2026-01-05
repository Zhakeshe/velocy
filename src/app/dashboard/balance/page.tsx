"use client";

import React from "react";
import { Banknote, CreditCard, IndianRupee, ShieldCheck, Wallet2 } from "lucide-react";

export default function BalancePage() {
  const history = [
    { id: "486789", amount: "+450₽", time: "2 месяца назад" },
    { id: "372728", amount: "+340₽", time: "2 месяца назад" },
    { id: "372739", amount: "+340₽", time: "2 месяца назад" },
    { id: "372750", amount: "+340₽", time: "2 месяца назад" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Финансы</p>
        <h1 className="text-2xl font-semibold">Пополнение баланса, а также контроль средств</h1>
        <p className="text-sm text-white/60">Добавляйте средства и отслеживайте движение средств</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Текущий баланс</p>
              <p className="text-3xl font-bold mt-1">4 ₽</p>
            </div>
            <div className="rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">активировать автоплатеж</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center gap-3 text-sm text-white/70">
            <ShieldCheck className="size-4 text-emerald-300" />
            <span>Безопасные транзакции и моментальные пополнения</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Пополнение баланса</p>
              <p className="text-xs text-white/40">Введите сумму платежа и выберите способ оплаты</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <IndianRupee className="size-4" />
              <span>Режим оплаты</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-emerald-400/60 focus:outline-none"
              placeholder="100"
              defaultValue="100"
            />
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">Способ оплаты: ЮKassa</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/30">
              <Wallet2 className="size-4" />
              Пополнить
            </button>
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white">Перейти к оплате</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Banknote className="size-4" />
          <span>История последних платежей</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {history.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 flex items-center justify-between">
              <div className="space-y-1 text-sm">
                <p className="text-white/80">Пополнение баланса #{item.id}</p>
                <p className="text-white/40">{item.time}</p>
              </div>
              <span className="text-emerald-300 font-semibold">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <div className="flex items-center gap-3">
          <CreditCard className="size-5 text-white/70" />
          <div>
            <p className="text-sm font-semibold">Сохраненные методы оплаты</p>
            <p className="text-xs text-white/50">Добавьте карту, чтобы оплачивать услуги быстрее</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/25 px-4 py-2 text-sm text-white/70 hover:text-white">
          <PlusIcon />
          Добавить карту
        </button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">+</span>;
}
