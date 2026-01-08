import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db, ensureMigrations } from "@/lib/db/client";
import { userServices, users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? 3);
    const windowMs = Number.isFinite(days) ? days * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const threshold = new Date(now + windowMs).toISOString();

    await ensureMigrations();
    const rows = await db
      .select({
        email: users.email,
        notifyEmail: users.notifyEmail,
        serviceName: userServices.name,
        nextInvoice: userServices.nextInvoice,
      })
      .from(userServices)
      .innerJoin(users, eq(userServices.userId, users.id));

    const pending = rows.filter(
      (row) => row.notifyEmail && row.nextInvoice <= threshold && row.nextInvoice >= new Date(now).toISOString(),
    );

    await Promise.all(
      pending.map((row) =>
        sendEmail({
          to: row.email,
          subject: "Скоро завершится срок услуги",
          html: `<p>Срок услуги <strong>${row.serviceName}</strong> заканчивается ${row.nextInvoice}.</p>`,
        }),
      ),
    );

    return NextResponse.json({ sent: pending.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Notification failed" }, { status: 400 });
  }
}
