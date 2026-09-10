"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/app";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// Existing user ko CMS_EDITOR promote karo
export async function assignCmsEditorAction(userId: string) {
  try {
    const admin = await requireAdmin();
    if (admin.id === userId)
      return apiError("You cannot change your own role.");

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return apiError("User not found.");
    if (user.role === "ADMIN") {
      return apiError("Cannot assign CMS Editor role to an Admin.");
    }

    await db.user.update({
      where: { id: userId },
      data: { role: "CMS_EDITOR" },
    });

    revalidatePath(ROUTES.adminCmsEditors);
    return apiSuccess(null);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to assign role.");
  }
}

// CMS_EDITOR ko wapas STUDENT bana do (revoke)
export async function revokeCmsEditorAction(userId: string) {
  try {
    const admin = await requireAdmin();
    if (admin.id === userId)
      return apiError("You cannot change your own role.");

    await db.user.update({
      where: { id: userId },
      data: { role: "STUDENT" },
    });

    revalidatePath(ROUTES.adminCmsEditors);
    return apiSuccess(null);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to revoke role.");
  }
}

// Search — CMS_EDITOR banane ke liye eligible users dhundo
export async function searchEligibleUsersAction(query: string) {
  try {
    await requireAdmin();

    if (!query.trim() || query.length < 2) return apiSuccess([]);

    const users = await db.user.findMany({
      where: {
        role: { in: ["STUDENT", "FACULTY"] }, // ADMIN/CMS_EDITOR exclude
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, name: true, email: true, role: true },
    });

    return apiSuccess(users);
  } catch (e) {
    return apiError("Search failed.");
  }
}
