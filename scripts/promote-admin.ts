import "dotenv/config";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";

const db = getDb();

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] || "admin") as "admin" | "super_admin";

  if (!email) {
    console.error("Usage: npx tsx scripts/promote-admin.ts <email> [role]");
    console.error("  role: 'admin' (default) or 'super_admin'");
    process.exit(1);
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.name} (${user.email}) — current role: ${user.role}`);

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  console.log(`Role updated to "${role}" successfully.`);
  console.log(`The user can now log in and access /admin.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
