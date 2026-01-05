import { NextResponse } from "next/server";

import { registerUser } from "@/lib/server/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body ?? {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await registerUser({ name, email, password });
    return NextResponse.json({ user: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Registration failed" }, { status: 400 });
  }
}
