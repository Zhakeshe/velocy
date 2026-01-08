import { NextResponse } from "next/server";

import { fetchActiveOrderForService, fetchActiveOrdersForUser, fetchOrderById, fetchUserByEmail, resolvePanelUrl } from "@/lib/server/database";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, orderId, productType, serviceId } = body ?? {};

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await fetchUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (orderId) {
    const order = await fetchOrderById(orderId);
    if (!order || order.userId !== user.id || order.status !== "active") {
      return NextResponse.json({ error: "No active order" }, { status: 403 });
    }
    return NextResponse.json({ url: order.panelUrl || resolvePanelUrl(order.productType) });
  }

  if (serviceId) {
    const order = await fetchActiveOrderForService({ email, serviceId });
    if (!order) {
      return NextResponse.json({ error: "No active order" }, { status: 403 });
    }
    return NextResponse.json({ url: order.panelUrl || resolvePanelUrl(order.productType) });
  }

  const orders = await fetchActiveOrdersForUser(email);
  const matched = productType ? orders.find((entry) => entry.productType === productType) : orders[0];

  if (!matched) {
    return NextResponse.json({ error: "No active orders" }, { status: 403 });
  }

  return NextResponse.json({ url: matched.panelUrl || resolvePanelUrl(matched.productType) });
}
