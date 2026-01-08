import type { PanelAccountPayload, PanelAccountResult, PanelProvider, PanelResourcePayload, PanelResourceResult } from "../types";

const apiUrl = process.env.PTERODACTYL_API_URL ?? "http://127.0.0.1:3000";
const apiKey = process.env.PTERODACTYL_API_KEY ?? "";

async function pterodactylRequest<T>(path: string, payload: Record<string, unknown>) {
  if (!apiKey) {
    return { attributes: { id: `pt-${Math.random().toString(36).slice(2, 10)}` } } as T;
  }

  const res = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "Application/vnd.pterodactyl.v1+json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pterodactyl API error: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

async function createUser(payload: PanelAccountPayload): Promise<PanelAccountResult> {
  const response = await pterodactylRequest<{ attributes?: { id?: number } }>("/api/application/users", {
    email: payload.email,
    username: payload.email.split("@")[0],
    first_name: payload.name.split(" ")[0] || payload.name,
    last_name: payload.name.split(" ").slice(1).join(" ") || payload.name,
  });

  return { externalId: String(response.attributes?.id ?? payload.email) };
}

async function createResource(payload: PanelResourcePayload, account: PanelAccountResult): Promise<PanelResourceResult> {
  const limits = payload.metadata.limits as { cpu?: number; memory?: number; disk?: number } | undefined;
  const response = await pterodactylRequest<{ attributes?: { id?: number } }>("/api/application/servers", {
    name: `Velocy-${payload.orderId}`,
    user: Number(account.externalId),
    egg: payload.metadata.egg ?? 1,
    docker_image: payload.metadata.image ?? "ghcr.io/pterodactyl/yolks:nodejs_18",
    startup: payload.metadata.startup ?? "npm start",
    limits: {
      cpu: limits?.cpu ?? 100,
      memory: limits?.memory ?? 1024,
      disk: limits?.disk ?? 10000,
      swap: 0,
      io: 500,
    },
    environment: payload.metadata.environment ?? {},
    feature_limits: { databases: 1, backups: 1, allocations: 1 },
    allocation: payload.metadata.allocation ?? 1,
  });

  return { externalId: String(response.attributes?.id ?? payload.orderId) };
}

export const pterodactylProvider: PanelProvider = {
  type: "game",
  createUser,
  createResource,
};
