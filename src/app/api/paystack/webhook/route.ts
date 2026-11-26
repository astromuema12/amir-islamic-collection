import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { verifyPayment } from "@/lib/paystack";
import { sendOrderConfirmation } from "@/lib/resend";
import {
  paystackAmountMatchesTotal,
  verifyPaystackSignature,
} from "@/lib/payment-security";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const webhookSchema = z.object({
  event: z.string(),
  data: z.object({
    id: z.union([z.string(), z.number()]),
    reference: z.string().optional(),
    amount: z.number().int().optional(),
    currency: z.string().optional(),
    metadata: z
      .object({
        orderId: z.string().uuid().optional(),
        customerEmail: z.string().optional(),
      })
      .optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyPaystackSignature(body, signature, PAYSTACK_SECRET)) {
      return NextResponse.json(
        { status: "error", message: "Invalid signature" },
        { status: 401 }
      );
    }

    const parsed = webhookSchema.safeParse(JSON.parse(body));
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid payload" },
        { status: 400 }
      );
    }

    const { event, data } = parsed.data;
    const orderId = data.metadata?.orderId;

    switch (event) {
      case "charge.success": {
        if (!orderId || !data.reference) break;

        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.id, orderId))
          .limit(1);
        if (!order || order.paymentStatus === "completed") break;

        // Never trust the event body for money or identity: ask Paystack and
        // compare against the order we control.
        const verification = await verifyPayment(data.reference);
        const transaction = verification.data;
        if (transaction.status !== "success") break;
        if (data.amount !== undefined && transaction.amount !== data.amount) break;
        if (
          data.currency &&
          transaction.currency &&
          transaction.currency !== data.currency
        ) {
          break;
        }
        if (!paystackAmountMatchesTotal(transaction.amount, order.total)) {
          console.error(
            `[paystack] Amount mismatch for order ${orderId}: paid ${transaction.amount}, expected ${order.total}`
          );
          break;
        }

        const verifiedOrderId = (
          transaction.metadata as { orderId?: unknown } | undefined
        )?.orderId;
        if (verifiedOrderId !== orderId) break;

        // Only pending orders can be confirmed. This makes duplicated events
        // harmless and prevents downgrading shipped/delivered orders.
        const updated = await db
          .update(orders)
          .set({
            paymentStatus: "completed",
            status: "confirmed",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(orders.id, orderId),
              eq(orders.paymentStatus, "pending"),
              eq(orders.status, "pending")
            )
          );

        if (updated.rowCount === 0) break;

        const [user] = await db
          .select({ email: users.email })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);
        if (user) {
          await sendOrderConfirmation(user.email, orderId);
        }
        break;
      }

      case "charge.failed": {
        if (!orderId) break;
        await db
          .update(orders)
          .set({ paymentStatus: "failed", updatedAt: new Date() })
          .where(
            and(
              eq(orders.id, orderId),
              eq(orders.paymentStatus, "pending"),
              eq(orders.status, "pending")
            )
          );
        break;
      }

      // Transfer events concern seller payouts, not customer order payments.
      default:
        break;
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
