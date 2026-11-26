import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { sessions, users, verificationTokens } from "@/lib/db/schema";
import { sendWelcomeEmail } from "@/lib/resend";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function verificationFailed(request: NextRequest) {
  return NextResponse.redirect(
    new URL("/login?error=verification_failed", request.url)
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return verificationFailed(request);

  const [record] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, token),
        eq(verificationTokens.type, "email_verification")
      )
    )
    .limit(1);

  if (!record || record.expiresAt < new Date()) return verificationFailed(request);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, record.email))
    .limit(1);

  if (!user) return verificationFailed(request);

  // A used link must not remain valid.
  await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.email, record.email),
        eq(verificationTokens.type, "email_verification")
      )
    );

  if (user.emailVerified) {
    return NextResponse.redirect(new URL("/login?verified=1", request.url));
  }

  await db
    .update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
  await db.insert(sessions).values({
    id: uuidv4(),
    userId: user.id,
    token: sessionToken,
    expiresAt,
  });

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  sendWelcomeEmail(user.email, user.name).catch(() => {
    console.error("Failed to send welcome email");
  });

  return response;
}
