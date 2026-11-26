import crypto from "crypto";

/** HMAC-SHA512 produces 128 hex characters. */
const SHA512_HEX_LENGTH = 128;

/**
 * Constant-time verification of the Paystack webhook signature.
 * Accepts only a well-formed hex digest so malformed input cannot be used to
 * shorten the comparison.
 */
export function verifyPaystackSignature(
  body: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret) return false;
  if (signature.length !== SHA512_HEX_LENGTH || !/^[0-9a-f]+$/i.test(signature)) {
    return false;
  }

  const expected = crypto.createHmac("sha512", secret).update(body).digest("hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

/**
 * Paystack reports amounts in the smallest currency unit (e.g. cents/kobo).
 * Compare against the order total read from the database, never client input.
 */
export function paystackAmountMatchesTotal(
  amountInMinorUnits: number,
  orderTotal: string | number
): boolean {
  if (!Number.isInteger(amountInMinorUnits) || amountInMinorUnits <= 0) return false;

  const total = Number(orderTotal);
  if (!Number.isFinite(total) || total <= 0) return false;

  return amountInMinorUnits === Math.round(total * 100);
}
