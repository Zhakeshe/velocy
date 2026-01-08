import { NextResponse } from "next/server";

import { createUserService, fetchUserByEmail } from "@/lib/server/database";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, catalogId, region, billing, os, panel } = body ?? {};

  if (!email || !catalogId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const service = await createUserService({ email, catalogId, region, billing, os, panel });
    const user = await fetchUserByEmail(email);
    if (user?.notifyEmail) {
      await sendEmail({
        to: email,
        subject: "Заказ VPS оформлен",
        html: `<p>Ваш VPS активирован: <strong>${service.name}</strong>.</p><p>Следующий платеж: ${service.nextInvoice}</p>`,
      });
    }
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось оформить заказ";
    const status = message.includes("Недостаточно средств") ? 402 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
