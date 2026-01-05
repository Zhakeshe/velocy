"use client";

import React from "react";
import { Bell, CheckCircle2, Clock, CreditCard, FlameKindling, Plus, Server } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const services = user?.services ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Домашняя страница</p>
          <h1 className="text-2xl font-semibold">Здравствуйте, {user?.name ?? "гость"}</h1>
          <p className="text-sm text-white/60">Ваши быстрые показатели и последние услуги</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
            <Plus className="size-4" />
            Приобрести услугу
          </button>
          <button className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white">
            <Bell className="size-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-[0_12px_80px_rgba(59,130,246,0.25)]">
          <p className="text-xs text-white/60">Текущий баланс</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold">4 ₽</p>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">+120 ₽ за 7 дн.</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">Активные услуги</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{services.length}</p>
            <span className="text-xs text-white/40">virtual / shared</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">Ближайший счёт</p>
          <div className="mt-2 space-y-1">
            <p className="text-xl font-semibold">22 July 2025</p>
            <p className="text-xs text-white/50">Автопродление включено</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">Поддержка</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/20 via-blue-500/20 to-transparent flex items-center justify-center border border-white/10">
              <FlameKindling className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Онлайн 24/7</p>
              <p className="text-xs text-white/50">Ответ в течение 5 минут</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ваши услуги</h3>
            <p className="text-sm text-white/60">Список активных и ожидающих сервисов</p>
          </div>
          <a href="/dashboard/purchase" className="text-sm text-emerald-200 hover:text-emerald-100 font-semibold">
            Приобрести новую
          </a>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
              <Server className="size-6 text-white/70" />
            </div>
            <p className="text-lg font-semibold">У вас нет услуг</p>
            <p className="text-sm text-white/60">Купите новую услугу, чтобы она отобразилась здесь.</p>
            <div className="flex justify-center gap-3">
              <a
                href="/dashboard/purchase"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/30"
              >
                Купить услугу
              </a>
              <a href="/auth" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white">
                Обновить данные
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-white/50">{service.plan}</p>
                    <h4 className="text-xl font-semibold leading-tight">{service.name}</h4>
                    <p className="text-sm text-white/60">Домен: {service.domain}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                    Активен
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                    <CheckCircle2 className="size-4 text-emerald-300" />
                    <span>Тариф: {service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                    <Clock className="size-4 text-white/50" />
                    <span>Оплата: {service.billing}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button className="flex-1 rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition">
                    Перейти в услугу
                  </button>
                  <button className="h-10 w-10 rounded-xl border border-white/15 bg-white/5 text-white/70 hover:text-white">
                    <CreditCard className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
