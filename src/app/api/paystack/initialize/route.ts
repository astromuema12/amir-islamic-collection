import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { initializePayment } from "@/lib/paystack";

const initializeSchema = z.object({
  orderId: z.string().uuid(),
});

const MIN_PAYMENT_KES = 100;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Authentication required" },
        { status: 401 }
      );
    }

    const parsed = initializeSchema.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "A valid orderId is required" },
        { status: 400 }
      );
    }

    // The server is the only source of truth for the order, amount, email and
    // reference. Clients may only name one of their own orders.
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, parsed.data.orderId), eq(orders.userId, user.id))
      )
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { status: "error", message: "Order not found" },
        { status: 404 }
      );
    }

    if (
      order.paymentStatus === "completed" ||
      ["cancelled", "refunded", "delivered"].includes(order.status)
    ) {
      return NextResponse.json(
        { status: "error", message: "This order is not awaiting payment" },
        { status: 409 }
      );
    }

    const amount = Number(order.total);
    if (!Number.isFinite(amount) || amount < MIN_PAYMENT_KES) {
      return NextResponse.json(
        {
          status: "error",
          message: `Order total must be at least KES ${MIN_PAYMENT_KES}`,
        },
        { status: 400 }
      );
    }

    const reference = `amir-${order.id}-${uuidv4()}`;
    const response = await initializePayment({
      email: user.email,
      amount,
      reference,
      metadata: {
        orderId: order.id,
        customerEmail: user.email,
      },
    });

    if (!response.status) {
      return NextResponse.json(
        {
          status: "error",
          message: response.message || "Payment initialization failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        authorizationUrl: response.data.authorization_url,
        reference: response.data.reference,
        accessCode: response.data.access_code,
      },
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { status: "error", message: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
