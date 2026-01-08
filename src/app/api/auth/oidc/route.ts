import crypto from "crypto";
import { NextResponse } from "next/server";

import { renderAuthCompletion } from "@/lib/server/auth-response";
import { buildAuthorizationUrl, exchangeCodeForTokens, verifyIdToken } from "@/lib/server/oidc";
import { upsertOAuthUser } from "@/lib/server/database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const issuer = process.env.OIDC_ISSUER_URL ?? "https://sso.velocy.cloud/application/o/velocy";
  const clientId = process.env.OIDC_CLIENT_ID ?? "";
  const clientSecret = process.env.OIDC_CLIENT_SECRET ?? "";
  const redirectUri = process.env.OIDC_REDIRECT_URI ?? `${url.origin}/api/auth/oidc`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing OIDC credentials" }, { status: 500 });
  }

  if (!code) {
    const state = crypto.randomUUID();
    const authUrl = await buildAuthorizationUrl({ issuer, clientId, redirectUri, state });
    return NextResponse.redirect(authUrl);
  }

  const tokens = await exchangeCodeForTokens({ issuer, clientId, clientSecret, redirectUri, code });
  const claims = await verifyIdToken({ issuer, clientId, idToken: tokens.id_token });

  if (!claims.email) {
    return NextResponse.json({ error: "OIDC missing email" }, { status: 400 });
  }

  const user = await upsertOAuthUser({
    provider: "oidc",
    providerId: claims.email,
    email: claims.email,
    name: claims.name || claims.email.split("@")[0],
  });

  return renderAuthCompletion(user);
}
