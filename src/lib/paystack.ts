import { getServerEnv } from "@/lib/env";

const PAYSTACK_API = "https://api.paystack.co";

function getSecretKey(): string {
  try {
    const env = getServerEnv();
    return env.PAYSTACK_SECRET_KEY;
  } catch {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured. Payments are unavailable."
    );
  }
}

export class PaystackError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "PaystackError";
  }
}

async function paystackRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const secretKey = getSecretKey();

  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const message =
      data.message || `Paystack API error: ${response.status} ${response.statusText}`;
    throw new PaystackError(message, response.status, data);
  }

  return data as T;
}

interface PaystackResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function initializePayment(params: {
  email: string;
  amount: number;
  reference?: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackResponse<InitializeResponse>> {
  return paystackRequest<PaystackResponse<InitializeResponse>>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email: params.email,
        amount: params.amount * 100,
        reference: params.reference,
        metadata: params.metadata,
      }),
    }
  );
}

interface VerifyResponse {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  metadata: Record<string, unknown>;
}

export async function verifyPayment(
  reference: string
): Promise<PaystackResponse<VerifyResponse>> {
  return paystackRequest<PaystackResponse<VerifyResponse>>(
    `/transaction/verify/${reference}`
  );
}

interface TransferResponse {
  reference: string;
  status: string;
  transfer_code: string;
  amount: number;
}

export async function createTransfer(params: {
  amount: number;
  recipient: string;
  reason?: string;
}): Promise<PaystackResponse<TransferResponse>> {
  return paystackRequest<PaystackResponse<TransferResponse>>("/transfer", {
    method: "POST",
    body: JSON.stringify({
      source: "balance",
      amount: params.amount * 100,
      recipient: params.recipient,
      reason: params.reason,
    }),
  });
}
