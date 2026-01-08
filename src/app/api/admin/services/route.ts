import { NextResponse } from "next/server";

import { addCatalogItem, deleteCatalogItem, fetchUserByEmail, listCatalog } from "@/lib/server/database";

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

export async function GET() {
  const items = await listCatalog();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;

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
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;

  const body = await request.json();
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const removed = await deleteCatalogItem(id);
  return NextResponse.json({ removed });
}
