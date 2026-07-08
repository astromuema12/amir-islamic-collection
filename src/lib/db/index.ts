import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { neon, Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _rlsDb: ReturnType<typeof neonDrizzle> | null = null;

function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

function getRlsDb() {
  if (!_rlsDb) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const pool = new Pool({ connectionString: url, max: 1 });
    _rlsDb = neonDrizzle(pool, { schema });
  }
  return _rlsDb;
}

// Proxy that lazily initializes the db connection (HTTP-based)
const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

export { db, getDb, getRlsDb, schema };
