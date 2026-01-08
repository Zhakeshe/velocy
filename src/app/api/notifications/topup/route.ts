import { NextResponse } from "next/server";

import { buildTopupReceiptEmail } from "@/lib/server/email-templates";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, currency, method } = body ?? {};
    if (!email || !amount || !currency || !method) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendEmail({
      to: email,
      subject: "Чек на пополнение",
      html: buildTopupReceiptEmail({
        title: "Чек на пополнение",
        amount,
        currency,
        method,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Notification failed" }, { status: 400 });
  }
}
