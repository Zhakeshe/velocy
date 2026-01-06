"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

export default function DedicatedServersPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("nav.extensions") as string}</p>
        <h1 className="text-2xl font-semibold">Дополнительные модули</h1>
        <p className="text-sm text-white/60">Подключайте расширения и управляйте доступом</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
          <ShieldCheck className="size-6 text-white/80" />
        </div>
        <p className="text-lg font-semibold">Каталог модулей скоро</p>
        <p className="text-sm text-white/60">Мы обновляем предложения. Вернитесь позже или свяжитесь с поддержкой.</p>
      </div>
    </div>
  );
}
