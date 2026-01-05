"use client";

import React from "react";
import { BookOpenCheck, Lightbulb, Search } from "lucide-react";
import { useLocale } from "@/lib/hooks/locale-context";

const guides = [
  {
    title: "Быстрый старт",
    bullets: ["Создайте продукт", "Прикрепите команду", "Настройте уведомления"],
  },
  {
    title: "Финансы",
    bullets: ["Пополнение", "Счета и чеки", "Возвраты"],
  },
  {
    title: "Поддержка",
    bullets: ["Создать обращение", "Прикрепить логи", "Эскалация"],
  },
];

export default function WikiPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
          <BookOpenCheck className="size-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("quick.wiki") as string}</p>
          <h1 className="text-2xl font-semibold leading-tight">{t("wiki.title") as string}</h1>
          <p className="text-sm text-white/60">{t("wiki.subtitle") as string}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[260px] flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
            <Search className="size-4 text-white/40" />
            <input
              type="text"
              placeholder="Search or type a question"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <Lightbulb className="size-4" />
            <span>{t("wiki.tip") as string}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <div key={guide.title} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 space-y-2">
              <p className="text-sm text-white/60">{guide.title}</p>
              <ul className="space-y-2 text-sm text-white/80 list-disc list-inside">
                {guide.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
