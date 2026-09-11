import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAdminEmail } from "@/lib/constants";
import { apiLimiter, authLimiter, checkoutLimiter } from "@/lib/rate-limit";
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  generateCsrfToken,
  validateCsrfToken,
  csrfCookieOptions,
} from "@/lib/csrf";

function generateNonce(): string {
  const array = new Uint8Array(16);
  globalThis.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

function withSecurityHeaders(response: NextResponse, nonce: string): NextResponse {
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

  const devScriptSrc = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'${devScriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://imgproxy.attic.sh https://attic.sh https://res.cloudinary.com https://placehold.co",
      "font-src 'self' https://fonts.gstatic.com",
      `connect-src 'self' https://api.paystack.co https://imgproxy.attic.sh https://attic.sh https://res.cloudinary.com${process.env.NODE_ENV === "development" ? " ws://localhost:*" : ""}`,
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return response;
}

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/account",
  "/checkout",
  "/orders",
  "/profile",
  "/settings",
  "/seller",
];

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

const CSRF_EXCLUDED_ROUTES = ["/api/paystack/webhook"];
const CSRF_MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function needsCsrfValidation(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  if (!CSRF_MUTATING_METHODS.includes(request.method)) return false;
  if (!pathname.startsWith("/api/")) return false;
  if (CSRF_EXCLUDED_ROUTES.includes(pathname)) return false;
  if (request.headers.has("next-action")) return false;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (!origin && !referer) return false;

  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  const nonce = generateNonce();

  // --- CSRF Validation ---
  if (needsCsrfValidation(request)) {
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
    const headerToken = request.headers.get(CSRF_HEADER);

    if (!validateCsrfToken(cookieToken, headerToken)) {
      return withSecurityHeaders(
        NextResponse.json(
          { status: "error", message: "Invalid or missing CSRF token." },
          { status: 403 },
        ),
        nonce,
      );
    }
  }

  // --- Rate Limiting: Payment initialization ---
  if (pathname === "/api/paystack/initialize" && request.method === "POST") {
    const result = await apiLimiter.limit(`api:${ip}`);
    if (!result.success) {
      return withSecurityHeaders(
        NextResponse.json(
          { status: "error", message: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
        ),
        nonce,
      );
    }
  }

  // --- Rate Limiting: Auth endpoints ---
  // Server actions already rate-limit internally and return a proper error object;
  // a redirect here would break the action's response decoding on the client
  // (surfacing as a generic "unexpected error" toast).
  if (authRoutes.includes(pathname) && request.method === "POST" && !request.headers.has("next-action")) {
    const result = await authLimiter.limit(`auth:${ip}`);
    if (!result.success) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "rate_limited");
      return withSecurityHeaders(NextResponse.redirect(loginUrl), nonce);
    }
  }

  // --- Rate Limiting: Checkout ---
  if (pathname === "/checkout" && request.method === "POST") {
    const result = await checkoutLimiter.limit(`checkout:${ip}`);
    if (!result.success) {
      return withSecurityHeaders(
        NextResponse.json(
          { status: "error", message: "Too many checkout attempts. Please try again later." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) } }
        ),
        nonce,
      );
    }
  }

  // --- Session Validation ---
  const sessionToken = request.cookies.get("session_token")?.value;
  let isAuthenticated = false;
  let session: typeof sessions.$inferSelect | null = null;
  let sessionRenewed: Date | null = null;

  if (sessionToken) {
    try {
      const [found] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, sessionToken));
      session = found ?? null;

      if (session && session.expiresAt > new Date()) {
        isAuthenticated = true;

        const twoDays = 2 * 24 * 60 * 60 * 1000;
        if (session.expiresAt.getTime() - Date.now() < twoDays) {
          const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await db
            .update(sessions)
            .set({ expiresAt: newExpiry })
            .where(eq(sessions.id, session.id));
          sessionRenewed = newExpiry;
        }
      }
    } catch {
      // DB connection failure — treat as unauthenticated
    }
  }

  // --- Admin Route Guard ---
  if (pathname.startsWith("/admin") && isAuthenticated) {
    try {
      if (session) {
        const [user] = await db
          .select({ role: users.role, email: users.email })
          .from(users)
          .where(eq(users.id, session.userId))
          .limit(1);

        const isAdmin =
          user &&
          (user.role === "admin" || user.role === "super_admin") &&
          isAdminEmail(user.email);

        if (!isAdmin) {
          // Authenticated but not an approved admin — keep them out of the admin panel.
          // Redirect browser navigations home, deny non-browser clients with 403.
          if (request.headers.get("accept")?.includes("text/html")) {
            return withSecurityHeaders(NextResponse.redirect(new URL("/", request.url)), nonce);
          }
          return withSecurityHeaders(
            NextResponse.json(
              { status: "error", message: "Forbidden — admin access required" },
              { status: 403 },
            ),
            nonce,
          );
        }
      }
    } catch {
      return withSecurityHeaders(
        NextResponse.json(
          { status: "error", message: "Forbidden — admin access required" },
          { status: 403 },
        ),
        nonce,
      );
    }
  }

  // --- Route Protection: Redirect unauthenticated users ---
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl), nonce);
  }

  // --- Route Protection: Redirect authenticated users away from auth pages ---
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return withSecurityHeaders(NextResponse.redirect(new URL("/", request.url)), nonce);
  }

  // --- Security Headers + CSRF Cookie + Nonce ---
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (sessionRenewed && sessionToken) {
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: sessionRenewed,
    });
  }

  if (!request.cookies.get(CSRF_COOKIE)?.value) {
    response.cookies.set(CSRF_COOKIE, generateCsrfToken(), csrfCookieOptions());
  }

  withSecurityHeaders(response, nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
