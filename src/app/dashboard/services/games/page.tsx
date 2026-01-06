"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

export default function GameServersPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("nav.automation") as string}</p>
        <h1 className="text-2xl font-semibold">Автоматизации и интеграции</h1>
        <p className="text-sm text-white/60">Подключите сценарии, чтобы видеть их здесь</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-lg font-semibold">{t("services.emptyTitle") as string}</p>
          <p className="text-sm text-white/60">{t("services.emptyDescription") as string}</p>
        </div>
        <a
          href="/dashboard/purchase"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition"
        >
          <Gamepad2 className="size-4" />
          {t("services.emptyPrimary") as string}
        </a>
      </div>
    </div>
  );
}
