"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, BadgeCheck, CreditCard, Loader2, Lock, ShieldCheck, Ticket, Wallet } from "lucide-react";

import { useAuth } from "@/lib/hooks/auth-context";
import { useLocale } from "@/lib/hooks/locale-context";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  owner: string;
  price: number;
  currency: string;
  region: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  ddos: string;
};

const locations = ["Germany", "Finland", "USA"];
const systems = ["Ubuntu 24.04", "Debian 12", "Rocky Linux 9", "Windows Server 2022"];
const panels = ["Без панели", "HestiaCP", "ISPmanager"];
const billingPeriods = ["Ежемесячно", "Ежеквартально", "За год"];

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { t } = useLocale();
  const [item, setItem] = React.useState<CatalogItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    location: locations[0],
    system: systems[0],
    panel: panels[0],
    billing: billingPeriods[0],
    notes: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(`/api/admin/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setItem(data?.item ?? null);
      })
      .catch(() => {
        if (!active) return;
        setItem(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      setError(t("purchase.authRequired") as string);
      return;
    }

    if (!item) {
      setError(t("purchase.loading") as string);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          catalogId: id,
          region: form.location,
          billing: form.billing,
          os: form.system,
          panel: form.panel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          router.push("/dashboard/balance");
          throw new Error(t("purchase.balanceRequired") as string);
        }
        throw new Error(data?.error || "Не удалось оформить");
      }
      await refreshUser();
      if (data?.order?.id) {
        const panelRes = await fetch("/api/panel-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, orderId: data.order.id }),
        });
        if (panelRes.ok) {
          const panelData = await panelRes.json();
          if (panelData?.url) {
            window.location.href = panelData.url as string;
            return;
          }
        }
      }
      router.push("/dashboard/services/virtual");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось оформить";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const priceLabel = item ? `${item.price.toLocaleString()}${item.currency} / мес.` : "";

  if (!loading && !item) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <ShieldCheck className="size-4" /> {t("purchase.loading") as string}
        </div>
        <Link href="/dashboard/purchase" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft className="size-4" />
          {t("purchase.back") as string}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
        <Link href="/dashboard/purchase" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft className="size-4" />
          {t("purchase.back") as string}
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
          <ShieldCheck className="size-3" /> Anti DDoS
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t("purchase.checkoutTitle") as string}</p>
              <h1 className="text-2xl font-semibold text-white">{item?.name ?? t("purchase.loading")}</h1>
            </div>
            <BadgeCheck className="size-6 text-emerald-300" />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label={t("purchase.checkoutLocation") as string}>
              <select
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {locations.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </Field>
            <Field label={t("purchase.checkoutSystem") as string}>
              <select
                value={form.system}
                onChange={(e) => setForm((prev) => ({ ...prev, system: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {systems.map((os) => (
                  <option key={os}>{os}</option>
                ))}
              </select>
            </Field>
            <Field label={t("purchase.checkoutPanel") as string}>
              <select
                value={form.panel}
                onChange={(e) => setForm((prev) => ({ ...prev, panel: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {panels.map((panel) => (
                  <option key={panel}>{panel}</option>
                ))}
              </select>
            </Field>
            <Field label={t("purchase.checkoutBilling") as string}>
              <select
                value={form.billing}
                onChange={(e) => setForm((prev) => ({ ...prev, billing: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {billingPeriods.map((period) => (
                  <option key={period}>{period}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("purchase.checkoutNotes") as string}>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder={t("purchase.checkoutNotesPlaceholder") as string}
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/5 p-3">
              <CreditCard className="size-5 text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t("purchase.summary") as string}</p>
              <p className="text-xs text-white/50">{t("purchase.summaryCaption") as string}</p>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            <Row label="Тариф" value={item?.name ?? "—"} />
            <Row label="Локация" value={form.location} />
            <Row label="Система" value={form.system} />
            <Row label="Панель" value={form.panel} />
            <Row label="Период" value={form.billing} />
            <Row label="Цена" value={priceLabel || "—"} />
          </div>

          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/70">
            <div className="flex items-center gap-2 text-white">
              <Wallet className="size-4" /> {t("purchase.checkoutPayWith") as string}
            </div>
            <p className="mt-1 text-xs text-white/50">{t("purchase.checkoutPayHint") as string}</p>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            onClick={handlePurchase}
            disabled={saving || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {t("purchase.checkoutCta") as string}
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
            <Ticket className="size-4" /> {t("purchase.checkoutSupport") as string}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-white/80">
      <span className="text-xs uppercase tracking-[0.08em] text-white/40">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-white/80">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
