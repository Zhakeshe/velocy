import { NextResponse } from "next/server";

import { createAuthCode, registerUser } from "@/lib/server/database";
import { sendEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body ?? {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await registerUser({ name, email, password });

    const code = await createAuthCode({ email, purpose: "email_verify" });
    await sendEmail({
      to: email,
      subject: "Подтверждение регистрации",
      html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`,
    });

    return NextResponse.json({ verificationRequired: true, email }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });
  }
}
