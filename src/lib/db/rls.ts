import { db, getRlsDb } from "./index";
import { getAuthContext } from "@/lib/auth-context";
import { sql } from "drizzle-orm";

export async function withRLS<T>(
  fn: (tx: typeof db) => Promise<T>
): Promise<T> {
  const ctx = getAuthContext();
  if (!ctx) return fn(db);

  const rlsDb = getRlsDb();
  return rlsDb.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user_id', ${ctx.userId}::text, true)`
    );
    await tx.execute(
      sql`SELECT set_config('app.current_user_role', ${ctx.role}, true)`
    );
    return fn(tx as unknown as typeof db);
  });
}