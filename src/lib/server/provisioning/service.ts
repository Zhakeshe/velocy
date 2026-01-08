import { and, eq } from "drizzle-orm";

import { db, ensureMigrations } from "@/lib/db/client";
import { orders, userServices } from "@/lib/db/schema";
import {
  createPanelAccount,
  createPanelResource,
  fetchOrderById,
  fetchPanelAccount,
  fetchUserById,
  resolvePanelUrl,
} from "@/lib/server/database";
import { getProvider } from "./providers";
import type { PanelType } from "./types";

function parseMetadata(raw: string | null | undefined) {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function provisionOrder(orderId: string) {
  await ensureMigrations();
  const order = await fetchOrderById(orderId);
  if (!order) {
    throw new Error("Заказ не найден");
  }

  const user = await fetchUserById(order.userId);
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const productType = order.productType as PanelType;
  const provider = getProvider(productType);
  if (!provider) {
    throw new Error(`Провайдер не найден для типа ${order.productType}`);
  }

  const metadata = parseMetadata(order.metadata);
  let account = await fetchPanelAccount({ userId: user.id, panel: productType });

  if (!account) {
    const created = await provider.createUser({ email: user.email, name: user.name });
    account = await createPanelAccount({ userId: user.id, panel: productType, externalId: created.externalId });
  }

  const resource = await provider.createResource(
    {
      orderId: order.id,
      email: user.email,
      name: user.name,
      productType,
      metadata,
    },
    { externalId: account.externalId }
  );

  await createPanelResource({ orderId: order.id, panel: productType, externalId: resource.externalId });

  const panelUrl = resource.panelUrl ?? resolvePanelUrl(productType);
  await db.update(orders).set({ panelUrl }).where(eq(orders.id, order.id));
  await db.update(userServices).set({ panelUrl }).where(and(eq(userServices.orderId, order.id), eq(userServices.userId, user.id)));

  return { panelUrl, resourceId: resource.externalId };
}
