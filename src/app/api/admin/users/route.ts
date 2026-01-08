import { NextResponse } from "next/server";

import { fetchUserByEmail, listUsers, setUserBanned } from "@/lib/server/database";

async function requireAdmin(request: Request) {
  const email = request.headers.get("x-admin-email");
  if (!email) {
    return { error: NextResponse.json({ error: "Missing admin email" }, { status: 401 }) };
  }

  const user = await fetchUserByEmail(email);
  if (!user || !user.isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { email };
}

export async function GET(request: Request) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;

  const users = await listUsers();
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;

  const body = await request.json();
  const { email, isBanned } = body ?? {};
  if (!email || typeof isBanned !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await setUserBanned({ email, isBanned });
  return NextResponse.json({ ok: true });
}
