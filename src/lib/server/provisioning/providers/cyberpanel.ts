import type { PanelAccountPayload, PanelAccountResult, PanelProvider, PanelResourcePayload, PanelResourceResult } from "../types";

const apiUrl = process.env.CYBERPANEL_API_URL ?? "http://127.0.0.1:8090";
const apiKey = process.env.CYBERPANEL_API_KEY ?? "";

async function cyberPanelRequest<T>(path: string, payload: Record<string, unknown>) {
  if (!apiKey) {
    return { id: `cp-${Math.random().toString(36).slice(2, 10)}` } as T;
  }

  const res = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CyberPanel API error: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

async function createUser(payload: PanelAccountPayload): Promise<PanelAccountResult> {
  const response = await cyberPanelRequest<{ id?: string; userID?: string }>("/api/createUser", {
    email: payload.email,
    name: payload.name,
  });

  return { externalId: response.id ?? response.userID ?? payload.email };
}

async function createResource(payload: PanelResourcePayload): Promise<PanelResourceResult> {
  const response = await cyberPanelRequest<{ id?: string; websiteID?: string }>("/api/createWebsite", {
    domain: payload.metadata.domain ?? `${payload.orderId}.velocy.cloud`,
    ownerEmail: payload.email,
    package: payload.metadata.package ?? "default",
  });

  return { externalId: response.id ?? response.websiteID ?? payload.orderId };
}

export const cyberPanelProvider: PanelProvider = {
  type: "web",
  createUser,
  createResource,
};
