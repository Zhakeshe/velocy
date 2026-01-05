import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  balance: integer("balance").notNull().default(0),
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
  catalogId: text("catalog_id").notNull().default("custom"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  name: text("name").notNull(),
  area: text("area").notNull(),
  plan: text("plan").notNull(),
  price: text("price").notNull(),
  billing: text("billing").notNull(),
  nextInvoice: text("next_invoice").notNull(),
  status: text("status").notNull(),
});
