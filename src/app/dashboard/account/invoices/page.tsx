"use client";

import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import { getInvoices, type Invoice } from "@/lib/invoices";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const getMethodLabel = (method: string) => {
    if (method === "send") return "Send (Crypto Pay)";
    if (method === "yookassa") return "ЮKassa";
    if (method === "card") return "Банковская карта";
    return method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ваша история пополнений баланса</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          Здесь пока нет пополнений.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">{invoice.time}</span>
                <CreditCard className="size-4 text-white/60" />
              </div>
              <p className="text-sm font-semibold">Пополнение баланса #{invoice.id}</p>
              <p className="text-xs text-white/50">Способ оплаты: {getMethodLabel(invoice.method)}</p>
              <p className="text-emerald-300 font-semibold">{invoice.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
