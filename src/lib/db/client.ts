import fs from "fs";
import path from "path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const databaseUrl = process.env.DATABASE_URL ?? "file:./drizzle/db.sqlite";

const client = createClient({ url: databaseUrl });
export const db = drizzle(client);

let migrationPromise: Promise<void> | null = null;

export async function ensureMigrations() {
  if (migrationPromise) return migrationPromise;

  const migrationsFolder = path.join(process.cwd(), "drizzle");
  fs.mkdirSync(migrationsFolder, { recursive: true });

   const metaFolder = path.join(migrationsFolder, "meta");
   const journalPath = path.join(metaFolder, "_journal.json");

   if (!fs.existsSync(journalPath)) {
     fs.mkdirSync(metaFolder, { recursive: true });

     const journal = {
       version: "7",
       dialect: "sqlite",
       entries: [],
     } satisfies {
       version: string;
       dialect: string;
       entries: unknown[];
     };

     fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2));
   }

  migrationPromise = migrate(db, { migrationsFolder }).catch((error) => {
    migrationPromise = null;
    throw error;
  });

  return migrationPromise;
}
