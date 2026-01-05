"use client";

import React from "react";
import { MessageSquare, Send, ShieldQuestion } from "lucide-react";

const subjects = ["Технический", "Оплата", "Запрос функции"];
const services = ["Подписки", "Автоматизации", "Услуга не выбрана"];

export default function CreateTicketPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Поддержка</p>
        <h1 className="text-2xl font-semibold">Создать обращение</h1>
        <p className="text-sm text-white/60">Опишите проблему и выберите услугу для быстрого решения</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-white/60">Тема обращения</label>
              <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" placeholder="Коротко опишите проблему" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Выберите услугу</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                {services.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Категория</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Приоритет</label>
              <select className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                <option>Низкий приоритет</option>
                <option>Средний</option>
                <option>Высокий</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60">Расписать подробнее</label>
            <textarea className="min-h-[140px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" placeholder="Расскажите в чем проблема" />
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
            <Send className="size-4" />
            Отправить обращение
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 flex flex-col">
          <div className="flex items-center gap-3">
            <ShieldQuestion className="size-5 text-white/70" />
            <div>
              <p className="text-sm font-semibold">Вы также можете написать в поддержку</p>
              <p className="text-xs text-white/50">Telegram: @velocy_support</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
            Наши операторы работают 24/7 и отвечают в течение нескольких минут.
          </div>
          <a
            href="https://t.me"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 hover:text-white"
          >
            <MessageSquare className="size-4" />
            Перейти в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
