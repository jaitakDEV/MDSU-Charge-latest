"use server";

import { db } from "@/server/db";
import {
  getEmailVerificationToken,
  deleteEmailVerificationToken,
  isTokenExpired,
} from "@/server/tokens";
import { apiError, apiSuccess } from "@/lib/utils";

export async function verifyEmailAction(token: string) {
  if (!token) return apiError("Token is missing");

  const record = await getEmailVerificationToken(token);
  if (!record) return apiError("Invalid token");
  if (isTokenExpired(record.expires)) {
    await deleteEmailVerificationToken(token);
    return apiError("Token expired — request a new verification email");
  }

  await db.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  await deleteEmailVerificationToken(token);
  return apiSuccess({ message: "Email verified! You can now sign in." });
}
