import { NextResponse } from "next/server";

import { verifyLogin } from "@/lib/server/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const result = await verifyLogin(email, password);
    return NextResponse.json({ user: result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Login failed" }, { status: 400 });
  }
}
