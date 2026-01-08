import { NextResponse } from "next/server";

import { fetchUserWithServices, verifyAuthCode } from "@/lib/server/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body ?? {};
    if (!email || !code) {
      return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
    }

    const ok = await verifyAuthCode({ email, code, purpose: "two_factor" });
    if (!ok) {
      return NextResponse.json({ error: "Неверный или просроченный код" }, { status: 400 });
    }

    const user = await fetchUserWithServices(email);
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Verification failed" }, { status: 400 });
  }
}
