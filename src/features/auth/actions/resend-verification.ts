"use server";

import { db } from "@/server/db";
import { createEmailVerificationToken } from "@/server/tokens";
import { sendVerificationEmail } from "@/server/email";

export async function resendVerificationAction(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, isActive: true },
  });

  if (!user || !user.isActive || user.emailVerified) {
    return;
  }

  const token = await createEmailVerificationToken(user.id, email);
  await sendVerificationEmail(email, token);
}
