"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, KeyRound, Mail, Shield, User } from "lucide-react";

import { useAuth } from "@/lib/hooks/auth-context";

export default function AccountSettingsPage() {
  const { user, isLoading, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [prefMessage, setPrefMessage] = useState<string | null>(null);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSavingKey, setPrefSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setNotifyEmail(user.notifyEmail);
    setNotifyBrowser(user.notifyBrowser);
    setTwoFactorEnabled(user.twoFactorEnabled);
  }, [user]);

  const securityScore = useMemo(() => (twoFactorEnabled ? 75 : 25), [twoFactorEnabled]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileSaving(true);

    try {
      await updateProfile({ name: name.trim(), newEmail: email.trim() });
      setProfileMessage("Настройки профиля обновлены");
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Не удалось сохранить данные";
      setProfileError(reason);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Заполните все поля для смены пароля");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    setPasswordSaving(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setPasswordMessage("Пароль успешно обновлён");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Не удалось обновить пароль";
      setPasswordError(reason);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handlePrefToggle = useCallback(
    async (key: "notifyEmail" | "notifyBrowser" | "twoFactorEnabled", value: boolean) => {
      setPrefMessage(null);
      setPrefError(null);
      setPrefSavingKey(key);
      try {
        const payload: {
          notifyEmail?: boolean;
          notifyBrowser?: boolean;
          twoFactorEnabled?: boolean;
        } = { [key]: value };
        await updateProfile(payload);
        setPrefMessage("Настройки уведомлений обновлены");
        if (key === "notifyEmail") setNotifyEmail(value);
        if (key === "notifyBrowser") setNotifyBrowser(value);
        if (key === "twoFactorEnabled") setTwoFactorEnabled(value);
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Не удалось обновить настройки";
        setPrefError(reason);
      } finally {
        setPrefSavingKey(null);
      }
    },
    [updateProfile],
  );

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-64 rounded bg-white/5" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-52 rounded-2xl bg-white/5" />
            <div className="h-64 rounded-2xl bg-white/5" />
          </div>
          <div className="space-y-4">
            <div className="h-60 rounded-2xl bg-white/5" />
            <div className="h-48 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Настройки аккаунта</p>
        <h1 className="text-2xl font-semibold">Изменение имени, пароля и уведомлений</h1>
        <p className="text-sm text-white/60">Управляйте безопасностью и интеграциями</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center gap-3 text-sm text-white/70">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center text-lg font-semibold">
          {user.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold">{user.name}</span>
          <span className="text-white/60">{user.email}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SettingsCard
            icon={<User className="size-5 text-white/70" />}
            title="Смена имени и почты"
            description="Обновите отображаемое имя и основной email"
          >
            <form className="space-y-3" onSubmit={handleProfileSubmit}>
              <div className="space-y-2">
                <label className="text-xs text-white/60" htmlFor="profile-name">
                  Имя пользователя
                </label>
                <div className="relative">
                  <User className="size-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-name"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-9 text-sm"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Введите имя"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/60" htmlFor="profile-email">
                  Основной email
                </label>
                <div className="relative">
                  <Mail className="size-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="profile-email"
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pl-9 text-sm"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              {profileError ? (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{profileError}</p>
              ) : null}
              {profileMessage ? (
                <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  {profileMessage}
                </p>
              ) : null}

              <button
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow disabled:opacity-60"
                disabled={profileSaving}
                type="submit"
              >
                {profileSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </form>
          </SettingsCard>

          <SettingsCard
            icon={<KeyRound className="size-5 text-white/70" />}
            title="Смена пароля"
            description="Обновите пароль для аккаунта"
          >
            <form className="space-y-3" onSubmit={handlePasswordSubmit}>
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm"
                type="password"
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm"
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm"
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              {passwordError ? (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{passwordError}</p>
              ) : null}
              {passwordMessage ? (
                <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  {passwordMessage}
                </p>
              ) : null}

              <button
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow disabled:opacity-60"
                type="submit"
                disabled={passwordSaving}
              >
                {passwordSaving ? "Изменение..." : "Изменить пароль"}
              </button>
            </form>
          </SettingsCard>
        </div>

        <div className="space-y-4">
          <SettingsCard
            icon={<Bell className="size-5 text-white/70" />}
            title="Уведомления"
            description="Включите уведомления, чтобы не пропустить важные события"
          >
            <Toggle
              label="Уведомления на почту"
              checked={notifyEmail}
              loading={prefSavingKey === "notifyEmail"}
              onChange={(next) => handlePrefToggle("notifyEmail", next)}
            />
            <Toggle
              label="Уведомления в браузере"
              checked={notifyBrowser}
              loading={prefSavingKey === "notifyBrowser"}
              onChange={(next) => handlePrefToggle("notifyBrowser", next)}
            />
            {prefError ? <p className="text-xs text-red-400">{prefError}</p> : null}
            {prefMessage ? <p className="text-xs text-emerald-300">{prefMessage}</p> : null}
          </SettingsCard>

          <SettingsCard
            icon={<Shield className="size-5 text-white/70" />}
            title="Безопасность"
            description="Включите двухфакторную аутентификацию"
          >
            <Toggle
              label="2FA"
              checked={twoFactorEnabled}
              loading={prefSavingKey === "twoFactorEnabled"}
              onChange={(next) => handlePrefToggle("twoFactorEnabled", next)}
            />
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Безопасность</span>
                  <span className="text-white/70 font-semibold">{securityScore}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${securityScore}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <CheckCircle2 className="size-4 text-emerald-300" />
                Мы никогда не передаём коды сторонним сервисам.
              </div>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
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

function Toggle({
  label,
  checked,
  loading,
  onChange,
}: {
  label: string;
  checked: boolean;
  loading?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 disabled:opacity-50"
    >
      <span>{label}</span>
      <span
        className={`h-5 w-10 rounded-full border transition ${
          checked ? "border-emerald-300 bg-emerald-500/20" : "border-white/20 bg-white/5"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </span>
    </button>
  );
}
