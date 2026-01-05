"use client";

import React from "react";
import { Bell, CheckCircle2, KeyRound, Shield, User } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Настройки аккаунта</p>
        <h1 className="text-2xl font-semibold">Изменение имени, пароля и уведомлений</h1>
        <p className="text-sm text-white/60">Управляйте безопасностью и интеграциями</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SettingsCard
            icon={<User className="size-5 text-white/70" />}
            title="Смена никнейма"
            description="Здесь вы можете сменить никнейм и уведомления"
          >
            <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" defaultValue="zhka123@gmail.com" />
            <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow">Сохранить</button>
          </SettingsCard>

          <SettingsCard
            icon={<KeyRound className="size-5 text-white/70" />}
            title="Смена пароля"
            description="Обновите пароль для аккаунта"
          >
            <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" type="password" placeholder="Новый пароль" />
            <input className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm" type="password" placeholder="Подтвердите пароль" />
            <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow">Изменить пароль</button>
          </SettingsCard>
        </div>

        <div className="space-y-4">
          <SettingsCard
            icon={<Bell className="size-5 text-white/70" />}
            title="Уведомления"
            description="Включите уведомления, чтобы не пропустить важные события"
          >
            <Toggle label="Уведомления на почту" defaultOn />
            <Toggle label="Уведомления в браузере" />
          </SettingsCard>

          <SettingsCard
            icon={<Shield className="size-5 text-white/70" />}
            title="Безопасность"
            description="Включите двухфакторную аутентификацию"
          >
            <Toggle label="2FA" />
            <div className="flex items-center gap-2 text-xs text-white/50">
              <CheckCircle2 className="size-4 text-emerald-300" />
              Мы никогда не передаём коды сторонним сервисам.
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
      <span>{label}</span>
      <span className={`h-5 w-10 rounded-full border ${defaultOn ? "border-emerald-300 bg-emerald-500/20" : "border-white/20 bg-white/5"}`}>
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${defaultOn ? "translate-x-5" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}
