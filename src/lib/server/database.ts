import crypto from "crypto";

import bcrypt from "bcrypt";
import { and, desc, eq, lte } from "drizzle-orm";

import { db, ensureMigrations } from "@/lib/db/client";
import {
  authCodes,
  catalogItems,
  orders,
  panelAccounts,
  panelResources,
  provisioningJobs,
  userServices,
  users,
} from "@/lib/db/schema";
import type { AuthUser, UserService } from "@/lib/types/auth";

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

const panelUrlsByType: Record<string, string> = {
  web: "https://panelweb.velocy.cloud",
  game: "https://panelgame.velocy.cloud",
  vps: "https://panelvps.velocy.cloud",
};

export function resolvePanelUrl(productType: string) {
  return panelUrlsByType[productType] ?? "https://panel.velocy.cloud";
}

function deriveProductType(category: string) {
  const value = category.toLowerCase();
  if (value.includes("web") || value.includes("hosting") || value.includes("хост")) return "web";
  if (value.includes("game") || value.includes("игр")) return "game";
  if (value.includes("vps") || value.includes("vds")) return "vps";
  return "vps";
}

function toAuthUser(userRow: typeof users.$inferSelect, services: UserService[] = []): AuthUser {
  return {
    name: userRow.name,
    email: userRow.email,
    balance: userRow.balance,
    notifyEmail: Boolean(userRow.notifyEmail),
    notifyBrowser: Boolean(userRow.notifyBrowser),
    twoFactorEnabled: Boolean(userRow.twoFactorEnabled),
    emailVerified: Boolean(userRow.emailVerified),
    isAdmin: Boolean(userRow.isAdmin),
    isBanned: Boolean(userRow.isBanned),
    services,
  };
}

function toUserServices(rows: typeof userServices.$inferSelect[]): UserService[] {
  return rows.map((row) => ({
    id: row.id,
    orderId: row.orderId || undefined,
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

export async function fetchUserById(id: number) {
  await ensureMigrations();
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
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

  const mappedServices = toUserServices(services);
  return toAuthUser(user, mappedServices);
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
    .values({ name, email, passwordHash, emailVerified: 0, isAdmin: 0, isBanned: 0 })
    .returning();

  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, created.id))
    .orderBy(desc(userServices.createdAt));

  return toAuthUser(created, toUserServices(services));
}

export async function upsertOAuthUser(payload: { provider: string; providerId: string; email: string; name: string }) {
  await ensureMigrations();
  const { email, name, provider, providerId } = payload;
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  const placeholderPassword = await bcrypt.hash(`${provider}:${providerId}`, 10);

  if (existing) {
    const services = await db
      .select()
      .from(userServices)
      .where(eq(userServices.userId, existing.id))
      .orderBy(desc(userServices.createdAt));

    return toAuthUser(existing, toUserServices(services));
  }

  const [created] = await db
    .insert(users)
    .values({
      name: name || email.split("@")[0],
      email,
      passwordHash: placeholderPassword,
      emailVerified: 1,
      isAdmin: 0,
      isBanned: 0,
    })
    .returning();

  return toAuthUser(created, []);
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

  if (existing.isBanned) {
    throw new Error("Доступ к аккаунту ограничен");
  }

  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, existing.id))
    .orderBy(desc(userServices.createdAt));

  return toAuthUser(existing, toUserServices(services));
}

export async function markEmailVerified(email: string) {
  await ensureMigrations();
  await db.update(users).set({ emailVerified: 1 }).where(eq(users.email, email));
}

