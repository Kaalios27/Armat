// Writes a full JSON export of learner data to backups/.
import { mkdirSync, writeFileSync } from "node:fs";
import { closeDatabase } from "../src/server/db/client";
import { exportAll } from "../src/server/services/export";

const data = await exportAll();
mkdirSync("backups", { recursive: true });
const file = `backups/armat-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(file, JSON.stringify(data));
await closeDatabase();
console.log(`Backup written to ${file}`);
