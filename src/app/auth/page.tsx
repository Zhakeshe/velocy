"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, LogIn, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/lib/hooks/auth-context";

const fieldStyles = "w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 px-4 py-3";
const labelStyles = "text-sm text-white/70 mb-2 block";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login, register, logout } = useAuth();

  const title = useMemo(() => (mode === "login" ? "Welcome back" : "Create account"), [mode]);
  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Log in to your account to manage your services and billing."
        : "Sign up to access your Velocy LLC client area and manage your products in one place.",
    [mode],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
        setMessage("Успешный вход. Добро пожаловать!");
      } else {
        if (!acceptedTerms) throw new Error("Необходимо согласиться с пользовательским соглашением");
        await register({ name: name.trim(), email: email.trim(), password });
        setMessage("Аккаунт создан. Теперь вы можете управлять услугами");
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Что-то пошло не так";
      setError(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
    setPassword("");
    setEmail("");
    setName("");
    setAcceptedTerms(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 -top-24 h-[520px] w-[520px] bg-blue-600/30 blur-[130px] rounded-full" />
      <div className="absolute -left-24 bottom-10 h-[320px] w-[320px] bg-blue-500/20 blur-[130px] rounded-full" />

      <div className="relative z-10 grid lg:grid-cols-[420px_1fr] min-h-screen">
        <div className="bg-black/80 border-r border-white/10 px-8 md:px-12 py-10 flex flex-col gap-10">
          <div className="flex items-center gap-3 text-white/80">
            <div className="size-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">V</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Velocy</p>
              <p className="font-semibold">Velocy LLC</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 text-sm text-white/70">
              <ShieldCheck className="size-4 text-emerald-300" />
              <span>Secure access to your client area</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-emerald-300">{mode === "login" ? "Authorization" : "Registration"}</p>
              <h1 className="text-4xl font-bold leading-tight">{title}</h1>
              <p className="text-white/60 max-w-md leading-relaxed">{subtitle}</p>
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
            {mode === "register" && (
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

            <div>
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
                  className={`${fieldStyles} pl-11 bg-black/60 border-white/15 focus:border-white/40`}
                />
              </div>
            </div>

            <div>
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

            {mode === "register" ? (
              <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-white/20 bg-white/10"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>Соглашаюсь с пользовательским соглашением и подтверждаю корректность данных</span>
              </label>
            ) : (
              <div className="flex items-center justify-between text-sm text-white/60">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="size-4 rounded border-white/20 bg-white/10" />
                  Запомнить меня
                </label>
                <a href="#" className="text-emerald-200 hover:text-emerald-100">
                  forgot password?
                </a>
              </div>
            )}

            {error ? <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</p> : null}
            {message ? (
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition shadow-lg disabled:opacity-60 ${
                mode === "register"
                  ? "bg-blue-500 hover:bg-blue-400 shadow-blue-500/30"
                  : "bg-white text-black hover:bg-white/90 shadow-white/10"
              }`}
            >
              {isSubmitting ? "Processing..." : mode === "login" ? "Continue" : "Регистрация"}
              {mode === "login" ? <LogIn className="size-4" /> : <ShieldCheck className="size-4" />}
            </button>

            <div className="grid grid-cols-[auto_1fr] gap-3 text-sm text-white/60 items-center">
              <input type="radio" defaultChecked className="accent-emerald-400" />
              <span className="flex items-center justify-between">
                Telegram
                <span className="text-xs text-white/40">or use</span>
              </span>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <button type="button" className="w-full py-3 rounded-xl bg-white/10 border border-white/15 hover:border-white/40">
                  Google
                </button>
                <button type="button" className="w-full py-3 rounded-xl bg-white/10 border border-white/15 hover:border-white/40">
                  Discord
                </button>
              </div>
            </div>
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

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_30%)]" />
          <img
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80"
            alt="Abstract green waves"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
