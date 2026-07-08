import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

const protectedRoutes = [
  "/profile",
  "/settings",
  "/orders",
  "/checkout",
  "/seller",
  "/admin",
  "/dashboard",
  "/wishlist",
];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

const RATE_LIMIT_WINDOW = 60_000;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";

  // --- Rate Limiting ---
  if (pathname === "/api/paystack/initialize" && request.method === "POST") {
    const result = rateLimit(`api:${ip}`, 30, RATE_LIMIT_WINDOW);
    if (!result.success) {
      return NextResponse.json(
        { status: "error", message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
      );
    }
  }

  if (authRoutes.includes(pathname) && request.method === "POST") {
    const result = rateLimit(`auth:${ip}`, 5, RATE_LIMIT_WINDOW);
    if (!result.success) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "rate_limited");
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Session Validation ---
  const sessionToken = request.cookies.get("session_token")?.value;
  let isAuthenticated = false;
  let sessionId: string | null = null;

  if (sessionToken) {
    try {
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, sessionToken));

      if (session && session.expiresAt > new Date()) {
        isAuthenticated = true;
        sessionId = session.id;

        // Refresh session if less than 2 days remain
        const twoDays = 2 * 24 * 60 * 60 * 1000;
        if (session.expiresAt.getTime() - Date.now() < twoDays) {
          const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await db.update(sessions).set({ expiresAt: newExpiry }).where(eq(sessions.id, session.id));
        }
      }
    } catch {
      // Silently fail — treat as unauthenticated
    }
  }

  // --- Route Protection ---
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --- Security Headers ---
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob: https://imgproxy.attic.sh https://attic.sh https://res.cloudinary.com`,
      `font-src 'self'`,
      `connect-src 'self' https://api.paystack.co${process.env.NODE_ENV === "development" ? " ws://localhost:*" : ""}`,
      `frame-src 'none'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api/paystack/webhook|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
