import { NextResponse } from "next/server";

import { addCatalogItem, deleteCatalogItem, listCatalog } from "@/lib/server/database";

export async function GET() {
  const items = await listCatalog();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, category, owner } = body ?? {};
  if (!name || !category || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await addCatalogItem({ name, category, owner });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const removed = await deleteCatalogItem(id);
  return NextResponse.json({ removed });
}
