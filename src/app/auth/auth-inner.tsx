"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, LogIn, Mail, ShieldCheck, UserRound } from "lucide-react";

import Navbar from "@/components/sections/navbar";
import { useAuth } from "@/lib/hooks/auth-context";

const fieldStyles = "w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 px-4 py-3";
const labelStyles = "text-sm text-white/70 mb-2 block";

export default function AuthInner() {
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [authStep, setAuthStep] = useState<"login" | "register" | "verify-email" | "verify-2fa">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { user, isLoading, login, register, verifyEmail, verifyTwoFactor, logout } = useAuth();

  const title = useMemo(() => {
    if (authStep === "verify-2fa") return "Two-factor verification";
    if (authStep === "verify-email") return "Email confirmation";
    return mode === "login" ? "Welcome back" : "Create account";
  }, [authStep, mode]);
  const subtitle = useMemo(
    () =>
      authStep === "verify-2fa"
        ? "Введите код, отправленный на ваш email, чтобы завершить вход."
        : authStep === "verify-email"
          ? "Мы отправили код подтверждения на почту. Введите его ниже."
          : mode === "login"
            ? "Log in to your account to manage your services and billing."
            : "Sign up to access your client area and manage your products in one place.",
    [authStep, mode],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (authStep === "verify-email") {
        const result = await verifyEmail({ email: email.trim(), code: code.trim() });
        if (result.status === "ok") {
          setMessage("Email подтвержден. Переадресация...");
          await new Promise((resolve) => setTimeout(resolve, 100));
          router.push("/dashboard");
        }
        return;
      }

      if (authStep === "verify-2fa") {
        const result = await verifyTwoFactor({ email: email.trim(), code: code.trim() });
        if (result.status === "ok") {
          setMessage("Вход подтвержден. Переадресация...");
          await new Promise((resolve) => setTimeout(resolve, 100));
          router.push("/dashboard");
        }
        return;
      }

      if (mode === "login") {
        const result = await login(email.trim(), password);
        if (result.status === "verification") {
          setAuthStep("verify-email");
          setMessage("Код подтверждения отправлен на email.");
          setIsSubmitting(false);
          return;
        }
        if (result.status === "twoFactor") {
          setAuthStep("verify-2fa");
          setMessage("Код для входа отправлен на email.");
          setIsSubmitting(false);
          return;
        }

        setMessage("Успешный вход. Переадресация...");
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/dashboard");
        return;
      }

      if (!acceptedTerms) throw new Error("Необходимо согласиться с пользовательским соглашением");
      const result = await register({ name: name.trim(), email: email.trim(), password });
      if (result.status === "verification") {
        setAuthStep("verify-email");
        setMessage("Код подтверждения отправлен на email.");
        setIsSubmitting(false);
        return;
      }

      setMessage("Аккаунт создан. Переадресация...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/dashboard");
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Что-то пошло не так";
      setError(reason);
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setAuthStep(nextMode);
    setError(null);
    setMessage(null);
    setPassword("");
    setEmail("");
    setName("");
    setCode("");
    setAcceptedTerms(false);
  };

  const handleOAuthRedirect = (provider: "telegram" | "google" | "discord") => {
    if (typeof window === "undefined") return;
    window.location.href = `/api/auth/${provider}`;
  };

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 -top-24 h-[520px] w-[520px] bg-blue-600/30 blur-[130px] rounded-full" />
      <div className="absolute -left-24 bottom-10 h-[320px] w-[320px] bg-blue-500/20 blur-[130px] rounded-full" />

      <div className="relative z-10 grid lg:grid-cols-[480px_1fr] min-h-screen">
        <div className="bg-black px-8 md:px-14 pl-10 md:pl-16 py-16 flex flex-col justify-center gap-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-emerald-300">{mode === "login" ? "Authorization" : "Registration"}</p>
              <h1 className="text-3xl font-bold leading-tight">{title}</h1>
              <p className="text-white/60 max-w-md leading-relaxed text-sm">{subtitle}</p>
            </div>

            <div className="inline-flex items-center gap-4 text-sm text-white/60">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`font-semibold ${mode === "login" ? "text-white" : "text-white/50"}`}
              >
                Авторизация
              </button>
              <span className="text-white/30">/</span>
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className={`font-semibold ${mode === "register" ? "text-white" : "text-white/50"}`}
              >
                регистрация
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "register" && authStep === "register" && (
              <div>
                <label className={labelStyles} htmlFor="name">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="size-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Velocy User"
                    className={`${fieldStyles} pl-11 bg-black/60 border-white/15 focus:border-white/40`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className={labelStyles} htmlFor="email">
                email
              </label>
              <div className="relative">
                <Mail className="size-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@velocy.io"
                  disabled={authStep === "verify-email" || authStep === "verify-2fa"}
                  className={`${fieldStyles} pl-11 bg-black/60 border-white/15 focus:border-white/40`}
                />
              </div>
            </div>

            {authStep === "login" || authStep === "register" ? (
              <div className="space-y-1">
                <label className={labelStyles} htmlFor="password">
                  password
                </label>
                <div className="relative">
                  <Lock className="size-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className={`${fieldStyles} pl-11 bg-black/60 border-white/15 focus:border-white/40`}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className={labelStyles} htmlFor="code">
                  verification code
                </label>
                <div className="relative">
                  <ShieldCheck className="size-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    required
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="123456"
                    className={`${fieldStyles} pl-11 bg-black/60 border-white/15 focus:border-white/40`}
                  />
                </div>
              </div>
            )}

            {mode === "register" && authStep === "register" ? (
              <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer select-none leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-white/20 bg-white/10"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>Соглашаюсь с пользовательским соглашением и подтверждаю корректность данных</span>
              </label>
            ) : authStep === "login" ? (
              <div className="flex items-center justify-between text-sm text-white/60">
                <a href="#" className="text-emerald-200 hover:text-emerald-100">
                  forgot password?
                </a>
                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className="text-white hover:text-white/80 font-semibold"
                >
                  register
                </button>
              </div>
            ) : null}

            {error ? <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p> : null}
            {message ? (
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition shadow-lg disabled:opacity-60 ${mode === "register"
                ? "bg-blue-500 hover:bg-blue-400 shadow-blue-500/30"
                : "bg-white text-black hover:bg-white/90 shadow-white/10"
                }`}
            >
              {isSubmitting ? (message?.includes("Переадресация") ? "Entering..." : "Processing...") : authStep === "verify-2fa" ? "Подтвердить вход" : authStep === "verify-email" ? "Подтвердить email" : mode === "login" ? "Continue" : "Регистрация"}
              {mode === "login" && authStep === "login" ? <LogIn className="size-4" /> : <ShieldCheck className="size-4" />}
            </button>

            {authStep === "login" || authStep === "register" ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleOAuthRedirect("telegram")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2AABEE] text-white font-semibold border border-white/15 shadow-[0_15px_60px_rgba(42,171,238,0.35)] hover:brightness-110 transition"
                >
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/15 border border-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M22.94 3.15a1.01 1.01 0 0 0-1.08-.15L2.6 11.54a.96.96 0 0 0-.6.92c.03.39.31.72.7.81l4.86 1.2 1.95 6.11c.11.33.39.56.73.61h.11a.94.94 0 0 0 .67-.28l3.05-3.1 4.62 3.31c.17.12.36.18.55.18.14 0 .28-.03.41-.09a.95.95 0 0 0 .57-.69l3-15.65c.07-.34-.08-.69-.36-.9Zm-4.57 3.1-9.17 8.73a.6.6 0 0 0-.17.57l.62 2.77-.98-3.07 9.7-8.02-12.15 6.7 14.28-7.5-.13.65Z" />
                    </svg>
                  </span>
                  Войти через Telegram
                </button>
                <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                  <button
                    type="button"
                    onClick={() => handleOAuthRedirect("google")}
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/15 hover:border-white/40"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuthRedirect("discord")}
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/15 hover:border-white/40"
                  >
                    Discord
                  </button>
                </div>
              </div>
            ) : null}
          </form>

          <div className="flex items-center gap-3 text-sm text-white/50">
            <a href="/" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <ArrowLeft className="size-4" />
              Back to home
            </a>
            {user ? (
              <>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                  <UserRound className="size-3 text-emerald-300" />
                  <span className="font-medium">{user.name}</span>
                  <button onClick={logout} className="text-white/60 hover:text-white font-semibold">
                    Выйти
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Right side - Full bleed image */}
        <div className="relative hidden lg:block h-full min-h-screen">
          <div className="absolute inset-0">
            <img
              src="/12.jpg"
              alt="Velocy reference background"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
