/**
 * The application database: PostgreSQL compiled to WebAssembly (PGlite), running in the
 * browser and stored in IndexedDB. Nothing leaves the device. Tests install an in-memory
 * instance with setDatabase().
 */
import type { PGlite } from "@electric-sql/pglite";
import { sql, type SQL } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { MIGRATIONS } from "./migrations";
import * as schema from "./schema";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;

interface DbState {
  db: DB;
  client: PGlite | null;
  close: () => Promise<void>;
}

// Kept on globalThis so that module reloads during development never open a second instance
// on the same IndexedDB database.
const g = globalThis as { __armatDb?: DbState | null; __armatDbOpening?: Promise<DbState> | null };

/** IndexedDB location of the learner's database. */
export const DATA_DIR = "idb://armat";

/** PGlite's WebAssembly files, copied from node_modules into public/ by scripts/copy-pglite.mjs. */
function assetUrl(file: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pglite/${file}`;
}

async function fetchAsset(file: string): Promise<Response> {
  const res = await fetch(assetUrl(file));
  if (!res.ok) throw new Error(`Could not load ${file} (HTTP ${res.status})`);
  return res;
}

async function compileWasm(file: string): Promise<WebAssembly.Module> {
  const res = await fetchAsset(file);
  try {
    return await WebAssembly.compileStreaming(res.clone());
  } catch {
    // Some servers send WebAssembly without the application/wasm type.
    return WebAssembly.compile(await res.arrayBuffer());
  }
}

/**
 * A background write can fail when PostgreSQL removes a temporary file while the write runs
 * (Emscripten ErrnoError, ENOENT). PGlite keeps those changes for the next write, but the failed
 * promise is not handled inside PGlite, so the browser would report it as an uncaught error.
 */
function ignoreBackgroundSyncErrors(): void {
  const w = window as Window & { __armatSyncGuard?: boolean };
  if (w.__armatSyncGuard) return;
  w.__armatSyncGuard = true;
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as { name?: string; errno?: number } | null;
    if (reason?.name === "ErrnoError" && reason.errno === 44) event.preventDefault();
  });
}

async function openBrowserDatabase(): Promise<DbState> {
  const [{ PGlite }, { drizzle }] = await Promise.all([import("@electric-sql/pglite"), import("drizzle-orm/pglite")]);
  const [pgliteWasmModule, initdbWasmModule, fsBundle] = await Promise.all([
    compileWasm("pglite.wasm"),
    compileWasm("initdb.wasm"),
    fetchAsset("pglite.data").then((r) => r.blob()),
  ]);
  // Relaxed durability: changes are written to IndexedDB in the background after each query, without
  // forcing a disk sync each time (strict mode takes about a second per answer). PGlite keeps the changes
  // of a failed background write and includes them in the next one; pending writes are also flushed when
  // the page is hidden.
  ignoreBackgroundSyncErrors();
  const client = await PGlite.create({ dataDir: DATA_DIR, relaxedDurability: true, pgliteWasmModule, initdbWasmModule, fsBundle });
  const db = drizzle({ client, schema }) as unknown as DB;
  await migrateDatabase(db);
  const { seedDatabase } = await import("./seed");
  await seedDatabase(db);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void client.syncToFs().catch(() => {});
  });
  window.addEventListener("pagehide", () => void client.syncToFs().catch(() => {}));
  return { db, client, close: () => client.close() };
}

/** The learner's database, opened, migrated and seeded on first use (browser only). */
export async function database(): Promise<DB> {
  if (g.__armatDb) return g.__armatDb.db;
  if (typeof window === "undefined") throw new Error("The database lives in the browser; tests install one with setDatabase().");
  g.__armatDbOpening ??= openBrowserDatabase()
    .then((s) => (g.__armatDb = s))
    .catch((err) => {
      g.__armatDbOpening = null;
      throw err;
    });
  return (await g.__armatDbOpening).db;
}

/** Ask PGlite to write pending changes to IndexedDB now (before an export, a reset, or leaving the page). */
export async function flushDatabase(): Promise<void> {
  await g.__armatDb?.client?.syncToFs();
}

/** Replace the database (tests use an in-memory PGlite instance). */
export function setDatabase(db: DB, close: () => Promise<void>): void {
  g.__armatDb = { db, client: null, close };
  g.__armatDbOpening = Promise.resolve(g.__armatDb);
}

export async function closeDatabase(): Promise<void> {
  const s = g.__armatDb;
  g.__armatDb = null;
  g.__armatDbOpening = null;
  if (s) await s.close();
}

/** Apply the bundled SQL migrations that have not run yet, each in its own transaction. */
export async function migrateDatabase(db: DB): Promise<void> {
  await db.execute(sql`create table if not exists armat_migrations (tag text primary key, applied_at timestamptz not null default now())`);
  const done = new Set((await rawRows<{ tag: string }>(db, sql`select tag from armat_migrations`)).map((r) => r.tag));
  for (const m of MIGRATIONS) {
    if (done.has(m.tag)) continue;
    await db.transaction(async (tx) => {
      for (const statement of m.statements) await tx.execute(sql.raw(statement));
      await tx.execute(sql`insert into armat_migrations (tag) values (${m.tag})`);
    });
  }
}

/** Run raw SQL and return its rows. */
export async function rawRows<T>(db: DB, query: SQL): Promise<T[]> {
  const res = (await db.execute(query)) as unknown;
  if (Array.isArray(res)) return res as T[];
  return ((res as { rows?: T[] }).rows ?? []) as T[];
}
