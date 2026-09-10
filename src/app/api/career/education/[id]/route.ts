import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { recomputeCompletionScore } from "@/lib/career-utils";

async function verifyOwnership(userId: string, entryId: string) {
  const entry = await db.studentEducation.findUnique({
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
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;
  const entry = await verifyOwnership(guard.userId, id);
  if (!entry) return NextResponse.json(apiError("Not found."), { status: 404 });

  const body = await req.json();
  await db.studentEducation.update({ where: { id }, data: body });

  return NextResponse.json(apiSuccess(null));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "STUDENT")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const { id } = await params;
  const entry = await verifyOwnership(guard.userId, id);
  if (!entry) return NextResponse.json(apiError("Not found."), { status: 404 });

  await db.studentEducation.delete({ where: { id } });
  await recomputeCompletionScore(entry.profileId);

  return NextResponse.json(apiSuccess(null));
}
