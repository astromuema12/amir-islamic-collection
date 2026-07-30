import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/resend";
import crypto from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature || !PAYSTACK_SECRET) return false;
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { status: "error", message: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const metadata = payload.data?.metadata;

    switch (event) {
      case "charge.success": {
        if (metadata?.orderId) {
          await db
            .update(orders)
            .set({
              paymentStatus: "completed",
              status: "confirmed",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, metadata.orderId));
        }

        if (metadata?.orderId && metadata?.customerEmail) {
          await sendOrderConfirmation(
            metadata.customerEmail,
            metadata.orderId
          );
        }
        break;
      }

      case "charge.failed": {
        if (metadata?.orderId) {
          await db
            .update(orders)
            .set({
              paymentStatus: "failed",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, metadata.orderId));
        }
        break;
      }

      case "transfer.success": {
        if (metadata?.orderId) {
          await db
            .update(orders)
            .set({
              paymentStatus: "completed",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, metadata.orderId));
        }
        break;
      }

      case "transfer.failed": {
        if (metadata?.orderId) {
          await db
            .update(orders)
            .set({
              paymentStatus: "failed",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, metadata.orderId));
        }
        break;
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { status: "error", message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
