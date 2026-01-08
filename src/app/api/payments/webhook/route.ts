import { NextResponse } from "next/server";

import { activateOrder, createOrder, enqueueProvisioningJob, fetchOrderById } from "@/lib/server/database";

function isValidWebhook(request: Request) {
  const secret = process.env.PAYMENTS_WEBHOOK_SECRET;
  if (!secret) return true;
  return request.headers.get("x-webhook-secret") === secret;
}

export async function POST(request: Request) {
  if (!isValidWebhook(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId, email, catalogId, status, metadata } = body ?? {};

  if (status !== "paid") {
    return NextResponse.json({ received: true });
  }

  if (!orderId && (!email || !catalogId)) {
    return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
  }

  let order = orderId ? await fetchOrderById(orderId) : null;

  if (!order) {
    order = await createOrder({ email, catalogId, status: "pending", metadata });
  }

  const { order: activeOrder } = await activateOrder({ orderId: order.id, createService: true, skipBalance: true });
  const job = await enqueueProvisioningJob(order.id);

  return NextResponse.json({ orderId: activeOrder.id, jobId: job.id });
}
