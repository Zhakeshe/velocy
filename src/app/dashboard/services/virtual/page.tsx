"use client";

import React from "react";
import { CheckCircle2, Clock, NotebookPen } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

export default function VirtualServicesPage() {
  const { user } = useAuth();
  const services = user?.services ?? [];
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("nav.products") as string}</p>
        <h1 className="text-2xl font-semibold">{t("services.title") as string}</h1>
        <p className="text-sm text-white/60">{t("services.subtitle") as string}</p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/15">
            <NotebookPen className="size-6 text-white/70" />
          </div>
          <p className="text-lg font-semibold">{t("services.emptyTitle") as string}</p>
          <p className="text-sm text-white/60">{t("services.emptyDescription") as string}</p>
          <a
            href="/dashboard/purchase"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold"
          >
            {t("services.emptyPrimary") as string}
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/5 to-transparent p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50">Активен с 23 декабря 2024</p>
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-sm text-white/60">{service.plan}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">{service.area}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <p>
                  {t("services.price") as string}: {service.price}
                </p>
                <p>Следующая оплата: {service.nextInvoice}</p>
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="size-4" />
                  {t("services.status.active") as string}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <span>Автопродление: Включено</span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1 border border-white/10">
                  <Clock className="size-4" />
                  24/7
                </span>
              </div>
              <a
                href={`/dashboard/services/virtual/${service.id}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black py-2 text-sm font-semibold shadow hover:-translate-y-0.5 transition"
              >
                Перейти в панель
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
