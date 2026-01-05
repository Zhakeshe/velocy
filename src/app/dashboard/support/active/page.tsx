"use client";

import React from "react";
import { LifeBuoy } from "lucide-react";

export default function ActiveTicketsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Все обращения</p>
        <h1 className="text-2xl font-semibold">Активные обращения</h1>
        <p className="text-sm text-white/60">В этом разделе вы можете найти ваши активные и закрытые обращения</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
          <LifeBuoy className="size-6 text-white/80" />
        </div>
        <p className="text-lg font-semibold">Здесь пока пусто</p>
        <p className="text-sm text-white/60">Создайте обращение, и оно появится в этом списке</p>
        <a
          href="/dashboard/support/create"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition"
        >
          Создать обращение
        </a>
      </div>
    </div>
  );
}
