"use client";

import React from "react";
import { ArrowRight, Server } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const services = user?.services ?? [];
  const hasServices = services.length > 0;

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/5 h-[220px] lg:h-[240px] bg-gradient-to-br from-[#1a0b0e] via-[#050505] to-[#050505]">
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden pointer-events-none opacity-60">
          <img
            src="/23.png"
            alt="Welcome"
            className="w-full h-full object-contain object-right translate-x-10 scale-110"
          />
          {/* Soft gradient fade for the image */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="relative z-20 flex flex-col justify-center h-full p-8 lg:p-12 max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white/90">
            Добро пожаловать, <span className="text-[#a78bfa]">{user?.name ?? "гость"}</span>!
          </h1>
          <p className="text-[15px] lg:text-[16px] text-white/40 leading-relaxed mt-4 font-medium max-w-md">
            Лиза снова рада видеть Вас в личном кабинете.<br />
            Заглядывайте сюда почаще! <span className="text-purple-400">💜</span>
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-6">
        <h2 className="text-[19px] font-bold text-white/90">Ваши последние услуги</h2>

        {hasServices ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <a
                key={service.id}
                href={`/dashboard/services/virtual/${service.id}`}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Server className="size-6 text-blue-400/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-white/90 truncate">{service.name}</p>
                    <p className="text-[13px] text-white/40 font-medium mt-1">{service.plan}</p>
                    <p className="text-[12px] text-white/30 mt-1.5 uppercase tracking-wider">{service.area}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-tight">
                    Активен
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="relative rounded-[24px] border border-white/5 bg-white/[0.015] p-10 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white/90">У вас нет активных услуг</h3>
                <p className="text-[15px] text-white/30 font-medium">
                  Видимо, у вас пока нет активных тарифных планов или услуг, но это можно исправить!
                </p>
              </div>
              <a
                href="/dashboard/purchase"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.03] border border-white/5 text-[14.5px] font-bold text-white/90 hover:bg-white/[0.08] transition-all whitespace-nowrap group"
              >
                <span className="transition-transform group-hover:translate-x-0.5">Приобрести сервер</span>
                <ArrowRight className="size-4 text-white/20 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            {/* Subtle decorative glow */}
            <div className="absolute -bottom-24 -right-24 size-48 bg-white/5 blur-[100px] pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}

