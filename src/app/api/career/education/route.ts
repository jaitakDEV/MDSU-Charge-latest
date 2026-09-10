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
  degree: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  institution: z.string().min(2),
  startYear: z.number(),
  endYear: z.number().optional(),
  isCurrently: z.boolean().default(false),
  cgpa: z.number().optional(),
  percentage: z.number().optional(),
  achievements: z.string().optional(),
});

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(apiError(parsed.error.issues[0].message), {
      status: 400,
    });

  const profile = await getOrCreateCareerProfile(guard.userId);
  const count = await db.studentEducation.count({
    where: { profileId: profile.id },
  });

  const entry = await db.studentEducation.create({
    data: { ...parsed.data, profileId: profile.id, displayOrder: count },
  });

  await recomputeCompletionScore(profile.id);
  return NextResponse.json(apiSuccess(entry), { status: 201 });
}
