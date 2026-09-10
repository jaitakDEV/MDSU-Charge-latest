"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/app";

export async function toggleUserStatusAction(
  userId: string,
  currentStatus: boolean,
) {
  const session = await auth();

  // Sirf admin kar sake
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  // Admin apna account block na kar sake
  if (userId === session.user.id) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive: !currentStatus },
  });

  revalidatePath(ROUTES.adminUsers);
  return { success: true, isActive: !currentStatus };
}
