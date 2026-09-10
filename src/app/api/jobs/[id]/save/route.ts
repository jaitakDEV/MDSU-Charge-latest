import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "STUDENT")
      return NextResponse.json(apiError("Only students can save jobs."), {
        status: 403,
      });

    const { id: listingId } = await params;

    const listing = await db.jobListing.findUnique({
      where: { id: listingId },
      select: { id: true, status: true },
    });
    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    const profile = await db.studentCareerProfile.findUnique({
      where: { userId: guard.userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(
        apiError("Complete your career profile first."),
        { status: 400 },
      );

    const existing = await db.savedJob.findUnique({
      where: { listingId_profileId: { listingId, profileId: profile.id } },
    });
    if (existing) return NextResponse.json(apiSuccess({ alreadySaved: true }));

    await db.savedJob.create({
      data: { listingId, profileId: profile.id },
    });

    return NextResponse.json(apiSuccess({ alreadySaved: false }), {
      status: 201,
    });
  } catch (error) {
    console.error("[JOB_SAVE]", error);
    return NextResponse.json(apiError("Failed to save job."), { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "STUDENT")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id: listingId } = await params;

    const profile = await db.studentCareerProfile.findUnique({
      where: { userId: guard.userId },
      select: { id: true },
    });
    if (!profile)
      return NextResponse.json(apiError("Profile not found."), { status: 404 });

    await db.savedJob.deleteMany({
      where: { listingId, profileId: profile.id },
    });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[JOB_UNSAVE]", error);
    return NextResponse.json(apiError("Failed to unsave job."), {
      status: 500,
    });
  }
}
