import path from "node:path";
import type { SQL } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;
export type DbKind = "postgres" | "pglite";

interface DbState {
  db: DB;
  kind: DbKind;
  ready: Promise<void>;
  close: () => Promise<void>;
}

declare global {
  // eslint-disable-next-line no-var
  var __armatDb: DbState | undefined;
  // eslint-disable-next-line no-var
  var __armatDbInit: Promise<DbState> | undefined;
}

export const MIGRATIONS_FOLDER = path.join(process.cwd(), "drizzle");

async function connect(): Promise<Omit<DbState, "ready">> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    // prepare: false keeps the connection compatible with transaction poolers (Supabase, PgBouncer).
    const client = postgres(url, { prepare: false, max: 5, idle_timeout: 20, connect_timeout: 15 });
    const db = drizzle({ client, schema }) as unknown as DB;
    return { db, kind: "postgres", close: () => client.end({ timeout: 5 }) };
  }
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_DB !== "1") {
    throw new Error("DATABASE_URL is not set. A PostgreSQL database is required in production.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dataDir = process.env.PGLITE_DIR ?? path.join(process.cwd(), ".data", "pglite");
  const { mkdirSync, renameSync } = await import("node:fs");
  mkdirSync(dataDir, { recursive: true });
  let client = new PGlite(dataDir);
  try {
    await client.query("select 1");
  } catch (err) {
    // A development database left inconsistent by a killed process: keep it aside and start fresh.
    const aside = `${dataDir}-unreadable-${Date.now()}`;
    console.warn(`[armat] Local PGlite database could not be opened (${String(err)}). Moved to ${aside}; starting a new local database.`);
    try {
      await client.close();
    } catch {
      // ignore
    }
    renameSync(dataDir, aside);
    mkdirSync(dataDir, { recursive: true });
    client = new PGlite(dataDir);
  }
  const close = () => client.close();
  registerShutdown(close);
  const db = drizzle({ client, schema }) as unknown as DB;
  return { db, kind: "pglite", close };
}

let shutdownRegistered = false;

/** Close the embedded database cleanly when the development server stops. */
function registerShutdown(close: () => Promise<void>): void {
  if (shutdownRegistered) return;
  shutdownRegistered = true;
  const handler = (signal: NodeJS.Signals) => {
    close()
      .catch(() => {})
      .finally(() => process.kill(process.pid, signal));
  };
  process.once("SIGINT", handler);
  process.once("SIGTERM", handler);
  process.once("beforeExit", () => void close().catch(() => {}));
}

export async function migrateDatabase(db: DB, kind: DbKind): Promise<void> {
  if (kind === "postgres") {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await migrate(db as any, { migrationsFolder: MIGRATIONS_FOLDER });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await migrate(db as any, { migrationsFolder: MIGRATIONS_FOLDER });
  }
}

async function prepare(state: Omit<DbState, "ready">): Promise<void> {
  await migrateDatabase(state.db, state.kind);
  const { seedDatabase } = await import("./seed");
  await seedDatabase(state.db);
}

/** The application database, migrated and seeded on first use. */
export async function database(): Promise<DB> {
  if (globalThis.__armatDb) {
    await globalThis.__armatDb.ready;
    return globalThis.__armatDb.db;
  }
  // Store the promise synchronously: concurrent first requests must share one connection
  // (two PGlite instances on one directory corrupt it).
  globalThis.__armatDbInit ??= (async () => {
    const conn = await connect();
    await prepare(conn);
    const state: DbState = { ...conn, ready: Promise.resolve() };
    globalThis.__armatDb = state;
    return state;
  })().catch((err) => {
    globalThis.__armatDbInit = undefined;
    throw err;
  });
  return (await globalThis.__armatDbInit).db;
}

export function databaseKind(): DbKind {
  return globalThis.__armatDb?.kind ?? (process.env.DATABASE_URL ? "postgres" : "pglite");
}

/** Replace the database (tests use an in-memory PGlite instance). */
export function setDatabase(db: DB, kind: DbKind, close: () => Promise<void>): void {
  globalThis.__armatDb = { db, kind, ready: Promise.resolve(), close };
  globalThis.__armatDbInit = Promise.resolve(globalThis.__armatDb);
}

export async function closeDatabase(): Promise<void> {
  const s = globalThis.__armatDb;
  globalThis.__armatDb = undefined;
  globalThis.__armatDbInit = undefined;
  if (s) await s.close();
}

/** Run raw SQL and return rows for either driver. */
export async function rawRows<T>(db: DB, query: SQL): Promise<T[]> {
  const res = (await db.execute(query)) as unknown;
  if (Array.isArray(res)) return res as T[];
  return ((res as { rows?: T[] }).rows ?? []) as T[];
}
