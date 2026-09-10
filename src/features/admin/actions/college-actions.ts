"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/app";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

const addCollegeSchema = z.object({
  name: z
    .string()
    .min(3, "College name must be at least 3 characters")
    .max(200),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
});

export async function addCollegeAction(formData: {
  name: string;
  city: string;
  state: string;
}) {
  try {
    await requireAdmin();

    const parsed = addCollegeSchema.safeParse(formData);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { name, city, state } = parsed.data;

    const existing = await db.college.findUnique({
      where: { name },
      select: { id: true },
    });
    if (existing) {
      return apiError("A college with this name already exists.");
    }

    await db.college.create({
      data: { name, city, state, isActive: true },
    });

    revalidatePath(ROUTES.adminColleges);
    return apiSuccess({ message: "College added successfully." });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to add college.");
  }
}

export async function toggleCollegeStatusAction(
  collegeId: string,
  isActive: boolean,
) {
  try {
    await requireAdmin();

    const college = await db.college.findUnique({
      where: { id: collegeId },
      select: { isOther: true },
    });

    if (college?.isOther) {
      return apiError("Fallback college cannot be deactivated.");
    }

    await db.college.update({
      where: { id: collegeId },
      data: { isActive },
    });

    revalidatePath(ROUTES.adminColleges);
    return apiSuccess({ isActive });
  } catch (e) {
    return apiError(
      e instanceof Error ? e.message : "Failed to update college status.",
    );
  }
}