export async function listUsers() {
  await ensureMigrations();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function setUserBanned(payload: { email: string; isBanned: boolean }) {
  await ensureMigrations();
  await db.update(users).set({ isBanned: payload.isBanned ? 1 : 0 }).where(eq(users.email, payload.email));
}

export async function createAuthCode(payload: { email: string; purpose: string; ttlMinutes?: number }) {
  await ensureMigrations();
  const ttl = payload.ttlMinutes ?? 10;
  const expiresAt = new Date(Date.now() + ttl * 60 * 1000).toISOString();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db.insert(authCodes).values({
    email: payload.email,
    code,
    purpose: payload.purpose,
    expiresAt,
  });

  return code;
}

export async function verifyAuthCode(payload: { email: string; code: string; purpose: string }) {
  await ensureMigrations();
  const [match] = await db
    .select()
    .from(authCodes)
    .where(and(eq(authCodes.email, payload.email), eq(authCodes.purpose, payload.purpose)))
    .orderBy(desc(authCodes.createdAt))
    .limit(1);

  if (!match) return false;
  if (match.code !== payload.code) return false;
  if (new Date(match.expiresAt).getTime() < Date.now()) return false;

  await db.delete(authCodes).where(eq(authCodes.id, match.id));
  return true;
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
  orderId?: string;
  skipBalance?: boolean;
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

  if (!payload.skipBalance && user.balance < item.price) {
    throw new Error("Недостаточно средств на балансе");
  }

  const nextInvoice = new Date();
  nextInvoice.setDate(nextInvoice.getDate() + 30);

  const [service] = await db
    .insert(userServices)
    .values({
      id: withId("svc"),
      userId: user.id,
      orderId: payload.orderId ?? "",
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
      panelUrl: resolvePanelUrl(deriveProductType(item.category)),
    })
    .returning();

  if (!payload.skipBalance) {
    await db.update(users).set({ balance: user.balance - item.price }).where(eq(users.id, user.id));
  }

  return toUserServices([service])[0];
}

export async function createOrder(payload: {
  email: string;
  catalogId: string;
  status?: "pending" | "active" | "failed";
  metadata?: Record<string, unknown>;
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

  const productType = deriveProductType(item.category);
  const [order] = await db
    .insert(orders)
    .values({
      id: withId("ord"),
      userId: user.id,
      catalogId: item.id,
      productType,
      status: payload.status ?? "pending",
      panelUrl: resolvePanelUrl(productType),
      metadata: JSON.stringify(payload.metadata ?? {}),
    })
    .returning();

  return order;
}

export async function activateOrder(payload: { orderId: string; createService?: boolean; skipBalance?: boolean }) {
  await ensureMigrations();
  const [order] = await db.select().from(orders).where(eq(orders.id, payload.orderId)).limit(1);
  if (!order) {
    throw new Error("Заказ не найден");
  }

  const activatedAt = new Date().toISOString();
  await db
    .update(orders)
    .set({ status: "active", activatedAt, panelUrl: resolvePanelUrl(order.productType) })
    .where(eq(orders.id, order.id));

  let service: UserService | null = null;
  if (payload.createService) {
    const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const [existing] = await db
      .select()
      .from(userServices)
      .where(eq(userServices.orderId, order.id))
      .limit(1);

    if (existing) {
      service = toUserServices([existing])[0];
    } else {
      service = await createUserService({
        email: user.email,
        catalogId: order.catalogId,
        orderId: order.id,
        skipBalance: payload.skipBalance ?? true,
      });
    }
  }

  return { order, service };
}

export async function fetchOrderById(orderId: string) {
  await ensureMigrations();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return order ?? null;
}

export async function fetchActiveOrdersForUser(email: string) {
  await ensureMigrations();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    throw new Error("Пользователь не найден");
  }
  return db.select().from(orders).where(and(eq(orders.userId, user.id), eq(orders.status, "active")));
}

export async function fetchActiveOrderForService(payload: { email: string; serviceId: string }) {
  await ensureMigrations();
  const [user] = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
  if (!user) {
    throw new Error("Пользователь не найден");
  }
  const [service] = await db
    .select()
    .from(userServices)
    .where(and(eq(userServices.id, payload.serviceId), eq(userServices.userId, user.id)))
    .limit(1);
  if (!service || !service.orderId) return null;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, service.orderId), eq(orders.status, "active")))
    .limit(1);
  return order ?? null;
}

export async function fetchPanelAccount(payload: { userId: number; panel: string }) {
  await ensureMigrations();
  const [account] = await db
    .select()
    .from(panelAccounts)
    .where(and(eq(panelAccounts.userId, payload.userId), eq(panelAccounts.panel, payload.panel)))
    .limit(1);
  return account ?? null;
}

export async function createPanelAccount(payload: { userId: number; panel: string; externalId: string }) {
  await ensureMigrations();
  const [account] = await db
    .insert(panelAccounts)
    .values({ id: withId("pacc"), userId: payload.userId, panel: payload.panel, externalId: payload.externalId })
    .returning();
  return account;
}

