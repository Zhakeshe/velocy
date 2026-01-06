import crypto from "crypto";

import { NextResponse } from "next/server";

import { renderAuthCompletion } from "@/lib/server/auth-response";
import { upsertOAuthUser } from "@/lib/server/database";

function verifyTelegramPayload(searchParams: URLSearchParams, botToken?: string) {
  if (!botToken) return false;
  const dataCheckString = Array.from(searchParams.entries())
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return computedHash === searchParams.get("hash");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;

  if (!params.get("hash")) {
    if (!botId) {
      return NextResponse.json({ error: "Telegram bot is not configured" }, { status: 500 });
    }

    const origin = encodeURIComponent(url.origin);
    const returnTo = encodeURIComponent(`${url.origin}/api/auth/telegram`);
    const redirectUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&return_to=${returnTo}&request_access=write`;
    return NextResponse.redirect(redirectUrl);
  }

  if (!verifyTelegramPayload(params, botToken)) {
    return NextResponse.json({ error: "Недостоверный ответ Telegram" }, { status: 400 });
  }

  const telegramId = params.get("id") ?? "unknown";
  const name = `${params.get("first_name") ?? "Telegram"} ${params.get("last_name") ?? "user"}`.trim();
  const email = `${params.get("username") || telegramId}@telegram.local`;

  const user = await upsertOAuthUser({
    provider: "telegram",
    providerId: telegramId,
    email,
    name,
  });

  return renderAuthCompletion(user);
}
