import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { recomputeCompletionScore } from "@/lib/career-utils";

async function verifyOwnership(userId: string, entryId: string) {
  const entry = await db.studentExperience.findUnique({
    where: { id: entryId },
    select: {
      id: true,
      profileId: true,
      profile: { select: { userId: true } },
    },
  });
  if (!entry || entry.profile.userId !== userId) return null;
  return entry;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  const entry = await verifyOwnership(guard.userId, id);
  if (!entry) return NextResponse.json(apiError("Not found."), { status: 404 });

  const body = await req.json();
  await db.studentExperience.update({
    where: { id },
    data: {
      ...body,
      ...(body.startDate && { startDate: new Date(body.startDate) }),
      ...(body.endDate && { endDate: new Date(body.endDate) }),
    },
  });
  return NextResponse.json(apiSuccess(null));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  const entry = await verifyOwnership(guard.userId, id);
  if (!entry) return NextResponse.json(apiError("Not found."), { status: 404 });

  await db.studentExperience.delete({ where: { id } });
  await recomputeCompletionScore(entry.profileId);
  return NextResponse.json(apiSuccess(null));
}
