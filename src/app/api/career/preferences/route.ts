import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import {
  getOrCreateCareerProfile,
  recomputeCompletionScore,
} from "@/lib/career-utils";
import { z } from "zod";

const schema = z.object({
  preferredTypes: z
    .array(
      z.enum([
        "FULL_TIME_JOB",
        "INTERNSHIP",
        "APPRENTICESHIP",
        "FREELANCE",
        "WALK_IN_DRIVE",
        "CAMPUS_HIRING",
        "PART_TIME",
      ]),
    )
    .optional(),
  preferredRoles: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  preferredWorkMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  minSalary: z.number().optional(),
  preferredIndustries: z.array(z.string()).optional(),
  isAlertEnabled: z.boolean().optional(),
  alertFrequency: z.enum(["INSTANT", "DAILY", "WEEKLY"]).optional(),
});

export async function GET() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: guard.userId },
    select: { jobPreferences: true },
  });

  return NextResponse.json(apiSuccess(profile?.jobPreferences ?? null));
}

export async function PATCH(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });

  const profile = await getOrCreateCareerProfile(guard.userId);

  await db.jobPreference.upsert({
    where: { profileId: profile.id },
    update: parsed.data,
    create: { profileId: profile.id, ...parsed.data },
  });

  await recomputeCompletionScore(profile.id);
  return NextResponse.json(apiSuccess(null));
}
