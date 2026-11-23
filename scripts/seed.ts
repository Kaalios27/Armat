// Re-applies curated content even if the seed version is unchanged. Learner data is never modified.
import { closeDatabase, database } from "../src/server/db/client";
import { seedDatabase } from "../src/server/db/seed";

await seedDatabase(await database(), true);
await closeDatabase();
console.log("Curated content seeded.");
