import "dotenv/config";
import { getDb } from "@/lib/db";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
