import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { createEmailVerificationToken } from "@/server/tokens";
import { sendVerificationEmail } from "@/server/email";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const user = await db.user.findUnique({
    where: { id: guard.userId },
    select: { id: true, email: true, emailVerified: true },
  });

  if (!user)
    return NextResponse.json(apiError("User not found"), { status: 404 });
  if (user.emailVerified)
    return NextResponse.json(apiError("Email already verified"), {
      status: 400,
    });

  const token = await createEmailVerificationToken(user.id, user.email);
  await sendVerificationEmail(user.email, token);

  return NextResponse.json(apiSuccess({ message: "Verification email sent." }));
}
