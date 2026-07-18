import "dotenv/config";
import { getDb } from "@/lib/db";

const db = getDb();

function log(message: string) {
  console.log(`[SEED] ${message}`);
}

async function main() {
  log("Starting seed...\n");

  const tables = db._.fullSchema ?? {};
  const tableNames = Object.keys(tables);

  if (tableNames.length === 0) {
    log("No tables found in schema. Ensure the database is migrated before seeding.");
    process.exit(0);
  }

  log(`Found ${tableNames.length} tables: ${tableNames.join(", ")}`);
  log("No seed data to insert — the database is now a clean slate.");
  log("Use the admin panel or API routes to add real data.\n");

  log("Seed completed successfully (no data inserted).");
  process.exit(0);
}

main().catch((err) => {
  console.error("[SEED] Error:", err);
  process.exit(1);
});
