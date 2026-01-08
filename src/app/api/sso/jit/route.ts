import { NextResponse } from "next/server";

import { createPanelAccount, fetchPanelAccount, fetchUserByEmail } from "@/lib/server/database";
import { getProvider } from "@/lib/server/provisioning/providers";
import type { PanelType } from "@/lib/server/provisioning/types";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, panel } = body ?? {};

  if (!email || !panel) {
    return NextResponse.json({ error: "Missing email or panel" }, { status: 400 });
  }

  const user = await fetchUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const panelType = panel as PanelType;
  const provider = getProvider(panelType);
  if (!provider) {
    return NextResponse.json({ error: "Unsupported panel" }, { status: 400 });
  }

  const existing = await fetchPanelAccount({ userId: user.id, panel: panelType });
  if (existing) {
    return NextResponse.json({ accountId: existing.id, externalId: existing.externalId });
  }

  const created = await provider.createUser({ email: user.email, name: user.name });
  const account = await createPanelAccount({ userId: user.id, panel: panelType, externalId: created.externalId });

  return NextResponse.json({ accountId: account.id, externalId: account.externalId });
}
