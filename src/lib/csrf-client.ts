import { CSRF_COOKIE, CSRF_HEADER } from "@/lib/csrf";

export function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`));
  return match?.[1];
}

export async function csrfFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = getCsrfToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set(CSRF_HEADER, token);
  }

  return fetch(input, { ...init, headers });
}
