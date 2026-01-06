import { NextResponse } from "next/server";

import { renderAuthCompletion } from "@/lib/server/auth-response";
import { upsertOAuthUser } from "@/lib/server/database";

async function exchangeToken(code: string, redirectUri: string, clientId?: string, clientSecret?: string) {
  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth is not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("Не удалось завершить вход через Discord");
  }

  return (await res.json()) as { access_token: string; token_type: string };
}

async function fetchDiscordUser(accessToken: string, tokenType: string) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `${tokenType} ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Не удалось получить данные пользователя Discord");
  }

  return (await res.json()) as { id: string; username: string; email?: string };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI ?? `${url.origin}/api/auth/discord`;

  if (!code) {
    if (!clientId) {
      return NextResponse.json({ error: "Discord OAuth is not configured" }, { status: 500 });
    }

    const authUrl = new URL("https://discord.com/api/oauth2/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("scope", "identify email");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    return NextResponse.redirect(authUrl.toString());
  }

  const token = await exchangeToken(code, redirectUri, clientId, clientSecret);
  const discordUser = await fetchDiscordUser(token.access_token, token.token_type);

  const email = discordUser.email ?? `${discordUser.id}@discord.local`;
  const user = await upsertOAuthUser({
    provider: "discord",
    providerId: discordUser.id,
    email,
    name: discordUser.username,
  });

  return renderAuthCompletion(user);
}
