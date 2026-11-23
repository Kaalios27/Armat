import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrateDatabase, setDatabase, type DB } from "@/server/db/client";
import * as schema from "@/server/db/schema";
import { seedDatabase } from "@/server/db/seed";

/** Fresh in-memory Postgres (PGlite), migrated and seeded, installed as the app database. */
export async function useTestDb(): Promise<DB> {
  const client = new PGlite();
  const db = drizzle({ client, schema }) as unknown as DB;
  await migrateDatabase(db, "pglite");
  await seedDatabase(db);
  setDatabase(db, "pglite", () => client.close());
  return db;
}
