"use client";

import React, { useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock,
  Cog,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Plus,
  Server,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/sections/navbar";
import { useAuth } from "@/lib/hooks/auth-context";
import { useRouter } from "next/navigation";

const navSections = [
  {
    title: "Услуги",
    links: [
      { icon: LayoutDashboard, label: "Рабочая страница", href: "/dashboard", active: true },
      { icon: Home, label: "Домены", href: "#domains" },
      { icon: Server, label: "Публичные услуги", href: "#services" },
      { icon: ShoppingBag, label: "Приобретение услуги", href: "#purchase" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { icon: MessageSquare, label: "Создать тикет", href: "#ticket" },
      { icon: LifeBuoy, label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Аккаунт",
    links: [
      { icon: CircleUserRound, label: "Личные данные", href: "#profile" },
      { icon: Cog, label: "Настройки", href: "#settings" },
    ],
  },
];

const statusStyles = {
  active: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/40",
  pending: "text-amber-300 bg-amber-500/10 border border-amber-500/40",
  expired: "text-red-300 bg-red-500/10 border border-red-500/40",
};

const statusLabel: Record<keyof typeof statusStyles, string> = {
  active: "Активен",
  pending: "Ожидает",
  expired: "Неактивен",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?mode=login");
    }
  }, [isLoading, router, user]);

  const services = user?.services ?? [];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 -top-24 h-[520px] w-[520px] bg-blue-600/20 blur-[140px] rounded-full" />
      <div className="absolute -left-32 bottom-10 h-[320px] w-[320px] bg-blue-500/15 blur-[140px] rounded-full" />
      <div className="absolute right-[-160px] top-10 h-[420px] w-[420px] bg-blue-400/15 blur-[140px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.12),transparent_45%)]" />

      <Navbar />

      <div className="relative z-10 flex pt-24">
        <aside className="hidden lg:flex w-72 flex-col gap-6 px-6 py-8 bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7a9e3967-e3f4-423b-b273-7c0d91c5ac32/photo_2026-01-05_16-20-34-Photoroom-1767612131816.png?width=8000&height=8000&resize=contain"
                alt="Velocy"
                className="h-full w-full object-contain invert"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">VE HOSTING</p>
              <p className="text-base font-semibold">Клиентский кабинет</p>
            </div>
          </div>

          <div className="space-y-8">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">{section.title}</p>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent transition hover:border-white/10 hover:bg-white/5 ${
                        link.active ? "bg-white/10 border-white/15 text-white" : "text-white/60"
                      }`}
                    >
                      <link.icon className="size-4" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            className="mt-auto inline-flex items-center gap-2 text-sm text-white/60 hover:text-white border border-white/10 rounded-xl px-3 py-2"
          >
            <LogOut className="size-4" />
            Выйти
          </button>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Панель / Рабочая страница</span>
              </div>
              <h1 className="text-2xl font-semibold">Личный кабинет</h1>
              <p className="text-sm text-white/60">Быстрый доступ к услугам и поддержке</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white">
                <Bell className="size-5" />
              </button>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                  <CircleUserRound className="size-5 text-white/70" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{user?.name ?? "Гость"}</p>
                  <p className="text-xs text-white/50">{user?.email ?? "Нет профиля"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent p-6 sm:p-8 shadow-[0_20px_120px_rgba(59,130,246,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-sm text-white/60">Рады снова видеть вас в личном кабинете.</p>
                <h2 className="text-3xl font-bold">Добро пожаловать, {user?.name ?? "гость"}!</h2>
                <p className="text-sm text-white/60">Загляните в услуги — обновления уже доступны.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow-md">
                  <Plus className="size-4" />
                  Купить услугу
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white">
                  <ChevronRight className="size-4" />
                  Перейти в панель
                </button>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Ваши последние услуги</h3>
                <p className="text-sm text-white/60">Быстрый доступ к продуктам и оплатам</p>
              </div>
              <a href="#purchase" className="text-sm text-emerald-200 hover:text-emerald-100 font-semibold">
                Все услуги
              </a>
            </div>

            {services.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
                  <Server className="size-6 text-white/70" />
                </div>
                <p className="text-lg font-semibold">У вас нет услуг</p>
                <p className="text-sm text-white/60">Купите новую услугу, чтобы она отобразилась здесь.</p>
                <div className="flex justify-center gap-3">
                  <a
                    href="/#pricing"
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
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[service.status]}`}>
                        Статус: {statusLabel[service.status]}
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

                    <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                      <span>
                        Статус: <span className="text-emerald-300">{statusLabel[service.status]}</span>
                      </span>
                      <span>Срок: {service.nextInvoice}</span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <button className="flex-1 rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:translate-y-[-1px] transition">
                        Перейти в услугу
                      </button>
                      <button className="h-10 w-10 rounded-xl border border-white/15 bg-white/5 text-white/70 hover:text-white">
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
