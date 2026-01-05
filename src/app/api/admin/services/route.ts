import { NextResponse } from "next/server";
import { addCatalogItem, deleteCatalogItem, listCatalog } from "@/lib/server/mock-db";

export async function GET() {
  return NextResponse.json({ items: listCatalog() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, category, owner } = body ?? {};
  if (!name || !category || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = addCatalogItem({ name, category, owner });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const removed = deleteCatalogItem(id);
  return NextResponse.json({ removed });
}
