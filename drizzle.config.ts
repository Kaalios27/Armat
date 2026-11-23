import { defineConfig } from "drizzle-kit";

// Migrations are generated from the schema and committed. They are applied by
// `npm run db:migrate`, by the Vercel build, and lazily on first database access.
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: process.env.DATABASE_URL ? { url: process.env.DATABASE_URL } : undefined,
});
