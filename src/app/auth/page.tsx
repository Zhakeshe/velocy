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

  const title = useMemo(() => (mode === "login" ? "Авторизация" : "Регистрация"), [mode]);
  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "Чтобы управлять своими услугами и аккаунтом вам нужно авторизоваться в личном кабинете"
        : "Если вы все еще не зарегистрированы на нашем сервисе, то вам необходимо сделать это, чтобы приобретать услуги и пользоваться ими",
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

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setMessage(null);
    setPassword("");
    setEmail("");
    setName("");
    setAcceptedTerms(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_40%)]" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-10 h-[450px] w-[450px] bg-blue-600/30 blur-[130px] rounded-full" />
      <div className="absolute -left-20 bottom-10 h-[360px] w-[360px] bg-pink-500/20 blur-[130px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-0 py-16 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
            <span className="p-2 rounded-full border border-white/10 bg-white/5"><ArrowLeft className="size-4" /></span>
            На главную
          </a>

          {user ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <UserRound className="size-4 text-pink-300" />
                <span className="font-medium">{user.name}</span>
                <span className="text-white/50">•</span>
                <span className="text-white/60">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition"
              >
                Выйти
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="size-8 rounded-full bg-pink-500/15 flex items-center justify-center border border-pink-500/30">
                <ShieldCheck className="size-4 text-pink-300" />
              </div>
              <div className="text-sm text-white/70">Надежная защита данных и прозрачность в каждом действии</div>
            </div>

            <div>
              <p className="text-sm text-pink-300 uppercase tracking-[0.25em] mb-2">VE Hosting</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
            </div>

            <p className="text-lg text-white/70 leading-relaxed max-w-2xl">{subtitle}</p>

            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Круглосуточная поддержка</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Безопасный вход</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Простая регистрация</span>
            </div>
          </div>

          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/60">{mode === "login" ? "Добро пожаловать" : "Создание аккаунта"}</p>
                  <h2 className="text-2xl font-semibold mt-1">{title}</h2>
                </div>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-sm font-semibold text-pink-300 hover:text-pink-200"
                >
                  {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                </button>
              </div>

              {mode === "register" && (
                <div>
                  <label className={labelStyles} htmlFor="name">
                    Как к вам обращаться
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
                      placeholder="Введите имя"
                      className={`${fieldStyles} pl-11`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className={labelStyles} htmlFor="email">
                  Введите почту
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
                    placeholder="example@email.com"
                    className={`${fieldStyles} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelStyles} htmlFor="password">
                  Пароль
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
                    placeholder="Введите пароль"
                    className={`${fieldStyles} pl-11`}
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
                  <a href="#" className="text-pink-200 hover:text-pink-100">
                    Забыли пароль?
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
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 transition disabled:opacity-60"
              >
                {isSubmitting ? "Подождите..." : mode === "login" ? "Авторизоваться" : "Зарегистрироваться"}
                {mode === "login" ? <LogIn className="size-4" /> : <ShieldCheck className="size-4" />}
              </button>

              <div className="text-center text-sm text-white/60">
                {mode === "login" ? "Еще нет аккаунта?" : "Уже зарегистрированы?"} {" "}
                <button onClick={switchMode} type="button" className="text-pink-200 hover:text-pink-100 font-semibold">
                  {mode === "login" ? "Создать" : "Войти"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
