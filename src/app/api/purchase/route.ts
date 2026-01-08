import { NextResponse } from "next/server";

import { buildVpsActivatedEmail } from "@/lib/server/email-templates";
import { activateOrder, createOrder, enqueueProvisioningJob, fetchUserByEmail } from "@/lib/server/database";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, catalogId, region, billing, os, panel } = body ?? {};

  if (!email || !catalogId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const order = await createOrder({
      email,
      catalogId,
      status: "pending",
      metadata: { region, billing, os, panel },
    });
    const { service } = await activateOrder({ orderId: order.id, createService: true, skipBalance: false });
    const job = await enqueueProvisioningJob(order.id);
    const user = await fetchUserByEmail(email);
    if (user?.notifyEmail) {
      await sendEmail({
        to: email,
        subject: "Заказ VPS оформлен",
        html: buildVpsActivatedEmail({
          title: "VPS активирован",
          serviceName: service?.name ?? "VPS",
          nextInvoice: service?.nextInvoice ?? "",
        }),
      });
    }
    return NextResponse.json({ order, service, jobId: job.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось оформить заказ";
    const status = message.includes("Недостаточно средств") ? 402 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
