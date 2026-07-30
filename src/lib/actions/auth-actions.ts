"use server";

import { db } from "@/lib/db";
import {
  users,
  sessions,
  verificationTokens,
  notifications,
  wishlists,
  reviews,
  sellerProfiles,
  cart,
  addresses,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, verifyPassword, createSession, logout as clearSession, getCurrentUser } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
import { sendEmail, sendWelcomeEmail } from "@/lib/resend";
import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  role: "user" | "seller" | "admin" | "super_admin";
  phone: string | undefined;
  bio: string | undefined;
} | null;

export async function getCurrentUserAction(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    phone: user.phone,
    bio: user.bio,
  };
}

function getIp(hdrs: Headers): string {
  return hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "127.0.0.1";
}

export async function register(formData: FormData) {
  try {
    const hdrs = await headers();
    const ip = getIp(hdrs);
    const rl = await rateLimit(`register:${ip}`, 3, 3_600_000);
    if (!rl.success) return { error: { email: ["Too many registration attempts. Please try again later."] } };

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: { email: ["Email already in use"] } };
    }

    const hashed = await hashPassword(parsed.data.password);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      emailVerified: true,
    });

    await createSession(userId);

    sendWelcomeEmail(parsed.data.email, parsed.data.name).catch(() => {
      console.error("Failed to send welcome email");
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Registration failed" };
  }
}

export async function login(formData: FormData) {
  try {
    const hdrs = await headers();
    const ip = getIp(hdrs);
    const rl = await rateLimit(`login:${ip}`, 5, 60_000);
    if (!rl.success) return { error: { email: ["Too many login attempts. Please try again later."] } };

    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    if (!user || !user.password) {
      return { error: { email: ["Invalid email or password"] } };
    }

    const valid = await verifyPassword(parsed.data.password, user.password);
    if (!valid) {
      return { error: { email: ["Invalid email or password"] } };
    }

    await createSession(user.id);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" };
  }
}

export async function logout() {
  await clearSession();
  revalidatePath("/");
}

export async function forgotPassword(formData: FormData) {
  try {
    const hdrs = await headers();
    const ip = getIp(hdrs);
    const rl = await rateLimit(`forgot-password:${ip}`, 3, 3_600_000);
    if (!rl.success) return { error: "Too many password reset requests. Please try again later." };

    const email = formData.get("email") as string;
    if (!email) return { error: "Email is required" };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return { success: true };
    }

    const token = uuidv4();
    await db.insert(verificationTokens).values({
      id: uuidv4(),
      email,
      token,
      type: "password_reset",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to send reset email" };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const hdrs = await headers();
    const ip = getIp(hdrs);
    const rl = await rateLimit(`reset-password:${ip}`, 5, 3_600_000);
    if (!rl.success) return { error: "Too many password reset attempts. Please try again later." };

    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password || password.length < 6) {
      return { error: "Invalid token or password too short" };
    }

    const [vt] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, "password_reset")
        )
      )
      .limit(1);

    if (!vt || vt.expiresAt < new Date()) {
      return { error: "Invalid or expired token" };
    }

    const hashed = await hashPassword(password);
    await db.update(users).set({ password: hashed }).where(eq(users.email, vt.email));
    await db.delete(verificationTokens).where(eq(verificationTokens.id, vt.id));

    revalidatePath("/login");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Password reset failed" };
  }
}

export async function oauthLogin(provider: string) {
  try {
    const { v4: uuidv4 } = await import("uuid");
    const { getAuthorizationUrl, OAUTH_STATE_COOKIE, OAUTH_STATE_MAX_AGE } = await import("@/lib/oauth");

    const config = (await import("@/lib/oauth")).providers[provider];
    if (!config || !config.clientId) {
      return { error: "OAuth is not configured for this provider" };
    }

    // Generate CSRF state token
    const state = uuidv4();

    // Set state cookie (httpOnly, secure in production, sameSite lax, short-lived)
    const cookieStore = await cookies();
    cookieStore.set(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: OAUTH_STATE_MAX_AGE,
      path: "/",
    });

    const url = getAuthorizationUrl(provider, state);
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to initiate OAuth" };
  }
}

export async function deleteAccount() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    // Anonymize the user record so orders remain intact for legal/accounting
    const anonymizedEmail = `deleted-${user.id}@anonymized.invalid`;
    const result = await db
      .update(users)
      .set({
        name: "Deleted Account",
        email: anonymizedEmail,
        phone: null,
        bio: null,
        image: null,
        password: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    if (result.rowCount === 0) {
      return { error: "No rows affected - deletion failed" };
    }

    // Delete all cascade-able user data
    await db.delete(sessions).where(eq(sessions.userId, user.id));
    await db.delete(notifications).where(eq(notifications.userId, user.id));
    await db.delete(wishlists).where(eq(wishlists.userId, user.id));
    await db.delete(reviews).where(eq(reviews.userId, user.id));
    await db.delete(sellerProfiles).where(eq(sellerProfiles.userId, user.id));
    // cart cascades to cart_items, addresses cascade to order references — handled
    await db.delete(cart).where(eq(cart.userId, user.id));
    await db.delete(addresses).where(eq(addresses.userId, user.id));

    // Clear the session cookie
    await clearSession();

    revalidatePath("/");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Account deletion failed" };
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;

    await db
      .update(users)
      .set({ name, phone, bio, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Update failed" };
  }
}
