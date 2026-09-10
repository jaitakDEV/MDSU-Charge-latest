import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!course)
    return NextResponse.json(apiError("Course not found."), { status: 404 });
  if (course.status !== "REVIEW") {
    return NextResponse.json(
      apiError("Only courses in REVIEW can be approved."),
      { status: 400 },
    );
  }

  await db.course.update({ where: { id }, data: { status: "PUBLISHED" } });

  return NextResponse.json(apiSuccess(null));
}
