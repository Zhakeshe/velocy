"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Clock, Globe2, Server, Shield, ShieldCheck, Wallet2 } from "lucide-react";

import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function VirtualServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [panelError, setPanelError] = React.useState<string | null>(null);
  const [panelLoading, setPanelLoading] = React.useState(false);

  const service = useMemo(() => user?.services.find((entry) => entry.id === id), [id, user?.services]);

  const handleOpenPanel = async () => {
    if (!user) return;
    setPanelLoading(true);
    setPanelError(null);
    try {
      const res = await fetch("/api/panel-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, serviceId: service?.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Панель недоступна");
      }
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Панель недоступна";
      setPanelError(message);
    } finally {
      setPanelLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <Shield className="size-4" /> {t("services.emptyDescription") as string}
        </div>
        <button
          onClick={() => router.push("/dashboard/services/virtual")}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          {t("purchase.back") as string}
        </button>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_35%)]" />
      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
          <Link href="/dashboard/services/virtual" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="size-4" />
            {t("purchase.back") as string}
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            <ShieldCheck className="size-3" /> {service.status === "active" ? "Активен" : "В обработке"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            <BadgeCheck className="size-3" /> {service.area}
          </span>
        </div>

        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/40 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{service.hostname}</p>
                <h1 className="text-2xl font-semibold text-white">{service.name}</h1>
                <p className="text-sm text-white/60">Управление вашей услугой</p>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3 text-right">
                <p className="text-xs text-white/40">Стоимость</p>
                <p className="text-xl font-semibold text-white">{service.price}</p>
                <p className="text-xs text-emerald-200">Статус: {service.status === "active" ? "Активен" : "Приостановлен"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <InfoRow label="Тариф" value={service.plan} />
                <InfoRow label="Стоимость" value={service.price} />
                <InfoRow label="Сервер" value={service.ip || "83.131.25.99"} />
                <InfoRow label="PTR" value={service.ptr || "velocy.cloud"} />
                <InfoRow label="Активен с" value={formatDate(service.activatedAt)} />
                <InfoRow label="Следующая оплата" value={formatDate(service.nextInvoice)} />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <ActionButton
                icon={<Server className="size-4" />}
                label={panelLoading ? "Открываем..." : "Панель управления"}
                onClick={handleOpenPanel}
              />
              <ActionButton icon={<Clock className="size-4" />} label="Продлить" href="/dashboard/balance" />
              <ActionButton icon={<Globe2 className="size-4" />} label="Настроить PTR" href="#" />
            </div>
            {panelError ? <p className="text-xs text-red-300">{panelError}</p> : null}
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/60 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">{t("nav.balance") as string}</p>
                <p className="text-2xl font-semibold text-white">{(user?.balance ?? 0).toLocaleString()} ₸</p>
              </div>
              <Wallet2 className="size-6 text-white/60" />
            </div>
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Пополните баланс, чтобы продлить услугу вовремя. Автопродление активно.
            </div>
            <Link
              href="/dashboard/balance"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Пополнить <ArrowRight className="size-4" />
            </Link>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="size-4" /> Автоматическое продление включено
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Shield className="size-4" /> Анти-DDoS активен
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70">
      <span>{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function ActionButton({
  label,
  href,
  icon,
  onClick,
}: {
  label: string;
  href?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  const className =
    "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ArrowRight className="size-4 text-white/60" />
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
      <ArrowRight className="size-4 text-white/60" />
    </Link>
  );
}
