import type { PanelAccountPayload, PanelAccountResult, PanelProvider, PanelResourcePayload, PanelResourceResult } from "../types";

const apiUrl = process.env.PROXMOX_API_URL ?? "https://127.0.0.1:8006";
const apiToken = process.env.PROXMOX_API_TOKEN ?? "";
const apiTokenId = process.env.PROXMOX_API_TOKEN_ID ?? "";
const apiRealm = process.env.PROXMOX_API_REALM ?? "pam";

async function proxmoxRequest<T>(path: string, payload: Record<string, unknown>) {
  if (!apiToken || !apiTokenId) {
    return { data: `px-${Math.random().toString(36).slice(2, 10)}` } as T;
  }

  const res = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `PVEAPIToken=${apiTokenId}=${apiToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Proxmox API error: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

async function createUser(payload: PanelAccountPayload): Promise<PanelAccountResult> {
  const username = `${payload.email.split("@")[0]}@${apiRealm}`;
  const response = await proxmoxRequest<{ data?: string }>("/api2/json/access/users", {
    userid: username,
    email: payload.email,
    firstname: payload.name,
  });

  return { externalId: response.data ?? username };
}

async function createResource(payload: PanelResourcePayload, account: PanelAccountResult): Promise<PanelResourceResult> {
  const resources = payload.metadata.resources as { cores?: number; memory?: number; disk?: number } | undefined;
  const response = await proxmoxRequest<{ data?: string }>("/api2/json/cluster/resources", {
    type: payload.metadata.type ?? "qemu",
    name: `velocy-${payload.orderId}`,
    cores: resources?.cores ?? 2,
    memory: resources?.memory ?? 2048,
    disk: resources?.disk ?? 20,
    owner: account.externalId,
  });

  return { externalId: response.data ?? payload.orderId };
}

export const proxmoxProvider: PanelProvider = {
  type: "vps",
  createUser,
  createResource,
};
