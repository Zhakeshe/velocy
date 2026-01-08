import { NextResponse } from "next/server";

import { createAuthCode, verifyLogin } from "@/lib/server/database";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const result = await verifyLogin(email, password);

    if (!result.emailVerified) {
      const code = await createAuthCode({ email, purpose: "email_verify" });
      await sendEmail({
        to: email,
        subject: "Подтверждение email",
        html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`,
      });
      return NextResponse.json({ verificationRequired: true, email });
    }

    if (result.twoFactorEnabled) {
      const code = await createAuthCode({ email, purpose: "two_factor" });
      await sendEmail({
        to: email,
        subject: "Код входа",
        html: `<p>Ваш код для входа: <strong>${code}</strong></p>`,
      });
      return NextResponse.json({ twoFactorRequired: true, email });
    }

    return NextResponse.json({ user: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Login failed" }, { status: 400 });
  }
}
