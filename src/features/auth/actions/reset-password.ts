"use server";

import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import {
  getPasswordResetToken,
  deletePasswordResetToken,
  isTokenExpired,
} from "@/server/tokens";
import { resetPasswordSchema } from "@/validations/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function resetPasswordAction(token: string, password: string) {
  const parsed = resetPasswordSchema.safeParse({
    password,
    confirmPassword: password,
  });
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message);
  }

  const record = await getPasswordResetToken(token);
  if (!record) {
    return apiError("Invalid reset link. Please request a new one.");
  }

  if (isTokenExpired(record.expires)) {
    await deletePasswordResetToken(token);
    return apiError("This link has expired. Please request a new one.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.update({
    where: { id: record.userId },
    data: { hashedPassword },
  });

  await deletePasswordResetToken(token);

  return apiSuccess({ message: "Password updated successfully." });
}
