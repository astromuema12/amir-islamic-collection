"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";
import { APP_NAME } from "@/lib/constants";

const CONTACT_INBOX =
  process.env.CONTACT_TO_EMAIL || "amirislamiccollections@gmail.com";

const FROM_ADDRESS = `${APP_NAME} <noreply@amirislamiccollections.com>`;

export type ContactResult = { success: true } | { error: string };

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

const newsletterSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function submitContactMessage(
  formData: FormData
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Please complete all fields.",
    };
  }

  const ip = await getClientIp();
  const rl = await rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return {
      error: "Too many messages sent. Please try again later.",
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendEmail({
      from: FROM_ADDRESS,
      to: CONTACT_INBOX,
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("[submitContactMessage] Failed to send message:", error);
    return { error: "Failed to send your message. Please try again later." };
  }
}

export async function subscribeNewsletter(
  email: string
): Promise<ContactResult> {
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  const ip = await getClientIp();
  const rl = await rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.success) {
    return { error: "Too many attempts. Please try again later." };
  }

  try {
    await sendEmail({
      from: FROM_ADDRESS,
      to: CONTACT_INBOX,
      subject: `[Newsletter] New subscriber — ${parsed.data.email}`,
      html: `
        <h2>New newsletter subscriber</h2>
        <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("[subscribeNewsletter] Failed to record subscriber:", error);
    return { error: "Subscription failed. Please try again later." };
  }
}
