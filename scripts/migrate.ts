// Applies migrations and seeds curated content (idempotent). Uses DATABASE_URL, or the local PGlite database.
import { closeDatabase, database } from "../src/server/db/client";

await database();
await closeDatabase();
console.log("Database migrated and seeded.");
