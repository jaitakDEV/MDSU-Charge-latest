"use server";

import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function changePasswordAction(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { hashedPassword: true },
  });

  if (!user?.hashedPassword)
    return apiError("No password set on this account.");

  const match = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!match) return apiError("Current password is incorrect.");

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db.user.update({ where: { id: userId }, data: { hashedPassword } });

  return apiSuccess(null);
}
