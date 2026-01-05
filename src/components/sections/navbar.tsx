"use client";

import React from "react";
import { User, Home, HelpCircle, CreditCard, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();

  const ctaLabel = user ? user.name : "Авторизация";

  return (
    <header className="w-full px-4 lg:px-16 py-6 fixed top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between mx-auto max-w-[100rem]">
        <div className="flex items-center">
          <a href="/" className="flex items-center group" aria-label="Logo">
            <div className="relative flex items-center justify-center size-10 overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7a9e3967-e3f4-423b-b273-7c0d91c5ac32/photo_2026-01-05_16-20-34-Photoroom-1767612131816.png?width=8000&height=8000&resize=contain"
                alt="Logo"
                className="w-full h-full object-contain invert"
              />
            </div>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            <Home className="size-4" />
            {t("nav.home") as string}
          </a>
          <a
            href="#why-us"
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <HelpCircle className="size-4" />
            {t("nav.notifications") as string}
          </a>
          <a
            href="#pricing"
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <CreditCard className="size-4" />
            {t("nav.balance") as string}
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <MessageCircle className="size-4" />
            {t("nav.supportCreate") as string}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/70">
            {[
              { code: "en", label: "Eng" },
              { code: "ru", label: "Рус" },
              { code: "kk", label: "Қаз" },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => setLocale(item.code as typeof locale)}
                className={`px-2 py-1 rounded-full transition ${locale === item.code ? "bg-white/20 text-white" : "hover:bg-white/10"}`}
                type="button"
                aria-pressed={locale === item.code}
              >
                {item.label}
              </button>
            ))}
          </div>
          {user ? (
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white"
            >
              <LogOut className="size-4" />
              Выйти
            </button>
          ) : null}
          <a
            href="/auth"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors rounded-full bg-white/5 border border-white/10"
          >
            <User className="size-4" />
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
