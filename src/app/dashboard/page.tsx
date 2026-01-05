"use client";

import React from "react";
import { Bell, CheckCircle2, Clock, CreditCard, FlameKindling, NotebookPen, Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const services = user?.services ?? [];
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("hero.title") as string}</p>
          <h1 className="text-2xl font-semibold">{t("hero.greeting", { name: user?.name ?? "гость" }) as string}</h1>
          <p className="text-sm text-white/60">{t("hero.subtitle") as string}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/dashboard/purchase"
            className="flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition"
          >
            <Plus className="size-4" />
            {t("hero.ctaPrimary") as string}
          </a>
          <button className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white">
            <Bell className="size-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-[0_12px_80px_rgba(59,130,246,0.25)]">
          <p className="text-xs text-white/60">{t("stats.balance") as string}</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-bold">4 ₽</p>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">{t("stats.balanceDelta") as string}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">{t("stats.products") as string}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{services.length}</p>
            <span className="text-xs text-white/40">{t("stats.productsHint") as string}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">{t("stats.invoice") as string}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xl font-semibold">22 July 2025</p>
            <p className="text-xs text-white/50">{t("stats.invoiceHint") as string}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/60">{t("stats.support") as string}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/20 via-blue-500/20 to-transparent flex items-center justify-center border border-white/10">
              <FlameKindling className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Онлайн 24/7</p>
              <p className="text-xs text-white/50">{t("stats.supportHint") as string}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t("services.title") as string}</h3>
            <p className="text-sm text-white/60">{t("services.subtitle") as string}</p>
          </div>
          <a href="/dashboard/purchase" className="text-sm text-emerald-200 hover:text-emerald-100 font-semibold">
            {t("hero.ctaPrimary") as string}
          </a>
        </div>

        {services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
              <NotebookPen className="size-6 text-white/70" />
            </div>
            <p className="text-lg font-semibold">{t("services.emptyTitle") as string}</p>
            <p className="text-sm text-white/60">{t("services.emptyDescription") as string}</p>
            <div className="flex justify-center gap-3">
              <a
                href="/dashboard/purchase"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-emerald-500/30"
              >
                {t("services.emptyPrimary") as string}
              </a>
              <a href="/auth" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white">
                {t("services.emptySecondary") as string}
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
                    <p className="text-sm text-white/60">{service.area}</p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                    {t("services.status.active") as string}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                    <CheckCircle2 className="size-4 text-emerald-300" />
                    <span>
                      {t("services.price") as string}: {service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                    <Clock className="size-4 text-white/50" />
                    <span>
                      {t("services.billing") as string}: {service.billing}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <a
                    href="/dashboard/wiki"
                    className="flex-1 text-center rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition"
                  >
                    {t("services.open") as string}
                  </a>
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
