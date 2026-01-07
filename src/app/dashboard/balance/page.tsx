"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Banknote, CreditCard, IndianRupee, ShieldCheck, Wallet2 } from "lucide-react";

import { useAuth } from "@/lib/hooks/auth-context";
import { addInvoice, getInvoices, type Invoice } from "@/lib/invoices";

export default function BalancePage() {
  const { user } = useAuth();
  const balance = user?.balance ?? 0;
  const [history, setHistory] = useState<Invoice[]>([]);
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("send");
  const [currency, setCurrency] = useState("RUB");
  const currencySymbol = useMemo(() => {
    if (currency === "KZT") return "₸";
    if (currency === "USD") return "$";
    return "₽";
  }, [currency]);

  useEffect(() => {
    setHistory(getInvoices());
  }, []);

  const handleCheckout = async () => {
    if (paymentMethod !== "send") {
      window.alert("Этот способ оплаты будет доступен позже.");
      return;
    }

    try {
      const response = await fetch("/api/payments/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, method: paymentMethod }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось создать счет.");
      }

      if (data?.payUrl) {
        window.location.href = data.payUrl;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка оплаты.";
      window.alert(message);
    }
  };

  const handleTopUp = () => {
    const trimmedAmount = amount.trim();
    if (!trimmedAmount) {
      window.alert("Введите сумму пополнения.");
      return;
    }

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      amount: `${trimmedAmount} ${currencySymbol}`,
      time: new Date().toLocaleString("ru-RU"),
      method: paymentMethod,
      status: "pending",
    };

    addInvoice(invoice);
    setHistory(getInvoices());
  };

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
              <p className="text-3xl font-bold mt-1">{balance.toLocaleString()} ₽</p>
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
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <select
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-emerald-400/60 focus:outline-none"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="send">Send (Crypto Pay)</option>
              <option value="yookassa">ЮKassa</option>
              <option value="card">Банковская карта</option>
            </select>
            <select
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-emerald-400/60 focus:outline-none sm:col-span-2"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <option value="KZT">Тенге (KZT)</option>
              <option value="RUB">Рубль (RUB)</option>
              <option value="USD">Доллар (USD)</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/30"
              onClick={handleTopUp}
            >
              <Wallet2 className="size-4" />
              Пополнить
            </button>
            <button
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white"
              onClick={handleCheckout}
            >
              Перейти к оплате
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Banknote className="size-4" />
          <span>История последних платежей</span>
        </div>
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-black/40 px-4 py-6 text-sm text-white/60">
            Пополнений еще не было — баланс аннулирован до первой оплаты.
          </div>
        ) : (
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
        )}
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
