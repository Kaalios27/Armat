// Copies PGlite's WebAssembly build of PostgreSQL into public/pglite, where the static site
// serves it to the browser. Runs before `next dev` and `next build`.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("@electric-sql/pglite"));
mkdirSync("public/pglite", { recursive: true });
for (const file of ["pglite.wasm", "initdb.wasm", "pglite.data"]) copyFileSync(join(dist, file), join("public/pglite", file));
console.log("PGlite assets copied to public/pglite");
