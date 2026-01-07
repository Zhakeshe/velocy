"use client";

import React from "react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ваша история пополнений баланса</h1>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        Здесь пока нет пополнений.
      </div>
    </div>
  );
}
