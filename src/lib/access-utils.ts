import { AccessDuration } from "@prisma/client";

//Duration to milliseconds map
const DURATION_MS: Record<AccessDuration, number | null> = {
  FIFTEEN_DAYS: 15 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  THREE_MONTHS: 90 * 24 * 60 * 60 * 1000,
  SIX_MONTHS: 180 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
  LIFETIME: null,
};

//UI display labels
export const ACCESS_DURATION_LABELS: Record<AccessDuration, string> = {
  FIFTEEN_DAYS: "15 Days",
  ONE_MONTH: "1 Month",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
  ONE_YEAR: "1 Year",
  LIFETIME: "Lifetime",
};

export const ACCESS_DURATION_SHORT: Record<AccessDuration, string> = {
  FIFTEEN_DAYS: "15d",
  ONE_MONTH: "1M",
  THREE_MONTHS: "3M",
  SIX_MONTHS: "6M",
  ONE_YEAR: "1Y",
  LIFETIME: "∞",
};

//Core functions
/**
 * Purchase date se accessExpiresAt calculate karo.
 * LIFETIME ke liye null return karta hai.
 *
 * @param duration  - Course ka AccessDuration enum value
 * @param grantedAt - Enrolment create hone ki date (default: now)
 * @returns Date | null — null means LIFETIME (no expiry)
 */
export function computeAccessExpiry(
  duration: AccessDuration,
  grantedAt: Date = new Date(),
): Date | null {
  const ms = DURATION_MS[duration];
  if (ms === null) return null;
  return new Date(grantedAt.getTime() + ms);
}

/**
 * Access expire ho gaya hai check karo.
 * null (LIFETIME) ke liye hamesha false return karta hai.
 *
 * @param accessExpiresAt - Enrolment.accessExpiresAt
 * @returns boolean
 */
export function isAccessExpired(accessExpiresAt: Date | null): boolean {
  if (accessExpiresAt === null) return false; // LIFETIME
  return accessExpiresAt <= new Date();
}

/**
 * Kitne din bacha hai access mein.
 * LIFETIME ke liye null return karta hai.
 * Expired hone pe 0 return karta hai (negative nahi).
 *
 * @param accessExpiresAt - Enrolment.accessExpiresAt
 * @returns number | null — null means LIFETIME
 */
export function getDaysRemaining(accessExpiresAt: Date | null): number | null {
  if (accessExpiresAt === null) return null; // LIFETIME
  const ms = accessExpiresAt.getTime() - Date.now();
  if (ms <= 0) return 0; // already expired
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/**
 * Access status determine karo — UI badge ke liye.
 */
export type AccessStatus = "LIFETIME" | "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

export function getAccessStatus(accessExpiresAt: Date | null): AccessStatus {
  if (accessExpiresAt === null) return "LIFETIME";
  if (isAccessExpired(accessExpiresAt)) return "EXPIRED";
  const days = getDaysRemaining(accessExpiresAt);
  if (days !== null && days <= 7) return "EXPIRING_SOON";
  return "ACTIVE";
}

/**
 * Checkout page pe "access until" date dikhao.
 * Purchase hone wali date se compute karo.
 */
export function getCheckoutExpiryPreview(
  duration: AccessDuration,
  purchaseDate: Date = new Date(),
): string {
  const expiry = computeAccessExpiry(duration, purchaseDate);
  if (expiry === null) return "Lifetime — No Expiry";
  return expiry.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Date format karo — "15 Jan 2025"
 */
export function formatExpiryDate(accessExpiresAt: Date | null): string {
  if (accessExpiresAt === null) return "Lifetime Access";
  return accessExpiresAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
