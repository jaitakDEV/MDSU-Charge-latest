import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

async function verifyOwnership(userId: string, entryId: string) {
  const entry = await db.studentCertification.findUnique({
    where: { id: entryId },
    select: { id: true, profile: { select: { userId: true } } },
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
  if (!(await verifyOwnership(guard.userId, id)))
    return NextResponse.json(apiError("Not found."), { status: 404 });

  const body = await req.json();
  await db.studentCertification.update({ where: { id }, data: body });
  return NextResponse.json(apiSuccess(null));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  if (!(await verifyOwnership(guard.userId, id)))
    return NextResponse.json(apiError("Not found."), { status: 404 });

  await db.studentCertification.delete({ where: { id } });
  return NextResponse.json(apiSuccess(null));
}
