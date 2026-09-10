import crypto from "crypto";
import { env } from "@/env";

// ── Payment Signature Verification ───────────────────────────

/**
 * Razorpay payment signature verify karo.
 * POST /api/payments/verify mein use hoga.
 *
 * Razorpay HMAC-SHA256 compute karta hai:
 * key    = RAZORPAY_KEY_SECRET
 * data   = razorpayOrderId + "|" + razorpayPaymentId
 *
 * @returns true if signature matches — payment genuine hai
 */
export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  // Timing-safe comparison — prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(razorpaySignature, "hex"),
  );
}

// ── Webhook Signature Verification ───────────────────────────

/**
 * Razorpay webhook signature verify karo.
 * POST /api/webhooks/razorpay mein use hoga.
 *
 * Header: x-razorpay-signature
 * key  = RAZORPAY_WEBHOOK_SECRET
 * data = raw request body (string)
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex"),
    );
  } catch {
    // Buffer length mismatch — invalid signature format
    return false;
  }
}

// ── Receipt ID Generator ──────────────────────────────────────

/**
 * Razorpay order ke liye unique receipt ID generate karo.
 * Format: RCPT-{YYYYMMDD}-{random6}
 * e.g.  : RCPT-20250115-A3F9K2
 *
 * Razorpay receipt field max 40 chars — yeh ~22 chars hai.
 */
export function generateReceiptId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20250115"

  const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // "A3F9K2"

  return `RCPT-${date}-${random}`;
}

// ── Amount Helpers (paise ↔ INR) ──────────────────────────────

/**
 * INR rupees ko paise mein convert karo.
 * Razorpay hamesha paise mein kaam karta hai.
 * e.g. 499 → 49900
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Paise ko INR rupees mein convert karo — display ke liye.
 * e.g. 49900 → 499
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Amount format karo INR display ke liye.
 * e.g. 49900 → "₹499"
 */
export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paiseToRupees(paise));
}

// ── Coupon Discount Calculator ────────────────────────────────

/**
 * Coupon discount calculate karo.
 *
 * @param originalPrice - Course price in paise
 * @param discountType  - "PERCENT" | "FLAT"
 * @param discountValue - PERCENT: 1-100, FLAT: paise mein
 * @param minOrderValue - Minimum order value in paise (default 0)
 * @returns { discountAmount, finalPrice } in paise
 */
export function calculateDiscount({
  originalPrice,
  discountType,
  discountValue,
  minOrderValue = 0,
}: {
  originalPrice: number;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  minOrderValue?: number;
}): { discountAmount: number; finalPrice: number } {
  if (originalPrice < minOrderValue) {
    return { discountAmount: 0, finalPrice: originalPrice };
  }

  let discountAmount = 0;

  if (discountType === "PERCENT") {
    discountAmount = Math.round(originalPrice * (discountValue / 100));
  } else {
    // FLAT
    discountAmount = discountValue;
  }

  // Discount originalPrice se zyada nahi ho sakta
  discountAmount = Math.min(discountAmount, originalPrice);
  const finalPrice = originalPrice - discountAmount;

  return { discountAmount, finalPrice };
}
