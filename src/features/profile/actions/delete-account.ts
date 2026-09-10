"use server";

import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function deleteAccountAction(userId: string) {
  try {
    await db.user.delete({ where: { id: userId } });
    return apiSuccess(null);
  } catch {
    return apiError("Failed to delete account. Please try again.");
  }
}
