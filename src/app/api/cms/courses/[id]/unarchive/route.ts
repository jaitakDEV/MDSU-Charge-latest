import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    select: { authorId: true, status: true },
  });

  if (!course) return NextResponse.json(apiError("Not found"), { status: 404 });
  if (guard.role !== "ADMIN" && course.authorId !== guard.userId) {
    return NextResponse.json(apiError("Forbidden"), { status: 403 });
  }
  if (course.status !== "ARCHIVED") {
    return NextResponse.json(
      apiError("Only archived courses can be restored"),
      { status: 400 },
    );
  }

  await db.course.update({ where: { id }, data: { status: "DRAFT" } });
  return NextResponse.json(apiSuccess(null));
}
