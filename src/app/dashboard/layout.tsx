"use client";

import React, { useEffect } from "react";
import {
  Bell,
  CircleUserRound,
  CreditCard,
  Gamepad2,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet2,
} from "lucide-react";
import Navbar from "@/components/sections/navbar";
import { useAuth } from "@/lib/hooks/auth-context";
import { usePathname, useRouter } from "next/navigation";

const navSections = [
  {
    title: "Общее",
    links: [
      { icon: Home, label: "Домашняя страница", href: "/dashboard" },
      { icon: Bell, label: "Уведомления", href: "/dashboard/notifications" },
      { icon: Wallet2, label: "Пополнение баланс", href: "/dashboard/balance" },
      { icon: ShoppingBag, label: "Приобрести услуги", href: "/dashboard/purchase" },
    ],
  },
  {
    title: "Услуги",
    links: [
      { icon: LayoutDashboard, label: "Виртуальные серверы", href: "/dashboard/services/virtual" },
      { icon: Gamepad2, label: "Игровые сервера", href: "/dashboard/services/games" },
      { icon: ShieldCheck, label: "Выделенные серверы", href: "/dashboard/services/dedicated" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { icon: MessageSquare, label: "Создать обращение", href: "/dashboard/support/create" },
      { icon: LifeBuoy, label: "Активные обращения", href: "/dashboard/support/active" },
    ],
  },
  {
    title: "Аккаунт",
    links: [
      { icon: Settings, label: "Настройки", href: "/dashboard/account/settings" },
      { icon: CreditCard, label: "Счета", href: "/dashboard/account/invoices" },
      { icon: Sparkles, label: "Реферальная система", href: "/dashboard/referrals" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?mode=login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">Загрузка...</div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030304] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-20 top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[150px]" />
        <div className="absolute right-[-100px] top-10 h-[360px] w-[360px] rounded-full bg-blue-400/15 blur-[160px]" />
        <div className="absolute -left-24 bottom-10 h-[280px] w-[280px] rounded-full bg-emerald-400/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.08),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.06),transparent_25%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.05),transparent_30%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08]" />
      </div>

      <Navbar />

      <div className="relative z-10 pt-20 flex">
        <aside className="hidden lg:flex w-72 flex-col gap-6 px-5 py-7 border-r border-white/10 bg-white/5 backdrop-blur-xl min-h-[calc(100vh-80px)]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400/30 via-blue-500/30 to-transparent flex items-center justify-center border border-white/15">
              <CircleUserRound className="size-6 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-white/50">{user.email}</p>
            </div>
          </div>

          <div className="space-y-7">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{section.title}</p>
                <div className="space-y-1.5">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition text-sm font-medium ${
                          active
                            ? "bg-white/10 border-white/20 text-white shadow-[0_10px_40px_rgba(59,130,246,0.2)]"
                            : "border-transparent text-white/60 hover:text-white hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <link.icon className="size-4" />
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 hover:text-white"
          >
            <LogOut className="size-4" />
            Выйти
          </button>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-16 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:px-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Sparkles className="size-4 text-emerald-300" />
              <span>Добро пожаловать обратно</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
              <button className={`rounded-lg px-3 py-1 ${pathname === "/dashboard" ? "bg-white/10 text-white" : "hover:bg-white/5"}`} onClick={() => router.push("/dashboard")}>Главная</button>
              <button className={`rounded-lg px-3 py-1 ${pathname.startsWith("/dashboard/balance") ? "bg-white/10 text-white" : "hover:bg-white/5"}`} onClick={() => router.push("/dashboard/balance")}>Финансы</button>
              <button className="rounded-lg px-3 py-1 hover:bg-white/5">Вики</button>
            </div>
          </div>

          {children}
        </main>
      </div>

      <button className="fixed bottom-6 right-6 lg:hidden rounded-full bg-white/10 border border-white/15 p-3 text-white/80">
        <Menu className="size-5" />
      </button>
    </div>
  );
}
