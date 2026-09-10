"use server";

import { db } from "@/server/db";
import { createPasswordResetToken } from "@/server/tokens";
import { sendPasswordResetEmail } from "@/server/email";

export async function forgotPasswordAction(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return;
  }

  const token = await createPasswordResetToken(user.id, email);
  await sendPasswordResetEmail(email, token);
}
