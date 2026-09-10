// src/app/api/career/experience/route.ts
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
  title: z.string().min(2),
  company: z.string().min(2),
  employmentType: z.string(),
  location: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrently: z.boolean().default(false),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
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
  const count = await db.studentExperience.count({
    where: { profileId: profile.id },
  });
  const d = parsed.data;

  const entry = await db.studentExperience.create({
    data: {
      profileId: profile.id,
      displayOrder: count,
      title: d.title,
      company: d.company,
      employmentType: d.employmentType,
      location: d.location || null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      isCurrently: d.isCurrently,
      description: d.description || null,
      skills: d.skills,
    },
  });

  await recomputeCompletionScore(profile.id);
  return NextResponse.json(apiSuccess(entry), { status: 201 });
}
