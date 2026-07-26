export const CSRF_COOKIE = "csrf_token";
export const CSRF_HEADER = "x-csrf-token";
const CSRF_MAX_AGE = 60 * 60 * 24; // 24 hours

export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export function validateCsrfToken(
  cookieToken: string | undefined | null,
  headerToken: string | undefined | null,
): boolean {
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return mismatch === 0;
}

export function csrfCookieOptions() {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: CSRF_MAX_AGE,
  };
}
