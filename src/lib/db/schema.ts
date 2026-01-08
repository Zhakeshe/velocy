import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  balance: integer("balance").notNull().default(0),
  notifyEmail: integer("notify_email").notNull().default(1),
  notifyBrowser: integer("notify_browser").notNull().default(0),
  twoFactorEnabled: integer("two_factor_enabled").notNull().default(0),
  emailVerified: integer("email_verified").notNull().default(0),
  isAdmin: integer("is_admin").notNull().default(0),
  isBanned: integer("is_banned").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const authCodes = sqliteTable("auth_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  code: text("code").notNull(),
  purpose: text("purpose").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const catalogItems = sqliteTable("catalog_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  owner: text("owner").notNull(),
  price: integer("price").notNull().default(0),
  currency: text("currency").notNull().default("₸"),
  region: text("region").notNull().default("KZ"),
  cpu: text("cpu").notNull().default(""),
  ram: text("ram").notNull().default(""),
  storage: text("storage").notNull().default(""),
  bandwidth: text("bandwidth").notNull().default(""),
  ddos: text("ddos").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userServices = sqliteTable("user_services", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  orderId: text("order_id").notNull().default(""),
  catalogId: text("catalog_id").notNull().default("custom"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  name: text("name").notNull(),
  area: text("area").notNull(),
  plan: text("plan").notNull(),
  price: text("price").notNull(),
  billing: text("billing").notNull(),
  nextInvoice: text("next_invoice").notNull(),
  status: text("status").notNull(),
  hostname: text("hostname").notNull().default(""),
  ip: text("ip").notNull().default(""),
  ptr: text("ptr").notNull().default(""),
  panelUrl: text("panel_url").notNull().default(""),
  activatedAt: text("activated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  catalogId: text("catalog_id").notNull(),
  productType: text("product_type").notNull(),
  status: text("status").notNull(),
  panelUrl: text("panel_url").notNull().default(""),
  metadata: text("metadata").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  activatedAt: text("activated_at"),
});

export const panelAccounts = sqliteTable("panel_accounts", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  panel: text("panel").notNull(),
  externalId: text("external_id").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const panelResources = sqliteTable("panel_resources", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  panel: text("panel").notNull(),
  externalId: text("external_id").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const provisioningJobs = sqliteTable("provisioning_jobs", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull(),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error").notNull().default(""),
  nextRunAt: text("next_run_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
