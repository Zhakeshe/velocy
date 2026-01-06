"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Уведомления</p>
        <h1 className="text-2xl font-semibold">Все ваши уведомления</h1>
        <p className="text-sm text-white/60">Здесь появятся новости, счета и сообщения поддержки</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="relative space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/15">
            <Bell className="size-6 text-white/80" />
          </div>
          <p className="text-lg font-semibold">У вас нет уведомлений</p>
          <p className="text-sm text-white/60">Когда появятся новости или счета, они отобразятся здесь</p>
        </div>
      </div>
    </div>
  );
}
