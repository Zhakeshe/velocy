import { NextResponse } from "next/server";

import { addCatalogItem, deleteCatalogItem, listCatalog } from "@/lib/server/database";

export async function GET() {
  const items = await listCatalog();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, category, owner, price, currency, region, cpu, ram, storage, bandwidth, ddos } = body ?? {};
  if (!name || !category || !owner || price === undefined || !currency || !region) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await addCatalogItem({
    name,
    category,
    owner,
    price: Number(price) || 0,
    currency,
    region,
    cpu: cpu ?? "",
    ram: ram ?? "",
    storage: storage ?? "",
    bandwidth: bandwidth ?? "",
    ddos: ddos ?? "",
  });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const removed = await deleteCatalogItem(id);
  return NextResponse.json({ removed });
}
