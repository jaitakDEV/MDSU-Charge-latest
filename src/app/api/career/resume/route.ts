import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import {
  getOrCreateCareerProfile,
  recomputeCompletionScore,
} from "@/lib/career-utils";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const utapi = new UTApi();

const schema = z.object({
  url: z.string().url(),
  key: z.string(),
});

// ── POST — save resume URL after client-side UploadThing upload ──
export async function POST(req: Request) {
  try {
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

    // ── Delete old resume from UploadThing if it exists ─────────
    const oldProfile = await db.studentCareerProfile.findUnique({
      where: { id: profile.id },
      select: { resumeKey: true },
    });

    if (oldProfile?.resumeKey) {
      try {
        await utapi.deleteFiles(oldProfile.resumeKey);
      } catch (e) {
        console.error("[OLD_RESUME_DELETE_FAILED]", e);
      }
    }

    await db.studentCareerProfile.update({
      where: { id: profile.id },
      data: {
        resumeUrl: parsed.data.url,
        resumeKey: parsed.data.key,
        resumeUpdatedAt: new Date(),
      },
    });

    const completionPercent = await recomputeCompletionScore(profile.id);

    return NextResponse.json(apiSuccess({ completionPercent }));
  } catch (error) {
    console.error("[RESUME_UPLOAD]", error);
    return NextResponse.json(apiError("Failed to save resume."), {
      status: 500,
    });
  }
}

// ── DELETE — remove resume ────────────────────────────────────
export async function DELETE() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: guard.userId },
    select: { id: true, resumeKey: true },
  });

  if (!profile)
    return NextResponse.json(apiError("Profile not found."), { status: 404 });

  if (profile.resumeKey) {
    try {
      await utapi.deleteFiles(profile.resumeKey);
    } catch (e) {
      console.error("[RESUME_DELETE_FAILED]", e);
    }
  }

  await db.studentCareerProfile.update({
    where: { id: profile.id },
    data: { resumeUrl: null, resumeKey: null, resumeUpdatedAt: null },
  });

  await recomputeCompletionScore(profile.id);
  return NextResponse.json(apiSuccess(null));
}
