import "dotenv/config";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function splitStatements(sql: string): string[] {
  return sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => {
      if (s.length === 0) return false;
      const lines = s.split("\n");
      return lines.some((line) => {
        const t = line.trim();
        return t.length > 0 && !t.startsWith("--");
      });
    });
}

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const path = join(__dirname, "rls-policies.sql");
  const content = readFileSync(path, "utf-8");
  const statements = splitStatements(content);

  console.log(`Applying ${statements.length} RLS statements...`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await sql.query(statements[i]);
      console.log(`  [${i + 1}/${statements.length}] OK`);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("already exists")) {
        console.log(`  [${i + 1}/${statements.length}] SKIP (${msg})`);
      } else {
        console.error(`  [${i + 1}/${statements.length}] FAILED:`, msg);
        console.error(`  Statement: ${statements[i].slice(0, 100)}...`);
      }
    }
  }

  console.log("RLS policies applied successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to apply RLS policies:", err);
  process.exit(1);
});
