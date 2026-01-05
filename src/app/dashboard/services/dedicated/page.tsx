"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export default function DedicatedServersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Выделенные серверы</p>
        <h1 className="text-2xl font-semibold">Тарифы на выделенные машины</h1>
        <p className="text-sm text-white/60">Настройте выделенный сервер под свои задачи</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
          <ShieldCheck className="size-6 text-white/80" />
        </div>
        <p className="text-lg font-semibold">Каталог выделенных серверов скоро</p>
        <p className="text-sm text-white/60">Мы обновляем предложения. Вернитесь позже или свяжитесь с поддержкой.</p>
      </div>
    </div>
  );
}
