import { NextResponse } from "next/server";

import { fetchUserWithServices } from "@/lib/server/database";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await fetchUserWithServices(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      name: user.user.name,
      email: user.user.email,
      services: user.services,
    },
  });
}
