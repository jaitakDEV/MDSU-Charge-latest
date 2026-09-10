import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import {
  getOrCreateCareerProfile,
  recomputeCompletionScore,
} from "@/lib/career-utils";
import { z } from "zod";

const updateSchema = z.object({
  headline: z.string().max(150).optional(),
  summary: z.string().max(1000).optional(),
  currentCity: z.string().optional(),
  currentState: z.string().optional(),
  availableFrom: z.string().datetime().optional(),
  preferredWorkMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  isProfileVisible: z.boolean().optional(),
  isOpenToWork: z.boolean().optional(),
});

export async function GET() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: guard.userId },
    include: {
      education: { orderBy: { displayOrder: "asc" } },
      experience: { orderBy: { displayOrder: "asc" } },
      projects: { orderBy: { displayOrder: "asc" } },
      certifications: { orderBy: { displayOrder: "asc" } },
      jobPreferences: true,
    },
  });

  if (!profile) {
    const created = await getOrCreateCareerProfile(guard.userId);
    return NextResponse.json(
      apiSuccess({
        ...created,
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        jobPreferences: null,
      }),
    );
  }

  return NextResponse.json(apiSuccess(profile));
}

export async function PATCH(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "STUDENT")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const profile = await getOrCreateCareerProfile(guard.userId);
    const d = parsed.data;

    await db.studentCareerProfile.update({
      where: { id: profile.id },
      data: {
        ...(d.headline !== undefined && { headline: d.headline || null }),
        ...(d.summary !== undefined && { summary: d.summary || null }),
        ...(d.currentCity !== undefined && {
          currentCity: d.currentCity || null,
        }),
        ...(d.currentState !== undefined && {
          currentState: d.currentState || null,
        }),
        ...(d.availableFrom !== undefined && {
          availableFrom: new Date(d.availableFrom),
        }),
        ...(d.preferredWorkMode !== undefined && {
          preferredWorkMode: d.preferredWorkMode,
        }),
        ...(d.skills !== undefined && { skills: d.skills }),
        ...(d.languages !== undefined && { languages: d.languages }),
        ...(d.isProfileVisible !== undefined && {
          isProfileVisible: d.isProfileVisible,
        }),
        ...(d.isOpenToWork !== undefined && { isOpenToWork: d.isOpenToWork }),
      },
    });

    const completionPercent = await recomputeCompletionScore(profile.id);

    return NextResponse.json(apiSuccess({ completionPercent }));
  } catch (error) {
    console.error("[CAREER_PROFILE_PATCH]", error);
    return NextResponse.json(apiError("Failed to update profile."), {
      status: 500,
    });
  }
}
