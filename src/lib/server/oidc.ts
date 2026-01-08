let oidcConfigPromise: Promise<{
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
}> | null = null;

export async function getOidcConfig(issuerUrl: string) {
  if (!oidcConfigPromise) {
    oidcConfigPromise = fetch(`${issuerUrl}/.well-known/openid-configuration`).then((res) => {
      if (!res.ok) {
        throw new Error(`OIDC discovery failed: ${res.status}`);
      }
      return res.json();
    });
  }
  return oidcConfigPromise;
}

export async function buildAuthorizationUrl(payload: {
  issuer: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope?: string;
}) {
  const config = await getOidcConfig(payload.issuer);
  const authUrl = new URL(config.authorization_endpoint);
  authUrl.searchParams.set("client_id", payload.clientId);
  authUrl.searchParams.set("redirect_uri", payload.redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", payload.scope ?? "openid email profile");
  authUrl.searchParams.set("state", payload.state);
  return authUrl.toString();
}

export async function exchangeCodeForTokens(payload: {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}) {
  const config = await getOidcConfig(payload.issuer);
  const res = await fetch(config.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: payload.code,
      redirect_uri: payload.redirectUri,
      client_id: payload.clientId,
      client_secret: payload.clientSecret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OIDC token exchange failed: ${res.status} ${text}`);
  }

  return (await res.json()) as { id_token: string; access_token?: string };
}

export async function verifyIdToken(payload: {
  issuer: string;
  clientId: string;
  idToken: string;
}) {
  const parts = payload.idToken.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid ID token");
  }
  const decoded = Buffer.from(parts[1], "base64url").toString("utf8");
  const claims = JSON.parse(decoded) as { email?: string; name?: string };
  if (!claims.email) {
    throw new Error("OIDC token missing email");
  }
  return claims;
}
