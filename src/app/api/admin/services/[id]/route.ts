import { NextResponse } from "next/server";

import { getCatalogItem } from "@/lib/server/database";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = await getCatalogItem(params.id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}
