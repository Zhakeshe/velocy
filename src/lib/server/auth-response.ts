import { NextResponse } from "next/server";

import type { AuthUser } from "@/lib/types/auth";

export function renderAuthCompletion(user: AuthUser) {
  const body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Completing sign in…</title>
    <style>
      body { font-family: system-ui, -apple-system, "Inter", sans-serif; background: #020203; color: white; display: grid; place-items: center; min-height: 100vh; }
      .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); padding: 32px; border-radius: 16px; box-shadow: 0 20px 80px rgba(0,0,0,0.35); max-width: 420px; text-align: center; }
      .pulse { width: 42px; height: 42px; border-radius: 50%; margin: 0 auto 16px; border: 3px solid rgba(80,152,255,0.3); border-top-color: #5098ff; animation: spin 1.4s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .muted { color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="pulse"></div>
      <h1>Redirecting to dashboard</h1>
      <p class="muted">Ваш вход выполнен. Подготавливаем рабочую область…</p>
    </div>
    <script>
      const user = ${JSON.stringify(user)};
      try {
        localStorage.setItem('ve_auth_session_email', user.email);
        localStorage.setItem('ve_auth_session_user', JSON.stringify(user));
      } catch (e) { console.error('Unable to persist session', e); }
      window.location.href = '/dashboard';
    </script>
  </body>
</html>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
