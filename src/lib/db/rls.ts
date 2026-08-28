import { db, getRlsDb } from "./index";
import { sql } from "drizzle-orm";

interface RlsUser {
  id: string;
  role: string;
}

export async function withRLS<T>(
  user: RlsUser,
  fn: (tx: typeof db) => Promise<T>
): Promise<T> {
  const rlsDb = getRlsDb();
  return rlsDb.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user_id', ${user.id}::text, true)`
    );
    await tx.execute(
      sql`SELECT set_config('app.current_user_role', ${user.role}, true)`
    );
    return fn(tx as unknown as typeof db);
  });
}