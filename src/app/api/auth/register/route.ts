import { NextResponse } from "next/server";

import { buildCodeEmail } from "@/lib/server/email-templates";
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
    const subject = "Подтверждение регистрации";
    await sendEmail({
      to: email,
      subject,
      html: buildCodeEmail({
        title: "Код подтверждения регистрации",
        code,
        hint: "Никому не сообщайте этот код.",
      }),
    });

    return NextResponse.json({ verificationRequired: true, email }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });
  }
}
