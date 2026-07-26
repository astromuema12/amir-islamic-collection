import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const OAUTH_STATE_COOKIE = "oauth_state";
const OAUTH_STATE_MAX_AGE = 600; // 10 minutes
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

interface OAuthProviderConfig {
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface OAuthTokens {
  access_token: string;
  token_type: string;
  scope?: string;
}

export interface OAuthUserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export const providers: Record<string, OAuthProviderConfig> = {
  google: {
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scopes: ["openid", "email", "profile"],
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
  },
  github: {
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scopes: ["user:email"],
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
  },
};

export function getAuthorizationUrl(provider: string, state: string): string {
  const config = providers[provider];
  if (!config) throw new Error(`Unsupported provider: ${provider}`);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  provider: string,
  code: string
): Promise<OAuthTokens> {
  const config = providers[provider];
  if (!config) throw new Error(`Unsupported provider: ${provider}`);

  const body: Record<string, string> = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  };

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

export async function fetchUserProfile(
  provider: string,
  accessToken: string
): Promise<OAuthUserProfile> {
  const config = providers[provider];
  if (!config) throw new Error(`Unsupported provider: ${provider}`);

  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile from ${provider}`);
  }

  const data = await response.json();

  switch (provider) {
    case "google":
      return {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        image: data.picture,
      };
    case "github": {
      const email = data.email || `${data.login}@github.local`;
      return {
        id: String(data.id),
        email,
        name: data.name || data.login,
        image: data.avatar_url,
      };
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export async function findOrCreateOAuthUser(
  profile: OAuthUserProfile,
): Promise<string> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, profile.email))
    .limit(1);

  if (existingUser.length > 0) {
    const user = existingUser[0];

    // Update image if not set or changed
    if (profile.image && user.image !== profile.image) {
      await db
        .update(users)
        .set({ image: profile.image, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    // Mark email as verified for OAuth users
    if (!user.emailVerified) {
      await db
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    return user.id;
  }

  // Create new user
  const userId = uuidv4();
  await db.insert(users).values({
    id: userId,
    name: profile.name,
    email: profile.email,
    emailVerified: true,
    image: profile.image || null,
    password: null, // OAuth users have no password
  });

  return userId;
}

export { OAUTH_STATE_COOKIE, OAUTH_STATE_MAX_AGE };

export async function handleOAuthCallback(
  request: NextRequest,
  provider: string,
  searchParams: URLSearchParams
): Promise<NextResponse> {
  const error = searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=oauth_denied`, request.url)
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_missing_params", request.url)
    );
  }

  // CSRF protection: verify state matches cookie
  const cookieStore = await cookies();
  const savedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  // Always delete the state cookie (replay protection)
  cookieStore.set(OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_invalid_state", request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(provider, code);

    // Fetch user profile from provider
    const profile = await fetchUserProfile(provider, tokens.access_token);

    // Find or create user in database
    const userId = await findOrCreateOAuthUser(profile);

    // Create session
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await db.insert(sessions).values({
      id: uuidv4(),
      userId,
      token: sessionToken,
      expiresAt,
    });

    // Set session cookie and redirect
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(`OAuth callback error (${provider}):`, err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", request.url)
    );
  }
}
