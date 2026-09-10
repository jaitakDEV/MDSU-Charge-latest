"use server";

import { db } from "@/server/db";
import { updateProfileSchema } from "@/validations/auth";
import { apiError, apiSuccess } from "@/lib/utils";
import type { UpdateProfileInput } from "@/validations/auth";

export async function updateProfileAction(
  userId: string,
  data: UpdateProfileInput,
) {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  try {
    await db.user.update({
      where: { id: userId },
      data: { name: parsed.data.name, image: parsed.data.image || null },
    });
    return apiSuccess(null);
  } catch {
    return apiError("Failed to update profile. Please try again.");
  }
}
