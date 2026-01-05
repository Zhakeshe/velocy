"use client";

import React from "react";
import { CheckCircle2, Clock, Server } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";

export default function VirtualServicesPage() {
  const { user } = useAuth();
  const services = user?.services ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Виртуальные серверы</p>
        <h1 className="text-2xl font-semibold">Список ваших виртуальных серверов</h1>
        <p className="text-sm text-white/60">Управляйте активными инстансами и продлениями</p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
            <Server className="size-6 text-white/70" />
          </div>
          <p className="text-lg font-semibold">Нет активных серверов</p>
          <p className="text-sm text-white/60">Добавьте первый сервер, чтобы он отобразился здесь</p>
          <a
            href="/dashboard/purchase"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold"
          >
            Приобрести сервер
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/5 to-transparent p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Активен с 23 декабря 2024</p>
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-sm text-white/60">{service.plan}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">virtual</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>Тариф: {service.price}</p>
                <p>Следующая оплата: {service.nextInvoice}</p>
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="size-4" />
                  Статус: Активен
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <span>Автопродление: Включено</span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1 border border-white/10">
                  <Clock className="size-4" />
                  24/7
                </span>
              </div>
              <button className="mt-4 w-full rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
                Перейти в панель
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
