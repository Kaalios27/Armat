import { defineConfig } from "drizzle-kit";

// Migrations are generated from the schema and committed, then bundled for the browser by
// scripts/gen-migrations.mjs (npm run db:generate does both).
export default defineConfig({
  schema: "./src/core/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
});
