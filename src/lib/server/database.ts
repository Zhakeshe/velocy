import crypto from "crypto";

import bcrypt from "bcrypt";
import { desc, eq } from "drizzle-orm";

import { db, ensureMigrations } from "@/lib/db/client";
import { catalogItems, userServices, users } from "@/lib/db/schema";
import type { UserService } from "@/lib/types/auth";

function withId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function generateIp() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 200) + 20).join(".");
}

function generateHostname(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 12);
  return `${base || "vps"}.${crypto.randomUUID().slice(0, 6)}.kz`;
}

function toUserServices(rows: typeof userServices.$inferSelect[]): UserService[] {
  return rows.map((row) => ({
    id: row.id,
    catalogId: row.catalogId === "custom" ? undefined : row.catalogId,
    name: row.name,
    area: row.area,
    plan: row.plan,
    price: row.price,
    billing: row.billing,
    nextInvoice: row.nextInvoice,
    status: row.status as UserService["status"],
    hostname: row.hostname,
    ip: row.ip,
    ptr: row.ptr,
    panelUrl: row.panelUrl,
    activatedAt: row.activatedAt,
  }));
}

export async function fetchUserByEmail(email: string) {
  await ensureMigrations();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function fetchUserWithServices(email: string) {
  const user = await fetchUserByEmail(email);
  if (!user) return null;

  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, user.id))
    .orderBy(desc(userServices.createdAt));

  return { user, services: toUserServices(services) };
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  await ensureMigrations();
  const { name, email, password } = payload;
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    throw new Error("Пользователь уже зарегистрирован");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      balance: users.balance,
      createdAt: users.createdAt,
    });

  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, created.id))
    .orderBy(desc(userServices.createdAt));

  return { user: created, services: toUserServices(services) };
}

export async function verifyLogin(email: string, password: string) {
  await ensureMigrations();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!existing) {
    throw new Error("Пользователь не найден");
  }

  const ok = await bcrypt.compare(password, existing.passwordHash);
  if (!ok) {
    throw new Error("Неверный пароль");
  }

  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, existing.id))
    .orderBy(desc(userServices.createdAt));

  return { user: existing, services: toUserServices(services) };
}

export async function listCatalog() {
  await ensureMigrations();
  const items = await db.select().from(catalogItems).orderBy(desc(catalogItems.createdAt));
  return items;
}

export async function getCatalogItem(id: string) {
  await ensureMigrations();
  const [item] = await db.select().from(catalogItems).where(eq(catalogItems.id, id)).limit(1);
  return item ?? null;
}

export async function addCatalogItem(payload: {
  name: string;
  category: string;
  owner: string;
  price: number;
  currency: string;
  region: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  ddos: string;
}) {
  await ensureMigrations();
  const [item] = await db
    .insert(catalogItems)
    .values({
      id: withId("srv"),
      name: payload.name,
      category: payload.category,
      owner: payload.owner,
      price: payload.price,
      currency: payload.currency,
      region: payload.region,
      cpu: payload.cpu,
      ram: payload.ram,
      storage: payload.storage,
      bandwidth: payload.bandwidth,
      ddos: payload.ddos,
    })
    .returning();

  return item;
}

export async function deleteCatalogItem(id: string) {
  await ensureMigrations();
  const deleted = await db.delete(catalogItems).where(eq(catalogItems.id, id));
  return Boolean(deleted.rowsAffected ?? deleted.changes ?? 0);
}

export async function createUserService(payload: {
  email: string;
  catalogId: string;
  region?: string;
  billing?: string;
  os?: string;
  panel?: string;
}) {
  await ensureMigrations();
  const [user] = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const item = await getCatalogItem(payload.catalogId);
  if (!item) {
    throw new Error("Тариф не найден");
  }

  if (user.balance < item.price) {
    throw new Error("Недостаточно средств на балансе");
  }

  const nextInvoice = new Date();
  nextInvoice.setDate(nextInvoice.getDate() + 30);

  const [service] = await db
    .insert(userServices)
    .values({
      id: withId("svc"),
      userId: user.id,
      catalogId: item.id,
      name: item.name,
      area: payload.region || item.region,
      plan: item.category,
      price: `${item.price.toLocaleString()} ${item.currency}/мес`,
      billing: payload.billing || "Ежемесячно",
      nextInvoice: nextInvoice.toISOString(),
      status: "active",
      hostname: generateHostname(item.name),
      ip: generateIp(),
      ptr: `${item.owner.toLowerCase().replace(/\s+/g, "-")}.${item.region.toLowerCase()}.velocy.cloud`,
      panelUrl: `https://panel.velocy.cloud/${crypto.randomUUID().slice(0, 6)}`,
    })
    .returning();

  await db.update(users).set({ balance: user.balance - item.price }).where(eq(users.id, user.id));

  return toUserServices([service])[0];
}
