import { NextResponse } from "next/server";

import { createUserService } from "@/lib/server/database";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, catalogId, region, billing, os, panel } = body ?? {};

  if (!email || !catalogId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const service = await createUserService({ email, catalogId, region, billing, os, panel });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось оформить заказ";
    const status = message.includes("Недостаточно средств") ? 402 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