export async function createPanelResource(payload: { orderId: string; panel: string; externalId: string }) {
  await ensureMigrations();
  const [resource] = await db
    .insert(panelResources)
    .values({ id: withId("pres"), orderId: payload.orderId, panel: payload.panel, externalId: payload.externalId })
    .returning();
  return resource;
}

export async function enqueueProvisioningJob(orderId: string) {
  await ensureMigrations();
  const [job] = await db
    .insert(provisioningJobs)
    .values({ id: withId("job"), orderId, status: "pending", attempts: 0 })
    .returning();
  return job;
}

export async function claimProvisioningJob() {
  await ensureMigrations();
  const now = new Date().toISOString();
  const [job] = await db
    .select()
    .from(provisioningJobs)
    .where(and(eq(provisioningJobs.status, "pending"), lte(provisioningJobs.nextRunAt, now)))
    .orderBy(desc(provisioningJobs.createdAt))
    .limit(1);

  if (!job) return null;

  const [updated] = await db
    .update(provisioningJobs)
    .set({ status: "running", attempts: job.attempts + 1, updatedAt: now })
    .where(eq(provisioningJobs.id, job.id))
    .returning();

  return updated ?? job;
}

export async function completeProvisioningJob(jobId: string) {
  await ensureMigrations();
  const now = new Date().toISOString();
  await db.update(provisioningJobs).set({ status: "done", updatedAt: now }).where(eq(provisioningJobs.id, jobId));
}

export async function failProvisioningJob(payload: { jobId: string; error: string; retryDelaySeconds?: number }) {
  await ensureMigrations();
  const now = new Date();
  const delay = payload.retryDelaySeconds ?? 60;
  const nextRunAt = new Date(now.getTime() + delay * 1000).toISOString();
  await db
    .update(provisioningJobs)
    .set({
      status: "failed",
      lastError: payload.error,
      nextRunAt,
      updatedAt: now.toISOString(),
    })
    .where(eq(provisioningJobs.id, payload.jobId));
}

export async function updateAccountSettings(payload: {
  currentEmail: string;
  name?: string;
  newEmail?: string;
  currentPassword?: string;
  newPassword?: string;
  notifyEmail?: boolean;
  notifyBrowser?: boolean;
  twoFactorEnabled?: boolean;
}): Promise<AuthUser> {
  await ensureMigrations();
  const [existing] = await db.select().from(users).where(eq(users.email, payload.currentEmail)).limit(1);
  if (!existing) {
    throw new Error("Пользователь не найден");
  }

  if (payload.newEmail && payload.newEmail !== existing.email) {
    const [conflict] = await db.select().from(users).where(eq(users.email, payload.newEmail)).limit(1);
    if (conflict) {
      throw new Error("Email уже используется другим аккаунтом");
    }
  }

  if (payload.newPassword) {
    if (!payload.currentPassword) {
      throw new Error("Укажите текущий пароль для изменения");
    }

    const matches = await bcrypt.compare(payload.currentPassword, existing.passwordHash);
    if (!matches) {
      throw new Error("Текущий пароль неверен");
    }
  }

  const updates: Partial<typeof users.$inferInsert> = {};

  if (payload.name && payload.name !== existing.name) {
    updates.name = payload.name;
  }

  if (payload.newEmail && payload.newEmail !== existing.email) {
    updates.email = payload.newEmail;
  }

  if (payload.newPassword) {
    updates.passwordHash = await bcrypt.hash(payload.newPassword, 10);
  }

  if (typeof payload.notifyEmail === "boolean") {
    updates.notifyEmail = payload.notifyEmail ? 1 : 0;
  }

  if (typeof payload.notifyBrowser === "boolean") {
    updates.notifyBrowser = payload.notifyBrowser ? 1 : 0;
  }

  if (typeof payload.twoFactorEnabled === "boolean") {
    updates.twoFactorEnabled = payload.twoFactorEnabled ? 1 : 0;
  }

  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, existing.id));
  }

  const [user] = await db.select().from(users).where(eq(users.id, existing.id));
  const services = await db
    .select()
    .from(userServices)
    .where(eq(userServices.userId, existing.id))
    .orderBy(desc(userServices.createdAt));

  return toAuthUser(user, toUserServices(services));
}
