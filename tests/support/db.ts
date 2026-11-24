import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrateDatabase, setDatabase, type DB } from "@/core/db/client";
import * as schema from "@/core/db/schema";
import { seedDatabase } from "@/core/db/seed";

/** Fresh in-memory Postgres (PGlite), migrated with the bundled migrations and seeded, installed as the app database. */
export async function useTestDb(): Promise<DB> {
  const client = new PGlite();
  const db = drizzle({ client, schema }) as unknown as DB;
  await migrateDatabase(db);
  await seedDatabase(db);
  setDatabase(db, () => client.close());
  return db;
}
