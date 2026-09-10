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
  description: z.string().min(10),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
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
  const count = await db.studentProject.count({
    where: { profileId: profile.id },
  });
  const d = parsed.data;

  const entry = await db.studentProject.create({
    data: {
      profileId: profile.id,
      displayOrder: count,
      title: d.title,
      description: d.description,
      technologies: d.technologies,
      liveUrl: d.liveUrl || null,
      repoUrl: d.repoUrl || null,
      startDate: d.startDate ? new Date(d.startDate) : null,
      endDate: d.endDate ? new Date(d.endDate) : null,
    },
  });

  await recomputeCompletionScore(profile.id);
  return NextResponse.json(apiSuccess(entry), { status: 201 });
}
