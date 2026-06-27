import { NextResponse } from "next/server";
import { initializePayment } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, metadata, reference } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { status: "error", message: "Email and amount are required" },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { status: "error", message: "Amount must be at least KES 100" },
        { status: 400 }
      );
    }

    const response = await initializePayment({
      email,
      amount,
      reference,
      metadata: {
        ...metadata,
        customerEmail: email,
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
