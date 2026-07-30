import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }

    cookieStore.delete("session_token");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Failed to logout" },
      { status: 500 }
    );
  }
}
