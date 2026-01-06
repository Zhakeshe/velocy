import { NextResponse } from "next/server";

import { renderAuthCompletion } from "@/lib/server/auth-response";
import { fetchUserByEmail, upsertOAuthUser } from "@/lib/server/database";

async function exchangeGoogleToken(code: string, redirectUri: string, clientId?: string, clientSecret?: string) {
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("Не удалось завершить вход через Google");
  }

  return (await res.json()) as { access_token: string };
}

async function fetchGoogleProfile(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Не удалось получить профиль Google");
  }

  return (await res.json()) as { id: string; email: string; name?: string; given_name?: string };
}

function renderNamePrompt(email: string, suggestedName: string) {
  const body = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Завершение входа</title>
    <style>
      body { font-family: system-ui, -apple-system, "Inter", sans-serif; background: #020203; color: white; display: grid; place-items: center; min-height: 100vh; }
      .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); padding: 32px; border-radius: 16px; box-shadow: 0 20px 80px rgba(0,0,0,0.35); max-width: 460px; width: min(90vw, 460px); }
      label { display: block; margin-bottom: 8px; color: rgba(255,255,255,0.7); font-size: 14px; }
      input { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: white; font-size: 15px; }
      button { margin-top: 14px; width: 100%; padding: 12px 14px; border-radius: 12px; border: none; background: linear-gradient(90deg, #67e0bb, #3c8fef); color: #020203; font-weight: 700; cursor: pointer; font-size: 15px; }
      p { color: rgba(255,255,255,0.65); line-height: 1.6; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h2 style="margin: 0 0 12px;">Добро пожаловать!</h2>
      <p>Укажите, как к вам обращаться в панели. Мы сохраним имя и завершим вход.</p>
      <label for="name">Имя</label>
      <input id="name" name="name" value="${suggestedName}" placeholder="Например, Иван" />
      <button id="submit">Сохранить и продолжить</button>
    </div>
    <script>
      const email = ${JSON.stringify(email)};
      const suggested = ${JSON.stringify(suggestedName)};
      const input = document.getElementById('name');
      input.value = suggested;
      document.getElementById('submit').onclick = async () => {
        const name = input.value.trim();
        if (!name) {
          alert('Введите имя, чтобы завершить вход');
          return;
        }
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, providerId: 'google-auto' })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data?.error || 'Не удалось сохранить пользователя');
          return;
        }
        localStorage.setItem('ve_auth_session_email', data.user.email);
        localStorage.setItem('ve_auth_session_user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      };
    </script>
  </body>
</html>`;

  return new NextResponse(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google`;

  if (!code) {
    if (!clientId) {
      return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 500 });
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("access_type", "online");
    return NextResponse.redirect(authUrl.toString());
  }

  const token = await exchangeGoogleToken(code, redirectUri, clientId, clientSecret);
  const profile = await fetchGoogleProfile(token.access_token);

  const existing = await fetchUserByEmail(profile.email);
  if (!existing) {
    const fallbackName = profile.name || profile.given_name || profile.email.split("@")[0];
    return renderNamePrompt(profile.email, fallbackName);
  }

  const user = await upsertOAuthUser({
    provider: "google",
    providerId: profile.id,
    email: profile.email,
    name: profile.name || profile.given_name || profile.email,
  });

  return renderAuthCompletion(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, providerId } = body ?? {};
  if (!email || !name) {
    return NextResponse.json({ error: "Missing email or name" }, { status: 400 });
  }

  const user = await upsertOAuthUser({ provider: "google", providerId: providerId || "google-manual", email, name });
  return NextResponse.json({ user });
}
