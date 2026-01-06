"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  CircleUserRound,
  CreditCard,
  FileText,
  Gamepad2,
  Gift,
  Home,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Server,
  Settings,
  ShieldCheck,
  Wallet2,
  X,
  BookOpen,
  ChevronRight,
  PlusCircle,
  Users,
  Monitor,
  Snowflake,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/hooks/locale-context";
import { Particles } from "@/components/ui/particles";

const navSections = [
  {
    title: null,
    links: [
      { icon: Home, label: "Домашняя страница", href: "/dashboard" },
      { icon: Bell, label: "Уведомления", href: "/dashboard/notifications" },
      { icon: Wallet2, label: "Пополнить баланс", href: "/dashboard/balance" },
      { icon: CreditCard, label: "Приобрести услугу", href: "/dashboard/purchase" },
    ],
  },
  {
    title: "УСЛУГИ",
    links: [
      { icon: Monitor, label: "Виртуальные серверы", href: "/dashboard/services/virtual" },
      { icon: Gamepad2, label: "Игровые серверы", href: "/dashboard/services/games" },
      { icon: Server, label: "Выделенные серверы", href: "/dashboard/services/dedicated" },
    ],
  },
  {
    title: "ПОДДЕРЖКА",
    links: [
      { icon: PlusCircle, label: "Создать обращение", href: "/dashboard/support/create" },
      { icon: MessageSquare, label: "Активные обращения", href: "/dashboard/support/active" },
    ],
  },
  {
    title: "АККАУНТ",
    links: [
      { icon: Settings, label: "Настройки", href: "/dashboard/account/settings" },
      { icon: FileText, label: "Счета", href: "/dashboard/account/invoices" },
      { icon: Gift, label: "Реферальная программа", href: "/dashboard/referrals" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?mode=login");
    }
  }, [isLoading, router, user]);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#050505]" />
    );
  }

  if (!user) return null;

  const balance = user?.balance ?? 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <Particles />

      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#050505]/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-10 flex items-center justify-center">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7a9e3967-e3f4-423b-b273-7c0d91c5ac32/photo_2026-01-05_16-20-34-Photoroom-1767612131816.png?width=8000&height=8000&resize=contain"
                alt="Logo"
                className="w-full h-full object-contain invert opacity-90 transition-opacity hover:opacity-100"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors duration-200">
            <Home className="size-[16px]" />
            Главная
          </Link>
          <Link href="/dashboard/wiki" className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors duration-200">
            <BookOpen className="size-[16px]" />
            Вики
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="size-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-400 hover:bg-white/[0.08] transition-all">
            <Snowflake className="size-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
            <img src="https://flagcdn.com/ru.svg" alt="RU" className="size-4 rounded-sm object-cover" />
          </div>
          <Link href="/dashboard/account/settings" className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all text-sm group">
            <CircleUserRound className="size-4 text-pink-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium text-white/90">{user.name}</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden size-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-16 bottom-0 bg-[#050505] border-r border-white/5 overflow-y-auto no-scrollbar z-40">
          {/* User profile */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="size-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <CircleUserRound className="size-[22px] text-white/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white/90 truncate">{user.name}</p>
                <p className="text-[13px] text-white/40 mt-0.5 font-medium tracking-tight">💳 {balance} ₽</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-8 space-y-7">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                {section.title && (
                  <p className="text-[11px] uppercase tracking-[0.1em] text-red-500 font-bold mb-3 px-3">
                    {section.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all group ${active
                          ? "bg-white/[0.03] text-white border border-white/5"
                          : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                          }`}
                      >
                        <link.icon className={`size-[18px] transition-colors ${active ? "text-white/80" : "text-white/20 group-hover:text-white/40"}`} />
                        <span className="flex-1">{link.label}</span>
                        <ChevronRight className={`size-3.5 transition-transform duration-200 ${active ? "text-white/20" : "opacity-0 -translate-x-2 group-hover:opacity-10 group-hover:translate-x-0"}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all"
            >
              <LogOut className="size-4" />
              Выйти
            </button>
          </div>
        </aside>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] pt-16">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative bg-[#050505] w-72 h-full border-r border-white/5 overflow-y-auto overflow-x-hidden flex flex-col">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                    <CircleUserRound className="size-[22px] text-white/20" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white/90">{user.name}</p>
                    <p className="text-[13px] text-white/40 font-medium">💳 {balance} ₽</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 px-4 space-y-7 pb-8">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {section.title && (
                      <p className="text-[11px] uppercase tracking-[0.1em] text-red-500 font-bold mb-3 px-3">
                        {section.title}
                      </p>
                    )}
                    <div className="space-y-0.5">
                      {section.links.map((link) => {
                        const active = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${active ? "bg-white/[0.03] text-white border border-white/5" : "text-white/40"
                              }`}
                          >
                            <link.icon className="size-[18px]" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white/30"
                >
                  <LogOut className="size-4" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-64px)] p-6 lg:p-10 relative z-10">
          <div key={pathname} className="page-transition max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

